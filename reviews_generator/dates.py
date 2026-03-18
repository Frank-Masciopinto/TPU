"""
Review date generation with equal-year distribution and per-day density cap.

Distribution:
- 2016 through 2025: ~9.5% per year (equal across all 10 years = 95% total)
- January–February 2026: 5% flat
- Per-day density cap: max(1, total // 3650) to avoid same-day clustering
- Returns a pre-shuffled list of date strings in YYYY-MM-DD format.
"""

from __future__ import annotations

import random
from datetime import date, timedelta

DATE_RANGE_START = date(2016, 1, 1)
DATE_RANGE_END_2025 = date(2025, 12, 31)
DATE_RANGE_END_2026 = date(2026, 2, 28)   # Jan–Feb 2026 window

WEIGHT_2026 = 0.05                          # 5% in Jan-Feb 2026
WEIGHT_PER_YEAR = (1.0 - WEIGHT_2026) / 10  # ~9.5% per year for 2016-2025

# Year boundaries (start, end inclusive)
_YEAR_WINDOWS = [
    (date(y, 1, 1), date(y, 12, 31))
    for y in range(2016, 2026)   # 2016 .. 2025
]


def _random_date_in_range(start: date, end: date) -> date:
    delta = (end - start).days
    if delta <= 0:
        return start
    return start + timedelta(days=random.randint(0, delta))


def _build_weighted_date_pool(total: int) -> list[date]:
    """
    Build a date pool of `total` dates distributed across 2016-Feb 2026.

    Each of the 10 years 2016-2025 receives an equal ~9.5% share.
    Jan-Feb 2026 receives 5%.
    """
    pool: list[date] = []

    # 5% for Jan-Feb 2026
    count_2026 = round(total * WEIGHT_2026)
    for _ in range(count_2026):
        pool.append(_random_date_in_range(date(2026, 1, 1), DATE_RANGE_END_2026))

    # Remaining 95% split equally across 2016-2025
    remaining = total - count_2026
    per_year = remaining / 10   # float, we'll round per year

    accumulated = 0
    for i, (start, end) in enumerate(_YEAR_WINDOWS):
        if i < 9:
            year_count = round(per_year)
        else:
            # Last year gets whatever is left to avoid rounding drift
            year_count = remaining - accumulated

        for _ in range(max(0, year_count)):
            pool.append(_random_date_in_range(start, end))
        accumulated += year_count

    return pool


def _apply_density_cap(dates: list[date], max_per_day: int) -> list[date]:
    """
    Redistribute dates so no single calendar day exceeds max_per_day.
    Excess dates are moved to nearby days (±1-7 days) to maintain naturalness.
    """
    if max_per_day <= 0:
        max_per_day = 1

    from collections import Counter

    day_counts: Counter = Counter(dates)
    result: list[date] = []
    overflow: list[date] = []

    for d, count in day_counts.items():
        allowed = min(count, max_per_day)
        result.extend([d] * allowed)
        overflow.extend([d] * (count - allowed))

    for original_date in overflow:
        placed = False
        for offset in range(1, 60):
            for direction in [1, -1]:
                candidate = original_date + timedelta(days=offset * direction)
                if candidate > DATE_RANGE_END_2026 or candidate < DATE_RANGE_START:
                    continue
                if day_counts[candidate] < max_per_day:
                    result.append(candidate)
                    day_counts[candidate] += 1
                    placed = True
                    break
            if placed:
                break
        if not placed:
            # Fallback: keep the original date (density slightly exceeded)
            result.append(original_date)

    return result


def build_date_pool(total: int) -> list[str]:
    """
    Build and return a shuffled list of `total` date strings (YYYY-MM-DD).
    Distribution: equal across 2016-2025 (9.5% each) + 5% in Jan-Feb 2026.
    Per-day density cap prevents unrealistic clustering.
    """
    # 10 years = ~3,650 days — cap to prevent same-day spam
    max_per_day = max(1, total // 3650)

    raw_dates = _build_weighted_date_pool(total)
    capped_dates = _apply_density_cap(raw_dates, max_per_day)

    # Ensure we have exactly `total` dates
    while len(capped_dates) < total:
        year = random.randint(2016, 2025)
        d = _random_date_in_range(date(year, 1, 1), date(year, 12, 31))
        capped_dates.append(d)
    capped_dates = capped_dates[:total]

    random.shuffle(capped_dates)
    return [d.strftime("%Y-%m-%d") for d in capped_dates]
