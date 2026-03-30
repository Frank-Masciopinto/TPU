#!/usr/bin/env python3
"""
Merge all yotpo_reviews_*.csv files in output/ into a single CSV (opens in Excel)
and union all product_id values into output/.processed_ids.json.

Skips filenames containing UNIFIED (so re-runs do not nest merges).

Usage:
  python3 merge_yotpo_exports.py
  python3 merge_yotpo_exports.py --dry-run
"""

from __future__ import annotations

import argparse
import csv
import glob
import os
import sys
from datetime import datetime

from checkpoint import load_processed, save_processed
from csv_writer import OUTPUT_DIR, YOTPO_COLUMNS, yotpo_row_for_export


def _input_files() -> list[str]:
    pattern = os.path.join(OUTPUT_DIR, "yotpo_reviews_*.csv")
    paths = sorted(glob.glob(pattern))
    return [
        p
        for p in paths
        if "UNIFIED" not in os.path.basename(p).upper()
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description="Merge Yotpo CSV exports + update checkpoint")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print plan only; do not write files",
    )
    args = parser.parse_args()

    files = _input_files()
    if not files:
        print(f"No yotpo_reviews_*.csv files found in {OUTPUT_DIR}", file=sys.stderr)
        sys.exit(1)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = os.path.join(OUTPUT_DIR, f"yotpo_reviews_UNIFIED_{ts}.csv")

    product_ids: set[str] = set()
    total_rows = 0

    if args.dry_run:
        for fp in files:
            print(f"  would read: {os.path.basename(fp)}")
        print(f"  would write: {os.path.basename(out_path)}")
        print("  (dry-run: not counting rows)")
        return

    with open(out_path, "w", newline="", encoding="utf-8") as out_f:
        writer: csv.DictWriter | None = None
        for fp in files:
            with open(fp, newline="", encoding="utf-8") as in_f:
                reader = csv.DictReader(in_f)
                if writer is None:
                    writer = csv.DictWriter(
                        out_f,
                        fieldnames=YOTPO_COLUMNS,
                        extrasaction="ignore",
                    )
                    writer.writeheader()
                for row in reader:
                    pid = str(row.get("product_id", "") or "").strip()
                    if pid:
                        product_ids.add(pid)
                    writer.writerow(yotpo_row_for_export(row))
                    total_rows += 1

    processed = load_processed()
    before = len(processed)
    processed |= product_ids
    save_processed(processed)

    print(f"Merged {len(files)} file(s) → {out_path}")
    print(f"Total data rows written: {total_rows:,}")
    print(f"Unique product_id in merge: {len(product_ids):,}")
    print(f".processed_ids.json: {before} → {len(processed)} ids")


if __name__ == "__main__":
    main()
