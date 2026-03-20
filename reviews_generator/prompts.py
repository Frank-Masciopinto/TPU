"""
Prompt templates for review generation.
System prompt enforces anti-AI naturalness rules specific to the TPU niche.
User prompt injects per-product context, trailer-type constraints, variation seeds,
and per-review target word counts.
"""

from __future__ import annotations

import random
import re

# Regex to strip alphanumeric spec codes from product names/descriptions
# when shown to plain-language personas. Covers tire sizes, bearing numbers,
# bolt dimensions, and similar catalog codes.
_SPEC_CODE_STRIP = re.compile(
    r"\b(?:ST)?\d{3}/\d{2,3}[RD]\d{2}(?:\.\d)?\b"   # tire sizes: ST235/85R16
    r"|\b\d{2}R\d{2}\.\d\b"                             # truck tires: 11R22.5
    r"|\bL\d{4,6}(?:/L\d{4,6})?\b"                      # bearing numbers: L44649
    r"|\b\d+(?:\.\d+)?\"[-x]\d+(?:\.\d+)?\"?\b"         # dimensions: 1-3/4"x25-1/4"
    r"|\b\d{1,2}-[Pp]ly\b",                              # ply ratings: 14-Ply (keep as "14-ply" → handled separately)
    re.IGNORECASE,
)


# ---------------------------------------------------------------------------
# Axle weight detection + trailer-type constraints
# ---------------------------------------------------------------------------

# Ordered from heaviest to lightest so first match wins
_AXLE_PATTERNS = [
    (16000, re.compile(r"\b16[,.]?000\b|\b16k\b", re.IGNORECASE)),
    (12000, re.compile(r"\b12[,.]?000\b|\b12k\b", re.IGNORECASE)),
    (10000, re.compile(r"\b10[,.]?000\b|\b10k\b", re.IGNORECASE)),
    (8000,  re.compile(r"\b8[,.]?000\b|\b8k\b", re.IGNORECASE)),
    (7000,  re.compile(r"\b7[,.]?000\b|\b7k\b", re.IGNORECASE)),
    (6000,  re.compile(r"\b6[,.]?000\b|\b6k\b", re.IGNORECASE)),
    (5200,  re.compile(r"\b5[,.]?200\b|\b5\.2k\b", re.IGNORECASE)),
    (3500,  re.compile(r"\b3[,.]?500\b|\b3\.5k\b", re.IGNORECASE)),
]


def detect_axle_weight(product_name: str) -> int | None:
    """
    Return the axle weight in lbs detected from the product name, or None
    if this doesn't appear to be an axle/axle-kit product.
    """
    for weight_lbs, pattern in _AXLE_PATTERNS:
        if pattern.search(product_name):
            return weight_lbs
    return None


