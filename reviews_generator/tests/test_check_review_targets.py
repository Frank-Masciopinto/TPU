"""Tests for CSV row classification used in check_review_targets."""

from __future__ import annotations

import pytest

from check_review_targets import SHORT_MAX_WORDS, classify_row


def test_classify_title_only_and_silent():
    assert (
        classify_row(
            {"review_title": "Good fit", "review_content": " "},
        )
        == "title_only"
    )
    assert (
        classify_row(
            {"review_title": "", "review_content": " "},
        )
        == "silent"
    )
    assert (
        classify_row(
            {"review_title": "", "review_content": ""},
        )
        == "silent"
    )


def test_classify_short_vs_full_by_word_count():
    short = " ".join(["w"] * SHORT_MAX_WORDS)
    long = " ".join(["w"] * (SHORT_MAX_WORDS + 1))
    assert classify_row({"review_title": "T", "review_content": short}) == "short_llm"
    assert classify_row({"review_title": "T", "review_content": long}) == "full_llm"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
