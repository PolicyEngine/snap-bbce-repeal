"""External benchmarks for validating SNAP BBCE repeal estimates.

KEY FINDINGS FOR METHODOLOGY NOTE
==================================

1. PROGRAM SCALE (FY2023)
   - 42.2 million people in 22.3 million households receive SNAP monthly
   - $107.1 billion in annual benefit spending ($113.2B total program cost)
   - Average monthly benefit: ~$211.65/person, ~$400/household

2. BBCE REACH
   - USDA (FY2022): 5.6M participants (~14% of total) eligible
     ONLY through BBCE; would not qualify under standard rules
   - CBPP (FY2023): ~4 million people have household income above 130% FPL and
     qualify only via BBCE income-limit expansion (includes ~1.8M children)
   - Additional ~1.5-2M would lose benefits from asset test
   - Total estimated loss from full BBCE repeal: ~5.6-6 million people
   - 44 state SNAP agencies + DC, Guam, USVI (46 total) currently use BBCE

3. SAVINGS ESTIMATES (wide range)
   - USDA 2019 regulatory analysis: ~$3B/year savings
   - Updated for 2025 benefit levels (+50% since 2019): ~$4-5B/year implied
   - House reconciliation proposal (2025): $10B over 10 years (narrow scope)
   - AEI estimate: ~$45B over 10 years (if benefit levels fully reflected)
   - High-end: up to $112B/10yr (broader behavioral assumptions)
   - CBO August 2025 (all SNAP cuts in P.L. 119-21): 2.7M lose benefits total
     Note: P.L. 119-21 did NOT directly eliminate BBCE; the $10-45B range
     applies to a standalone full BBCE repeal

4. IMPLICATIONS FOR OUR ESTIMATES
   - Baseline recipients ~42.2M should match closely (within 5% for 2025)
   - Baseline spending ~$107B should match within 10% for 2025
   - BBCE losers: expect 3-6 million people in our estimate
   - Annual benefit savings: expect $3-5B range (central est.)
   - Our analysis year is 2026; adjust upward slightly for benefit indexing
"""

# ---------------------------------------------------------------------------
# External benchmarks
# ---------------------------------------------------------------------------