def get_trailer_context(product_name: str) -> str | None:
    """
    Return a TRAILER_TYPE_CONSTRAINT string to inject into the prompt,
    or None if no constraint applies (non-axle products).

    Key domain rule from TPU:
    - 10k and 12k (and 16k) axles: ONLY flatbeds, gooseneck trailers,
      hotshot trailers, heavy equipment trailers, and commercial trailers.
    - 7k-8k: car haulers, equipment trailers, flatbeds, landscape trailers,
      larger utility trailers. NOT small utility or boat trailers.
    - 5.2k-6k: utility, cargo, landscape, car hauler, small equipment.
    - 3.5k and under: boat, small utility, ATV, small cargo — anything.
    - Non-axle product: no trailer-type constraint (part could go on any trailer).
    """
    weight = detect_axle_weight(product_name)
    if weight is None:
        return None

    if weight >= 10000:
        return (
            "TRAILER TYPE CONSTRAINT — THIS IS CRITICAL: This is a heavy-duty axle "
            f"({weight // 1000}k lbs). Reviewers MUST reference one of these trailer "
            "types ONLY: flatbed trailer, gooseneck trailer, hotshot trailer, heavy "
            "equipment trailer, lowboy, commercial trailer. "
            "NEVER reference: utility trailers, small cargo trailers, boat trailers, "
            "ATV trailers, horse trailers, or any trailer under 20 feet. "
            "Nobody installs a 10k or 12k axle on a small utility trailer — that "
            "would immediately expose the review as fake."
        )
    elif weight >= 7000:
        return (
            "TRAILER TYPE CONSTRAINT: This is a medium-heavy axle "
            f"({weight // 1000}k lbs). Reviewers should reference: car hauler, "
            "equipment trailer, flatbed, landscape trailer, or larger utility trailer "
            "(16 ft+). Avoid referencing very small trailers (5x10, 6x12) or boat "
            "trailers — those use lighter axles."
        )
    elif weight >= 5200:
        return (
            "TRAILER TYPE CONSTRAINT: This is a medium-duty axle "
            f"({weight} lbs). Appropriate trailers: utility trailer, cargo trailer, "
            "landscape trailer, car hauler, small equipment trailer. Any common "
            "trailer type is realistic here."
        )
    else:
        # 3500 and under — no restriction, any trailer type is valid
        return (
            "TRAILER TYPE NOTE: This is a light-duty axle (3,500 lbs). All common "
            "trailer types are appropriate: boat trailer, small utility, ATV trailer, "
            "small cargo — anything."
        )


# ---------------------------------------------------------------------------
# Tire / wheel size detection + compatibility constraints
# ---------------------------------------------------------------------------

# Detect rim/wheel diameter from product names.
# Handles: "R17.5", "17.5 inch", "17.5\"", "R16", "16 inch", "R15", "15 inch"
_TIRE_17_5 = re.compile(r"\bR?17\.5\b|17\.5[\"\s]", re.IGNORECASE)
_TIRE_16   = re.compile(r"\bR?16\b|16[\"\s-]|16\"", re.IGNORECASE)
_TIRE_15   = re.compile(r"\bR?15\b|15[\"\s-]|15\"", re.IGNORECASE)
_TIRE_14   = re.compile(r"\bR?14\b|14[\"\s-]", re.IGNORECASE)
_TIRE_13   = re.compile(r"\bR?13\b|13[\"\s-]", re.IGNORECASE)

# Commercial truck tire sizes (22.5-inch and 24.5-inch semi/heavy truck fitments)
_TRUCK_TIRE = re.compile(
    r"\b11R22\.5\b|\b11R24\.5\b"
    r"|\b295/75R22\.5\b|\b285/75R22\.5\b|\b275/80R22\.5\b"
    r"|\b255/70R22\.5\b|\b315/80R22\.5\b|\b22\.5\b",
    re.IGNORECASE,
)

# Detect dual-wheel configuration
_DUAL      = re.compile(r"\bdual\b", re.IGNORECASE)

# Detect lug count (for 15" differentiation)
_LUG_5     = re.compile(r"\b5[\s-]?lug\b", re.IGNORECASE)
_LUG_6     = re.compile(r"\b6[\s-]?lug\b", re.IGNORECASE)

# Tire size code patterns like "ST205/75R15", "235/80R16", "215/75R17.5"
_TIRE_CODE = re.compile(
    r"\b(?:ST)?\d{3}/\d{2,3}[RD](17\.5|16|15|14|13)\b",
    re.IGNORECASE,
)


def detect_tire_size(product_name: str) -> dict | None:
    """
    Detect tire/wheel rim size and dual/lug configuration from a product name.
    Returns a dict like {"size": "17.5", "dual": False, "lug": 8} or None.

    Priority: tire code (e.g. R17.5) > explicit size mention.
    """
    name = product_name

    # First try to extract size from tire code (most precise)
    m = _TIRE_CODE.search(name)
    if m:
        size = m.group(1)
    elif _TIRE_17_5.search(name):
        size = "17.5"
    elif _TIRE_16.search(name):
        size = "16"
    elif _TIRE_15.search(name):
        size = "15"
    elif _TIRE_14.search(name):
        size = "14"
    elif _TIRE_13.search(name):
        size = "13"
    else:
        return None

    dual = bool(_DUAL.search(name))
    lug = 5 if _LUG_5.search(name) else (6 if _LUG_6.search(name) else None)

    return {"size": size, "dual": dual, "lug": lug}


