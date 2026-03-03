"""Constants for SNAP BBCE repeal analysis."""

ANALYSIS_YEAR = 2026

# States that currently use BBCE (as of 2024).
# Source: USDA FNS SNAP Policy Database.
BBCE_STATES = [
    "AL",
    "AZ",
    "CA",
    "CO",
    "CT",
    "DC",
    "DE",
    "FL",
    "GA",
    "HI",
    "IA",
    "ID",
    "IL",
    "IN",
    "KY",
    "LA",
    "MA",
    "MD",
    "ME",
    "MI",
    "MN",
    "MO",
    "MS",
    "MT",
    "NC",
    "ND",
    "NE",
    "NH",
    "NJ",
    "NM",
    "NV",
    "NY",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TX",
    "UT",
    "VT",
    "WA",
    "WI",
]

# States that do NOT use BBCE.
NON_BBCE_STATES = [
    "AK",
    "AR",
    "KS",
    "TN",
    "VA",
    "WV",
    "WY",
]

ALL_STATES = sorted(BBCE_STATES + NON_BBCE_STATES)

# Household archetypes for income sweep analysis.
ARCHETYPES = [
    {
        "name": "Single adult (CA)",
        "state": "CA",
        "ages": [30],
        "description": "Single adult, no dependents, California",
    },
    {
        "name": "Family of four (TX)",
        "state": "TX",
        "ages": [35, 33, 8, 5],
        "description": "Two parents, two children, Texas",
    },
    {
        "name": "Elderly couple (FL)",
        "state": "FL",
        "ages": [68, 66],
        "description": "Retired couple, both over 60, Florida",
    },
    {
        "name": "Single parent (NY)",
        "state": "NY",
        "ages": [28, 4],
        "description": "Single parent, one child, New York",
    },
]

# Income sweep: 0% to 300% FPL in 5% increments.
INCOME_SWEEP_FPL_POINTS = list(range(0, 305, 5))
