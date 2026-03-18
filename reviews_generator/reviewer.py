"""
Review generation engine.

- generate_silent_reviews(): Tier 1 no-text reviews, zero LLM cost.
- generate_llm_reviews(): async batched LLM generation with parse fault
  tolerance, exponential backoff on rate limits, and variation seeding.
"""

from __future__ import annotations

import asyncio
import json
import logging
import math
import random
from typing import Any

from openai import AsyncOpenAI, RateLimitError, APIStatusError

from dates import build_date_pool
from identity import IdentityPool
from personas import PERSONAS, get_random_persona
from prompts import (
    SYSTEM_PROMPT,
    build_user_prompt,
    build_tier1_text_prompt,
    detect_axle_weight,
    random_title_only_title,
    _TRUCK_TIRE,
)
from tier import get_rating_pool, BATCH_SIZE


# ---------------------------------------------------------------------------
# Persona eligibility by axle weight
# ---------------------------------------------------------------------------

# Personas that are realistic for heavy axles (10k / 12k / 16k).
# These people actually own or work with flatbeds, goosenecks, and hotshots.
_HEAVY_AXLE_PERSONA_IDS = {
    "derek_heavy_hauler",   # 40-ft gooseneck, heavy equipment, DOT
    "steve_fleet_manager",  # fleet of trailers including flatbeds
    "gary_retired_trucker", # 40 years in trucking, builds trailers
    "mike_repair_shop",     # buys parts for all customer trailer types
    "luis_contractor",      # GC hauling heavy equipment and materials
    "zach_reseller",        # flips trailers, knows specs
    "jake_landscaper",      # landscape contractor (uses tandem flatbeds)
}

# Personas appropriate for medium-heavy axles (7k / 8k):
# car haulers, equipment trailers, large flatbeds
_MEDIUM_HEAVY_PERSONA_IDS = _HEAVY_AXLE_PERSONA_IDS | {
    "tony_car_hauler",      # 20-ft car hauler
    "randy_homesteader",    # larger farm equipment
}

# All personas are valid for 6k and below
_ALL_PERSONA_IDS = {p["id"] for p in PERSONAS}

# Commercial truck tires (22.5/24.5 inch) — only personas who operate
# semi trucks, commercial fleets, or heavy freight vehicles
_TRUCK_TIRE_PERSONA_IDS = {
    "derek_heavy_hauler",   # 40-ft gooseneck, commercial hauler
    "steve_fleet_manager",  # manages 20+ vehicle fleet
    "gary_retired_trucker", # 40 years OTR trucking
    "mike_repair_shop",     # buys for all commercial customer vehicles
    "jake_landscaper",      # runs commercial trucks for his crew
    "luis_contractor",      # GC with commercial trucks and equipment
}


def _get_eligible_personas(product_name: str) -> list[dict]:
    """
    Return the filtered list of personas that are realistic for this product.
    Commercial truck tires, heavy axles, and medium axles each have restricted pools.
    All other products get all personas.
    """
    # Commercial truck tires take priority — very specific operator profile
    if _TRUCK_TIRE.search(product_name):
        eligible_ids = _TRUCK_TIRE_PERSONA_IDS
    else:
        weight = detect_axle_weight(product_name)
        if weight is not None and weight >= 10000:
            eligible_ids = _HEAVY_AXLE_PERSONA_IDS
        elif weight is not None and weight >= 7000:
            eligible_ids = _MEDIUM_HEAVY_PERSONA_IDS
        else:
            eligible_ids = _ALL_PERSONA_IDS

    eligible = [p for p in PERSONAS if p["id"] in eligible_ids]
    return eligible if eligible else PERSONAS   # fallback: never return empty list

logger = logging.getLogger(__name__)

# Lazily initialized — must NOT be created at module level because
# asyncio.run() creates a new event loop each invocation and a
# module-level Semaphore would be bound to a dead loop (Python 3.9+).
_LLM_SEM: asyncio.Semaphore | None = None


def _llm_sem() -> asyncio.Semaphore:
    global _LLM_SEM
    if _LLM_SEM is None:
        _LLM_SEM = asyncio.Semaphore(10)
    return _LLM_SEM


MAX_RETRIES = 5
INITIAL_BACKOFF = 2.0    # seconds
MAX_BACKOFF = 60.0