def get_tire_wheel_context(product_name: str) -> str | None:
    """
    Return a compatibility constraint string for tire/wheel products.

    Compatibility rules (from TPU owner Kaleb Carter):
    - 15" 5-lug:           2k – 3.5k axles
    - 15" 6-lug:           5.2k – 6k axles
    - 16" single:          5.2k – 8k axles
    - 16" dual:            10k – 12k axles
    - 17.5" single:        7k – 12k axles
    - 17.5" dual:          10k – 12k axles
    - Common upgrade path: 16" → 17.5" single for more capacity and fewer blowouts

    Returns None for non-tire/wheel products.
    """
    info = detect_tire_size(product_name)
    if info is None:
        return None

    size = info["size"]
    dual = info["dual"]
    lug  = info["lug"]

    if size == "17.5":
        if dual:
            return (
                "TIRE/WHEEL COMPATIBILITY CONSTRAINT: These are 17.5\" dual wheels/tires. "
                "They are used on 10k and 12k axles only — gooseneck trailers, hotshot "
                "trailers, heavy flatbeds, and commercial trailers. "
                "NEVER reference a small trailer, utility trailer, or axle under 10k. "
                "Many reviewers upgraded from 16\" singles to these for more load capacity "
                "and fewer blowouts — that is a realistic and natural thing to mention."
            )
        else:
            return (
                "TIRE/WHEEL COMPATIBILITY CONSTRAINT: These are 17.5\" single wheels/tires. "
                "They are used on 7k through 12k axles — car haulers, flatbeds, goosenecks, "
                "equipment trailers, and hotshot trailers. "
                "A very common and realistic scenario to mention: the reviewer upgraded "
                "from 16\" tires to 17.5\" for more hauling power and fewer blowouts. "
                "This is something real customers do all the time and it reads naturally "
                "in reviews. NEVER reference axles under 7k or small utility/boat trailers."
            )
    elif size == "16":
        if dual:
            return (
                "TIRE/WHEEL COMPATIBILITY CONSTRAINT: These are 16\" dual wheels/tires. "
                "They work with 10k and 12k axles on gooseneck trailers, hotshot trailers, "
                "and heavy commercial flatbeds. NEVER reference axles under 10k or small "
                "trailers."
            )
        else:
            return (
                "TIRE/WHEEL COMPATIBILITY CONSTRAINT: These are 16\" single wheels/tires. "
                "They work with 5.2k through 8k axles — landscape trailers, cargo trailers, "
                "car haulers, utility trailers, and medium equipment trailers. "
                "NEVER reference 10k+ axles (those need 17.5\" or dual configuration) "
                "or very light axles under 5k."
            )
    elif size == "15":
        if lug == 5:
            return (
                "TIRE/WHEEL COMPATIBILITY CONSTRAINT: These are 15\" 5-lug wheels/tires. "
                "They work with 2k and 3.5k axles — small utility trailers, boat trailers, "
                "ATV trailers, and light cargo trailers. NEVER reference axles over 3.5k "
                "for 5-lug 15\" wheels."
            )
        elif lug == 6:
            return (
                "TIRE/WHEEL COMPATIBILITY CONSTRAINT: These are 15\" 6-lug wheels/tires. "
                "They work with 5.2k and 6k axles — utility trailers, cargo trailers, "
                "landscape trailers, and medium-duty setups. NEVER reference 3.5k or "
                "under (those need 5-lug), or axles over 7k."
            )
        else:
            # 15" without clear lug count — give general guidance
            return (
                "TIRE/WHEEL COMPATIBILITY CONSTRAINT: These are 15\" wheels/tires. "
                "15\" 5-lug fit 2k–3.5k axles; 15\" 6-lug fit 5.2k–6k axles. "
                "Reference light to medium-duty trailers only (boat, utility, cargo, "
                "landscape). NEVER reference axles over 7k."
            )
    elif size in ("13", "14"):
        return (
            f"TIRE/WHEEL COMPATIBILITY CONSTRAINT: These are {size}\" wheels/tires. "
            "They are used on very light trailers: small boat trailers, personal watercraft, "
            "utility trailers under 3,500 lbs, and small cargo trailers. "
            "NEVER reference heavy axles or large trailers."
        )

    return None


