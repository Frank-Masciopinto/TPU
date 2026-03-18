"""
Automated quality gate for generated Yotpo review CSVs.

Runs 6 checks against the hardened humanization requirements.
Exits 0 if all pass, 1 if any fail.

Usage:
  python3 validate_csv.py output/yotpo_reviews_TIMESTAMP_part1.csv
  python3 validate_csv.py output/yotpo_reviews_TIMESTAMP_part1.csv --verbose
"""

from __future__ import annotations

import argparse
import csv
import math
import re
import sys
from collections import Counter
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration — mirrors the rules in SYSTEM_PROMPT
# ---------------------------------------------------------------------------

ALLOWED_SCORES = {"4", "5"}

BANNED_WORDS = [
    "perfect", "perfectly", "perfectly fine", "works perfectly", "fits perfectly",
    "amazing", "amazing quality", "excellent", "outstanding", "great product",
    "highly recommend", "top notch", "fantastic", "superb", "phenomenal",
    "flawless", "stellar", "seamless", "game changer", "game-changer",
    "exceeded my expectations", "couldn't be happier", "couldn't ask for more",
    "can't go wrong", "cannot be happier", "five stars", "10/10",
]

BANNED_CONTENT_OPENERS = {"these", "the", "this", "i"}

BANNED_TITLE_OPENERS = {
    "good", "solid", "decent", "nice", "works", "great",
    "amazing", "excellent", "perfect", "outstanding", "fantastic",
    "reliable", "quality",
}

OPENER_DOMINANCE_THRESHOLD = 0.10   # no single first word > 10%
LENGTH_STDDEV_MIN = 12.0            # words std dev must exceed this
MAX_OPENER_PCT_DISPLAY = 15         # show top N openers in report


# ---------------------------------------------------------------------------
# Check functions — each returns (passed: bool, details: str)
# ---------------------------------------------------------------------------

def check_star_ratings(rows: list[dict]) -> tuple[bool, str]:
    scores = Counter(r["review_score"] for r in rows)
    bad = {k: v for k, v in scores.items() if k not in ALLOWED_SCORES}
    if bad:
        return False, f"Illegal scores present: {dict(sorted(bad.items()))}"
    dist = dict(sorted(scores.items()))
    return True, f"Score distribution (4/5 only): {dist}"


def check_opener_dominance(rows: list[dict]) -> tuple[bool, str]:
    openers = Counter()
    for r in rows:
        content = r.get("review_content", "").strip()
        if content:
            first = content.split()[0].lower().rstrip(".,!?")
            openers[first] += 1

    total = sum(openers.values())
    if total == 0:
        return True, "No reviews with content to check"

    violations = []
    for word, count in openers.most_common():
        pct = count / total
        if pct > OPENER_DOMINANCE_THRESHOLD:
            violations.append(f'"{word}" = {pct:.1%} ({count}/{total})')

    top_display = [
        f'"{w}" {c/total:.1%}' for w, c in openers.most_common(MAX_OPENER_PCT_DISPLAY)
    ]
    detail = "Top openers: " + ", ".join(top_display)

    if violations:
        return False, f"Opener dominance violations: {violations}\n  {detail}"
    return True, detail


def check_banned_content_openers(rows: list[dict]) -> tuple[bool, str]:
    violations = []
    for i, r in enumerate(rows, 1):
        content = r.get("review_content", "").strip()
        if content:
            first = content.split()[0].lower().rstrip(".,!?")
            if first in BANNED_CONTENT_OPENERS:
                violations.append(
                    f'Row {i}: starts with "{first}" — "{content[:60]}..."'
                )
    if violations:
        sample = violations[:5]
        return False, f"{len(violations)} banned opener(s). Examples:\n  " + "\n  ".join(sample)
    return True, "No banned content openers found"


def check_banned_title_openers(rows: list[dict]) -> tuple[bool, str]:
    violations = []
    for i, r in enumerate(rows, 1):
        title = r.get("review_title", "").strip()
        if title:
            first = title.split()[0].lower().rstrip(".,!?")
            if first in BANNED_TITLE_OPENERS:
                violations.append(f'Row {i}: title "{title}"')
    if violations:
        sample = violations[:5]
        return False, f"{len(violations)} banned title opener(s). Examples:\n  " + "\n  ".join(sample)
    return True, "No banned title openers found"


def check_banned_words(rows: list[dict]) -> tuple[bool, str]:
    violations = []
    for i, r in enumerate(rows, 1):
        text = (
            (r.get("review_content") or "") + " " + (r.get("review_title") or "")
        ).lower()
        hits = [w for w in BANNED_WORDS if w in text]
        if hits:
            violations.append(
                f'Row {i} ({r.get("review_title","")[:40]}): {hits}'
            )
    if violations:
        sample = violations[:5]
        return False, f"{len(violations)} banned word violation(s). Examples:\n  " + "\n  ".join(sample)
    return True, "No banned word violations"


