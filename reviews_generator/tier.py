"""
Price-tier logic: determines review count, rating distribution, and LLM strategy
for each product based on its calculated_price.

Also provides the dry-run cost estimator.
"""

from __future__ import annotations

import hashlib
import math
import random
from dataclasses import dataclass

# ---------------------------------------------------------------------------
# Tier definitions
# ---------------------------------------------------------------------------

TIER_4_MIN = 1000.0   # > $1,000
TIER_3_MIN = 500.0    # $500 – $1,000
TIER_2_MIN = 100.0    # $100 – $500
# Tier 1: < $100

# Review count ranges per tier (random within range per product)
TIER_RANGES = {
    4: (1200, 2500),
    3: (500, 1000),
    2: (100, 500),
    1: (10, 100),
}

# Rating distribution for tiers 2-4 (only 4 and 5 stars per product requirement)
# Yields 4.85 average: 0.85*5 + 0.15*4 = 4.85
FULL_RATING_WEIGHTS = {5: 85, 4: 15}

# Cost estimation constants (GPT-4o-mini, Mar 2026 pricing)
# Input is large (system + user); output ~200–400 tokens/review batch — conservative.
COST_PER_BATCH_USD = 0.00045   # per 10-review batch (slightly conservative vs old 0.0003)

BATCH_SIZE = 10


@dataclass
class TierInfo:
    tier: int
    review_count: int
    use_llm: bool
    llm_review_count: int   # reviews that require LLM (tier 1: only 10%)
    silent_review_count: int  # reviews generated locally (tier 1: 90%)
    estimated_batches: int
    estimated_cost_usd: float


def get_tier(price: float) -> int:
    if price > TIER_4_MIN:
        return 4
    if price >= TIER_3_MIN:
        return 3
    if price >= TIER_2_MIN:
        return 2
    return 1


def get_review_count(tier: int) -> int:
    """Random count (legacy); prefer deterministic_review_count for stable plans."""
    lo, hi = TIER_RANGES[tier]
    return random.randint(lo, hi)


def deterministic_review_count(product_id: str, tier: int) -> int:
    """Stable review count for a SKU so prepare/assemble/checkpoint always agree."""
    lo, hi = TIER_RANGES[tier]
    span = hi - lo + 1
    h = int(hashlib.sha256(str(product_id).encode()).hexdigest()[:12], 16)
    return lo + (h % span)


def allocate_content_buckets(total: int) -> tuple[int, int, int]:
    """
    Split total reviews into (title_only, short_llm, full).
    Targets: 25% title-only, 21% short (LLM), remainder full.
    Adjusts so the three integers sum exactly to total.
    """
    if total <= 0:
        return 0, 0, 0
    title = round(total * 0.25)
    short = round(total * 0.21)
    full = total - title - short
    if full < 0:
        excess = -full
        dt = min(title, excess)
        title -= dt
        excess -= dt
        ds = min(short, excess)
        short -= ds
        full = total - title - short
    # Prefer at least one short LLM slice when product has several reviews
    if total >= 5 and short < 1 and (title > 0 or full > 1):
        if title > 0:
            title -= 1
        else:
            full -= 1
        short += 1
        full = total - title - short
    # Fix drift
    delta = total - (title + short + full)
    full += delta
    if full < 0:
        need = -full
        ts = min(short, need)
        short -= ts
        need -= ts
        tt = min(title, need)
        title -= tt
        full = total - title - short
    title = max(0, title)
    short = max(0, short)
    full = max(0, full)
    # Final exact sum
    s2 = title + short + full
    if s2 != total:
        full += total - s2
    return title, short, full


@dataclass
class ProductPlan:
    """Immutable per-product generation plan (single source of truth)."""

    product_id: str
    tier: int
    review_count: int
    title_only_count: int
    short_llm_count: int
    full_count: int

    def to_dict(self) -> dict:
        return {
            "product_id": self.product_id,
            "tier": self.tier,
            "review_count": self.review_count,
            "title_only_count": self.title_only_count,
            "short_llm_count": self.short_llm_count,
            "full_count": self.full_count,
        }

    @staticmethod
    def from_dict(d: dict) -> ProductPlan:
        return ProductPlan(
            product_id=str(d["product_id"]),
            tier=int(d["tier"]),
            review_count=int(d["review_count"]),
            title_only_count=int(d["title_only_count"]),
            short_llm_count=int(d["short_llm_count"]),
            full_count=int(d["full_count"]),
        )


def plan_product(product: dict) -> ProductPlan:
    """
    Compute the generation plan for one product (deterministic counts).
    """
    price = product.get("calculated_price", 0) or 0
    tier = get_tier(price)
    pid = str(product["id"])
    n = deterministic_review_count(pid, tier)
    title, short, full = allocate_content_buckets(n)
    return ProductPlan(
        product_id=pid,
        tier=tier,
        review_count=n,
        title_only_count=title,
        short_llm_count=short,
        full_count=full,
    )