def get_truck_tire_context(product_name: str) -> str | None:
    """
    Return a constraint for commercial truck tires (22.5-inch / 24.5-inch).
    These go on semi trucks and heavy commercial vehicles, NOT trailers.
    """
    if not _TRUCK_TIRE.search(product_name):
        return None
    return (
        "TIRE TYPE CONSTRAINT — CRITICAL: This is a commercial truck tire "
        "(22.5-inch or 24.5-inch commercial size). These mount on semi trucks, "
        "18-wheelers, heavy commercial vehicles, and large freight haulers ONLY. "
        "NEVER reference: boat trailers, horse trailers, ATV trailers, utility "
        "trailers, personal pickup trucks, or any recreational trailer. "
        "Reviewers MUST reference: semi truck, commercial vehicle, fleet truck, "
        "18-wheeler, freight hauler, or heavy-duty work truck context."
    )


def get_product_constraints(product_name: str) -> list[str]:
    """
    Collect all applicable constraints for a product (axle + tire/wheel + truck tire).
    Returns a list of constraint strings to inject into the prompt.
    Commercial truck tire detection takes priority over generic tire/wheel detection.
    """
    constraints = []

    # Truck tire check first — overrides generic tire/wheel context
    truck = get_truck_tire_context(product_name)
    if truck:
        constraints.append(truck)
    else:
        tire_wheel = get_tire_wheel_context(product_name)
        if tire_wheel:
            constraints.append(tire_wheel)

    trailer = get_trailer_context(product_name)
    if trailer:
        constraints.append(trailer)

    return constraints


