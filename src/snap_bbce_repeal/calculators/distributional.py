"""Distributional impact by income decile."""

import microdf as mdf
import numpy as np
import pandas as pd
from policyengine_us import Microsimulation

from ..constants import ANALYSIS_YEAR
from ..reform import get_bbce_repeal_reform

DECILE_LABELS = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
]


def calculate_distributional_impact(year=ANALYSIS_YEAR):
    """Calculate impact on household net income by income decile.

    Returns a DataFrame with columns:
    - decile, absolute_change (avg per household), relative_change (%)
    """
    baseline = Microsimulation()
    reformed = Microsimulation(reform=get_bbce_repeal_reform())

    baseline_income = baseline.calculate("household_net_income", year)
    reform_income_raw = reformed.calculate("household_net_income", year)
    income_decile = baseline.calculate("household_income_decile", year)

    reform_income = mdf.MicroSeries(
        reform_income_raw.values, weights=baseline_income.weights
    )

    valid = np.array(income_decile) >= 1
    baseline_income = baseline_income[valid]
    reform_income = reform_income[valid]
    income_change = reform_income - baseline_income
    decile_values = income_decile[valid]

    results = []

    for decile in range(1, 11):
        mask = np.array(decile_values) == decile
        if not mask.any():
            continue

        change_sum = income_change[mask].sum()
        baseline_sum = baseline_income[mask].sum()
        relative = (change_sum / baseline_sum) * 100 if baseline_sum > 0 else 0
        avg_change = income_change[mask].mean()

        results.append(
            {
                "decile": DECILE_LABELS[decile - 1],
                "absolute_change": round(float(avg_change), 2),
                "relative_change": round(float(relative), 4),
            }
        )

    # Overall
    total_change = income_change.sum()
    total_baseline = baseline_income.sum()
    overall_relative = (
        (total_change / total_baseline) * 100 if total_baseline > 0 else 0
    )
    results.append(
        {
            "decile": "All",
            "absolute_change": round(float(income_change.mean()), 2),
            "relative_change": round(float(overall_relative), 4),
        }
    )

    return pd.DataFrame(results)