# ---------------------------------------------------------------------------
# Row builder helpers
# ---------------------------------------------------------------------------

def _base_row(product: dict) -> dict:
    return {
        "product_id": product["id"],
        "product_title": product["name"],
        "product_url": product.get("url", ""),
        "product_image_url": product.get("image_url", ""),
        "product_description": (product.get("description") or "")[:500],
        "user_type": "Verified Buyer",
        "md_customer_country": "US",
        "published": "true",
        # optional Yotpo columns
        "comment_content": "",
        "comment_public": "",
        "comment_created_at": "",
        "published_image_url": "",
        "unpublished_image_url": "",
        "published_video_url": "",
        "unpublished_video_url": "",
        "cf_Y__X": "",
    }


# ---------------------------------------------------------------------------
# Tier 1 silent reviews (local, no LLM)
# ---------------------------------------------------------------------------

def generate_silent_reviews(product: dict, count: int) -> list[dict]:
    """
    Generate `count` silent 5-star reviews (no title, no content).
    Used for the residual Tier 1 bucket only.
    """
    dates = build_date_pool(count)
    pool = IdentityPool(product["id"])

    rows: list[dict] = []
    for date_str in dates:
        identity = pool.generate(date_str)
        row = _base_row(product)
        row.update(
            {
                "date": date_str,
                "review_score": "5",
                "review_title": "",
                "review_content": "",
                "display_name": identity.display_name,
                "email": identity.email,
            }
        )
        rows.append(row)

    return rows


def generate_title_only_reviews(product: dict, count: int) -> list[dict]:
    """
    Generate `count` title-only 5-star reviews (title present, content empty).
    Zero LLM cost. Represents the 10% of lazy reviewers who just type a quick title.
    Applied universally across all product tiers.
    """
    dates = build_date_pool(count)
    pool = IdentityPool(product["id"])

    rows: list[dict] = []
    for date_str in dates:
        identity = pool.generate(date_str)
        row = _base_row(product)
        row.update(
            {
                "date": date_str,
                "review_score": "5",
                "review_title": random_title_only_title(),
                "review_content": "",
                "display_name": identity.display_name,
                "email": identity.email,
            }
        )
        rows.append(row)

    return rows


# ---------------------------------------------------------------------------
# LLM review generation
# ---------------------------------------------------------------------------

async def _call_llm_with_retry(
    client: AsyncOpenAI,
    model: str,
    user_prompt: str,
    batch_size: int,
) -> list[dict]:
    """
    Call the OpenAI chat completion API, returning a list of review dicts.
    Retries on rate limits with exponential backoff.
    Falls back to batch_size=5 on second attempt if JSON parse fails.
    """
    backoff = INITIAL_BACKOFF
    last_exc: Exception | None = None

    for attempt in range(MAX_RETRIES):
        try:
            async with _llm_sem():
                response = await client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt},
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.9,
                )

            raw = response.choices[0].message.content or ""

            # The model returns {"reviews": [...]} or a bare array
            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError as exc:
                logger.warning(
                    f"JSON parse failed (attempt {attempt + 1}/{MAX_RETRIES}): {exc}. "
                    f"Raw (first 200 chars): {raw[:200]}"
                )
                last_exc = exc
                # Don't sleep — immediately retry with smaller batch if on attempt 2+
                continue

            if isinstance(parsed, list):
                return parsed
            if isinstance(parsed, dict):
                # Unwrap {"reviews": [...]} or {"data": [...]} etc.
                for key in ("reviews", "data", "results", "items"):
                    if key in parsed and isinstance(parsed[key], list):
                        return parsed[key]
                # Single review wrapped in object
                if "review_title" in parsed or "review_content" in parsed:
                    return [parsed]

            logger.warning(f"Unexpected JSON shape (attempt {attempt + 1}): {list(parsed.keys()) if isinstance(parsed, dict) else type(parsed)}")
            last_exc = ValueError("Unexpected JSON shape")
            continue

        except RateLimitError as exc:
            logger.warning(f"Rate limit hit (attempt {attempt + 1}/{MAX_RETRIES}). Sleeping {backoff:.1f}s...")
            last_exc = exc
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, MAX_BACKOFF)

        except APIStatusError as exc:
            if exc.status_code and exc.status_code >= 500:
                logger.warning(f"OpenAI 5xx (attempt {attempt + 1}/{MAX_RETRIES}). Sleeping {backoff:.1f}s...")
                last_exc = exc
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, MAX_BACKOFF)
            else:
                raise  # 4xx other than 429 — don't retry

    logger.error(f"LLM call failed after {MAX_RETRIES} attempts. Last error: {last_exc}")
    return []