SYSTEM_PROMPT = """\
You are a review generation engine for trailerpartsunlimited.com, a trailer parts \
supplier based in Huntsville, Texas. Your job is to write realistic product reviews \
that are indistinguishable from reviews written by real customers in the US South, \
Midwest, and Texas.

STRICT RULES — follow every one without exception:

1. BANNED WORDS — these apply to BOTH review_content AND review_title. \
Never use any of these words or phrases: \
"perfect", "perfectly", "perfectly fine", "works perfectly", "fits perfectly", \
"works perfect", "work perfect", "runs perfect", "fit perfect", \
"amazing", "amazing quality", "excellent", "outstanding", "great product", \
"highly recommend", "top notch", "fantastic", "superb", "phenomenal", "flawless", \
"stellar", "seamless", "game changer", "game-changer", "exceeded my expectations", \
"couldn't be happier", "couldn't ask for more", "can't go wrong", \
"cannot be happier", "five stars", "10/10".

2. SPEC DETAIL — every review must mention one concrete technical detail. \
The spec_language field in persona_must_sound_like controls how technical to be:

   spec_language=codes: this persona uses exact technical notation naturally. \
Use catalog-style specs when they fit: "ST235/85R16 14-ply", "12k axle rating", \
"5 on 4.5 bolt pattern", "L44649 bearing". Only 3 of 15 personas are codes-level.

   spec_language=partial: use plain shorthand — no alphanumeric codes. \
Say "the 16-inch tires" not "ST235/85R16". Say "the 7k axle" not full model names. \
Say "14-ply", "8-lug", "the tandem axle kit", "the 3.5k springs". \
Short recognizable labels, not catalog numbers.

   spec_language=plain: describe the part in everyday English only. \
NEVER write an alphanumeric code, model number, or size code for plain personas. \
Use these plain alternatives by product type: \
  Tire → "the trailer tires", "the heavy-duty tires", "these tires" \
  Bearing/seal → "the bearings", "the bearing kit", "fresh wheel bearings" \
  Spring/suspension → "the leaf springs", "the suspension", "new springs" \
  Axle → "the axle", "the new axle", "the trailer axle" \
  Brake assembly → "the brakes", "the electric brakes", "the brake setup" \
  U-bolt/hardware → "the U-bolts", "the hardware kit", "the mounting hardware" \
  Light/electrical → "the trailer lights", "the LED lights", "the wiring" \
  Hub/drum → "the hub", "the wheel hub", "the drum" \
  Lug nuts/studs → "the lug nuts", "the wheel studs" \
  Coupler/hitch → "the coupler", "the hitch ball", "the tongue hardware" \
  Strap/chain → "the tie-down straps", "the ratchet straps", "the chains"

IMPORTANT: Never phrase the same spec the same way twice in one batch — \
vary the expression even within the same language tier.

3. STAR RATING CONTENT RULES — only 4-star and 5-star reviews are generated:
   - 5-star reviews: must include one minor gripe or caveat — vary what the gripe \
is (e.g. "instructions could be clearer", "grease fitting took a minute to figure \
out", "shipping ran a day late", "packaging could be better", "no torque spec \
included"). target_words will be specified per review — hit it within ±5 words.
   - 4-star reviews: focus on a real inconvenience that caused friction — not a \
defect. target_words will be specified per review — 4-star reviews must be \
noticeably longer than 5-star reviews. Vary the inconvenience: shipping delay, \
minor install issue, missing hardware, unclear fitment info.

4. NATURAL LANGUAGE AND OPENING VARIETY:
   - Vary sentence structure. Use contractions. Allow occasional minor grammar \
imperfection (not a typo — just how people write casually in reviews).
   - BANNED FIRST WORDS for review_content: never start a review with \
"These", "The", "This", "I ", "Got", "Ordered", or "Been".
   - OPENING VARIETY: each review spec will include a required_opener field. \
Your review_content MUST start with EXACTLY that word. No exceptions.
   - BANNED TITLE FIRST WORDS — THIS IS CRITICAL: the following words may \
NEVER be the first word of review_title: \
"Good", "Solid", "Decent", "Nice", "Works", "Great", "Amazing", "Excellent", \
"Perfect", "Outstanding", "Fantastic", "Reliable", "Quality". \
REWRITE EXAMPLES — instead of starting with "Good": \
"Good tire for my trailer" → "Fit my trailer and held up all season" \
"Good price for the part" → "Priced right, arrived on time" \
"Good fit for heavy loads" → "Handled heavy loads without issue" \
Write the specific outcome or experience, not a generic quality word.
   - TITLE EXAMPLES — titles must be specific and grounded: \
"Fit my 8k Dexter without any modifications", \
"Third set I've ordered from TPU this year", \
"Shipping took longer than expected but worth it", \
"Finally found 17.5s that fit my gooseneck setup", \
"Bolted right up, no issues", \
"Shop orders these for all 7k axle repairs", \
"One tire was slightly off-balance but TPU fixed it", \
"Arrived faster than I expected".

5. PERSONA VOICE — you ARE this person writing the review. Do not describe them. \
Do not label their role. Just write as them. \
The persona_must_sound_like field tells you exactly how they write and what \
vocabulary they use. Their specific phrases MUST appear naturally — not paraphrased. \
A fleet manager says "ordered another batch for the shop" not "I purchased multiple \
units." A rancher says "bolted right up" not "installation was straightforward." \
The persona voice must be obvious to anyone reading the review.

6. REGIONAL DIALECT — the persona_must_sound_like field may include \
regional_slang phrases specific to the reviewer's home region. Rules: \
- Use 0-2 slang phrases per review, naturally woven in — never forced. \
- NOT every review needs slang. Maybe 60% of reviews include one phrase. \
- A Texas rancher might write "fixin' to mount it" or "I reckon it'll hold". \
- A Cajun-adjacent guy near Louisiana might say "mais yeah" or "I tell you what". \
- A Valley contractor might say "for real" or "no lie" once. \
- A young Austin reseller might say "lowkey" or "no joke". \
- If the persona has NO regional_slang (e.g. a corporate fleet manager), \
write in clean, neutral professional English. That is correct for them. \
- NEVER mix regions. A Missouri guy does NOT say "y'all" and a Texan does \
NOT say "heck yeah". Each persona's slang is region-locked.

7. VOCAB VARIATION — persona vocabulary anchors are inspiration only, never \
copy-paste. If the persona says "margins are tight", each review must phrase \
that concept differently: "slim margins on these flips", "not a lot of room \
on the price", "tight on budget for this turnaround". \
NEVER repeat the exact same phrase from the vocabulary list across two reviews \
in the same batch, even for the same persona. The vocabulary is a starting \
point — rephrase the idea each time.

8. VARIATION — a variation_seed (0-9) will be provided. Even for the same persona \
and same product, produce meaningfully different content: different opening angle, \
different product aspect discussed, different gripe, different use-case detail.

9. LENGTH — each review has a target_words value. Write to within ±5 words of that \
exact target. Every review in the batch MUST be a different length — a batch where \
every review is 40-50 words is a failure. At least one review per batch must be \
under 32 words (short, punchy) and at least one must be over 70 words (detailed). \
4-star reviews must average longer than 5-star reviews. \
Vary from very short (~24 words) to long (~120 words) across the batch.

10. REVIEWER NAMES AND EMAILS — will be provided. Use them exactly as given.

11. DATES — will be provided. Use them exactly as given in YYYY-MM-DD format.

12. OUTPUT FORMAT — return a single JSON object with key "reviews" containing \
an array of exactly N review objects. Each review object has these exact keys:
   {
     "reviews": [
       {
         "review_title": "...",
         "review_content": "...",
         "review_score": 5,
         "display_name": "...",
         "email": "...",
         "date": "YYYY-MM-DD",
         "user_type": "Verified Buyer"
       },
       ...
     ]
   }
   Do not include any text outside this JSON object. No markdown fences. \
   The "reviews" array must contain EXACTLY the number of reviews requested.
"""


