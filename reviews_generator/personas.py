"""
Buyer personas for Trailer Parts Unlimited review generation.
Each persona defines who the reviewer is, their vocabulary anchors,
use-case context, and technical literacy level.
"""

from __future__ import annotations
import random

# ---------------------------------------------------------------------------
# Name pools — US South / Midwest / Texas weighted
# ---------------------------------------------------------------------------

FIRST_NAMES_MALE = [
    "Randy", "Jake", "Tony", "Steve", "Chris", "Bobby", "Mike", "Luis",
    "Gary", "Zach", "Derek", "Kevin", "Travis", "Dale", "Cody", "Brett",
    "Kyle", "Shane", "Dustin", "Logan", "Heath", "Brent", "Wade", "Troy",
    "Curtis", "Lance", "Clint", "Ricky", "Marty", "Dean", "Clay", "Trent",
    "Brad", "Scott", "Craig", "Chad", "Todd", "Glen", "Ronnie", "Jimmy",
    "Billy", "Tommy", "Danny", "Kenny", "Donnie", "Eddie", "Jessie", "Robbie",
    "Caleb", "Mason", "Hunter", "Austin", "Tyler", "Garrett", "Colton", "Tanner",
    "Carson", "Wyatt", "Jace", "Brayden", "Tucker", "Sawyer", "Colt", "Ryder",
]

FIRST_NAMES_FEMALE = [
    "Donna", "Maria", "Paula", "Lisa", "Sandra", "Debbie", "Karen", "Tammy",
    "Sheryl", "Cindy", "Brenda", "Angela", "Crystal", "Tiffany", "Heather",
    "Amber", "Ashley", "Brittany", "Kayla", "Megan", "Chelsea", "Lacey",
    "Brandy", "Shelby", "Savannah", "Madison", "Brooke", "Kelsey", "Hannah",
    "Sara", "Jennifer", "Michelle", "Melissa", "Stephanie", "Nicole", "Amy",
]

LAST_NAMES = [
    "Carter", "Williams", "Johnson", "Davis", "Wilson", "Martinez", "Anderson",
    "Taylor", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson",
    "Garcia", "Moore", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
    "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright",
    "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Nelson", "Mitchell",
    "Perez", "Campbell", "Roberts", "Evans", "Turner", "Phillips", "Parker",
    "Collins", "Edwards", "Stewart", "Sanchez", "Morris", "Rogers", "Reed",
    "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Cox",
    "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James",
    "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood",
    "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell",
    "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons",
    "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz",
    "Hayes", "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace",
]

EMAIL_DOMAINS = [
    "gmail.com", "gmail.com", "gmail.com",   # weighted: gmail most common
    "yahoo.com", "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "att.net",
    "comcast.net",
]

# ---------------------------------------------------------------------------
# Persona definitions
# ---------------------------------------------------------------------------

