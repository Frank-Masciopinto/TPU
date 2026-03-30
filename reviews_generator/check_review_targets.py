#!/usr/bin/env python3
"""
Compare generated Yotpo CSV rows to per-product targets from batch_specs product_plans
(or recomputed plan_product() from BigCommerce).

Bucket detection (heuristic for LLM rows):
  - title_only: non-empty review_title, review_content is blank/whitespace only
  - silent: empty title, blank/whitespace content (Tier 1 "full" local reviews)
  - short_llm: visible content, word count <= SHORT_MAX_WORDS (≤12-word batch + margin)
  - full_llm: visible content, word count > SHORT_MAX_WORDS

Rating targets:
  - Tier 1: all 5 among non-LLM rows; short_llm may still be 4/5 from pool
  - Tiers 2–4: among LLM rows only (short+full), expect ~85% five-star / ~15% four-star

Usage:
  python3 check_review_targets.py output/yotpo_reviews_UNIFIED_xxx.csv \\
      --specs output/batch_specs_20260323_173706.json
  python3 check_review_targets.py output/yotpo_reviews_*.csv --specs specs.json --per-product 15
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import glob
import json
import os
import sys
from collections import defaultdict
from io import StringIO
from pathlib import Path

from dotenv import load_dotenv

from batch_runner import _load_batch_specs
from bc_client import fetch_all_products
from csv_writer import YOTPO_COLUMNS
from tier import FULL_RATING_WEIGHTS, plan_product

SHORT_MAX_WORDS = 18
# Target share of 4-star among LLM reviews for tiers 2–4 (from FULL_RATING_WEIGHTS)
TARGET_FOUR_PCT = 100.0 * FULL_RATING_WEIGHTS[4] / sum(FULL_RATING_WEIGHTS.values())
TARGET_FIVE_PCT = 100.0 * FULL_RATING_WEIGHTS[5] / sum(FULL_RATING_WEIGHTS.values())


def _is_whitespace_only_content(content: str) -> bool:
    return len((content or "").strip()) <= 1


def _word_count(content: str) -> int:
    return len((content or "").strip().split())


def classify_row(row: dict) -> str:
    """Return one of: title_only | silent | short_llm | full_llm."""
    title = (row.get("review_title") or "").strip()
    content = row.get("review_content") or ""
    if _is_whitespace_only_content(content):
        return "title_only" if title else "silent"
    if _word_count(content) <= SHORT_MAX_WORDS:
        return "short_llm"
    return "full_llm"


def _read_csv_rows(paths: list[str]) -> list[dict]:
    rows: list[dict] = []
    for fp in paths:
        raw = Path(fp).read_text(encoding="utf-8", errors="replace").replace("\x00", "")
        reader = csv.DictReader(StringIO(raw))
        for row in reader:
            full = {c: row.get(c, "") for c in YOTPO_COLUMNS}
            rows.append(full)
    return rows


def _gather_csv_paths(patterns: list[str]) -> list[str]:
    out: list[str] = []
    for p in patterns:
        if any(c in p for c in "*?[]"):
            out.extend(sorted(glob.glob(p)))
        elif os.path.isfile(p):
            out.append(p)
    # stable unique
    seen: set[str] = set()
    uniq: list[str] = []
    for p in out:
        ap = os.path.abspath(p)
        if ap not in seen:
            seen.add(ap)
            uniq.append(ap)
    return uniq


def main() -> None:
    load_dotenv()
    parser = argparse.ArgumentParser(
        description="Compare Yotpo CSV review rows to planned bucket counts and rating mix"
    )
    parser.add_argument(
        "csv_paths",
        nargs="+",
        help="CSV file(s) or glob(s)",
    )
    parser.add_argument(
        "--specs",
        metavar="PATH",
        help="batch_specs_*.json with product_plans (recommended)",
    )
    parser.add_argument(
        "--no-bc",
        action="store_true",
        help="Do not fetch BigCommerce; require --specs for every product_id in CSV",
    )
    parser.add_argument(
        "--include-out-of-stock",
        action="store_true",
        help="When using BC, include OOS products (default: in-stock only)",
    )
    parser.add_argument(
        "--per-product",
        type=int,
        default=10,
        metavar="N",
        help="Show up to N products with largest bucket mismatches (default 10)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print machine-readable summary JSON to stdout",
    )
    args = parser.parse_args()

    paths = _gather_csv_paths(args.csv_paths)
    if not paths:
        print("No CSV files matched.", file=sys.stderr)
        sys.exit(1)

    rows = _read_csv_rows(paths)
    if not rows:
        print("No data rows in CSV(s).", file=sys.stderr)
        sys.exit(1)

    by_product: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        pid = str(r.get("product_id", "")).strip()
        if pid:
            by_product[pid].append(r)

    plans: dict[str, dict] = {}
    if args.specs:
        raw = json.load(open(args.specs, encoding="utf-8"))
        if not isinstance(raw, dict):
            print("--specs file must be a JSON object.", file=sys.stderr)
            sys.exit(1)
        _, plans_raw = _load_batch_specs(args.specs)
        plans = plans_raw or {}

    product_by_id: dict[str, dict] = {}
    if not args.no_bc or not plans:
        if args.no_bc and not plans:
            print("--no-bc requires --specs with product_plans.", file=sys.stderr)
            sys.exit(1)
        missing_plans = [pid for pid in by_product if pid not in plans]
        if missing_plans and not args.no_bc:
            if not os.getenv("BC_STORE_HASH") or not os.getenv("BC_API_KEY"):
                print(
                    "Missing BC_STORE_HASH / BC_API_KEY — cannot fill plans for IDs "
                    f"not in --specs ({len(missing_plans)} products).",
                    file=sys.stderr,
                )
                sys.exit(1)
            in_stock_only = not args.include_out_of_stock
            if os.getenv("BC_INCLUDE_OUT_OF_STOCK", "").strip().lower() in (
                "1",
                "true",
                "yes",
            ):
                in_stock_only = False
            products = asyncio.run(
                fetch_all_products(
                    os.environ["BC_STORE_HASH"],
                    os.environ["BC_API_KEY"],
                    in_stock_only=in_stock_only,
                )
            )
            product_by_id = {str(p["id"]): p for p in products}
            for pid in missing_plans:
                p = product_by_id.get(pid)
                if p:
                    plans[pid] = plan_product(p).to_dict()

    # Classify and aggregate
    exp_title = exp_short = exp_full = exp_total = 0
    act_title = act_short = act_full = act_silent = act_llm = 0
    mismatches: list[tuple[float, str, dict, dict]] = []

    tier_llm_scores: dict[int, list[str]] = defaultdict(list)
    missing_plan: list[str] = []
    not_in_csv: list[str] = []

    for pid, plan in plans.items():
        if pid not in by_product:
            not_in_csv.append(pid)
            continue

    for pid, prow in by_product.items():
        plan_d = plans.get(pid)
        if not plan_d:
            missing_plan.append(pid)
            continue

        tier = int(plan_d["tier"])
        e_to = int(plan_d["title_only_count"])
        e_sh = int(plan_d["short_llm_count"])
        e_fu = int(plan_d["full_count"])
        e_tot = int(plan_d["review_count"])
        silent_e = e_fu if tier == 1 else 0
        llm_short_e = e_sh
        llm_full_e = e_fu if tier != 1 else 0

        counts = {"title_only": 0, "silent": 0, "short_llm": 0, "full_llm": 0}
        for r in prow:
            bucket = classify_row(r)
            counts[bucket] += 1
            score = str(r.get("review_score", "")).strip()
            if bucket in ("short_llm", "full_llm") and score in ("4", "5"):
                tier_llm_scores[tier].append(score)

        a_to = counts["title_only"]
        a_si = counts["silent"]
        a_sh = counts["short_llm"]
        a_fu = counts["full_llm"]
        a_tot = len(prow)

        exp_title += e_to
        exp_short += e_sh
        exp_full += e_fu
        exp_total += e_tot

        act_title += a_to
        act_short += a_sh
        act_full += a_fu
        act_silent += a_si
        act_llm += a_sh + a_fu

        # Compare expected "logical" buckets to actual
        # Tier 1: full_count → silent; tiers 2–4: full_count → full_llm
        e_silent = silent_e
        e_llm_short = llm_short_e
        e_llm_full = llm_full_e

        delta = (
            abs(a_to - e_to)
            + abs(a_si - e_silent)
            + abs(a_sh - e_llm_short)
            + abs(a_fu - e_llm_full)
            + abs(a_tot - e_tot) * 0.01
        )
        mismatches.append(
            (
                float(delta),
                pid,
                {
                    "expected": {
                        "total": e_tot,
                        "title_only": e_to,
                        "silent": e_silent,
                        "short_llm": e_llm_short,
                        "full_llm": e_llm_full,
                    },
                    "actual": {
                        "total": a_tot,
                        "title_only": a_to,
                        "silent": a_si,
                        "short_llm": a_sh,
                        "full_llm": a_fu,
                    },
                },
                plan_d,
            )
        )

    mismatches.sort(key=lambda x: -x[0])

    compared_rows = sum(len(by_product[pid]) for pid in by_product if pid in plans)

    # Sub-aggregate: products essentially complete (>=95% of expected rows)
    complete_pids: list[str] = []
    agg_c = {
        "title_only": {"e": 0, "a": 0},
        "short": {"e": 0, "a": 0},
        "full": {"e": 0, "a": 0},
    }
    for pid, prow in by_product.items():
        plan_d = plans.get(pid)
        if not plan_d:
            continue
        e_tot = int(plan_d["review_count"])
        a_tot = len(prow)
        if e_tot <= 0 or a_tot < e_tot * 0.95:
            continue
        complete_pids.append(pid)
        tier = int(plan_d["tier"])
        e_to = int(plan_d["title_only_count"])
        e_sh = int(plan_d["short_llm_count"])
        e_fu = int(plan_d["full_count"])
        e_silent = e_fu if tier == 1 else 0
        e_llm_f = e_fu if tier != 1 else 0
        counts = {"title_only": 0, "silent": 0, "short_llm": 0, "full_llm": 0}
        for r in prow:
            counts[classify_row(r)] += 1
        agg_c["title_only"]["e"] += e_to
        agg_c["title_only"]["a"] += counts["title_only"]
        agg_c["short"]["e"] += e_sh
        agg_c["short"]["a"] += counts["short_llm"]
        agg_c["full"]["e"] += e_silent + e_llm_f
        agg_c["full"]["a"] += counts["silent"] + counts["full_llm"]

    # Rating mix tiers 2–4 (LLM rows only)
    mix_report: dict[str, object] = {}
    for tier in (2, 3, 4):
        scores = tier_llm_scores.get(tier, [])
        if not scores:
            continue
        n = len(scores)
        n4 = sum(1 for s in scores if s == "4")
        n5 = sum(1 for s in scores if s == "5")
        other = n - n4 - n5
        mix_report[f"tier_{tier}"] = {
            "llm_rows": n,
            "pct_4": round(100.0 * n4 / n, 2),
            "pct_5": round(100.0 * n5 / n, 2),
            "other_scores": other,
            "target_pct_4": round(TARGET_FOUR_PCT, 2),
            "target_pct_5": round(TARGET_FIVE_PCT, 2),
        }

    summary = {
        "csv_files": len(paths),
        "csv_rows": len(rows),
        "products_with_rows": len(by_product),
        "products_in_specs": len(plans),
        "missing_plan_for_csv_product": len(missing_plan),
        "spec_products_not_in_csv": len(not_in_csv),
        "aggregate_expected_total_reviews": exp_total,
        "aggregate_actual_total_reviews_compared": compared_rows,
        "bucket_targets_vs_actual": {
            "title_only": {"expected": exp_title, "actual": act_title},
            "short_llm": {"expected": exp_short, "actual": act_short},
            "full_llm_including_tier1_silent": {
                "expected": exp_full,
                "actual": act_full + act_silent,
            },
            "silent_only": {"actual": act_silent},
            "full_llm_only": {"actual": act_full},
        },
        "llm_rating_mix": mix_report,
        "complete_products_ge_95pct": len(complete_pids),
        "bucket_aggregate_complete_products_only": agg_c,
    }

    if args.json:
        print(json.dumps(summary, indent=2))
        return

    sep = "─" * 56
    print(sep)
    print("Review targets vs generated CSV")
    print(sep)
    print(f"CSV file(s)     : {len(paths)}")
    print(f"Data rows       : {len(rows):,}")
    print(f"Products in CSV : {len(by_product):,}")
    if args.specs:
        print(f"Specs           : {args.specs}")
        print(f"Product plans   : {len(plans):,}")
    if missing_plan:
        print(f"WARNING: {len(missing_plan)} CSV product_id(s) have no plan (skipped)")
    if not_in_csv:
        print(f"Specs products not in CSV: {len(not_in_csv):,} (incomplete export)")

    print(sep)
    print("Aggregate buckets (sum over products that have a plan)")
    print(
        f"  title_only     expected {exp_title:>8,}  actual {act_title:>8,}  "
        f"Δ {act_title - exp_title:+,}"
    )
    print(
        f"  short_llm      expected {exp_short:>8,}  actual {act_short:>8,}  "
        f"Δ {act_short - exp_short:+,}"
    )
    print(
        f"  full bucket*   expected {exp_full:>8,}  actual {act_full + act_silent:>8,}  "
        f"Δ {act_full + act_silent - exp_full:+,}"
    )
    print(
        f"    (silent T1   actual {act_silent:>8,}  full_llm actual {act_full:>8,})"
    )
    print(
        f"  total reviews  expected {exp_total:>8,}  actual {compared_rows:>8,}  "
        f"Δ {compared_rows - exp_total:+,}  (products with plan only)"
    )
    cov = 100.0 * compared_rows / exp_total if exp_total else 0.0
    print(f"  Line coverage   {cov:.1f}% of expected rows (partial batch if << 100%)")
    print(
        "  *Tier 1: plan full_count → silent rows; tiers 2–4 → full_llm rows."
    )

    if complete_pids:
        exp_complete = sum(int(plans[pid]["review_count"]) for pid in complete_pids)
        act_complete = sum(len(by_product[pid]) for pid in complete_pids)
        print(sep)
        print(
            f"Bucket check — products ≥95% complete only (n={len(complete_pids):,} SKUs)"
        )
        print(
            f"  Rows in subset      expected {exp_complete:>8,}  actual {act_complete:>8,}"
        )
        for key, label in (
            ("title_only", "title_only"),
            ("short", "short_llm"),
            ("full", "silent + full_llm"),
        ):
            b = agg_c[key]
            e, a = b["e"], b["a"]
            print(f"  {label:<22} expected {e:>8,}  actual {a:>8,}  Δ {a - e:+,}")
        print(
            "  (Global % targets: ~25% title-only / ~21% short / rest full — "
            "per-SKU counts vary; silent counts as full bucket.)"
        )

    if mix_report:
        print(sep)
        print(
            f"LLM row star mix (target ~{TARGET_FIVE_PCT:.0f}% five / "
            f"{TARGET_FOUR_PCT:.0f}% four, tiers 2–4 only)"
        )
        for key, m in mix_report.items():
            assert isinstance(m, dict)
            print(
                f"  {key}: n={m['llm_rows']:,}  "
                f"five {m['pct_5']}%  four {m['pct_4']}%  "
                f"other {m['other_scores']}"
            )

    n_show = max(0, args.per_product)
    if n_show and mismatches:
        print(sep)
        print(f"Largest bucket mismatches (top {n_show})")
        for delta, pid, cmp_, pl in mismatches[:n_show]:
            ex = cmp_["expected"]
            ac = cmp_["actual"]
            print(
                f"  product_id={pid} tier={pl['tier']}  mismatch_score={delta:.1f}  "
                f"total {ac['total']}/{ex['total']}"
            )
            print(
                f"    title_only {ac['title_only']}/{ex['title_only']}  "
                f"silent {ac['silent']}/{ex['silent']}  "
                f"short {ac['short_llm']}/{ex['short_llm']}  "
                f"full {ac['full_llm']}/{ex['full_llm']}"
            )

    print(sep)


if __name__ == "__main__":
    main()
