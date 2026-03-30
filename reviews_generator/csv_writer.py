"""
Yotpo-compatible CSV writer with automatic file splitting at 10,000 rows.

Produces files named:
  output/yotpo_reviews_YYYYMMDD_HHMMSS_part1.csv
  output/yotpo_reviews_YYYYMMDD_HHMMSS_part2.csv
  ...
"""

from __future__ import annotations

import csv
import logging
import os
import threading
from datetime import datetime

logger = logging.getLogger(__name__)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")

ROWS_PER_FILE = 10_000

# Exact Yotpo column order from the import template
YOTPO_COLUMNS = [
    "product_id",
    "product_title",
    "product_url",
    "date",
    "review_content",
    "review_score",
    "review_title",
    "display_name",
    "email",
    "user_type",
    "md_customer_country",
    "published",
    "product_image_url",
    "product_description",
    "comment_content",
    "comment_public",
    "comment_created_at",
    "published_image_url",
    "unpublished_image_url",
    "published_video_url",
    "unpublished_video_url",
    "cf_Y__X",
]

# Title-only / silent reviews use whitespace-only body in memory; Yotpo CSV uses this placeholder.
_EMPTY_REVIEW_CONTENT_PLACEHOLDER = " - "


def yotpo_row_for_export(row: dict) -> dict[str, str]:
    """
    Normalize a row for Yotpo CSV: strip NULs; whitespace-only review_content → " - ".
    """
    out: dict[str, str] = {}
    for col in YOTPO_COLUMNS:
        s = str(row.get(col, "") or "").replace("\x00", "")
        if col == "review_content" and not s.strip():
            s = _EMPTY_REVIEW_CONTENT_PLACEHOLDER
        out[col] = s
    return out


class YotpoCSVWriter:
    """
    Buffers rows in memory and flushes them to split CSV files.
    Call write_rows() to add rows, then finalize() to flush the last partial file.
    """

    def __init__(self, timestamp: str | None = None):
        self._timestamp = timestamp or datetime.now().strftime("%Y%m%d_%H%M%S")
        self._buffer: list[dict] = []
        self._part = 1
        self._total_written = 0
        self._files_written: list[str] = []
        # Async tasks share one writer; 429 hook may finalize while another task writes.
        self._lock = threading.Lock()
        os.makedirs(OUTPUT_DIR, exist_ok=True)

    def _part_path(self) -> str:
        return os.path.join(
            OUTPUT_DIR,
            f"yotpo_reviews_{self._timestamp}_part{self._part}.csv",
        )

    def _flush(self, rows: list[dict]) -> None:
        path = self._part_path()
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(
                f,
                fieldnames=YOTPO_COLUMNS,
                extrasaction="ignore",
            )
            writer.writeheader()
            for row in rows:
                writer.writerow(yotpo_row_for_export(row))

        self._files_written.append(path)
        self._total_written += len(rows)
        logger.info(f"Wrote {len(rows):,} rows to {os.path.basename(path)}")
        self._part += 1

    def write_rows(self, rows: list[dict]) -> None:
        """Add rows to the buffer, flushing complete 10k-row files as needed."""
        with self._lock:
            self._buffer.extend(rows)

            while len(self._buffer) >= ROWS_PER_FILE:
                chunk = self._buffer[:ROWS_PER_FILE]
                self._buffer = self._buffer[ROWS_PER_FILE:]
                self._flush(chunk)

    def flush_pending(self) -> None:
        """
        Write any buffered rows to the next part file immediately (partial chunk).
        Safe to call after each product so crashes / 429 do not lose in-memory rows.
        """
        with self._lock:
            if self._buffer:
                self._flush(self._buffer)
                self._buffer = []

    def finalize(self) -> list[str]:
        """Flush any remaining buffered rows. Returns list of file paths written."""
        self.flush_pending()
        with self._lock:
            return list(self._files_written)

    @property
    def total_written(self) -> int:
        with self._lock:
            return self._total_written + len(self._buffer)

    @property
    def files_written(self) -> list[str]:
        with self._lock:
            return list(self._files_written)
