"""
Async BigCommerce V3 product fetcher.
Paginates through the full catalog, returning a flat list of normalised product dicts.
Rate-limited to 5 concurrent page requests (BC allows 150 req/30s on Standard plan).
"""

from __future__ import annotations

import asyncio
import os
import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

PAGE_SIZE = 250

_BC_SEM: asyncio.Semaphore | None = None


def _bc_sem() -> asyncio.Semaphore:
    global _BC_SEM
    if _BC_SEM is None:
        _BC_SEM = asyncio.Semaphore(5)
    return _BC_SEM


def _bc_headers(api_key: str) -> dict[str, str]:
    return {
        "X-Auth-Token": api_key,
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def _base_url(store_hash: str) -> str:
    return f"https://api.bigcommerce.com/stores/{store_hash}/v3"


def _normalise_product(raw: dict) -> dict:
    """Extract only the fields we need for review generation."""
    images = raw.get("images") or []
    primary_image_url = ""
    for img in images:
        if img.get("is_thumbnail"):
            primary_image_url = img.get("url_standard", "")
            break
    if not primary_image_url and images:
        primary_image_url = images[0].get("url_standard", "")

    custom_url = raw.get("custom_url", {})
    url_path = custom_url.get("url", "") if isinstance(custom_url, dict) else ""

    store_hash = os.getenv("BC_STORE_HASH", "")
    # Build the full storefront URL from the store's primary domain.
    # The store domain is not available from the products API alone, so we
    # construct it using the store hash. Callers can override by setting
    # BC_STORE_DOMAIN in the environment.
    store_domain = os.getenv("BC_STORE_DOMAIN", "")
    if store_domain:
        full_url = f"https://{store_domain.rstrip('/')}{url_path}"
    else:
        full_url = url_path  # fallback — relative URL, Yotpo accepts this

    return {
        "id": str(raw["id"]),
        "name": raw.get("name", ""),
        "url": full_url,
        "calculated_price": float(raw.get("calculated_price") or raw.get("price") or 0),
        "image_url": primary_image_url,
        "description": _strip_html(raw.get("description") or ""),
    }


def _strip_html(text: str) -> str:
    """Very lightweight HTML tag stripper — no external deps."""
    import re
    return re.sub(r"<[^>]+>", " ", text).strip()


def _is_in_stock(raw: dict) -> bool:
    """
    True if the product should be treated as available for sale (has sellable qty).

    - inventory_tracking=none → always True (store does not track stock for this SKU).
    - Variants present → sum variant inventory_level > 0.
    - Else → product-level inventory_level > 0.
    - If tracking is on but levels are missing from payload → True (avoid false negatives).
    """
    tracking = (raw.get("inventory_tracking") or "none").lower()
    if tracking == "none":
        return True

    variants = raw.get("variants") or []
    if variants:
        total = sum(int(v.get("inventory_level") or 0) for v in variants)
        return total > 0

    level = raw.get("inventory_level")
    if level is not None:
        return int(level) > 0

    return True


async def _fetch_page(
    client: httpx.AsyncClient,
    url: str,
    headers: dict,
    params: dict,
) -> dict[str, Any]:
    async with _bc_sem():
        resp = await client.get(url, headers=headers, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json()


async def fetch_all_products(
    store_hash: str,
    api_key: str,
    include_inactive: bool = False,
    in_stock_only: bool = True,
) -> list[dict]:
    """
    Fetch every product in the BigCommerce catalog.
    Returns a list of normalised product dicts.

    When ``in_stock_only`` is True (default), only products with inventory > 0 are
    returned (requires ``include=variants`` for multi-variant SKUs). Products with
    ``inventory_tracking: none`` are always kept.
    """
    base = _base_url(store_hash)
    url = f"{base}/catalog/products"
    headers = _bc_headers(api_key)

    include_parts = ["images"]
    if in_stock_only:
        include_parts.append("variants")
    include = ",".join(include_parts)

    params: dict[str, Any] = {
        "limit": PAGE_SIZE,
        "page": 1,
        "include": include,
        "is_visible": "true" if not include_inactive else None,
    }
    # Remove None values
    params = {k: v for k, v in params.items() if v is not None}

    async with httpx.AsyncClient() as client:
        # Fetch page 1 to get total count
        logger.info("Fetching page 1 of products...")
        first = await _fetch_page(client, url, headers, params)

        pagination = first.get("meta", {}).get("pagination", {})
        total_pages = pagination.get("total_pages", 1)
        total_count = pagination.get("total", len(first.get("data", [])))

        logger.info(f"BigCommerce catalog: {total_count} products across {total_pages} pages")

        def normalise_page(raw_items: list[dict]) -> list[dict]:
            out: list[dict] = []
            for p in raw_items:
                if in_stock_only and not _is_in_stock(p):
                    continue
                out.append(_normalise_product(p))
            return out

        raw_first = first.get("data", [])
        products: list[dict] = normalise_page(raw_first)

        if total_pages <= 1:
            if in_stock_only:
                logger.info(
                    f"After in-stock filter: {len(products)} products "
                    f"(dropped {len(raw_first) - len(products)} OOS of {len(raw_first)} fetched)"
                )
            logger.info(f"Fetched {len(products)} products total")
            return products

        # Fetch remaining pages concurrently
        async def fetch_page_n(page: int) -> list[dict]:
            p = dict(params)
            p["page"] = page
            data = await _fetch_page(client, url, headers, p)
            return normalise_page(data.get("data", []))

        tasks = [fetch_page_n(page) for page in range(2, total_pages + 1)]
        pages = await asyncio.gather(*tasks)
        for page_products in pages:
            products.extend(page_products)

    if in_stock_only:
        logger.info(
            f"After in-stock filter: {len(products)} products "
            f"(from {total_count} visible in catalog)"
        )
    logger.info(f"Fetched {len(products)} products total")
    return products
