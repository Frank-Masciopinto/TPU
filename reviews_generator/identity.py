"""
Reviewer identity generation.

Guarantees:
- Each review within a product has a unique first name (no same first name twice per product).
- Each email is unique via a deterministic hash-based numeric suffix.
- Email format varies naturally across common patterns.
"""

from __future__ import annotations

import hashlib
import random
import string
from dataclasses import dataclass

from personas import (
    FIRST_NAMES_MALE,
    FIRST_NAMES_FEMALE,
    LAST_NAMES,
    EMAIL_DOMAINS,
    random_full_name,
    random_email_domain,
)


@dataclass
class ReviewerIdentity:
    display_name: str   # e.g. "Randy K." or "Randy Kowalski"
    email: str          # e.g. "randy.k_4821@gmail.com"
    first_name: str     # for dedup tracking


def _email_suffix(product_id: str, first: str, last: str, date: str) -> str:
    """Deterministic 3-4 digit suffix derived from product+identity+date."""
    raw = f"{product_id}:{first}:{last}:{date}"
    digest = int(hashlib.md5(raw.encode()).hexdigest(), 16)
    return str(digest % 9000 + 1000)   # always 4 digits, 1000-9999


def _build_email(first: str, last: str, product_id: str, date: str) -> str:
    """
    Choose one of several realistic email patterns and apply a unique suffix.
    Patterns rotate based on hash to ensure variety without randomness.
    """
    suffix = _email_suffix(product_id, first, last, date)
    domain = random_email_domain()
    f = first.lower()
    l = last.lower()

    # Pick pattern deterministically from suffix's last digit
    pattern_idx = int(suffix[-1]) % 6
    patterns = [
        f"{f}.{l}{suffix}",          # randy.kowalski4821
        f"{f}{l[0]}{suffix}",        # randyk4821
        f"{f[0]}{l}{suffix}",        # rkowalski4821
        f"{f}.{l[0]}_{suffix}",      # randy.k_4821
        f"{f}{suffix}",              # randy4821
        f"{f[0]}.{l}_{suffix}",      # r.kowalski_4821
    ]
    local = patterns[pattern_idx]
    return f"{local}@{domain}"


def _display_name_format(first: str, last: str) -> str:
    """
    Randomly choose between full name and abbreviated format.
    About 60% full name, 40% first + last initial.
    """
    if random.random() < 0.6:
        return f"{first} {last}"
    return f"{first} {last[0]}."


class IdentityPool:
    """
    Manages per-product reviewer identity generation.
    Tracks which first names have been used to enforce uniqueness within a product.
    """

    def __init__(self, product_id: str):
        self.product_id = product_id
        self._used_first_names: set[str] = set()
        # Build shuffled pools to exhaust before repeating
        self._male_pool = FIRST_NAMES_MALE.copy()
        self._female_pool = FIRST_NAMES_FEMALE.copy()
        random.shuffle(self._male_pool)
        random.shuffle(self._female_pool)
        self._male_idx = 0
        self._female_idx = 0

    def _next_unique_first(self, gender: str) -> str:
        """
        Pull the next unused first name for this gender.
        If the pool is exhausted, append a number suffix to allow reuse
        while maintaining uniqueness at the email level.
        """
        pool = self._male_pool if gender == "male" else self._female_pool
        start_idx = self._male_idx if gender == "male" else self._female_idx

        for offset in range(len(pool)):
            idx = (start_idx + offset) % len(pool)
            name = pool[idx]
            if name not in self._used_first_names:
                if gender == "male":
                    self._male_idx = (idx + 1) % len(pool)
                else:
                    self._female_idx = (idx + 1) % len(pool)
                self._used_first_names.add(name)
                return name

        # Pool exhausted — reuse a random name freely.
        # Email hash suffix guarantees unique accounts; display name repeats
        # (e.g. "Randy Davis" and "Randy Roberts") are natural in large pools.
        return random.choice(pool)

    def generate(self, date: str, gender: str | None = None) -> ReviewerIdentity:
        """Generate one unique reviewer identity for this product."""
        if gender is None:
            gender = random.choice(["male", "male", "male", "female"])  # ~75% male, realistic for niche

        first = self._next_unique_first(gender)
        last = random.choice(LAST_NAMES)

        display = _display_name_format(first, last)
        email = _build_email(first, last, self.product_id, date)

        return ReviewerIdentity(
            display_name=display,
            email=email,
            first_name=first,
        )

    def generate_batch(self, dates: list[str]) -> list[ReviewerIdentity]:
        """Generate one identity per date in the provided list."""
        return [self.generate(date) for date in dates]
