"""State-level SNAP BBCE repeal impact calculations."""

import microdf as mdf
import numpy as np
import pandas as pd

from ..constants import ALL_STATES, ANALYSIS_YEAR, BBCE_STATES


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

    Counts recipients at the person level but sums spending at the
    household level, so the recipient counts match the dashboard's
    "people receiving SNAP" framing while spending remains unduplicated.
    """
    if baseline is None or reformed is None:
        from policyengine_us import Microsimulation

        from ..reform import get_bbce_repeal_reform

        baseline = Microsimulation()
        reformed = Microsimulation(reform=get_bbce_repeal_reform())

    baseline_snap_people = baseline.calculate("snap", year, map_to="person")
    reform_snap_people_raw = reformed.calculate("snap", year, map_to="person")
    reform_snap_people = mdf.MicroSeries(
        reform_snap_people_raw.values, weights=baseline_snap_people.weights
    )
    person_state_codes = np.array(
        [
            str(state)
            for state in baseline.calculate(
                "state_name", year, map_to="person"
            )
        ]
    )

    # Map snap to household level for spending totals.
    baseline_snap_households = baseline.calculate(
        "snap", year, map_to="household"
    )
    reform_snap_households_raw = reformed.calculate(
        "snap", year, map_to="household"
    )
    reform_snap_households = mdf.MicroSeries(
        reform_snap_households_raw.values,
        weights=baseline_snap_households.weights,
    )
    household_state_codes = np.array(
        [str(state) for state in baseline.calculate("state_name", year)]
    )

    person_weights = np.array(baseline_snap_people.weights)
    baseline_person_vals = np.array(baseline_snap_people)
    reform_person_vals = np.array(reform_snap_people)

    household_weights = np.array(baseline_snap_households.weights)
    baseline_household_vals = np.array(baseline_snap_households)
    reform_household_vals = np.array(reform_snap_households)

    rows = []

    for state in ALL_STATES:
        person_mask = person_state_codes == state
        household_mask = household_state_codes == state

        b_spending = float(
            (
                baseline_household_vals[household_mask]
                * household_weights[household_mask]
            ).sum()
        )
        r_spending = float(
            (
                reform_household_vals[household_mask]
                * household_weights[household_mask]
            ).sum()
        )

        b_recipients = float(
            person_weights[person_mask][
                baseline_person_vals[person_mask] > 0
            ].sum()
        )
        r_recipients = float(
            person_weights[person_mask][
                reform_person_vals[person_mask] > 0
            ].sum()
        )

        rows.append(
            {
                "state": state,
                "is_bbce": state in BBCE_STATES,
                "baseline_recipients": b_recipients,
                "reform_recipients": r_recipients,
                "recipients_lost": b_recipients - r_recipients,
                "baseline_spending": b_spending,
                "reform_spending": r_spending,
                "savings": b_spending - r_spending,
            }
        )

    df = pd.DataFrame(rows)
    df = df.sort_values("savings", ascending=False).reset_index(drop=True)
    return df
