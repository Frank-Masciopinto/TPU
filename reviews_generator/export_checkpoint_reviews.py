#!/usr/bin/env python3
"""
Rebuild a single Yotpo CSV containing only reviews for product IDs listed in
output/.processed_ids.json (i.e. completed successfully before a crash / 429).

Scans existing yotpo_reviews_*.csv exports (includes UNIFIED merges; excludes
*CHECKPOINT* outputs from this tool to avoid re-ingesting),
dedupes by (product_id, email, date).

Usage:
  python3 export_checkpoint_reviews.py
  python3 export_checkpoint_reviews.py --sources output/yotpo_reviews_20260323_155156_part1.csv
"""

from __future__ import annotations

import argparse
import csv
import glob
import os
import sys
from datetime import datetime

from checkpoint import OUTPUT_DIR, load_processed
from csv_writer import YOTPO_COLUMNS, yotpo_row_for_export


def _default_sources() -> list[str]:
    pattern = os.path.join(OUTPUT_DIR, "yotpo_reviews_*.csv")
    paths = sorted(glob.glob(pattern))
    out: list[str] = []
    for p in paths:
        base = os.path.basename(p).upper()
        if "CHECKPOINT" in base:
            continue
        out.append(p)
    return out


def _row_key(row: dict) -> tuple[str, str, str]:
    return (
        str(row.get("product_id", "")).strip(),
        str(row.get("email", "")).strip().lower(),
        str(row.get("date", "")).strip(),
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Export CSV of reviews for checkpoint .processed_ids.json only"
    )
    parser.add_argument(
        "--sources",
        nargs="*",
        metavar="CSV",
        help="Input CSV paths (default: all yotpo_reviews_*.csv except UNIFIED/CHECKPOINT)",
    )
    parser.add_argument(
        "-o",
        "--output",
        metavar="PATH",
        help="Output path (default: output/yotpo_reviews_CHECKPOINT_<timestamp>.csv)",
    )
    args = parser.parse_args()

    processed = load_processed()
    if not processed:
        print("No IDs in output/.processed_ids.json — nothing to export.", file=sys.stderr)
        sys.exit(1)

    sources = args.sources if args.sources else _default_sources()
    if not sources:
        print(f"No source CSVs found under {OUTPUT_DIR}", file=sys.stderr)
        sys.exit(1)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = args.output or os.path.join(OUTPUT_DIR, f"yotpo_reviews_CHECKPOINT_{ts}.csv")

    seen: set[tuple[str, str, str]] = set()
    written = 0
    skipped_not_processed = 0
    skipped_dup = 0

    with open(out_path, "w", newline="", encoding="utf-8") as out_f:
        writer = csv.DictWriter(
            out_f,
            fieldnames=YOTPO_COLUMNS,
            extrasaction="ignore",
        )
        writer.writeheader()

        for src in sources:
            if not os.path.isfile(src):
                print(f"  skip missing: {src}", file=sys.stderr)
                continue
            with open(src, newline="", encoding="utf-8") as in_f:
                reader = csv.DictReader(in_f)
                for row in reader:
                    pid = str(row.get("product_id", "") or "").strip()
                    if pid not in processed:
                        skipped_not_processed += 1
                        continue
                    key = _row_key(row)
                    if key in seen:
                        skipped_dup += 1
                        continue
                    seen.add(key)
                    writer.writerow(yotpo_row_for_export(row))
                    written += 1

    print(f"Processed IDs in checkpoint : {len(processed):,}")
    print(f"Source files                : {len(sources)}")
    print(f"Rows written                : {written:,}")
    print(f"Skipped (not in checkpoint) : {skipped_not_processed:,}")
    print(f"Skipped (duplicate key)     : {skipped_dup:,}")
    print(f"Output                      : {out_path}")


if __name__ == "__main__":
    main()
