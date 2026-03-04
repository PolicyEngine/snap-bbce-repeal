"""National-level SNAP BBCE repeal impact calculations."""

import microdf as mdf
import pandas as pd

from ..constants import ANALYSIS_YEAR


def calculate_national_impact(baseline=None, reformed=None, year=ANALYSIS_YEAR):
    """Calculate national aggregate impact of repealing BBCE.

    Args:
        baseline: Optional pre-built baseline Microsimulation.
        reformed: Optional pre-built reform Microsimulation.
        year: Analysis year.

    Returns a DataFrame with metrics:
    - baseline_recipients / reform_recipients / recipients_lost
    - baseline_spending / reform_spending / savings
    - avg_benefit_lost
    """
    if baseline is None or reformed is None:
        from policyengine_us import Microsimulation

        from ..reform import get_bbce_repeal_reform

        baseline = Microsimulation()
        reformed = Microsimulation(reform=get_bbce_repeal_reform())

    baseline_snap = baseline.calculate("snap", year)
    reform_snap_raw = reformed.calculate("snap", year)
    reform_snap = mdf.MicroSeries(
        reform_snap_raw.values, weights=baseline_snap.weights
    )

    baseline_spending = float(baseline_snap.sum())
    reform_spending = float(reform_snap.sum())

    baseline_recipients = float(
        baseline_snap[baseline_snap > 0].weights.sum()
    )
    reform_recipients = float(
        reform_snap[reform_snap > 0].weights.sum()
    )

    recipients_lost = baseline_recipients - reform_recipients
    savings = baseline_spending - reform_spending
    avg_benefit_lost = (
        savings / recipients_lost if recipients_lost > 0 else 0
    )

    rows = [
        {"metric": "baseline_recipients", "value": baseline_recipients},
        {"metric": "reform_recipients", "value": reform_recipients},
        {"metric": "recipients_lost", "value": recipients_lost},
        {"metric": "baseline_spending", "value": baseline_spending},
        {"metric": "reform_spending", "value": reform_spending},
        {"metric": "savings", "value": savings},
        {"metric": "avg_benefit_lost", "value": avg_benefit_lost},
    ]

    return pd.DataFrame(rows)
