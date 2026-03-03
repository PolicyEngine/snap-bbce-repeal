"""Archetype household income sweeps for SNAP BBCE repeal.

For each archetype and FPL fraction, creates a single-household
Simulation to show how SNAP benefits change under the reform.
"""

import pandas as pd
from policyengine_us import Simulation

from ..constants import (
    ANALYSIS_YEAR,
    ARCHETYPES,
    INCOME_SWEEP_FPL_POINTS,
)
from ..reform import get_bbce_repeal_reform

# 2026 Federal Poverty Guidelines (48 contiguous states + DC).
# Base amount for 1 person + increment per additional person.
# Source: HHS poverty guidelines, projected for 2026.
_FPL_BASE = 16_020
_FPL_INCREMENT = 5_820


def _fpl_for_size(n_people):
    """Return annual FPL for a household of n_people."""
    return _FPL_BASE + _FPL_INCREMENT * max(n_people - 1, 0)


def _build_situation(ages, state, employment_income, year):
    """Build a PolicyEngine situation dict for a household."""
    members = {
        f"person_{i}": {"age": {str(year): a}} for i, a in enumerate(ages)
    }
    # Assign all employment income to first adult
    members["person_0"]["employment_income"] = {str(year): employment_income}

    member_names = list(members.keys())

    # Build marital units: pair adults, then singles for children
    adults = [k for k, v in members.items() if v["age"][str(year)] >= 18]
    children = [k for k, v in members.items() if v["age"][str(year)] < 18]

    marital_units = {}
    mu_idx = 0
    i = 0
    while i < len(adults):
        if i + 1 < len(adults):
            marital_units[f"marital_unit_{mu_idx}"] = {
                "members": [adults[i], adults[i + 1]]
            }
            i += 2
        else:
            marital_units[f"marital_unit_{mu_idx}"] = {"members": [adults[i]]}
            i += 1
        mu_idx += 1
    for child in children:
        marital_units[f"marital_unit_{mu_idx}"] = {"members": [child]}
        mu_idx += 1

    return {
        "people": members,
        "spm_units": {"spm_unit": {"members": member_names}},
        "tax_units": {"tax_unit": {"members": member_names}},
        "families": {"family": {"members": member_names}},
        "households": {
            "household": {
                "members": member_names,
                "state_name": {str(year): state},
            }
        },
        "marital_units": marital_units,
    }


def calculate_archetype_sweeps(year=ANALYSIS_YEAR):
    """Run income sweeps for all archetypes.

    Returns a DataFrame with columns:
    - archetype, state, household_size, fpl_pct, employment_income
    - baseline_snap, reform_snap, snap_change
    """
    reform = get_bbce_repeal_reform()
    rows = []

    for archetype in ARCHETYPES:
        ages = archetype["ages"]
        state = archetype["state"]
        name = archetype["name"]
        hh_size = len(ages)
        fpl_amount = _fpl_for_size(hh_size)

        for fpl_pct in INCOME_SWEEP_FPL_POINTS:
            income = fpl_amount * fpl_pct / 100

            situation = _build_situation(ages, state, income, year)

            sim_baseline = Simulation(situation=situation)
            sim_reform = Simulation(situation=situation, reform=reform)

            b_snap = float(sim_baseline.calculate("snap", year)[0])
            r_snap = float(sim_reform.calculate("snap", year)[0])

            rows.append(
                {
                    "archetype": name,
                    "state": state,
                    "household_size": hh_size,
                    "fpl_pct": fpl_pct,
                    "employment_income": income,
                    "baseline_snap": b_snap,
                    "reform_snap": r_snap,
                    "snap_change": r_snap - b_snap,
                }
            )

    return pd.DataFrame(rows)