# ---------------------------------------------------------------------------
# Opener rotation pool — assigned per-review to eliminate dominance
# ---------------------------------------------------------------------------

# These openers are distributed across reviews in round-robin order.
# Words that were historically dominant ("Got", "These", "Ordered", "Been") are excluded.
_OPENER_POOL = [
    "My", "Had", "Just", "Bought", "Running", "Needed", "Put", "Used",
    "Picked", "Finally", "Shop", "Third", "Grabbed", "Replaced", "Switched",
    "Ran", "Pulled", "Mounted", "Tried", "After", "First", "Back", "Second",
    "We", "Always", "Upgraded", "Swapped", "Fast", "Spent", "Checked",
    "Looked", "Figured", "Wanted", "Hauled", "Loaded", "Built", "Fixed",
    "Needed", "Found",
]

_opener_counter = 0


def _next_opener() -> str:
    """Return the next opener from the pool in round-robin order."""
    global _opener_counter
    opener = _OPENER_POOL[_opener_counter % len(_OPENER_POOL)]
    _opener_counter += 1
    return opener


# ---------------------------------------------------------------------------
# Per-review word count targets — forces genuine length variance
# ---------------------------------------------------------------------------

_WORD_TARGETS = {
    5: [24, 29, 35, 42, 50, 58, 67, 75],
    4: [65, 75, 88, 100, 112, 120],
}