def _build_review_specs(
    product: dict,
    scores: list[int],
    dates: list[str],
    identity_pool: IdentityPool,
) -> list[dict]:
    """
    Build review spec dicts (score + persona + identity + date) for one batch.
    Personas are filtered by axle weight so heavy products only get
    realistic reviewers (flatbed/gooseneck/hotshot operators).
    """
    eligible_personas = _get_eligible_personas(product["name"])
    specs = []
    for score, date_str in zip(scores, dates):
        persona = random.choice(eligible_personas)
        identity = identity_pool.generate(date_str)
        specs.append(
            {
                "score": score,
                "date": date_str,
                "persona": persona,
                "display_name": identity.display_name,
                "email": identity.email,
            }
        )
    return specs


_BANNED_TITLE_OPENERS = {
    "good", "solid", "decent", "nice", "works", "great", "amazing",
    "excellent", "perfect", "outstanding", "fantastic", "reliable", "quality",
}

_BANNED_CONTENT_WORDS = [
    "perfect", "perfectly", "perfectly fine", "works perfectly", "fits perfectly",
    "works perfect", "work perfect", "runs perfect", "fit perfect",
]

_BANNED_CONTENT_OPENERS = {"these", "the", "this", "i ", "got", "ordered", "been"}


def _has_title_violation(title: str) -> bool:
    if not title:
        return False
    first = title.strip().split()[0].lower().rstrip(".,!?")
    return first in _BANNED_TITLE_OPENERS


def _has_content_opener_violation(content: str) -> bool:
    if not content.strip():
        return False
    first = content.strip().split()[0].lower().rstrip(".,!?")
    return first in _BANNED_CONTENT_OPENERS


def _has_content_violation(content: str) -> bool:
    lower = content.lower()
    return any(phrase in lower for phrase in _BANNED_CONTENT_WORDS)


async def _fix_violations(
    rows: list[dict],
    client: AsyncOpenAI,
    model: str,
) -> list[dict]:
    """
    For any row with a banned title opener or banned content word,
    make a lightweight targeted call to rewrite just that element.
    Max 2 retries per row. Operates in-place.
    """
    violations = [
        i for i, r in enumerate(rows)
        if _has_title_violation(r.get("review_title", ""))
        or _has_content_violation(r.get("review_content", ""))
        or _has_content_opener_violation(r.get("review_content", ""))
    ]

    if not violations:
        return rows

    logger.info(f"Fixing {len(violations)} title/content violations via targeted rewrites...")

    for idx in violations:
        row = rows[idx]
        title = row.get("review_title", "")
        content = row.get("review_content", "")
        score = row.get("review_score", "5")

        prompt = (
            f"Rewrite this product review to fix the violations described below.\n\n"
            f"Current title: {title}\n"
            f"Current content: {content}\n"
            f"Score: {score}\n\n"
            f"VIOLATIONS TO FIX:\n"
        )
        if _has_title_violation(title):
            prompt += (
                f"- Title starts with a banned word. "
                f"Rewrite it as a specific outcome or experience "
                f"(e.g. 'Fit my 7k axle without issue', 'Held up all season on my flatbed'). "
                f"Do NOT start with: Good, Solid, Decent, Nice, Works, Great, Perfect, Outstanding, Reliable, Quality.\n"
            )
        if _has_content_violation(content):
            prompt += (
                f"- Content contains a banned word/phrase "
                f"(perfect, perfectly, works perfect, etc.). Remove or rephrase it.\n"
            )
        if _has_content_opener_violation(content):
            first_word = content.strip().split()[0] if content.strip() else ""
            prompt += (
                f"- Content starts with a banned first word ('{first_word}'). "
                f"Rewrite the opening so the review starts with a different word. "
                f"Do NOT start with: These, The, This, I, Got, Ordered, Been.\n"
            )

        prompt += (
            "\nReturn only a JSON object: "
            '{"review_title": "...", "review_content": "..."}'
            "\nDo not change the tone, persona, or meaning — only fix the violations."
        )

        for attempt in range(2):
            try:
                async with _llm_sem():
                    resp = await client.chat.completions.create(
                        model=model,
                        messages=[{"role": "user", "content": prompt}],
                        response_format={"type": "json_object"},
                        temperature=0.7,
                    )
                raw = resp.choices[0].message.content or ""
                fixed = json.loads(raw)
                new_title = fixed.get("review_title", title)
                new_content = fixed.get("review_content", content)

                if not _has_title_violation(new_title) and not _has_content_violation(new_content):
                    rows[idx]["review_title"] = new_title
                    rows[idx]["review_content"] = new_content
                    break
            except Exception as exc:
                logger.warning(f"Violation fix attempt {attempt + 1} failed: {exc}")

    return rows