PERSONAS: list[dict] = [
    {
        "id": "randy_homesteader",
        "name": "Randy",
        "gender": "male",
        "age_range": "48-58",
        "location": "East Texas / rural South",
        "occupation": "Rancher / DIY homesteader",
        "trailer_use": "hauls hay bales, livestock, farm equipment on a utility trailer he built himself",
        "technical_level": "medium",
        "spec_language": "plain",
        "regional_slang": ["fixin' to", "I reckon", "right quick", "dadgum", "over yonder"],
        "vocabulary": [
            "bolted right up", "fit my trailer", "solid build", "no complaints so far",
            "been using it for a while now", "had to order this after my old one gave out",
            "works like it should", "my buddy recommended this place",
        ],
        "writing_style": "plain-spoken, short sentences, mentions the ranch or livestock occasionally",
    },
    {
        "id": "jake_landscaper",
        "name": "Jake",
        "gender": "male",
        "age_range": "35-42",
        "location": "Central Texas / suburbs",
        "occupation": "Landscaping contractor, runs 3-truck crew",
        "trailer_use": "hauls mowers, debris, mulch on a 16-ft tandem landscape trailer",
        "technical_level": "medium-high",
        "spec_language": "partial",
        "regional_slang": [],
        "vocabulary": [
            "cheaper than the dealer", "my crew uses this daily", "had to replace after it wore out",
            "decent quality for the price", "ordered a few of these for the shop",
            "fits the Dexter axle on my landscape trailer", "quick shipping",
        ],
        "writing_style": "cost-focused, mentions crew or workload, compares to dealer pricing",
    },
    {
        "id": "maria_horse_trailer",
        "name": "Maria",
        "gender": "female",
        "age_range": "42-50",
        "location": "Hill Country Texas / Oklahoma",
        "occupation": "Recreational equestrian, part-time riding instructor",
        "trailer_use": "2-horse slant-load trailer, weekend trail rides and competitions",
        "technical_level": "low-medium",
        "spec_language": "plain",
        "regional_slang": [],
        "vocabulary": [
            "my horses are everything to me", "safety is non-negotiable",
            "had a mechanic install it", "peace of mind on the road",
            "trailer is 8 years old and needed new parts", "drives smooth now",
        ],
        "writing_style": "safety-first, mentions horses or competitions, moderate technical detail",
    },
    {
        "id": "tony_car_hauler",
        "name": "Tony",
        "gender": "male",
        "age_range": "30-38",
        "location": "Houston TX / Dallas",
        "occupation": "Auto enthusiast, weekend track days",
        "trailer_use": "20-ft bumper-pull car hauler, hauls a Fox Body Mustang",
        "technical_level": "high",
        "spec_language": "partial",
        "regional_slang": [],
        "vocabulary": [
            "GVWR", "bolt pattern", "5 lug", "6 lug", "axle rating",
            "Dexter-compatible", "upgraded from the stock setup",
            "torqued to spec", "no wobble at highway speed",
        ],
        "writing_style": "gear-head jargon, specific numbers, mentions the car or race track",
    },
    {
        "id": "steve_fleet_manager",
        "name": "Steve",
        "gender": "male",
        "age_range": "44-52",
        "location": "North Texas / Oklahoma",
        "occupation": "Fleet manager, construction firm with 20+ trailers",
        "trailer_use": "mixed fleet: flatbeds, equipment trailers, car haulers",
        "technical_level": "high",
        "spec_language": "partial",
        "regional_slang": [],
        "vocabulary": [
            "ordered in bulk", "lead time was acceptable", "fits our Dexter axles",
            "maintenance schedule", "we run these on multiple trailers",
            "consistent quality across the batch", "procurement",
        ],
        "writing_style": "procurement mindset, mentions multiple units, talks lead time and consistency",
    },
    {
        "id": "chris_boat_trailer",
        "name": "Chris",
        "gender": "male",
        "age_range": "38-46",
        "location": "Lake Fork TX / Gulf Coast",
        "occupation": "Bass fisherman, weekend angler",
        "trailer_use": "20-ft bass boat trailer, freshwater and occasional coastal launches",
        "technical_level": "medium",
        "spec_language": "plain",
        "regional_slang": ["man", "shoot", "tight lines", "no kidding"],
        "vocabulary": [
            "saltwater rated", "rust was starting to show", "freshwater use only",
            "boat launch", "replaced the bearings after last season",
            "backed into the water dozens of times", "holds up to the lake",
        ],
        "writing_style": "mentions fishing, boat ramp, corrosion concern, seasonal use",
    },
    {
        "id": "bobby_atv_guy",
        "name": "Bobby",
        "gender": "male",
        "age_range": "25-34",
        "location": "East Texas / Louisiana border",
        "occupation": "Welder, ATV enthusiast",
        "trailer_use": "16-ft open trailer, hauls 2 ATVs for deer season and trail rides",
        "technical_level": "low-medium",
        "spec_language": "plain",
        "regional_slang": ["shoot", "I tell you what", "mais yeah", "man", "no kidding"],
        "vocabulary": [
            "held up fine", "no issues", "fast shipping", "easy install",
            "needed this for deer season", "good deal", "did the job",
            "threw it on and it worked",
        ],
        "writing_style": "short punchy sentences, occasional typo, mentions hunting or ATVs",
    },
    {
        "id": "donna_concession",
        "name": "Donna",
        "gender": "female",
        "age_range": "50-58",
        "location": "Central Texas",
        "occupation": "Mobile food concession, runs trailer at weekend events",
        "trailer_use": "20-ft enclosed concession trailer, moves every weekend",
        "technical_level": "low",
        "spec_language": "plain",
        "regional_slang": ["y'all", "honey", "Lord have mercy", "bless your heart"],
        "vocabulary": [
            "my livelihood depends on this trailer", "needed something reliable",
            "not very mechanical but it was easy to install",
            "the trailer has to be ready every weekend",
            "had a local shop put it on",
        ],
        "writing_style": "reliability over price, mentions weekend events or business dependence",
    },
    {
        "id": "mike_repair_shop",
        "name": "Mike",
        "gender": "male",
        "age_range": "40-48",
        "location": "Huntsville TX / Lufkin",
        "occupation": "Independent trailer repair shop owner",
        "trailer_use": "buys parts for customer repairs — all types of trailers",
        "technical_level": "expert",
        "spec_language": "codes",
        "regional_slang": ["I tell you what", "ol' boy", "she bolted right up", "ain't bad"],
        "vocabulary": [
            "Dexter-interchangeable", "drop-in replacement", "bearing kit",
            "ordered for a customer's 7k axle", "fits the Lippert spindle",
            "been ordering from TPU for a while", "good supplier",
            "shop stock", "keeps the customer happy",
        ],
        "writing_style": "highly technical, mentions specific axle brands and repair context",
    },
    {
        "id": "luis_contractor",
        "name": "Luis",
        "gender": "male",
        "age_range": "36-44",
        "location": "San Antonio TX / Rio Grande Valley",
        "occupation": "General contractor",
        "trailer_use": "tandem flatbed, hauls lumber, roofing materials, equipment",
        "technical_level": "medium",
        "spec_language": "plain",
        "regional_slang": ["for real", "no lie", "man", "you know what I mean"],
        "vocabulary": [
            "good price", "holds up on my work trailer", "fast delivery",
            "needed this to get the job done", "no problems so far",
            "ordered a couple of these", "my work trailer",
        ],
        "writing_style": "price-conscious, practical, short and direct",
    },
    {
        "id": "gary_retired_trucker",
        "name": "Gary",
        "gender": "male",
        "age_range": "60-68",
        "location": "West Texas / Panhandle",
        "occupation": "Retired OTR trucker, now builds trailers as hobby",
        "trailer_use": "builds custom utility and car trailers in retirement",
        "technical_level": "expert",
        "spec_language": "codes",
        "regional_slang": ["I'll tell ya", "she'll hold", "ain't bad", "back when I was runnin'"],
        "vocabulary": [
            "back in the day", "quality has gone downhill on most brands",
            "this one held up", "been doing this for 40 years",
            "torqued it down proper", "old-school way",
            "welder by trade", "spec'd it myself",
        ],
        "writing_style": "old-school vernacular, references experience, compares to older standards",
    },
    {
        "id": "zach_reseller",
        "name": "Zach",
        "gender": "male",
        "age_range": "24-30",
        "location": "Austin TX / DFW",
        "occupation": "Buys and resells trailers for profit",
        "trailer_use": "various trailer types — flips them after reconditioning",
        "technical_level": "medium-high",
        "spec_language": "partial",
        "regional_slang": [],
        "vocabulary": [
            "margins are tight", "fit and finish was acceptable",
            "quick turnaround matters on flips",
            "third one I've ordered this month", "adds value to the trailer",
            "customers notice the details",
        ],
        "writing_style": "mentions profit margins, turnaround time, shipping speed",
    },
    {
        "id": "paula_property_manager",
        "name": "Paula",
        "gender": "female",
        "age_range": "46-55",
        "location": "North Texas suburbs",
        "occupation": "Property manager, self-storage facility",
        "trailer_use": "small utility trailer for moving supplies and equipment around property",
        "technical_level": "low",
        "spec_language": "plain",
        "regional_slang": [],
        "vocabulary": [
            "not a trailer expert", "my maintenance guy recommended this",
            "seems to work fine", "the trailer is back in service",
            "easy enough for a non-mechanic",
        ],
        "writing_style": "non-technical, values simplicity, relies on others for installation",
    },
    {
        "id": "derek_heavy_hauler",
        "name": "Derek",
        "gender": "male",
        "age_range": "43-51",
        "location": "Oklahoma / Kansas",
        "occupation": "Owner-operator, hauls heavy equipment commercially",
        "trailer_use": "40-ft gooseneck, 24k GVWR, hauls excavators and skid steers",
        "technical_level": "expert",
        "spec_language": "codes",
        "regional_slang": ["dadgum", "she pulled fine", "ain't had no trouble", "run her loaded"],
        "vocabulary": [
            "20k GVWR", "24k tandem", "DOT compliant", "fifth wheel",
            "gooseneck", "hydraulic brakes", "12k axle", "8 lug",
            "running loaded at max GVWR", "inspected by my DOT officer",
        ],
        "writing_style": "commercial-grade language, references DOT, GVWR, load weight",
    },
    {
        "id": "kevin_first_timer",
        "name": "Kevin",
        "gender": "male",
        "age_range": "28-35",
        "location": "Midwest / Missouri",
        "occupation": "IT professional, building first trailer from plans",
        "trailer_use": "building a 16-ft utility trailer from scratch using online plans",
        "technical_level": "low-medium",
        "spec_language": "plain",
        "regional_slang": [],
        "vocabulary": [
            "first time building a trailer", "watched a lot of YouTube videos",
            "instructions were helpful", "wasn't sure at first",
            "called customer service and they helped me out",
            "came out better than expected", "proud of how it turned out",
        ],
        "writing_style": "enthusiastic, mentions learning curve, thankful for good parts",
    },
]


def get_random_persona() -> dict:
    return random.choice(PERSONAS)


def get_persona_by_id(persona_id: str) -> dict | None:
    return next((p for p in PERSONAS if p["id"] == persona_id), None)


def random_full_name(gender: str | None = None) -> tuple[str, str]:
    """Return (first_name, last_name). Gender: 'male', 'female', or None for random."""
    if gender is None:
        gender = random.choice(["male", "female"])
    if gender == "female":
        first = random.choice(FIRST_NAMES_FEMALE)
    else:
        first = random.choice(FIRST_NAMES_MALE)
    last = random.choice(LAST_NAMES)
    return first, last


def random_email_domain() -> str:
    return random.choice(EMAIL_DOMAINS)