def _pick_target_words(score: int) -> int:
    return random.choice(_WORD_TARGETS.get(score, [50]))


# ---------------------------------------------------------------------------
# Title-only review pool — for locally generated title-only reviews (no LLM)
# ---------------------------------------------------------------------------

_TITLE_ONLY_POOL = [
    "Arrived fast",
    "Held up well",
    "Fit right up",
    "No complaints",
    "Did the job",
    "Will order again",
    "Exactly what I needed",
    "Fast shipping",
    "Held up fine",
    "Easy install",
    "Worth it",
    "Fits my trailer",
    "Happy with this",
    "Quick delivery",
    "Does what it should",
    "No issues so far",
    "Used it, works",
    "Fast and easy",
    "Came as described",
    "Would buy again",
    "On time, no problems",
    "Matched what I needed",
    "Worked right away",
    "Simple install",
    "Shipping was quick",
    "Fits and works",
    "No drama",
    "Bought again",
    "Held up so far",
    "Came quick",
    "Exactly right",
    "Just what I needed",
    "Arrived on time",
    "Five out of five",
    "No issues at all",
]


def random_title_only_title() -> str:
    """Return a random natural short title for a title-only review."""
    return random.choice(_TITLE_ONLY_POOL)


def _plain_product_name(product: dict) -> str:
    """
    Return a version of the product name with alphanumeric spec codes stripped
    for use in prompts targeted at plain-language personas.
    Preserves brand names and plain descriptors.
    """
    name = product.get("name", "")
    cleaned = _SPEC_CODE_STRIP.sub("", name)
    # Collapse extra whitespace left by stripping
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
    return cleaned or name   # fallback to original if cleaning empties the string


def _plain_description(product: dict) -> str:
    """Strip spec codes from product description for plain-language personas."""
    desc = (product.get("description") or "")[:300].strip()
    cleaned = _SPEC_CODE_STRIP.sub("", desc)
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()
    return cleaned or desc


