"""Poverty impact calculations for SNAP BBCE repeal."""

import microdf as mdf
import numpy as np
import pandas as pd

from ..constants import ANALYSIS_YEAR


def calculate_poverty_impact(
    baseline=None, reformed=None, year=ANALYSIS_YEAR
):
    """Calculate SPM poverty rate changes from BBCE repeal.

    Args:
        baseline: Optional pre-built baseline Microsimulation.
        reformed: Optional pre-built reform Microsimulation.
        year: Analysis year.

    Computes baseline vs reform rates for:
    - Overall SPM poverty
    - Child SPM poverty
    - Overall SPM deep poverty
    - Child SPM deep poverty

    Returns a DataFrame with columns: metric, baseline, reform, change
    """
    if baseline is None or reformed is None:
        from policyengine_us import Microsimulation

        from ..reform import get_bbce_repeal_reform

        baseline = Microsimulation()
        reformed = Microsimulation(reform=get_bbce_repeal_reform())

    is_child = np.array(
        baseline.calculate("is_child", year, map_to="person")
    )

    results = []

    def _add_poverty_metric(name, variable, child_filter=None):
        b_vals = baseline.calculate(
            variable, year, map_to="person"
        )
        r_vals_raw = reformed.calculate(
            variable, year, map_to="person"
        )
        r_vals = mdf.MicroSeries(
            r_vals_raw.values, weights=b_vals.weights
        )

        if child_filter is not None:
            b_rate = float(b_vals[child_filter].mean()) * 100
            r_rate = float(r_vals[child_filter].mean()) * 100
        else:
            b_rate = float(b_vals.mean()) * 100
            r_rate = float(r_vals.mean()) * 100

        results.append(
            {
                "metric": name,
                "baseline": round(b_rate, 4),
                "reform": round(r_rate, 4),
                "change": round(r_rate - b_rate, 4),
            }
        )

    _add_poverty_metric(
        "spm_poverty_rate", "spm_unit_is_in_spm_poverty"
    )
    _add_poverty_metric(
        "spm_child_poverty_rate",
        "spm_unit_is_in_spm_poverty",
        child_filter=is_child,
    )
    _add_poverty_metric(
        "spm_deep_poverty_rate",
        "spm_unit_is_in_deep_spm_poverty",
    )
    _add_poverty_metric(
        "spm_child_deep_poverty_rate",
        "spm_unit_is_in_deep_spm_poverty",
        child_filter=is_child,
    )

    return pd.DataFrame(results)
