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
) -> list[dict]:
    """
    Fetch every product in the BigCommerce catalog.
    Returns a list of normalised product dicts.
    """
    base = _base_url(store_hash)
    url = f"{base}/catalog/products"
    headers = _bc_headers(api_key)

    params: dict[str, Any] = {
        "limit": PAGE_SIZE,
        "page": 1,
        "include": "images",
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

        products: list[dict] = [_normalise_product(p) for p in first.get("data", [])]

        if total_pages <= 1:
            return products

        # Fetch remaining pages concurrently
        async def fetch_page_n(page: int) -> list[dict]:
            p = dict(params)
            p["page"] = page
            data = await _fetch_page(client, url, headers, p)
            return [_normalise_product(item) for item in data.get("data", [])]

        tasks = [fetch_page_n(page) for page in range(2, total_pages + 1)]
        pages = await asyncio.gather(*tasks)
        for page_products in pages:
            products.extend(page_products)

    logger.info(f"Fetched {len(products)} products total")
    return products
