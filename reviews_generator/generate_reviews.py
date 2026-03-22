"""
TPU Yotpo Review Generator
==========================
Generates human-like, tiered product reviews for Trailer Parts Unlimited
and exports them as Yotpo-compatible CSV files.

Usage:
  python generate_reviews.py --products 50
  python generate_reviews.py --products all
  python generate_reviews.py --dry-run --products all
  python generate_reviews.py --max-cost-usd 20
  python generate_reviews.py --retry-incomplete
  python generate_reviews.py --reset
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import os
import sys
from datetime import datetime

from dotenv import load_dotenv
from openai import AsyncOpenAI
from tqdm.asyncio import tqdm as async_tqdm

from bc_client import fetch_all_products
from checkpoint import (
    add_incomplete,
    load_incomplete,
    load_processed,
    mark_processed,
    reset_processed,
)
from csv_writer import YotpoCSVWriter
from reviewer import generate_llm_reviews, generate_silent_reviews, generate_title_only_reviews
from tier import compute_tier_info, estimate_run, print_dry_run

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

def _load_env() -> dict[str, str]:
    load_dotenv()
    required = ["BC_STORE_HASH", "BC_API_KEY", "OPENAI_API_KEY"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        print(f"\nError: missing required environment variables: {', '.join(missing)}")
        print("Copy .env.example to .env and fill in your credentials.\n")
        sys.exit(1)
    return {
        "store_hash": os.environ["BC_STORE_HASH"],
        "api_key": os.environ["BC_API_KEY"],
        "openai_key": os.environ["OPENAI_API_KEY"],
        "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Yotpo-compatible product reviews for Trailer Parts Unlimited",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--products",
        default="all",
        help="Number of products to process, or 'all' (default: all)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print cost estimate and exit — no reviews generated",
    )
    parser.add_argument(
        "--max-cost-usd",
        type=float,
        default=None,
        metavar="AMOUNT",
        help="Prompt for confirmation if estimated cost exceeds this amount",
    )
    parser.add_argument(
        "--retry-incomplete",
        action="store_true",
        help="Reprocess products listed in output/.incomplete.json",
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Clear the processed-IDs checkpoint (prompts for confirmation)",
    )
    return parser.parse_args()


# ---------------------------------------------------------------------------
# Per-product processor
# ---------------------------------------------------------------------------

async def process_product(
    product: dict,
    client: AsyncOpenAI,
    model: str,
    processed_ids: set[str],
    incomplete_list: list[dict],
    file_lock: asyncio.Lock,
    csv_writer: YotpoCSVWriter,
) -> tuple[int, int]:
    """
    Generate all reviews for one product, write to CSV, update checkpoints.
    Returns (reviews_generated, reviews_expected).
    """
    info = compute_tier_info(product)
    tier = info.tier
    expected = info.review_count
    rows: list[dict] = []

    # Universal 2-bucket split across ALL tiers:
    #   46% → short text ≤12 words (LLM) — lazy reviewers
    #   54% → full content (LLM for Tier 2-4; local silent for Tier 1)
    short_count = max(1, round(expected * 0.46))
    full_count  = max(0, expected - short_count)

    try:
        # Bucket 1: short text — ≤12 words (all tiers, LLM)
        if short_count > 0:
            short_rows = await generate_llm_reviews(
                product=product,
                total_count=short_count,
                tier=tier,
                client=client,
                model=model,
                is_tier1_text=True,
            )
            rows.extend(short_rows)

        # Bucket 3: full reviews
        if full_count > 0:
            if tier == 1:
                # Tier 1: remaining 80% stays local-silent (cost-efficient)
                rows.extend(generate_silent_reviews(product, full_count))
            else:
                full_rows = await generate_llm_reviews(
                    product=product,
                    total_count=full_count,
                    tier=tier,
                    client=client,
                    model=model,
                )
                rows.extend(full_rows)

    except Exception as exc:
        logger.error(f"Product {product['id']} ({product['name']}) failed: {exc}", exc_info=True)

    got = len(rows)
    threshold = expected * 0.95

    async with file_lock:
        if rows:
            csv_writer.write_rows(rows)

        if got >= threshold:
            mark_processed(product["id"], processed_ids)
        else:
            add_incomplete(product, expected, got, incomplete_list)

    return got, expected


# ---------------------------------------------------------------------------
# Main orchestration
# ---------------------------------------------------------------------------

async def run(args: argparse.Namespace) -> None:
    env = _load_env()

    # --- Reset checkpoint ---
    if args.reset:
        answer = input("Reset the .processed_ids.json checkpoint? This cannot be undone. [y/N]: ")
        if answer.strip().lower() == "y":
            reset_processed(confirm=True)
            print("Checkpoint reset.")
        else:
            print("Aborted.")
        return

    # --- Load checkpoints ---
    processed_ids = load_processed()
    incomplete_list = load_incomplete()

    # --- Retry-incomplete mode ---
    if args.retry_incomplete:
        if not incomplete_list:
            print("No incomplete products found in output/.incomplete.json")
            return

        print(f"Retrying {len(incomplete_list)} incomplete product(s)...")
        # Remove them from processed so they get reprocessed
        for entry in incomplete_list:
            processed_ids.discard(str(entry.get("product_id", "")))
        # Fetch products and filter to only the incomplete ones
        incomplete_ids = {str(e["product_id"]) for e in incomplete_list}
        all_products = await fetch_all_products(env["store_hash"], env["api_key"])
        products_to_run = [p for p in all_products if p["id"] in incomplete_ids]

        if not products_to_run:
            print("None of the incomplete products were found in the current catalog.")
            return
    else:
        # --- Normal mode: fetch and filter ---
        print("\nFetching product catalog from BigCommerce...")
        all_products = await fetch_all_products(env["store_hash"], env["api_key"])

        if not all_products:
            print("No products returned from BigCommerce. Check your credentials and store hash.")
            return

        limit: int | None = None
        if args.products != "all":
            try:
                limit = int(args.products)
            except ValueError:
                print(f"Invalid --products value: {args.products!r}. Use a number or 'all'.")
                sys.exit(1)

        unprocessed = [p for p in all_products if p["id"] not in processed_ids]
        products_to_run = unprocessed[:limit] if limit else unprocessed

    model = env["model"]

    # --- Dry run ---
    if args.dry_run:
        summary = estimate_run(all_products if not args.retry_incomplete else products_to_run,
                               processed_ids, limit if not args.retry_incomplete else None, model)
        print_dry_run(summary)
        return

    # --- Cost guard ---
    if args.max_cost_usd is not None and not args.retry_incomplete:
        summary = estimate_run(all_products, processed_ids, limit, model)
        if summary.total_cost_usd > args.max_cost_usd:
            answer = input(
                f"\nEstimated cost ${summary.total_cost_usd:.2f} exceeds "
                f"--max-cost-usd ${args.max_cost_usd:.2f}. Continue? [y/N]: "
            )
            if answer.strip().lower() != "y":
                print("Aborted.")
                return

    if not products_to_run:
        print("Nothing to process — all products already completed.")
        print(f"Use --reset to clear the checkpoint, or check output/.incomplete.json")
        return

    # --- Summary banner ---
    sep = "─" * 50
    print()
    print("TPU Review Generator")
    print(sep)
    print(f"{'Products to process':<30}: {len(products_to_run):,}")
    print(f"{'Already processed':<30}: {len(processed_ids):,}")
    print(f"{'Model':<30}: {model}")
    print(sep)
    print()

    # --- Run ---
    client = AsyncOpenAI(api_key=env["openai_key"])
    file_lock = asyncio.Lock()
    csv_writer = YotpoCSVWriter()

    total_generated = 0
    total_expected = 0

    tasks = [
        process_product(
            product=p,
            client=client,
            model=model,
            processed_ids=processed_ids,
            incomplete_list=incomplete_list,
            file_lock=file_lock,
            csv_writer=csv_writer,
        )
        for p in products_to_run
    ]

    results = await async_tqdm.gather(
        *tasks,
        desc="Generating reviews",
        unit="product",
    )

    for got, expected in results:
        total_generated += got
        total_expected += expected

    # Flush remaining rows to final CSV part
    files = csv_writer.finalize()

    # --- Final summary ---
    print()
    print(sep)
    print(f"{'Products processed':<30}: {len(products_to_run):,}")
    print(f"{'Reviews generated':<30}: {total_generated:,}  (expected ~{total_expected:,})")
    print(f"{'Output files':<30}: {len(files)}")
    for f in files:
        print(f"  → {f}")

    if incomplete_list:
        print(f"\n  {len(incomplete_list)} product(s) in output/.incomplete.json (run with --retry-incomplete)")

    print(sep)
    print()


def main() -> None:
    args = parse_args()
    asyncio.run(run(args))


if __name__ == "__main__":
    main()
