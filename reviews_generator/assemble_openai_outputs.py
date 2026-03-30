#!/usr/bin/env python3
"""
Assemble every downloaded OpenAI Batch result file (*_openai_part*.jsonl) in output/
into Yotpo CSV(s), using the matching batch_specs_*.json lookup.

Does not update .processed_ids.json or .incomplete.json (export-only).

Usage:
  python3 assemble_openai_outputs.py
  python3 assemble_openai_outputs.py --include-out-of-stock
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import glob
import os
import re
import sys
from collections import defaultdict
from datetime import datetime
from io import StringIO

from dotenv import load_dotenv

from batch_runner import OUTPUT_DIR, _product_map_from_specs, assemble_csv
from bc_client import fetch_all_products
from checkpoint import load_incomplete, load_processed
from csv_writer import YOTPO_COLUMNS, yotpo_row_for_export

_PART_RE = re.compile(r"^(batch_specs_\d+_\d+)_openai_part(\d+)\.jsonl$")


def _discover_groups() -> dict[str, list[str]]:
    """stem -> sorted list of jsonl paths (by part number)."""
    groups: dict[str, list[tuple[int, str]]] = defaultdict(list)
    for name in os.listdir(OUTPUT_DIR):
        m = _PART_RE.match(name)
        if not m:
            continue
        stem, part_s = m.group(1), m.group(2)
        path = os.path.join(OUTPUT_DIR, name)
        if os.path.isfile(path) and os.path.getsize(path) > 0:
            groups[stem].append((int(part_s), path))
    out: dict[str, list[str]] = {}
    for stem, items in groups.items():
        items.sort(key=lambda x: x[0])
        out[stem] = [p for _, p in items]
    return out


def _merge_run_parts_into_unified(first_part_path: str) -> str | None:
    """Merge yotpo_reviews_<ts>_part*.csv from the same run into one UNIFIED file."""
    base = os.path.basename(first_part_path)
    m = re.match(r"^(yotpo_reviews_\d+_\d+)_part\d+\.csv$", base)
    if not m:
        return None
    prefix = m.group(1)
    pattern = os.path.join(OUTPUT_DIR, f"{prefix}_part*.csv")
    paths = sorted(
        glob.glob(pattern),
        key=lambda p: int(re.search(r"_part(\d+)\.csv$", p).group(1)),
    )
    if not paths:
        return None
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = os.path.join(OUTPUT_DIR, f"yotpo_reviews_UNIFIED_{ts}.csv")
    total = 0
    with open(out_path, "w", newline="", encoding="utf-8") as out_f:
        writer: csv.DictWriter | None = None
        for fp in paths:
            raw = open(fp, encoding="utf-8", errors="replace").read().replace("\x00", "")
            reader = csv.DictReader(StringIO(raw))
            if writer is None:
                writer = csv.DictWriter(
                    out_f,
                    fieldnames=YOTPO_COLUMNS,
                    extrasaction="ignore",
                )
                writer.writeheader()
                for row in reader:
                    writer.writerow(yotpo_row_for_export(row))
                total += 1
    print(f"Unified CSV: {out_path} ({total:,} rows from {len(paths)} part file(s))")
    return out_path


def main() -> None:
    load_dotenv()
    parser = argparse.ArgumentParser(
        description="Build Yotpo CSV from all batch_specs_*_openai_part*.jsonl in output/"
    )
    parser.add_argument(
        "--include-out-of-stock",
        action="store_true",
        help="Match generate_reviews default-off; pass to include OOS SKUs",
    )
    args = parser.parse_args()

    required = ["BC_STORE_HASH", "BC_API_KEY"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        print(f"Missing env: {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)

    groups = _discover_groups()
    if not groups:
        print(f"No non-empty batch_specs_*_openai_part*.jsonl in {OUTPUT_DIR}", file=sys.stderr)
        sys.exit(1)

    in_stock_only = not args.include_out_of_stock
    if os.getenv("BC_INCLUDE_OUT_OF_STOCK", "").strip().lower() in ("1", "true", "yes"):
        in_stock_only = False

    products = asyncio.run(
        fetch_all_products(
            os.environ["BC_STORE_HASH"],
            os.environ["BC_API_KEY"],
            in_stock_only=in_stock_only,
        )
    )

    processed_ids = load_processed()
    incomplete_list = load_incomplete()
    written: list[str] = []

    for stem in sorted(groups.keys()):
        jsonl_paths = groups[stem]
        specs_path = os.path.join(OUTPUT_DIR, f"{stem}.json")
        if not os.path.isfile(specs_path):
            print(f"Skip {stem}: missing {specs_path}", file=sys.stderr)
            continue
        product_map = _product_map_from_specs(products, specs_path)
        if not product_map:
            print(f"Skip {stem}: no products match specs", file=sys.stderr)
            continue
        print(f"Assembling {stem}: {len(jsonl_paths)} chunk file(s), {len(product_map)} products")
        first_csv = assemble_csv(
            jsonl_paths,
            specs_path,
            product_map,
            processed_ids,
            incomplete_list,
            update_checkpoints=False,
        )
        if first_csv:
            written.append(first_csv)

    if not written:
        print("No CSV produced.", file=sys.stderr)
        sys.exit(1)
    print("Done. First output file(s) per run:", "\n  ".join(written))
    if len(written) == 1:
        _merge_run_parts_into_unified(written[0])
    else:
        print(
            "Multiple spec runs — merge each run's parts manually or use merge_yotpo_exports.py",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()
