"""
Batch API runner for TPU review generation.

Uses sequential request IDs as custom_id and a local specs lookup file
to map results back to products/identities. No base64 encoding needed.
"""

from __future__ import annotations

import json
import logging
import math
import os
import time
from collections import defaultdict
from datetime import datetime

from openai import OpenAI

from checkpoint import add_incomplete, mark_processed, save_processed
from csv_writer import YOTPO_COLUMNS, YotpoCSVWriter, yotpo_row_for_export
from dates import build_date_pool
from identity import IdentityPool
from prompts import SYSTEM_PROMPT, SYSTEM_PROMPT_SHORT, build_tier1_text_prompt, build_user_prompt
from reviewer import (
    _base_row,
    _build_review_specs,
    _has_content_opener_violation,
    _has_content_violation,
    _has_title_violation,
    generate_silent_reviews,
    generate_title_only_reviews,
)
from tier import BATCH_SIZE, ProductPlan, compute_tier_info, get_rating_pool, plan_product

SPECS_FILE_VERSION = 2
_MAX_COMPLETION_FULL_BATCH = 4500
_MAX_COMPLETION_SHORT_BATCH = 900
_FIX_CHUNK_SIZE = 12

# OpenAI batch input limit: error strings cite 209715200 (binary 200 MiB) but validation
# often enforces ~200 * 10**6 bytes (decimal 200 MB). 192 MiB binary ≈ 201.3 MB decimal
# and fails. Chunk under a strict decimal ceiling with margin.
_OPENAI_BATCH_DECIMAL_MB = 200 * 1000 * 1000
_BATCH_JSONL_CHUNK_BYTES = _OPENAI_BATCH_DECIMAL_MB - 3 * 1000 * 1000

# Org-level enqueued-token cap (e.g. 2M for gpt-5.4-mini) — chunk so one batch stays under.
def _max_chunk_enqueue_tokens() -> int:
    raw = os.getenv("OPENAI_BATCH_CHUNK_ENQUEUE_TOKENS", "").strip()
    if raw.isdigit():
        return max(50_000, int(raw))
    return 1_500_000


_ENQUEUED_LIMIT_MARKER = "enqueued token limit"

logger = logging.getLogger(__name__)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
ACTIVE_BATCH_FILE = os.path.join(OUTPUT_DIR, ".active_batch.json")
# Checkpoint format for multi-part JSONL (each part = one OpenAI batch job)
ACTIVE_RUN_MULTICHUNK = 2

# Parallel (--batch-parallel): at most OPENAI_BATCH_MAX_INFLIGHT concurrent OpenAI batch jobs
# (default 3). Submit fills the window; as jobs complete and download, new chunks are submitted.


def _atomic_json_write(path: str, data: object) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f)
    os.replace(tmp, path)


def _load_json(path: str) -> dict | list | None:
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _load_batch_specs(specs_path: str) -> tuple[dict[str, dict], dict[str, dict] | None]:
    """
    Returns (requests_lookup, product_plans or None for legacy flat JSON).
    Legacy files are a single dict of req_* -> meta with no version key.
    """
    raw = _load_json(specs_path)
    if not raw or not isinstance(raw, dict):
        return {}, None
    if raw.get("version") == SPECS_FILE_VERSION:
        return raw.get("requests") or {}, raw.get("product_plans")
    # v1: entire object is req_id -> meta
    if "version" not in raw:
        return raw, None
    return {}, None


def _product_map_from_specs(products: list[dict], specs_path: str) -> dict[str, dict]:
    """Map product_id -> product dict for every SKU referenced in a batch specs file."""
    req, plans = _load_batch_specs(specs_path)
    if plans:
        want = set(plans.keys())
    else:
        want = {
            str(m["product_id"])
            for m in req.values()
            if isinstance(m, dict) and "product_id" in m
        }
    return {str(p["id"]): p for p in products if str(p["id"]) in want}


def _estimate_enqueue_tokens_for_body(body: dict) -> int:
    """
    Rough upper bound for OpenAI 'enqueued tokens' accounting per batch line.
    Uses max_completion_tokens + message chars (over-estimate via /3).
    """
    max_out = int(body.get("max_completion_tokens") or 0)
    chars = 0
    for m in body.get("messages") or []:
        c = m.get("content")
        if isinstance(c, str):
            chars += len(c)
        elif isinstance(c, list):
            for part in c:
                if isinstance(part, dict) and part.get("type") == "text":
                    chars += len(part.get("text") or "")
    input_est = (chars + 2) // 3
    return max_out + input_est + 300


def _batch_error_summary(batch: object) -> str:
    parts: list[str] = []
    errs = getattr(batch, "errors", None)
    if errs:
        try:
            err_list = list(errs) if not isinstance(errs, list) else errs
            parts.extend(str(x) for x in err_list)
        except (TypeError, ValueError):
            pass
    return " ".join(parts).lower()


# ---------------------------------------------------------------------------
# Phase 1: Prepare JSONL + specs lookup
# ---------------------------------------------------------------------------