def _llm_reviews_to_rows(
    llm_results: list[dict],
    specs: list[dict],
    product: dict,
) -> list[dict]:
    """
    Merge LLM output with pre-assigned identity/date specs into Yotpo row dicts.
    LLM output may have fewer items than specs (parse failure). We use what we get.
    """
    rows: list[dict] = []
    for i, result in enumerate(llm_results):
        if i >= len(specs):
            break
        spec = specs[i]
        row = _base_row(product)
        row.update(
            {
                "date": spec["date"],
                "review_score": str(result.get("review_score", spec["score"])),
                "review_title": str(result.get("review_title", "")),
                "review_content": str(result.get("review_content", "")),
                "display_name": spec["display_name"],
                "email": spec["email"],
            }
        )
        rows.append(row)
    return rows


async def generate_llm_reviews(
    product: dict,
    total_count: int,
    tier: int,
    client: AsyncOpenAI,
    model: str,
    is_tier1_text: bool = False,
) -> list[dict]:
    """
    Generate `total_count` LLM-backed reviews for the given product.
    Handles batching, variation seeds, and assembles final row dicts.
    """
    scores = get_rating_pool(tier, total_count)
    dates = build_date_pool(total_count)
    identity_pool = IdentityPool(product["id"])

    # Split into batches
    batches: list[tuple[list[int], list[str]]] = []
    for start in range(0, total_count, BATCH_SIZE):
        end = min(start + BATCH_SIZE, total_count)
        batches.append((scores[start:end], dates[start:end]))

    # Build tasks with variation seeds cycling 0-9
    async def process_batch(
        batch_scores: list[int],
        batch_dates: list[str],
        variation_seed: int,
    ) -> list[dict]:
        specs = _build_review_specs(product, batch_scores, batch_dates, identity_pool)

        if is_tier1_text:
            user_prompt = build_tier1_text_prompt(product, specs, variation_seed)
        else:
            user_prompt = build_user_prompt(product, specs, variation_seed)

        # First attempt with full batch size
        results = await _call_llm_with_retry(client, model, user_prompt, len(specs))

        # If parse failed partially, retry with smaller batch
        if len(results) < len(specs) * 0.5 and len(specs) > 5:
            logger.info(
                f"Batch returned only {len(results)}/{len(specs)} reviews — "
                f"retrying with batch_size=5"
            )
            # Split into half-batches and retry
            mid = len(specs) // 2
            r1 = await _call_llm_with_retry(
                client, model,
                build_user_prompt(product, specs[:mid], variation_seed + 10) if not is_tier1_text
                else build_tier1_text_prompt(product, specs[:mid], variation_seed + 10),
                mid,
            )
            r2 = await _call_llm_with_retry(
                client, model,
                build_user_prompt(product, specs[mid:], variation_seed + 20) if not is_tier1_text
                else build_tier1_text_prompt(product, specs[mid:], variation_seed + 20),
                len(specs) - mid,
            )
            results = r1 + r2

        return _llm_reviews_to_rows(results, specs, product)

    tasks = [
        process_batch(batch_scores, batch_dates, i % 10)
        for i, (batch_scores, batch_dates) in enumerate(batches)
    ]

    batch_results = await asyncio.gather(*tasks)
    rows: list[dict] = [row for batch in batch_results for row in batch]

    # Post-generation: fix any title/content violations before returning
    rows = await _fix_violations(rows, client, model)
    return rows
