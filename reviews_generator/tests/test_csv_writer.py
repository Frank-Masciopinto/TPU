"""Tests for YotpoCSVWriter flush / finalize behavior."""

from __future__ import annotations

import csv

import pytest

import csv_writer as cw


def _row(product_id: str = "1") -> dict:
    return {col: "" for col in cw.YOTPO_COLUMNS} | {"product_id": product_id}


def test_yotpo_row_for_export_whitespace_review_content():
    r = _row("9") | {"review_content": " ", "review_title": "T"}
    out = cw.yotpo_row_for_export(r)
    assert out["review_content"] == " - "
    assert out["review_title"] == "T"


def test_flush_pending_writes_partial_file(tmp_path, monkeypatch):
    monkeypatch.setattr(cw, "OUTPUT_DIR", str(tmp_path))
    w = cw.YotpoCSVWriter(timestamp="test_flush")
    w.write_rows([_row("a"), _row("b")])
    assert w.total_written == 2
    w.flush_pending()
    assert w.total_written == 2
    files = list(tmp_path.glob("*.csv"))
    assert len(files) == 1
    with open(files[0], newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    assert len(rows) == 2
    assert rows[0]["product_id"] == "a"


def test_finalize_empty_after_flush_pending(tmp_path, monkeypatch):
    monkeypatch.setattr(cw, "OUTPUT_DIR", str(tmp_path))
    w = cw.YotpoCSVWriter(timestamp="test_fin")
    w.write_rows([_row()])
    w.flush_pending()
    paths = w.finalize()
    assert len(paths) == 1
    assert not list(tmp_path.glob("yotpo_reviews_test_fin_part2.csv"))


def test_write_rows_splits_at_10k(tmp_path, monkeypatch):
    monkeypatch.setattr(cw, "OUTPUT_DIR", str(tmp_path))
    monkeypatch.setattr(cw, "ROWS_PER_FILE", 3)
    w = cw.YotpoCSVWriter(timestamp="split")
    w.write_rows([_row(str(i)) for i in range(7)])
    w.finalize()
    parts = sorted(tmp_path.glob("yotpo_reviews_split_part*.csv"))
    assert len(parts) == 3