def get_rating_pool(tier: int, count: int) -> list[int]:
    """
    Return a list of `count` integer scores that match the target distribution.
    Tier 1 always returns all 5s.
    Tiers 2-4 use FULL_RATING_WEIGHTS (~4.85 average).
    """
    if tier == 1:
        return [5] * count

    weights = FULL_RATING_WEIGHTS
    total_weight = sum(weights.values())
    pool: list[int] = []
    for score, weight in weights.items():
        n = round(count * weight / total_weight)
        pool.extend([score] * n)

    # Adjust to exact count (rounding can be off by 1-2)
    while len(pool) < count:
        pool.append(5)
    while len(pool) > count:
        # Remove from the smallest score bucket first
        for score in [2, 3, 4, 5]:
            if score in pool:
                pool.remove(score)
                break

    random.shuffle(pool)
    return pool


def compute_tier_info(product: dict) -> TierInfo:
    """
    Tier summary aligned with plan_product: title-only is local (no LLM).
    Tier 1: LLM only for short_llm_count; silent for title_only + full buckets.
    Tier 2+: LLM for short + full; title_only local.
    """
    p = plan_product(product)
    tier = p.tier
    review_count = p.review_count

    if tier == 1:
        llm_count = p.short_llm_count
        silent_count = p.title_only_count + p.full_count
    else:
        llm_count = p.short_llm_count + p.full_count
        silent_count = p.title_only_count

    if llm_count > 0:
        batches = math.ceil(llm_count / BATCH_SIZE)
    else:
        batches = 0
    cost = batches * COST_PER_BATCH_USD

    return TierInfo(
        tier=tier,
        review_count=review_count,
        use_llm=True,
        llm_review_count=llm_count,
        silent_review_count=silent_count,
        estimated_batches=batches,
        estimated_cost_usd=cost,
    )


# ---------------------------------------------------------------------------
# Dry-run estimator
# ---------------------------------------------------------------------------

@dataclass
class DryRunSummary:
    total_products: int
    already_processed: int
    will_process: int
    tier_breakdown: dict[int, dict]   # tier -> {products, reviews, batches, cost}
    total_reviews: int
    total_batches: int
    total_cost_usd: float
    model: str


def estimate_run(
    products: list[dict],
    processed_ids: set[str],
    limit: int | None,
    model: str,
) -> DryRunSummary:
    already = len([p for p in products if p["id"] in processed_ids])
    pending = [p for p in products if p["id"] not in processed_ids]
    will_process = pending[:limit] if limit else pending

    breakdown: dict[int, dict] = {
        1: {"products": 0, "reviews": 0, "batches": 0, "cost": 0.0},
        2: {"products": 0, "reviews": 0, "batches": 0, "cost": 0.0},
        3: {"products": 0, "reviews": 0, "batches": 0, "cost": 0.0},
        4: {"products": 0, "reviews": 0, "batches": 0, "cost": 0.0},
    }

    for product in will_process:
        info = compute_tier_info(product)
        t = info.tier
        breakdown[t]["products"] += 1
        breakdown[t]["reviews"] += info.review_count
        breakdown[t]["batches"] += info.estimated_batches
        breakdown[t]["cost"] += info.estimated_cost_usd

    total_reviews = sum(v["reviews"] for v in breakdown.values())
    total_batches = sum(v["batches"] for v in breakdown.values())
    total_cost = sum(v["cost"] for v in breakdown.values())

    return DryRunSummary(
        total_products=len(products),
        already_processed=already,
        will_process=len(will_process),
        tier_breakdown=breakdown,
        total_reviews=total_reviews,
        total_batches=total_batches,
        total_cost_usd=total_cost,
        model=model,
    )


def print_dry_run(summary: DryRunSummary) -> None:
    sep = "─" * 46
    print()
    print("Dry run — no reviews will be generated")
    print(sep)
    print(f"{'Total products in catalog':<30}: {summary.total_products:,}")
    print(f"{'Already processed':<30}: {summary.already_processed:,}")
    print(f"{'Will process now':<30}: {summary.will_process:,}")
    print(sep)
    tier_labels = {
        4: ">$1000",
        3: "$500-$1000",
        2: "$100-$500",
        1: "<$100",
    }
    for tier in [4, 3, 2, 1]:
        b = summary.tier_breakdown[tier]
        if b["products"] == 0:
            continue
        label = f"Tier {tier} ({tier_labels[tier]})"
        note = "  (short bucket LLM only)" if tier == 1 else ""
        print(
            f"  {label:<24}: {b['products']:>5} products"
            f"  ~{b['reviews']:>8,} reviews"
            f"  ~{b['batches']:>6,} LLM calls{note}"
        )
    print(sep)
    print(f"{'Est. total reviews':<30}: {summary.total_reviews:,}")
    print(f"{'Est. LLM calls':<30}: {summary.total_batches:,}")
    print(f"{'Est. cost':<30}: ${summary.total_cost_usd:.2f}  (model: {summary.model})")
    print(sep)
    print()
