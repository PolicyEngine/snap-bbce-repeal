"""State-level SNAP BBCE repeal impact calculations."""

import microdf as mdf
import numpy as np
import pandas as pd

from ..constants import ANALYSIS_YEAR, BBCE_STATES


def calculate_state_impact(baseline=None, reformed=None, year=ANALYSIS_YEAR):
    """Calculate per-state impact of repealing BBCE.

    Args:
        baseline: Optional pre-built baseline Microsimulation.
        reformed: Optional pre-built reform Microsimulation.
        year: Analysis year.

    Returns a DataFrame with columns:
    - state, is_bbce
    - baseline_recipients, reform_recipients, recipients_lost
    - baseline_spending, reform_spending, savings

    Aggregates snap at the household level to match state_name
    (which is a household-level variable).
    """
    if baseline is None or reformed is None:
        from policyengine_us import Microsimulation

        from ..reform import get_bbce_repeal_reform

        baseline = Microsimulation()
        reformed = Microsimulation(reform=get_bbce_repeal_reform())

    # Map snap to household level (same entity as state_name)
    baseline_snap = baseline.calculate(
        "snap", year, map_to="household"
    )
    reform_snap_raw = reformed.calculate(
        "snap", year, map_to="household"
    )
    reform_snap = mdf.MicroSeries(
        reform_snap_raw.values, weights=baseline_snap.weights
    )

    state_codes = np.array(baseline.calculate("state_name", year))

    weights = np.array(baseline_snap.weights)
    baseline_vals = np.array(baseline_snap)
    reform_vals = np.array(reform_snap)

    unique_states = np.unique(state_codes)
    rows = []

    for state in unique_states:
        mask = state_codes == state
        w = weights[mask]
        b_vals = baseline_vals[mask]
        r_vals = reform_vals[mask]

        b_spending = float((b_vals * w).sum())
        r_spending = float((r_vals * w).sum())

        b_recipients = float(w[b_vals > 0].sum())
        r_recipients = float(w[r_vals > 0].sum())

        state_str = str(state)

        rows.append(
            {
                "state": state_str,
                "is_bbce": state_str in BBCE_STATES,
                "baseline_recipients": b_recipients,
                "reform_recipients": r_recipients,
                "recipients_lost": b_recipients - r_recipients,
                "baseline_spending": b_spending,
                "reform_spending": r_spending,
                "savings": b_spending - r_spending,
            }
        )

    df = pd.DataFrame(rows)
    df = df.sort_values("savings", ascending=False).reset_index(
        drop=True
    )
    return df