def prepare_batch(
    products: list[dict],
    processed_ids: set[str],
    limit: int | None,
    model: str,
) -> tuple[list[str], str, dict]:
    """
    Build JSONL input (split under OpenAI's per-file size cap) + specs lookup file.
    Returns (jsonl_paths, specs_path, product_map).
    """
    unprocessed = [p for p in products if p["id"] not in processed_ids]
    to_run = unprocessed[:limit] if limit else unprocessed

    if not to_run:
        print("Nothing to process — all products already completed.")
        return [], "", {}

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    specs_path = os.path.join(OUTPUT_DIR, f"batch_specs_{timestamp}.json")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    product_map: dict[str, dict] = {}
    specs_requests: dict[str, dict] = {}
    product_plans_out: dict[str, dict] = {}
    req_counter = 0
    review_count = 0

    jsonl_paths: list[str] = []
    chunk_idx = 0
    chunk_fh = None
    chunk_bytes = 0
    chunk_token_estimate = 0
    chunk_token_totals: list[int] = []
    tok_budget = _max_chunk_enqueue_tokens()

    def _open_next_chunk() -> None:
        nonlocal chunk_fh, chunk_bytes, chunk_idx, chunk_token_estimate
        if chunk_fh is not None:
            chunk_fh.close()
            chunk_fh = None
            chunk_token_totals.append(chunk_token_estimate)
        chunk_idx += 1
        path = os.path.join(
            OUTPUT_DIR, f"batch_input_{timestamp}_part{chunk_idx}.jsonl"
        )
        jsonl_paths.append(path)
        chunk_fh = open(path, "w", encoding="utf-8")
        chunk_bytes = 0
        chunk_token_estimate = 0

    def _write_line(obj: dict) -> None:
        nonlocal chunk_bytes, chunk_token_estimate
        body = obj.get("body") or {}
        t = _estimate_enqueue_tokens_for_body(body)
        if t > tok_budget:
            logger.warning(
                "Single batch line est. %d enqueued tokens exceeds chunk budget %d.",
                t,
                tok_budget,
            )
        line = json.dumps(obj) + "\n"
        line_b = line.encode("utf-8")
        n = len(line_b)
        if n > _BATCH_JSONL_CHUNK_BYTES:
            logger.warning(
                "Single batch line (%d bytes) exceeds chunk budget; OpenAI may reject.",
                n,
            )
        if chunk_fh is None:
            _open_next_chunk()
        elif chunk_bytes > 0:
            byte_full = chunk_bytes + n > _BATCH_JSONL_CHUNK_BYTES
            tok_full = chunk_token_estimate + t > tok_budget
            if byte_full or tok_full:
                _open_next_chunk()
        assert chunk_fh is not None
        chunk_fh.write(line)
        chunk_bytes += n
        chunk_token_estimate += t

    for product in to_run:
        product_map[str(product["id"])] = product
        plan = plan_product(product)
        tier = plan.tier
        product_plans_out[plan.product_id] = plan.to_dict()

        short_count = plan.short_llm_count
        llm_full_count = plan.full_count if tier != 1 else 0

        identity_pool = IdentityPool(product["id"])

        # --- Short bucket (LLM) ---
        if short_count > 0:
            scores_short = get_rating_pool(tier, short_count)
            dates_short = build_date_pool(short_count)

            for start in range(0, short_count, BATCH_SIZE):
                end_idx = min(start + BATCH_SIZE, short_count)
                specs = _build_review_specs(
                    product, scores_short[start:end_idx],
                    dates_short[start:end_idx], identity_pool,
                )
                variation_seed = (start // BATCH_SIZE) % 10
                user_prompt = build_tier1_text_prompt(product, specs, variation_seed)
                sys_msg = SYSTEM_PROMPT_SHORT if tier == 1 else SYSTEM_PROMPT
                max_tok = _MAX_COMPLETION_SHORT_BATCH

                req_counter += 1
                req_id = f"req_{req_counter}"
                specs_requests[req_id] = {
                    "product_id": product["id"],
                    "bucket": "short",
                    "specs": [
                        {"s": sp["score"], "d": sp["date"],
                         "n": sp["display_name"], "e": sp["email"]}
                        for sp in specs
                    ],
                }
                _write_line({
                    "custom_id": req_id,
                    "method": "POST",
                    "url": "/v1/chat/completions",
                    "body": {
                        "model": model,
                        "messages": [
                            {"role": "system", "content": sys_msg},
                            {"role": "user", "content": user_prompt},
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.9,
                        "max_completion_tokens": max_tok,
                    },
                })
                review_count += len(specs)

        # --- Full bucket (LLM, tiers 2–4 only) ---
        if llm_full_count > 0:
            scores_full = get_rating_pool(tier, llm_full_count)
            dates_full = build_date_pool(llm_full_count)

            for start in range(0, llm_full_count, BATCH_SIZE):
                end_idx = min(start + BATCH_SIZE, llm_full_count)
                specs = _build_review_specs(
                    product, scores_full[start:end_idx],
                    dates_full[start:end_idx], identity_pool,
                )
                variation_seed = (start // BATCH_SIZE) % 10
                user_prompt = build_user_prompt(product, specs, variation_seed)

                req_counter += 1
                req_id = f"req_{req_counter}"
                specs_requests[req_id] = {
                    "product_id": product["id"],
                    "bucket": "full",
                    "specs": [
                        {"s": sp["score"], "d": sp["date"],
                         "n": sp["display_name"], "e": sp["email"]}
                        for sp in specs
                    ],
                }
                _write_line({
                    "custom_id": req_id,
                    "method": "POST",
                    "url": "/v1/chat/completions",
                    "body": {
                        "model": model,
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": user_prompt},
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.9,
                        "max_completion_tokens": _MAX_COMPLETION_FULL_BATCH,
                    },
                })
                review_count += len(specs)

    if chunk_fh is not None:
        chunk_fh.close()
        chunk_fh = None
        chunk_token_totals.append(chunk_token_estimate)

    envelope = {
        "version": SPECS_FILE_VERSION,
        "requests": specs_requests,
        "product_plans": product_plans_out,
    }
    _atomic_json_write(specs_path, envelope)

    sep = "─" * 50
    print(f"\n{sep}")
    print("Phase 1: JSONL prepared")
    print(f"  Products        : {len(to_run)}")
    print(f"  LLM requests    : {req_counter:,}")
    print(f"  Est. reviews    : {review_count:,}")
    cap_mb = _BATCH_JSONL_CHUNK_BYTES // 1_000_000
    print(
        f"  JSONL parts     : {len(jsonl_paths)} file(s) "
        f"(≤{cap_mb} MB decimal; est. ≤{tok_budget / 1e6:.1f}M enqueued tokens/part)"
    )
    for i, p in enumerate(jsonl_paths):
        sz = os.path.getsize(p)
        et = chunk_token_totals[i] if i < len(chunk_token_totals) else 0
        print(
            f"      {os.path.basename(p)}  "
            f"({sz / 1_000_000:.1f} MB dec, {sz / (1024 * 1024):.1f} MiB bin"
            f", ~{et // 1000}k est. enqueue tok)"
        )
    print(f"  Specs           : {os.path.basename(specs_path)}")
    print(f"{sep}\n")

    return jsonl_paths, specs_path, product_map


# ---------------------------------------------------------------------------
# Phase 2: Submit and poll
# ---------------------------------------------------------------------------

def submit_batch(client: OpenAI, jsonl_path: str, specs_path: str) -> str:
    print("Uploading JSONL to OpenAI...")
    with open(jsonl_path, "rb") as f:
        file_obj = client.files.create(file=f, purpose="batch")

    print(f"  File uploaded: {file_obj.id}")

    batch = client.batches.create(
        input_file_id=file_obj.id,
        endpoint="/v1/chat/completions",
        completion_window="24h",
        metadata={"description": "TPU review generation"},
    )

    prev = _load_json(ACTIVE_BATCH_FILE) or {}
    if prev.get("run_version") == ACTIVE_RUN_MULTICHUNK:
        prev["batch_id"] = batch.id
        prev["input_file_id"] = file_obj.id
        prev["jsonl_path"] = jsonl_path
        prev["specs_path"] = os.path.abspath(specs_path)
        prev["created_at"] = datetime.now().isoformat()
        prev["status"] = batch.status
        prev["output_file_id"] = None
        prev["error_file_id"] = None
        _atomic_json_write(ACTIVE_BATCH_FILE, prev)
    else:
        _atomic_json_write(ACTIVE_BATCH_FILE, {
            "batch_id": batch.id,
            "input_file_id": file_obj.id,
            "jsonl_path": jsonl_path,
            "specs_path": specs_path,
            "created_at": datetime.now().isoformat(),
            "status": batch.status,
        })

    print(f"  Batch created: {batch.id}")
    print(f"  Status: {batch.status}")
    return batch.id


def _print_batch_failure_details(client: OpenAI, batch: object) -> None:
    """Print OpenAI batch error payload / error file so validation failures are actionable."""
    errs = getattr(batch, "errors", None)
    if errs:
        try:
            err_list = list(errs) if not isinstance(errs, list) else errs
            if err_list:
                print("  OpenAI batch.errors:")
                for e in err_list[:25]:
                    print(f"    {e}")
        except (TypeError, ValueError) as exc:
            logger.debug("Could not iterate batch.errors: %s", exc)

    efid = getattr(batch, "error_file_id", None)
    if efid:
        try:
            print(f"  Fetching error file {efid}...")
            content = client.files.content(efid)
            text = getattr(content, "text", None) or str(content)
            max_chars = 12_000
            snippet = text[:max_chars]
            if len(text) > max_chars:
                snippet += f"\n  ... ({len(text):,} chars total, truncated)"
            print("  --- error file ---")
            for ln in snippet.splitlines()[:100]:
                print(f"    {ln}")
            print("  --- end error file ---")
        except Exception as exc:
            print(f"  (Could not fetch error file: {exc})")


def poll_batch(client: OpenAI, batch_id: str) -> dict:
    sep = "─" * 50
    print(f"\n{sep}")
    print(f"Phase 2: Polling batch {batch_id}")
    print(f"{sep}")

    while True:
        batch = client.batches.retrieve(batch_id)
        counts = batch.request_counts
        total = counts.total if counts else 0
        completed = counts.completed if counts else 0
        failed = counts.failed if counts else 0

        ts = datetime.now().strftime("%H:%M:%S")
        line = (
            f"  [{ts}] {batch.status}  "
            f"{completed}/{total} done, {failed} failed"
        )
        if batch.status in ("completed", "failed", "expired", "cancelled"):
            print(f"\n{line}")
            break

        print(line, end="\r", flush=True)
        time.sleep(60)

    active = _load_json(ACTIVE_BATCH_FILE) or {}
    active["status"] = batch.status
    active["output_file_id"] = batch.output_file_id
    active["error_file_id"] = batch.error_file_id
    _atomic_json_write(ACTIVE_BATCH_FILE, active)

    print(f"\n  Final status: {batch.status}")
    if batch.status != "completed":
        print("  Batch did not complete successfully.")
        _print_batch_failure_details(client, batch)
        return {}

    print(f"  Output file: {batch.output_file_id}")
    return {
        "batch_id": batch.id,
        "output_file_id": batch.output_file_id,
        "error_file_id": batch.error_file_id,
    }


def _poll_until_done_or_retry_enqueued(
    client: OpenAI,
    initial_batch_id: str,
) -> dict:
    """
    Poll until the batch completes. If it fails with org enqueued-token limit,
    wait and submit a new batch job for the same uploaded input file.
    """
    bid = initial_batch_id
    max_rounds = int(os.getenv("OPENAI_BATCH_ENQUEUED_WAIT_ROUNDS", "96"))
    wait_s = int(os.getenv("OPENAI_BATCH_ENQUEUED_WAIT_SEC", "300"))

    for round_i in range(max_rounds + 1):
        result = poll_batch(client, bid)
        if result:
            return result

        batch = client.batches.retrieve(bid)
        if _ENQUEUED_LIMIT_MARKER not in _batch_error_summary(batch):
            return {}

        if round_i >= max_rounds:
            print("  Exhausted enqueued-token wait/retry rounds.")
            return {}

        active = _load_json(ACTIVE_BATCH_FILE) or {}
        iid = active.get("input_file_id")
        if not iid:
            print("  No input_file_id in checkpoint — cannot re-queue this chunk.")
            return {}

        print(
            f"  Waiting {wait_s // 60} min for enqueued capacity, "
            f"then re-submitting same input file (retry {round_i + 2}/{max_rounds + 1})..."
        )
        time.sleep(wait_s)
        try:
            nb = client.batches.create(
                input_file_id=iid,
                endpoint="/v1/chat/completions",
                completion_window="24h",
                metadata={"description": "TPU review generation"},
            )
        except Exception as exc:
            print(f"  batches.create failed: {exc}")
            continue

        bid = nb.id
        active = _load_json(ACTIVE_BATCH_FILE) or {}
        active["batch_id"] = nb.id
        active["status"] = nb.status
        active["output_file_id"] = None
        active["error_file_id"] = None
        _atomic_json_write(ACTIVE_BATCH_FILE, active)

    return {}


# ---------------------------------------------------------------------------
# Phase 3: Download and assemble
# ---------------------------------------------------------------------------

def _multichunk_append_output(output_path: str) -> None:
    """Record a finished chunk: clear in-flight batch fields, bump progress."""
    active = _load_json(ACTIVE_BATCH_FILE) or {}
    if active.get("run_version") != ACTIVE_RUN_MULTICHUNK:
        return
    outs = list(active.get("completed_outputs", []))
    outs.append(output_path)
    active["completed_outputs"] = outs
    active["next_chunk_index"] = len(outs)
    active["batch_id"] = None
    active["output_file_id"] = None
    active["error_file_id"] = None
    active["status"] = "between_chunks"
    active.pop("chunk_inflight", None)
    _atomic_json_write(ACTIVE_BATCH_FILE, active)


def _all_chunk_files_ready(specs_path: str, nchunks: int) -> tuple[bool, list[str]]:
    """True if every part file exists and is non-empty; returns ordered absolute paths."""
    paths: list[str] = []
    for i in range(nchunks):
        p = _stable_chunk_output_path(specs_path, i)
        if os.path.isfile(p) and os.path.getsize(p) > 0:
            paths.append(os.path.abspath(p))
        else:
            return False, paths
    return True, paths


def _refresh_multichunk_progress(active: dict, specs_path: str, nchunks: int) -> dict:
    """Set completed_outputs / next_chunk_index from consecutive part files on disk."""
    out: list[str] = []
    for i in range(nchunks):
        p = _stable_chunk_output_path(specs_path, i)
        if os.path.isfile(p) and os.path.getsize(p) > 0:
            out.append(os.path.abspath(p))
        else:
            break
    active["completed_outputs"] = out
    active["next_chunk_index"] = len(out)
    return active


def _migrate_legacy_inflight_to_parallel(active: dict) -> dict:
    """Single batch_id checkpoint → chunk_inflight for one index."""
    if active.get("chunk_inflight"):
        return active
    bid = active.get("batch_id")
    if not bid:
        return active
    next_i = int(active.get("next_chunk_index", 0))
    active["chunk_inflight"] = {
        str(next_i): {
            "batch_id": bid,
            "input_file_id": active.get("input_file_id"),
            "jsonl_path": active.get("jsonl_path"),
            "status": active.get("status") or "unknown",
        }
    }
    for k in ("batch_id", "input_file_id", "jsonl_path", "output_file_id", "error_file_id"):
        active.pop(k, None)
    return active


def _submit_chunk_job(
    client: OpenAI,
    jsonl_path: str,
) -> dict[str, str | None]:
    print(f"  Uploading {os.path.basename(jsonl_path)}...")
    with open(jsonl_path, "rb") as f:
        file_obj = client.files.create(file=f, purpose="batch")
    batch = client.batches.create(
        input_file_id=file_obj.id,
        endpoint="/v1/chat/completions",
        completion_window="24h",
        metadata={"description": "TPU review generation"},
    )
    print(f"    → batch {batch.id}  ({batch.status})")
    return {
        "batch_id": batch.id,
        "input_file_id": file_obj.id,
        "jsonl_path": jsonl_path,
        "status": batch.status,
    }


def _max_parallel_batch_inflight() -> int:
    """Upper bound on simultaneous OpenAI batch jobs in parallel multichunk mode."""
    raw = os.getenv("OPENAI_BATCH_MAX_INFLIGHT", "3").strip()
    if raw.isdigit():
        return max(1, int(raw))
    return 3


def _parallel_merge_inflight(
    active: dict,
    chunk_index: int,
    job: dict[str, str | None],
) -> None:
    inflight = dict(active.get("chunk_inflight") or {})
    inflight[str(chunk_index)] = job
    active["chunk_inflight"] = inflight
    active["status"] = "parallel_inflight"
    active["parallel_chunk_mode"] = True
    _atomic_json_write(ACTIVE_BATCH_FILE, active)


def _multichunk_try_assemble(
    client: OpenAI,
    products: list[dict],
    processed_ids: set[str],
    incomplete_list: list[dict],
    model: str,
    specs_path: str,
    outputs: list[str],
) -> bool:
    """Run assemble + fix + delete checkpoint. Returns True if pipeline finished."""
    product_map = _product_map_from_specs(products, specs_path)
    csv_path = assemble_csv(
        outputs, specs_path, product_map, processed_ids, incomplete_list
    )
    if csv_path:
        fix_violations_batch(csv_path, client, model)
    if os.path.exists(ACTIVE_BATCH_FILE):
        os.remove(ACTIVE_BATCH_FILE)
    print("Batch pipeline complete.")
    return True


def _multichunk_batch_loop_sequential(
    client: OpenAI,
    products: list[dict],
    processed_ids: set[str],
    incomplete_list: list[dict],
    model: str,
) -> None:
    """
    One JSONL chunk at a time: submit → poll → download → next.
    """
    _TERMINAL = ("completed", "failed", "expired", "cancelled")
    for _ in range(10000):
        active = _load_json(ACTIVE_BATCH_FILE) or {}
        if active.get("run_version") != ACTIVE_RUN_MULTICHUNK:
            return

        chunks: list[str] = active.get("jsonl_chunks") or []
        specs_path = active.get("specs_path") or ""
        outputs: list[str] = list(active.get("completed_outputs", []))
        next_i = int(active.get("next_chunk_index", 0))
        bid = active.get("batch_id")
        st = active.get("status") or ""

        if not chunks or not specs_path:
            print("  Invalid multi-chunk checkpoint (missing chunks or specs_path).")
            return

        nchunks = len(chunks)
        ready, all_paths = _all_chunk_files_ready(specs_path, nchunks)
        if ready and not bid and not active.get("chunk_inflight"):
            _multichunk_try_assemble(
                client, products, processed_ids, incomplete_list, model,
                specs_path, all_paths,
            )
            return

        # All chunk outputs downloaded → assemble (legacy list-based check)
        if next_i >= len(chunks) and not bid:
            _multichunk_try_assemble(
                client, products, processed_ids, incomplete_list, model,
                specs_path, outputs,
            )
            return

        # Batch ended unsuccessfully — retry enqueued-token limit; else stop
        if bid and st in ("failed", "expired", "cancelled"):
            if st == "failed":
                fb = client.batches.retrieve(bid)
                if _ENQUEUED_LIMIT_MARKER in _batch_error_summary(fb):
                    iid = active.get("input_file_id")
                    if iid:
                        print(
                            "  Chunk failed: enqueued token limit — "
                            "will wait and re-submit the same input file."
                        )
                        result = _poll_until_done_or_retry_enqueued(client, bid)
                        if result:
                            dest = _stable_chunk_output_path(specs_path, next_i)
                            op = download_results(
                                client, result["output_file_id"], dest_path=dest
                            )
                            _multichunk_append_output(op)
                            continue
            print(
                f"  Chunk batch ended with status={st!r}. "
                f"Fix the issue, then delete output/.active_batch.json to start a new run, "
                f"or retry per OpenAI docs."
            )
            return

        # Completed on API side but local file not saved yet
        dest = _stable_chunk_output_path(specs_path, next_i)
        if (
            bid
            and st == "completed"
            and active.get("output_file_id")
            and len(outputs) == next_i
        ):
            op = download_results(
                client, active["output_file_id"], dest_path=dest
            )
            _multichunk_append_output(op)
            continue

        # In-flight: validating / in_progress / etc.
        if bid and st not in _TERMINAL:
            print(f"Polling batch: {bid}")
            result = _poll_until_done_or_retry_enqueued(client, bid)
            if not result:
                print(
                    "  Chunk failed — progress saved in output/.active_batch.json "
                    "(completed chunk outputs listed under completed_outputs)."
                )
                return
            op = download_results(
                client, result["output_file_id"], dest_path=dest
            )
            _multichunk_append_output(op)
            continue

        # Submit next chunk
        if next_i < len(chunks):
            jsonl_path = chunks[next_i]
            nchunks = len(chunks)
            if nchunks > 1:
                print(f"\n{'─' * 50}")
                print(
                    f"Batch chunk {next_i + 1}/{nchunks}: "
                    f"{os.path.basename(jsonl_path)}"
                )
                print(f"{'─' * 50}")
            submit_batch(client, jsonl_path, specs_path)
            continue

        return

    print("  Multi-chunk loop iteration limit exceeded — aborting.")


def _multichunk_batch_loop_parallel(
    client: OpenAI,
    products: list[dict],
    processed_ids: set[str],
    incomplete_list: list[dict],
    model: str,
) -> None:
    """
    Keep up to OPENAI_BATCH_MAX_INFLIGHT (default 3) batch jobs in flight: submit missing
    chunks until the cap, poll all in-flight jobs, download completions, repeat.
    """
    _TERMINAL = ("completed", "failed", "expired", "cancelled")
    sep = "─" * 50
    max_inf = _max_parallel_batch_inflight()

    for _ in range(1_000_000):
        active = _load_json(ACTIVE_BATCH_FILE) or {}
        if active.get("run_version") != ACTIVE_RUN_MULTICHUNK:
            return

        chunks: list[str] = active.get("jsonl_chunks") or []
        specs_path = active.get("specs_path") or ""
        if not chunks or not specs_path:
            print("  Invalid multi-chunk checkpoint (missing chunks or specs_path).")
            return

        nchunks = len(chunks)
        active = _refresh_multichunk_progress(active, specs_path, nchunks)
        active = _migrate_legacy_inflight_to_parallel(active)
        inflight: dict[str, dict] = dict(active.get("chunk_inflight") or {})

        ready, all_paths = _all_chunk_files_ready(specs_path, nchunks)
        if ready and not inflight:
            active["completed_outputs"] = all_paths
            active["next_chunk_index"] = nchunks
            _atomic_json_write(ACTIVE_BATCH_FILE, active)
            _multichunk_try_assemble(
                client, products, processed_ids, incomplete_list, model,
                specs_path, all_paths,
            )
            return

        # --- Submit missing chunks until in-flight cap (default 3) ---
        submitted = 0
        while len(inflight) < max_inf:
            next_i: int | None = None
            for i in range(nchunks):
                dest = _stable_chunk_output_path(specs_path, i)
                if os.path.isfile(dest) and os.path.getsize(dest) > 0:
                    continue
                if str(i) in inflight:
                    continue
                next_i = i
                break
            if next_i is None:
                break
            jsonl_path = chunks[next_i]
            print(
                f"\n{sep}\nParallel submit chunk {next_i + 1}/{nchunks} "
                f"({len(inflight) + 1}/{max_inf} in flight): "
                f"{os.path.basename(jsonl_path)}\n{sep}"
            )
            try:
                job = _submit_chunk_job(client, jsonl_path)
            except Exception as exc:
                print(f"  Submit failed for chunk {next_i + 1}: {exc}")
                print(
                    "  Fix the error or switch to sequential mode (omit --batch-parallel). "
                    "Progress saved in .active_batch.json."
                )
                inflight.update(active.get("chunk_inflight") or {})
                active["chunk_inflight"] = inflight
                _atomic_json_write(ACTIVE_BATCH_FILE, active)
                return
            _parallel_merge_inflight(active, next_i, job)
            active = _load_json(ACTIVE_BATCH_FILE) or {}
            inflight = dict(active.get("chunk_inflight") or {})
            submitted += 1

        if submitted:
            print(
                f"\nSubmitted {submitted} new chunk batch(es); "
                f"{len(inflight)}/{max_inf} in flight (cap).\n"
            )

        active["chunk_inflight"] = inflight
        _refresh_multichunk_progress(active, specs_path, nchunks)
        _atomic_json_write(ACTIVE_BATCH_FILE, active)

        # --- Poll all in-flight jobs (one retrieve per chunk per minute) ---
        if not inflight:
            time.sleep(2)
            continue

        ts = datetime.now().strftime("%H:%M:%S")
        status_bits: list[str] = []
        failed_jobs: list[tuple[int, object]] = []

        for idx_s in sorted(inflight.keys(), key=int):
            job = inflight[idx_s]
            bid = str(job.get("batch_id") or "")
            try:
                batch = client.batches.retrieve(bid)
            except Exception as exc:
                status_bits.append(f"p{int(idx_s)+1}:err")
                logger.debug("retrieve %s: %s", bid, exc)
                continue

            job["status"] = batch.status
            counts = batch.request_counts
            c = counts.completed if counts else 0
            t = counts.total if counts else 0
            st = (batch.status or "")[:4]
            status_bits.append(f"p{int(idx_s)+1}:{st}{c}/{t}")

            if batch.status not in _TERMINAL:
                continue

            idx = int(idx_s)
            if batch.status == "completed" and batch.output_file_id:
                dest = _stable_chunk_output_path(specs_path, idx)
                download_results(
                    client, batch.output_file_id, dest_path=dest
                )
                del inflight[idx_s]
                continue

            if (
                batch.status == "failed"
                and _ENQUEUED_LIMIT_MARKER in _batch_error_summary(batch)
            ):
                iid = job.get("input_file_id")
                if iid:
                    wait_s = int(os.getenv("OPENAI_BATCH_ENQUEUED_WAIT_SEC", "300"))
                    print(
                        f"\n  Chunk {idx + 1}: enqueued token limit — "
                        f"waiting {wait_s}s, re-submitting same input file..."
                    )
                    time.sleep(wait_s)
                    try:
                        nb = client.batches.create(
                            input_file_id=iid,
                            endpoint="/v1/chat/completions",
                            completion_window="24h",
                            metadata={"description": "TPU review generation"},
                        )
                    except Exception as exc:
                        print(f"  batches.create failed: {exc}")
                        failed_jobs.append((idx, batch))
                        continue
                    job["batch_id"] = nb.id
                    job["status"] = nb.status
                    inflight[idx_s] = job
                else:
                    failed_jobs.append((idx, batch))
                continue

            failed_jobs.append((idx, batch))

        print(f"  [{ts}] " + "  ".join(status_bits), flush=True)

        active["chunk_inflight"] = inflight
        _refresh_multichunk_progress(active, specs_path, nchunks)
        _atomic_json_write(ACTIVE_BATCH_FILE, active)

        if failed_jobs:
            for idx, batch in failed_jobs:
                print(f"\n  Chunk index {idx} batch {batch.id} final status={batch.status!r}")
                _print_batch_failure_details(client, batch)
            print(
                "\n  One or more parallel batches failed. "
                "Fix issues, then re-run with the same checkpoint."
            )
            return

        time.sleep(60)

    print("  Parallel multi-chunk iteration limit exceeded — aborting.")


def _multichunk_batch_loop(
    client: OpenAI,
    products: list[dict],
    processed_ids: set[str],
    incomplete_list: list[dict],
    model: str,
    *,
    parallel_chunks: bool = False,
) -> None:
    """
    Drive multi-part batch jobs using .active_batch.json (run_version=2).
    """
    active = _load_json(ACTIVE_BATCH_FILE) or {}
    use_parallel = parallel_chunks or active.get("parallel_chunk_mode") is True
    if use_parallel:
        if parallel_chunks:
            active["parallel_chunk_mode"] = True
            _atomic_json_write(ACTIVE_BATCH_FILE, active)
        cap = _max_parallel_batch_inflight()
        print(
            f"\nMulti-chunk mode: PARALLEL (max {cap} batch job(s) in flight; "
            f"override with OPENAI_BATCH_MAX_INFLIGHT).\n"
        )
        _multichunk_batch_loop_parallel(
            client, products, processed_ids, incomplete_list, model
        )
    else:
        _multichunk_batch_loop_sequential(
            client, products, processed_ids, incomplete_list, model
        )


def _stable_chunk_output_path(specs_path: str, zero_based_chunk_index: int) -> str:
    stem = os.path.splitext(os.path.basename(specs_path))[0]
    return os.path.join(
        OUTPUT_DIR, f"{stem}_openai_part{zero_based_chunk_index + 1}.jsonl"
    )


def download_results(
    client: OpenAI,
    output_file_id: str,
    *,
    dest_path: str | None = None,
) -> str:
    if dest_path:
        if os.path.isfile(dest_path) and os.path.getsize(dest_path) > 0:
            print(f"  Using existing chunk output {os.path.basename(dest_path)}")
            line_count = sum(1 for _ in open(dest_path, encoding="utf-8"))
            print(f"  ({line_count:,} result lines)")
            return dest_path
        output_path = dest_path
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(OUTPUT_DIR, f"batch_output_{timestamp}.jsonl")

    print(f"  Downloading results to {os.path.basename(output_path)}...")
    content = client.files.content(output_file_id)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content.text)

    line_count = sum(1 for _ in open(output_path, encoding="utf-8"))
    print(f"  Downloaded {line_count:,} result lines")
    return output_path


def _parse_llm_response(raw_content: str) -> list[dict]:
    try:
        parsed = json.loads(raw_content)
    except json.JSONDecodeError:
        return []

    if isinstance(parsed, list):
        return parsed
    if isinstance(parsed, dict):
        for key in ("reviews", "data", "results", "items"):
            if key in parsed and isinstance(parsed[key], list):
                return parsed[key]
        if "review_title" in parsed or "review_content" in parsed:
            return [parsed]
    return []


def assemble_csv(
    output_jsonl_path: str | list[str],
    specs_path: str,
    product_map: dict[str, dict],
    processed_ids: set[str],
    incomplete_list: list[dict],
    *,
    update_checkpoints: bool = True,
) -> str:
    sep = "─" * 50
    print(f"\n{sep}")
    print("Phase 3: Assembling CSV")
    print(f"{sep}")

    output_paths = (
        [output_jsonl_path]
        if isinstance(output_jsonl_path, str)
        else list(output_jsonl_path)
    )

    specs_lookup, product_plans_raw = _load_batch_specs(specs_path)
    if not specs_lookup:
        print("  ERROR: specs lookup file not found or empty.")
        return ""

    product_plans: dict[str, ProductPlan] | None = None
    if product_plans_raw:
        product_plans = {
            k: ProductPlan.from_dict(v) for k, v in product_plans_raw.items()
        }

    product_rows: dict[str, list[dict]] = defaultdict(list)
    product_expected: dict[str, int] = {}
    parse_errors = 0

    for path in output_paths:
        with open(path, encoding="utf-8") as f:
            for line in f:
                result = json.loads(line)
                req_id = result.get("custom_id", "")
                response = result.get("response", {})
                error = result.get("error")

                if error or response.get("status_code", 0) != 200:
                    parse_errors += 1
                    continue

                meta = specs_lookup.get(req_id)
                if not meta:
                    parse_errors += 1
                    continue

                product_id = str(meta["product_id"])
                specs = meta.get("specs", [])

                body = response.get("body", {})
                choices = body.get("choices", [])
                if not choices:
                    parse_errors += 1
                    continue

                raw_content = choices[0].get("message", {}).get("content", "")
                reviews = _parse_llm_response(raw_content)

                product = product_map.get(product_id)
                if not product:
                    continue

                for i, review in enumerate(reviews):
                    if i >= len(specs):
                        break
                    spec = specs[i]
                    row = _base_row(product)
                    row.update({
                        "date": spec["d"],
                        "review_score": str(review.get("review_score", spec["s"])),
                        "review_title": str(review.get("review_title", "")),
                        "review_content": str(review.get("review_content", "")).strip()
                        or " ",
                        "display_name": spec["n"],
                        "email": spec["e"],
                    })
                    product_rows[product_id].append(row)

    # Local rows: title-only + Tier 1 silent (from persisted plan)
    for product_id, product in product_map.items():
        pid = str(product_id)
        if product_plans and pid in product_plans:
            plan = product_plans[pid]
            product_expected[pid] = plan.review_count
            pool = IdentityPool(pid)
            if plan.title_only_count > 0:
                product_rows[pid].extend(
                    generate_title_only_reviews(product, plan.title_only_count, pool)
                )
            if plan.tier == 1 and plan.full_count > 0:
                product_rows[pid].extend(
                    generate_silent_reviews(product, plan.full_count, pool)
                )
        else:
            # Legacy v1 batch files (no product_plans)
            info = compute_tier_info(product)
            product_expected[pid] = info.review_count
            if info.tier == 1:
                full_count = max(
                    0,
                    info.review_count - max(1, round(info.review_count * 0.46)),
                )
                if full_count > 0:
                    product_rows[pid].extend(generate_silent_reviews(product, full_count))

    # Write CSV and checkpoint
    csv_writer = YotpoCSVWriter()
    total_generated = 0
    total_expected = 0
    products_done = 0

    for product_id in product_map:
        rows = product_rows.get(product_id, [])
        expected = product_expected.get(product_id, 0)
        total_generated += len(rows)
        total_expected += expected

        if rows:
            csv_writer.write_rows(rows)

        if update_checkpoints:
            if len(rows) >= expected * 0.95:
                mark_processed(product_id, processed_ids)
                products_done += 1
            else:
                add_incomplete(
                    product_map[product_id], expected, len(rows), incomplete_list
                )
        elif len(rows) >= expected * 0.95:
            products_done += 1

    files = csv_writer.finalize()

    print(f"  Products completed  : {products_done}")
    print(f"  Reviews assembled   : {total_generated:,}  (expected ~{total_expected:,})")
    print(f"  Parse errors        : {parse_errors}")
    print(f"  Output files        : {len(files)}")
    for fp in files:
        print(f"    -> {fp}")
    print(f"{sep}\n")

    return files[0] if files else ""


# ---------------------------------------------------------------------------
# Phase 3b: Fix violations via second batch
# ---------------------------------------------------------------------------

def fix_violations_batch(csv_path: str, client: OpenAI, model: str) -> None:
    import csv as csv_mod

    if not csv_path or not os.path.exists(csv_path):
        return

    with open(csv_path, newline="", encoding="utf-8") as f:
        rows = list(csv_mod.DictReader(f))

    violation_indices: list[int] = []
    for i, row in enumerate(rows):
        title = row.get("review_title", "")
        content = row.get("review_content", "")
        if (
            _has_title_violation(title)
            or _has_content_violation(content)
            or _has_content_opener_violation(content)
        ):
            violation_indices.append(i)

    if not violation_indices:
        print("  No violations to fix.")
        return

    print(
        f"  Found {len(violation_indices)} violations — "
        f"submitting fix batch (~{math.ceil(len(violation_indices) / _FIX_CHUNK_SIZE)} requests)..."
    )

    fix_requests: list[dict] = []
    chunk_meta: list[list[int]] = []

    for cstart in range(0, len(violation_indices), _FIX_CHUNK_SIZE):
        chunk_idxs = violation_indices[cstart : cstart + _FIX_CHUNK_SIZE]
        chunk_meta.append(chunk_idxs)
        parts = []
        viol_lines = []
        for j, row_i in enumerate(chunk_idxs):
            row = rows[row_i]
            title = row.get("review_title", "")
            content = row.get("review_content", "")
            parts.append(
                f'Item {j}: score={row.get("review_score", "5")}\n'
                f'  title: {title}\n  content: {content}'
            )
            v = []
            if _has_title_violation(title):
                v.append("title banned opener")
            if _has_content_violation(content):
                v.append("banned word in content")
            if _has_content_opener_violation(content):
                v.append("banned content opener")
            viol_lines.append(f"Item {j}: fix " + ", ".join(v))

        prompt = (
            "Fix each review below. Preserve tone and meaning; only fix listed issues.\n"
            "Banned title first words: Good, Solid, Decent, Nice, Works, Great, etc.\n"
            "Banned content openers as first word: these, the, this, got, ordered, been.\n"
            "Remove 'perfect' and similar banned words.\n\n"
            + "\n\n".join(parts)
            + "\n\nIssues per item:\n"
            + "\n".join(viol_lines)
            + '\n\nReturn JSON: {"fixes":[{"idx":0,"review_title":"...","review_content":"..."},...]} '
            f"with exactly {len(chunk_idxs)} objects; idx is 0..{len(chunk_idxs) - 1}."
        )

        fix_requests.append({
            "custom_id": f"fixchunk_{len(fix_requests)}",
            "method": "POST",
            "url": "/v1/chat/completions",
            "body": {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
                "temperature": 0.7,
                "max_completion_tokens": 2800,
            },
        })

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    fix_jsonl = os.path.join(OUTPUT_DIR, f"batch_fix_{timestamp}.jsonl")
    with open(fix_jsonl, "w") as f:
        for req in fix_requests:
            f.write(json.dumps(req) + "\n")

    with open(fix_jsonl, "rb") as f:
        file_obj = client.files.create(file=f, purpose="batch")

    batch = client.batches.create(
        input_file_id=file_obj.id,
        endpoint="/v1/chat/completions",
        completion_window="24h",
        metadata={"description": "TPU review violation fixes"},
    )
    print(f"  Fix batch: {batch.id}")

    while True:
        batch = client.batches.retrieve(batch.id)
        if batch.status in ("completed", "failed", "expired", "cancelled"):
            break
        time.sleep(15)

    if batch.status != "completed" or not batch.output_file_id:
        print(f"  Fix batch did not complete: {batch.status}")
        return

    fix_content = client.files.content(batch.output_file_id)
    fixes_applied = 0
    line_by_cid: dict[str, dict] = {}
    for line in fix_content.text.strip().split("\n"):
        if not line.strip():
            continue
        result = json.loads(line)
        line_by_cid[result["custom_id"]] = result

    for chunk_i, chunk_idxs in enumerate(chunk_meta):
        result = line_by_cid.get(f"fixchunk_{chunk_i}")
        if not result:
            continue
        response = result.get("response", {})
        if response.get("status_code") != 200:
            continue
        raw = response.get("body", {}).get("choices", [{}])[0].get("message", {}).get("content", "")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            continue
        fix_list = payload.get("fixes")
        if not isinstance(fix_list, list):
            continue
        for fix in fix_list:
            if not isinstance(fix, dict):
                continue
            j = fix.get("idx")
            if j is None or not isinstance(j, int) or j < 0 or j >= len(chunk_idxs):
                continue
            row_idx = chunk_idxs[j]
            new_title = fix.get("review_title", rows[row_idx].get("review_title", ""))
            new_content = fix.get("review_content", rows[row_idx].get("review_content", ""))
            if (
                not _has_title_violation(new_title)
                and not _has_content_violation(new_content)
                and not _has_content_opener_violation(new_content)
            ):
                rows[row_idx]["review_title"] = new_title
                rows[row_idx]["review_content"] = new_content
                fixes_applied += 1

    print(f"  Applied {fixes_applied}/{len(violation_indices)} row fixes")

    if fixes_applied > 0:
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv_mod.DictWriter(f, fieldnames=YOTPO_COLUMNS, extrasaction="ignore")
            writer.writeheader()
            for row in rows:
                writer.writerow(yotpo_row_for_export(row))
        print(f"  CSV rewritten with fixes: {os.path.basename(csv_path)}")


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def run_batch(
    products: list[dict],
    processed_ids: set[str],
    incomplete_list: list[dict],
    limit: int | None,
    model: str,
    api_key: str,
    *,
    new_run: bool = False,
    batch_parallel: bool = False,
) -> None:
    if new_run and os.path.isfile(ACTIVE_BATCH_FILE):
        os.remove(ACTIVE_BATCH_FILE)
        print(
            "Removed output/.active_batch.json — will prepare new batch JSONL/specs "
            "(re-run without --batch-new-run to resume an in-flight multi-chunk batch)."
        )
    client = OpenAI(api_key=api_key)
    try:
        _run_batch_inner(
            client,
            products,
            processed_ids,
            incomplete_list,
            limit,
            model,
            batch_parallel=batch_parallel,
        )
    finally:
        save_processed(processed_ids)


def _run_batch_inner(
    client: OpenAI,
    products: list[dict],
    processed_ids: set[str],
    incomplete_list: list[dict],
    limit: int | None,
    model: str,
    *,
    batch_parallel: bool = False,
) -> None:
    active = _load_json(ACTIVE_BATCH_FILE)

    # Multi-part JSONL checkpoint (size-chunked OpenAI batches)
    if active and active.get("run_version") == ACTIVE_RUN_MULTICHUNK:
        _multichunk_batch_loop(
            client,
            products,
            processed_ids,
            incomplete_list,
            model,
            parallel_chunks=batch_parallel,
        )
        return

    # Legacy: single batch finished on API, download + assemble once
    if active and active.get("status") == "completed" and active.get("output_file_id"):
        print("Active batch already completed. Downloading results...")
        output_path = download_results(client, active["output_file_id"])
        specs_path = active.get("specs_path", "")
        product_map = _product_map_from_specs(products, specs_path)
        csv_path = assemble_csv(
            output_path, specs_path, product_map, processed_ids, incomplete_list
        )
        if csv_path:
            fix_violations_batch(csv_path, client, model)
        if os.path.exists(ACTIVE_BATCH_FILE):
            os.remove(ACTIVE_BATCH_FILE)
        return

    # Legacy: single in-flight batch
    if active and active.get("batch_id") and active.get("status") not in (
        "completed", "failed", "expired", "cancelled", None
    ):
        batch_id = active["batch_id"]
        specs_path = active.get("specs_path", "")
        print(f"Resuming active batch: {batch_id}")
        result = _poll_until_done_or_retry_enqueued(client, batch_id)
        if not result:
            return

        output_path = download_results(client, result["output_file_id"])
        product_map = _product_map_from_specs(products, specs_path)
        csv_path = assemble_csv(
            output_path, specs_path, product_map, processed_ids, incomplete_list
        )

        if csv_path:
            fix_violations_batch(csv_path, client, model)

        if os.path.exists(ACTIVE_BATCH_FILE):
            os.remove(ACTIVE_BATCH_FILE)

        print("Batch pipeline complete.")
        return

    # Fresh run
    jsonl_paths, specs_path, _ = prepare_batch(
        products, processed_ids, limit, model
    )
    if not jsonl_paths:
        return

    _atomic_json_write(
        ACTIVE_BATCH_FILE,
        {
            "run_version": ACTIVE_RUN_MULTICHUNK,
            "specs_path": os.path.abspath(specs_path),
            "jsonl_chunks": [os.path.abspath(p) for p in jsonl_paths],
            "completed_outputs": [],
            "next_chunk_index": 0,
            "parallel_chunk_mode": bool(batch_parallel),
        },
    )
    _multichunk_batch_loop(
        client,
        products,
        processed_ids,
        incomplete_list,
        model,
        parallel_chunks=batch_parallel,
    )
