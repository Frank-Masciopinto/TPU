"""
Price-tier logic: determines review count, rating distribution, and LLM strategy
for each product based on its calculated_price.

Also provides the dry-run cost estimator.
"""

from __future__ import annotations

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
# ~800 input tokens + ~400 output tokens per batch of 10 reviews
COST_PER_BATCH_USD = 0.0003   # conservative estimate per 10-review batch

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
    lo, hi = TIER_RANGES[tier]
    return random.randint(lo, hi)


def get_rating_pool(tier: int, count: int) -> list[int]:
    """
    Return a list of `count` integer scores that match the target distribution.
    Tier 1 always returns all 5s.
    Tiers 2-4 use FULL_RATING_WEIGHTS (~4.68 average).
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
    price = product.get("calculated_price", 0) or 0
    tier = get_tier(price)
    review_count = get_review_count(tier)

    if tier == 1:
        llm_count = max(1, round(review_count * 0.10))
        silent_count = review_count - llm_count
    else:
        llm_count = review_count
        silent_count = 0

    batches = math.ceil(llm_count / BATCH_SIZE)
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
        note = "  (10% LLM)" if tier == 1 else ""
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