def check_length_variance(rows: list[dict]) -> tuple[bool, str]:
    # Only check reviews that have actual content — title-only and silent reviews
    # are intentional empties and should not penalise the variance metric.
    lengths = [
        len(r["review_content"].split())
        for r in rows
        if r.get("review_content", "").strip()
    ]
    if len(lengths) < 2:
        return True, "Not enough content reviews to check variance"

    mean = sum(lengths) / len(lengths)
    variance = sum((x - mean) ** 2 for x in lengths) / len(lengths)
    stddev = math.sqrt(variance)
    lo, hi = min(lengths), max(lengths)

    empty_count = len(rows) - len(lengths)
    detail = (
        f"Length (content reviews only): min={lo}, max={hi}, "
        f"mean={mean:.0f}, stddev={stddev:.1f} words  "
        f"[{empty_count} empty-content rows excluded]"
    )

    if stddev < LENGTH_STDDEV_MIN:
        return False, f"Length std dev {stddev:.1f} < required {LENGTH_STDDEV_MIN}. {detail}"
    return True, detail


def check_rating_length_order(rows: list[dict]) -> tuple[bool, str]:
    """4-star reviews with content should average longer than 5-star reviews with content."""
    fives = [
        len(r["review_content"].split())
        for r in rows
        if r.get("review_score") == "5" and r.get("review_content", "").strip()
    ]
    fours = [
        len(r["review_content"].split())
        for r in rows
        if r.get("review_score") == "4" and r.get("review_content", "").strip()
    ]

    if not fives or not fours:
        return True, "Not enough data for both rating levels"

    avg5 = sum(fives) / len(fives)
    avg4 = sum(fours) / len(fours)
    detail = f"Avg 5-star: {avg5:.0f} words, Avg 4-star: {avg4:.0f} words"

    if avg4 <= avg5:
        return False, f"4-star reviews not longer than 5-star. {detail}"
    return True, detail


def check_date_distribution(rows: list[dict]) -> tuple[bool, str]:
    """Verify dates fall within 2016-Feb 2026 and no extreme year outliers."""
    from collections import Counter
    years = Counter(r["date"][:4] for r in rows if r.get("date", ""))

    pre_2016 = sum(v for k, v in years.items() if k < "2016")
    post_2026_mar = sum(v for k, v in years.items() if k > "2026")
    if post_2026_mar:
        return False, f"Dates beyond Feb 2026 present: {post_2026_mar} rows"
    if pre_2016:
        return False, f"Dates before 2016 present: {pre_2016} rows"

    year_summary = " | ".join(
        f"{k}: {v}" for k, v in sorted(years.items())
    )
    return True, f"Date range OK — {year_summary}"


# ---------------------------------------------------------------------------
# Main runner
# ---------------------------------------------------------------------------

def check_spec_code_density(rows: list[dict]) -> tuple[bool, str]:
    """
    Flag if more than 15% of reviews contain alphanumeric spec codes.
    Codes-tier personas (3/15 = 20% of pool) may use them, so >15% is the ceiling.
    Pattern covers: tire sizes (ST235/85R16), truck tires (11R22.5),
    bearing numbers (L44649), and similar catalog codes.
    """
    _code_pattern = re.compile(
        r"\b(?:ST)?\d{3}/\d{2,3}[RD]\d{2}(?:\.\d)?\b"
        r"|\b\d{2}R\d{2}\.\d\b"
        r"|\bL\d{4,6}(?:/L\d{4,6})?\b",
        re.IGNORECASE,
    )

    hits = []
    for i, r in enumerate(rows, 1):
        content = r.get("review_content", "")
        if content.strip() and _code_pattern.search(content):  # skip empty-content rows
            hits.append(i)

    pct = len(hits) / max(len(rows), 1)
    detail = f"{len(hits)}/{len(rows)} reviews contain alphanumeric spec codes ({pct:.1%})"

    if pct > 0.15:
        sample = [f"Row {i}" for i in hits[:5]]
        return False, f"Spec code density {pct:.1%} exceeds 15% ceiling. {detail}. Examples: {sample}"
    return True, detail


CHECKS = [
    ("Star ratings (4 and 5 only)",      check_star_ratings),
    ("Opener dominance (< 10% each)",    check_opener_dominance),
    ("Banned content openers",           check_banned_content_openers),
    ("Banned title openers",             check_banned_title_openers),
    ("Banned word violations",           check_banned_words),
    ("Length variance (std dev > 12)",   check_length_variance),
    ("Length by rating (4★ > 5★)",       check_rating_length_order),
    ("Spec code density (< 15%)",        check_spec_code_density),
    ("Date distribution (2016-Feb 2026)", check_date_distribution),
]


def run(csv_path: str, verbose: bool = False) -> int:
    path = Path(csv_path)
    if not path.exists():
        print(f"ERROR: file not found: {csv_path}")
        return 1

    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    if not rows:
        print("ERROR: CSV is empty")
        return 1

    print(f"\nValidating: {path.name}  ({len(rows):,} reviews)")
    sep = "─" * 56
    print(sep)

    passed_all = True
    for name, fn in CHECKS:
        passed, detail = fn(rows)
        status = "PASS" if passed else "FAIL"
        if not passed:
            passed_all = False
        print(f"  {status}  {name}")
        if not passed or verbose:
            for line in detail.splitlines():
                print(f"       {line}")

    print(sep)
    if passed_all:
        print("  All checks passed. Safe to run larger batches.\n")
    else:
        print("  One or more checks FAILED. Fix issues before running full catalog.\n")

    return 0 if passed_all else 1


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate Yotpo review CSV quality")
    parser.add_argument("csv_file", help="Path to CSV file to validate")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Show details for passing checks too")
    args = parser.parse_args()
    sys.exit(run(args.csv_file, verbose=args.verbose))


if __name__ == "__main__":
    main()