EXTERNAL_BENCHMARKS = {
    # ------------------------------------------------------------------
    # USDA FNS: national SNAP participation, FY2023
    # Source: USDA FNS Characteristics of SNAP Households: FY2023
    #         + FNS SNAP Data Tables (administrative records)
    # ------------------------------------------------------------------
    "usda_total_recipients_fy2023": {
        "value": 42_200_000,  # people (average monthly)
        "unit": "people",
        "source": (
            "USDA FNS, Characteristics of SNAP Households: Fiscal Year 2023 "
            "(May 2025). Administrative data, average monthly count."
        ),
        "url": "https://www.fns.usda.gov/research/snap/characteristics-fy23",
        "notes": (
            "42.2M people in 22.3M households. Emergency allotments ended "
            "Feb/Mar 2023; FY2023 covers Oct 2022–Sep 2023."
        ),
        "tolerance_pct": 10,
    },
    "usda_total_households_fy2023": {
        "value": 22_300_000,  # households (average monthly)
        "unit": "households",
        "source": (
            "USDA FNS, Characteristics of SNAP Households: Fiscal Year 2023 "
            "(May 2025). Administrative data."
        ),
        "url": "https://www.fns.usda.gov/research/snap/characteristics-fy23",
        "notes": "Average monthly household count, FY2023.",
        "tolerance_pct": 10,
    },
    "usda_total_benefit_spending_fy2023": {
        "value": 107_100_000_000,  # dollars, annual
        "unit": "dollars",
        "source": (
            "USDA FNS, SNAP Data Tables and Characteristics of SNAP "
            "Households: Fiscal Year 2023 (May 2025). Total program cost was "
            "$113.2B; $107.1B was direct benefits."
        ),
        "url": "https://www.fns.usda.gov/pd/supplemental-nutrition-assistance-program-snap",
        "notes": "Annual total. Non-benefit admin costs ≈ $6.1B.",
        "tolerance_pct": 15,
    },
    "usda_avg_monthly_benefit_per_person_fy2023": {
        "value": 211.65,  # dollars per person per month
        "unit": "dollars_per_person_per_month",
        "source": (
            "USDA FNS administrative data FY2023. Derived: $107.1B / "
            "(42.2M × 12 months) ≈ $211.65."
        ),
        "url": "https://www.fns.usda.gov/pd/supplemental-nutrition-assistance-program-snap",
        "notes": (
            "Annual average. Characteristics report shows $177/person based "
            "on QC sample data; administrative total yields $211.65. "
            "Discrepancy may reflect sampling vs. census coverage."
        ),
        "tolerance_pct": 15,
    },
    # ------------------------------------------------------------------
    # BBCE reach: households/people eligible only through BBCE
    # ------------------------------------------------------------------
    "usda_bbce_only_recipients_fy2022": {
        "value": 5_600_000,  # people eligible only through BBCE
        "unit": "people",
        "source": (
            "USDA FNS estimate for FY2022, as reported by EPIC for America "
            "and CBPP. 5.6M individuals were eligible via BBCE and would not "
            "have qualified under standard federal income/asset rules. "
            "Represents ~14% of total FY2022 SNAP enrollment."
        ),
        "url": "https://www.cbpp.org/research/food-assistance/snaps-broad-based-categorical-eligibility-supports-working-families-and-0",
        "notes": (
            "Includes both income-limit and asset-test components. "
            "Income-limit-only estimate for FY2023 is ~4M (CBPP)."
        ),
        "tolerance_pct": 25,
    },
    "cbpp_bbce_income_limit_recipients_fy2023": {
        # People above 130% FPL eligible via BBCE income expansion
        "value": 4_000_000,
        "unit": "people",
        "source": (
            "CBPP analysis, 2025. ~4M people participated in SNAP in 2023 "
            "whose household income exceeded the standard 130% FPL gross "
            "income limit and who qualify only via BBCE income expansion. "
            "Includes ~1.8M children."
        ),
        "url": "https://www.cbpp.org/research/food-assistance/snaps-broad-based-categorical-eligibility-supports-working-families-and-0",
        "notes": (
            "Income-limit component only; does not include asset-test-only "
            "BBCE households (~1.5-2M additional). Full repeal estimate: ~6M."
        ),
        "tolerance_pct": 30,
    },
    # ------------------------------------------------------------------
    # BBCE repeal savings
    # ------------------------------------------------------------------
    "usda_bbce_repeal_annual_savings_2019_dollars": {
        "value": 3_000_000_000,  # $3B per year (2019 regulatory estimate)
        "unit": "dollars_per_year",
        "source": (
            "USDA regulatory impact analysis, 2019 proposed rule. Estimated "
            "~$3B/year in savings from eliminating BBCE. Benefits have since "
            "risen ~50%, implying ~$4.5B/year in 2025 dollars."
        ),
        "url": "https://www.usda.gov/sites/default/files/documents/BBCE_Fact_Sheet_(FINAL)_72219-PR.pdf",
        "notes": (
            "2019 dollars; based on FY2017 SNAP data. Updated estimate for "
            "2025: ~$4-5B/year. 10-year estimates range from $10B (narrow) "
            "to $45B (AEI) to $112B (broadest assumptions)."
        ),
        "tolerance_pct": 50,  # wide range across sources/years
    },
    # ------------------------------------------------------------------
    # Number of BBCE states
    # ------------------------------------------------------------------
    "usda_bbce_state_count_2024": {
        "value": 46,  # 44 state agencies + DC + Guam + USVI
        "unit": "states_and_territories",
        "source": (
            "USDA FNS, Broad-Based Categorical Eligibility page (accessed "
            "2025). 44 state SNAP agencies plus DC, Guam, and U.S. Virgin "
            "Islands use BBCE."
        ),
        "url": "https://www.fns.usda.gov/snap/broad-based-categorical-eligibility",
        "notes": (
            "Income limit varies: 200% FPL (26 jurisdictions), 185% (4), "
            "165% (5), 160% (1), 150% (1), 130% (7 — same as federal floor, "
            "so only asset test differs). Note: the project's constants.py "
            "BBCE_STATES list shows 44 states + DC; cross-check against "
            "USDA table is recommended."
        ),
        "tolerance_pct": 5,
    },
    # ------------------------------------------------------------------
    # BBCE benefit share (cost attribution)
    # ------------------------------------------------------------------
    "usda_bbce_share_of_benefit_costs_2019": {
        "value": 0.04,  # ~4% of program costs attributable to BBCE overall
        "unit": "fraction",
        "source": (
            "USDA 2019 proposed rule regulatory impact analysis. BBCE "
            "accounted for ~4% of total SNAP program costs. By 2023, the "
            "income-limit component alone was ~3.2% of benefit costs (CBPP)."
        ),
        "url": "https://www.cbpp.org/research/food-assistance/snaps-broad-based-categorical-eligibility-supports-working-families-and-0",
        "notes": (
            "Useful cross-check: 4% × $107B = ~$4.3B, consistent with "
            "$3-5B/year savings estimate range."
        ),
        "tolerance_pct": 50,
    },
}


# ---------------------------------------------------------------------------
# Validation function
# ---------------------------------------------------------------------------


def validate_results(our_estimates: dict) -> list[dict]:
    """Compare our simulation estimates to external benchmarks.

    Args:
        our_estimates: dict mapping benchmark keys to our computed values.
            Keys should match keys in EXTERNAL_BENCHMARKS.

    Returns:
        List of dicts with comparison results for each matched benchmark.
    """
    results = []
    for key, benchmark in EXTERNAL_BENCHMARKS.items():
        if key not in our_estimates:
            continue
        our_val = our_estimates[key]
        ext_val = benchmark["value"]
        diff_pct = abs(our_val - ext_val) / ext_val * 100
        results.append(
            {
                "benchmark": key,
                "external": ext_val,
                "ours": our_val,
                "diff_pct": round(diff_pct, 1),
                "within_tolerance": diff_pct <= benchmark["tolerance_pct"],
                "tolerance_pct": benchmark["tolerance_pct"],
                "unit": benchmark["unit"],
                "source": benchmark["source"],
            }
        )
    return results


def print_validation_report(our_estimates: dict) -> None:
    """Print a human-readable validation report."""
    results = validate_results(our_estimates)
    if not results:
        print("No matching benchmarks found in our_estimates.")
        return

    print("\n" + "=" * 70)
    print("VALIDATION REPORT: Our Estimates vs. External Benchmarks")
    print("=" * 70)
    for r in results:
        status = "PASS" if r["within_tolerance"] else "FAIL"
        print(
            f"\n[{status}] {r['benchmark']}"
            f"\n  External : {r['external']:>20,.2f} ({r['unit']})"
            f"\n  Ours     : {r['ours']:>20,.2f}"
            f"\n  Diff     : {r['diff_pct']:.1f}% "
            f"(tolerance: ±{r['tolerance_pct']}%)"
            f"\n  Source   : {r['source']}"
        )
    passed = sum(1 for r in results if r["within_tolerance"])
    print(f"\n{passed}/{len(results)} benchmarks within tolerance.\n")
