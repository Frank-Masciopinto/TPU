"""Unit tests for deterministic product planning and bucket allocation."""

from __future__ import annotations

import pytest

from tier import (
    TIER_RANGES,
    allocate_content_buckets,
    deterministic_review_count,
    plan_product,
)


def test_allocate_buckets_sum_to_total():
    for n in range(1, 500):
        t, s, f = allocate_content_buckets(n)
        assert t + s + f == n
        assert t >= 0 and s >= 0 and f >= 0


def test_deterministic_review_count_stable():
    pid = "SKU-12345"
    for tier in (1, 2, 3, 4):
        a = deterministic_review_count(pid, tier)
        b = deterministic_review_count(pid, tier)
        assert a == b
        lo, hi = TIER_RANGES[tier]
        assert lo <= a <= hi


def test_plan_product_ids_match():
    p = {
        "id": "99",
        "name": "Test Axle 10k",
        "calculated_price": 1500.0,
    }
    plan1 = plan_product(p)
    plan2 = plan_product(p)
    assert plan1.review_count == plan2.review_count
    assert plan1.title_only_count + plan1.short_llm_count + plan1.full_count == plan1.review_count


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
