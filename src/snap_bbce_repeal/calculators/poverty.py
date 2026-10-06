"""Poverty impact calculations for SNAP BBCE repeal."""

import microdf as mdf
import numpy as np
import pandas as pd

from ..constants import ANALYSIS_YEAR


def _reported_poverty_series(simulation, year, *, deep=False):
    """Map reported SPM poverty from SPM units to persons."""

    reported_income = np.array(
        simulation.calculate("spm_unit_net_income_reported", year, map_to="spm_unit")
    )
    threshold = np.array(
        simulation.calculate("spm_unit_spm_threshold", year, map_to="spm_unit")
    )
    cutoff = threshold / 2 if deep else threshold
    reported_poor = (reported_income < cutoff).astype(int)
    return simulation.map_result(reported_poor, "spm_unit", "person")


def calculate_poverty_impact(baseline=None, reformed=None, year=ANALYSIS_YEAR):
    """Calculate SPM poverty rate changes from BBCE repeal.

    Args:
        baseline: Optional pre-built baseline Microsimulation.
        reformed: Optional pre-built reform Microsimulation.
        year: Analysis year.

    Displays reported SPM baseline rates from the microdata, then applies the
    model-estimated repeal delta to those baselines. This keeps headline levels
    benchmarked to the dataset while still using the model for policy impacts.

    Returns a DataFrame with columns: metric, baseline, reform, change
    """
    if baseline is None or reformed is None:
        from policyengine_us import Microsimulation

        from ..reform import get_bbce_repeal_reform

        baseline = Microsimulation()
        reformed = Microsimulation(reform=get_bbce_repeal_reform())

    is_child = np.array(baseline.calculate("is_child", year, map_to="person"))
    reported_poverty = _reported_poverty_series(baseline, year, deep=False)
    reported_deep_poverty = _reported_poverty_series(baseline, year, deep=True)

    results = []

    def _add_poverty_metric(
        name, reported_vals, model_variable, child_filter=None
    ):
        b_vals = baseline.calculate(model_variable, year, map_to="person")
        r_vals_raw = reformed.calculate(model_variable, year, map_to="person")
        r_vals = mdf.MicroSeries(
            getattr(r_vals_raw, "values", r_vals_raw), weights=b_vals.weights
        )
        reported_series = mdf.MicroSeries(
            getattr(reported_vals, "values", reported_vals), weights=b_vals.weights
        )

        if child_filter is not None:
            benchmark_rate = float(reported_series[child_filter].mean()) * 100
            b_rate = float(b_vals[child_filter].mean()) * 100
            r_rate = float(r_vals[child_filter].mean()) * 100
        else:
            benchmark_rate = float(reported_series.mean()) * 100
            b_rate = float(b_vals.mean()) * 100
            r_rate = float(r_vals.mean()) * 100

        change = r_rate - b_rate

        results.append(
            {
                "metric": name,
                "baseline": round(benchmark_rate, 4),
                "reform": round(benchmark_rate + change, 4),
                "change": round(change, 4),
                "reported_baseline": round(benchmark_rate, 4),
                "modeled_baseline": round(b_rate, 4),
                "modeled_reform": round(r_rate, 4),
            }
        )

    _add_poverty_metric(
        "spm_poverty_rate",
        reported_poverty,
        "spm_unit_is_in_spm_poverty",
    )
    _add_poverty_metric(
        "spm_child_poverty_rate",
        reported_poverty,
        "spm_unit_is_in_spm_poverty",
        child_filter=is_child,
    )
    _add_poverty_metric(
        "spm_deep_poverty_rate",
        reported_deep_poverty,
        "spm_unit_is_in_deep_spm_poverty",
    )
    _add_poverty_metric(
        "spm_child_deep_poverty_rate",
        reported_deep_poverty,
        "spm_unit_is_in_deep_spm_poverty",
        child_filter=is_child,
    )

    return pd.DataFrame(results)