def build_user_prompt(
    product: dict,
    reviews_spec: list[dict],
    variation_seed: int,
) -> str:
    """
    Build the user-side prompt for one batch of reviews.

    product: dict with keys name, description, calculated_price, image_url, url
    reviews_spec: list of dicts, each with keys:
        score, persona (dict), display_name, email, date
    variation_seed: int 0-9
    """
    price = product.get("calculated_price") or product.get("price", 0)

    # Determine if any persona in this batch is plain-language.
    # We'll compute per-review below, but pre-check to decide product display.
    # (Each review spec has its own persona, so we handle per-review below.)

    constraints = get_product_constraints(product["name"])

    # Use full product name in the prompt header — per-review persona instructions
    # will guide the model on how to reference specs from the name.
    lines = [
        f"PRODUCT: {product['name']}",
        f"PRICE: ${price:.2f}",
        f"DESCRIPTION: {(product.get('description') or '')[:300].strip() or '(no description available)'}",
    ]

    for constraint in constraints:
        lines += [
            "",
            f"*** {constraint} ***",
        ]

    lines += [
        "",
        f"VARIATION SEED: {variation_seed} — make this batch meaningfully different "
        f"from other variation seeds for the same product and persona.",
        "",
        f"Generate exactly {len(reviews_spec)} reviews as a JSON array.",
        "Use the reviewer details below exactly as provided.",
        "",
    ]

    for i, spec in enumerate(reviews_spec):
        persona = spec["persona"]
        # Rotate the vocabulary slice per review so the same 3 phrases are
        # never repeated verbatim across all specs for the same persona.
        vocab = persona["vocabulary"]
        vocab_start = i % max(1, len(vocab) - 2)
        vocab_slice = vocab[vocab_start : vocab_start + 3] or vocab[:3]
        spec_lang = persona.get("spec_language", "plain")

        if spec_lang == "plain":
            plain_ref = _plain_product_name(product)
            spec_lang_note = (
                f"spec_language=plain — NEVER cite alphanumeric codes, model numbers, "
                f"or size codes. Refer to the product as '{plain_ref}' or by type "
                f"(e.g. 'the trailer tires', 'the bearings', 'the axle', 'the brakes')."
            )
        elif spec_lang == "partial":
            spec_lang_note = (
                "spec_language=partial — use plain shorthand only: "
                "'the 16-inch tires', 'the 7k axle', '14-ply', '8-lug setup'. "
                "No full alphanumeric catalog codes."
            )
        else:
            spec_lang_note = (
                "spec_language=codes — exact technical notation is natural for this person."
            )

        slang = persona.get("regional_slang", [])
        slang_note = (
            f" Regional dialect: {', '.join(slang[:3])}."
            if slang
            else " No regional slang — write in clean neutral English."
        )

        persona_voice = (
            f"{persona['occupation']} from {persona['location']}. "
            f"{persona['writing_style']}.{slang_note} "
            f"{spec_lang_note} "
            f"Use phrases like: {', '.join(vocab_slice)}."
        )
        lines += [
            f"--- Review {i + 1} ---",
            f"score: {spec['score']}",
            f"target_words: {_pick_target_words(spec['score'])}",
            f"required_opener: {_next_opener()} — review_content MUST start with this exact word",
            f"prohibited_title_start: do NOT start review_title with Good, Solid, Decent, Nice, Works, Great, Perfect, Outstanding, Reliable, Quality",
            f"display_name: {spec['display_name']}",
            f"email: {spec['email']}",
            f"date: {spec['date']}",
            f"persona_must_sound_like: {persona_voice}",
            "",
        ]

    lines.append(
        'Return only a JSON object: {"reviews": [...]} with exactly '
        f"{len(reviews_spec)} review objects inside. No markdown fences."
    )
    return "\n".join(lines)


def build_tier1_text_prompt(
    product: dict,
    reviews_spec: list[dict],
    variation_seed: int,
) -> str:
    """
    Simplified prompt for Tier 1 short-text reviews (10% of <$100 products).
    All are 5-star, very short (1-2 sentences max).
    """
    desc = (product.get("description") or "")[:150].strip()
    desc = desc or "(no description available)"

    constraints = get_product_constraints(product["name"])

    lines = [
        f"PRODUCT: {product['name']}",
        f"PRICE: ${(product.get('calculated_price') or product.get('price', 0)):.2f}",
        f"DESCRIPTION: {desc}",
    ]

    for constraint in constraints:
        lines += [
            "",
            f"*** {constraint} ***",
        ]

    lines += [
        "",
        f"VARIATION SEED: {variation_seed}",
        "",
        f"Generate exactly {len(reviews_spec)} SHORT 5-star reviews as a JSON array.",
        "Rules for these reviews:",
        "- Score is always 5.",
        "- Write to within ±3 words of the target_words value for each review.",
        "- Very casual, minimal — like someone quickly typing after clicking 5 stars.",
        "- Must mention the product or what it does in one concrete way.",
        "- Do NOT use banned words: perfect, perfectly, amazing, excellent, outstanding.",
        "- Do NOT start with 'These', 'The', 'This', or 'I '.",
        "- Titles: 3-6 words, specific and casual (not 'Good product' or 'Solid item').",
        "",
    ]

    for i, spec in enumerate(reviews_spec):
        lines += [
            f"--- Review {i + 1} ---",
            f"score: 5",
            f"target_words: {random.choice([6, 8, 10, 12])}",
            f"display_name: {spec['display_name']}",
            f"email: {spec['email']}",
            f"date: {spec['date']}",
            "",
        ]

    lines.append(
        'Return only a JSON object: {"reviews": [...]} with exactly '
        f"{len(reviews_spec)} review objects inside. No markdown fences."
    )
    return "\n".join(lines)
