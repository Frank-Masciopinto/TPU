"""
Crash-safe checkpoint management.

processed_ids.json  — set of product IDs that completed successfully (>= 95% target).
incomplete.json     — list of product dicts that fell below the 95% threshold.

All writes are atomic: write to a .tmp file, then os.replace() to final path.
All public functions that mutate state are protected by the caller's asyncio.Lock.
"""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime

logger = logging.getLogger(__name__)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
PROCESSED_FILE = os.path.join(OUTPUT_DIR, ".processed_ids.json")
INCOMPLETE_FILE = os.path.join(OUTPUT_DIR, ".incomplete.json")


def _ensure_output_dir() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def _atomic_write(path: str, data: object) -> None:
    """Write JSON atomically: temp file → os.replace."""
    _ensure_output_dir()
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, path)


# ---------------------------------------------------------------------------
# Processed IDs
# ---------------------------------------------------------------------------

def load_processed() -> set[str]:
    """Load the set of already-processed product IDs."""
    if not os.path.exists(PROCESSED_FILE):
        return set()
    try:
        with open(PROCESSED_FILE, encoding="utf-8") as f:
            data = json.load(f)
        return set(str(i) for i in data.get("processed", []))
    except (json.JSONDecodeError, OSError) as exc:
        logger.warning(f"Could not read {PROCESSED_FILE}: {exc}. Starting fresh.")
        return set()


def save_processed(processed_ids: set[str]) -> None:
    """Atomically persist the processed IDs set."""
    _atomic_write(
        PROCESSED_FILE,
        {
            "processed": sorted(processed_ids),
            "count": len(processed_ids),
            "last_updated": datetime.utcnow().isoformat() + "Z",
        },
    )


def mark_processed(product_id: str, processed_ids: set[str]) -> None:
    """Add a product ID to the set and persist immediately."""
    processed_ids.add(str(product_id))
    save_processed(processed_ids)


# ---------------------------------------------------------------------------
# Incomplete tracking
# ---------------------------------------------------------------------------

def load_incomplete() -> list[dict]:
    """Load the list of products that fell below the 95% review threshold."""
    if not os.path.exists(INCOMPLETE_FILE):
        return []
    try:
        with open(INCOMPLETE_FILE, encoding="utf-8") as f:
            data = json.load(f)
        return data.get("incomplete", [])
    except (json.JSONDecodeError, OSError) as exc:
        logger.warning(f"Could not read {INCOMPLETE_FILE}: {exc}.")
        return []


def save_incomplete(incomplete: list[dict]) -> None:
    """Atomically persist the incomplete products list."""
    _atomic_write(
        INCOMPLETE_FILE,
        {
            "incomplete": incomplete,
            "count": len(incomplete),
            "last_updated": datetime.utcnow().isoformat() + "Z",
        },
    )


def add_incomplete(product: dict, expected: int, got: int, existing: list[dict]) -> None:
    """
    Add a product to the incomplete list (does not mark it as processed).
    existing is mutated in place and re-persisted.
    """
    entry = {
        "product_id": product["id"],
        "product_name": product.get("name", ""),
        "expected_reviews": expected,
        "generated_reviews": got,
        "shortfall_pct": round((expected - got) / max(expected, 1) * 100, 1),
        "recorded_at": datetime.utcnow().isoformat() + "Z",
    }
    # Avoid duplicate entries for the same product
    existing[:] = [e for e in existing if e.get("product_id") != product["id"]]
    existing.append(entry)
    save_incomplete(existing)
    logger.warning(
        f"Product {product['id']} ({product.get('name')}) incomplete: "
        f"got {got}/{expected} reviews ({entry['shortfall_pct']}% shortfall). "
        f"Added to {INCOMPLETE_FILE}"
    )


# ---------------------------------------------------------------------------
# Reset
# ---------------------------------------------------------------------------

def reset_processed(confirm: bool = False) -> None:
    """Delete the processed IDs checkpoint. Requires explicit confirm=True."""
    if not confirm:
        raise ValueError("Pass confirm=True to reset the checkpoint.")
    if os.path.exists(PROCESSED_FILE):
        os.remove(PROCESSED_FILE)
        logger.info("Checkpoint reset: .processed_ids.json deleted.")
    else:
        logger.info("Nothing to reset — .processed_ids.json does not exist.")
