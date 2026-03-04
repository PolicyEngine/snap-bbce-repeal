"""Pipeline to generate all analysis data and save to CSV."""

import os

from .calculators.archetypes import calculate_archetype_sweeps
from .calculators.distributional import (
    calculate_distributional_impact,
)
from .calculators.national import calculate_national_impact
from .calculators.poverty import calculate_poverty_impact
from .calculators.state import calculate_state_impact
from .constants import ANALYSIS_YEAR


def generate_all_data(output_dir="public/data"):
    """Run all calculators and save CSVs to output_dir."""
    os.makedirs(output_dir, exist_ok=True)

    # Build shared Microsimulation instances once (expensive).
    from policyengine_us import Microsimulation

    from .reform import get_bbce_repeal_reform

    print("Loading baseline microsimulation...")
    baseline = Microsimulation()
    print("Loading reform microsimulation...")
    reformed = Microsimulation(reform=get_bbce_repeal_reform())

    year = ANALYSIS_YEAR

    print("Calculating national impact...")
    national = calculate_national_impact(baseline, reformed, year)
    national.to_csv(f"{output_dir}/national_summary.csv", index=False)
    print(f"  Saved {output_dir}/national_summary.csv")

    print("Calculating state impact...")
    state = calculate_state_impact(baseline, reformed, year)
    state.to_csv(f"{output_dir}/state_impact.csv", index=False)
    print(f"  Saved {output_dir}/state_impact.csv")

    print("Calculating distributional impact...")
    distributional = calculate_distributional_impact(
        baseline, reformed, year
    )
    distributional.to_csv(
        f"{output_dir}/distributional_impact.csv", index=False
    )
    print(f"  Saved {output_dir}/distributional_impact.csv")

    print("Calculating poverty impact...")
    poverty = calculate_poverty_impact(baseline, reformed, year)
    poverty.to_csv(f"{output_dir}/poverty_metrics.csv", index=False)
    print(f"  Saved {output_dir}/poverty_metrics.csv")

    print("Calculating archetype sweeps...")
    archetypes = calculate_archetype_sweeps()
    # Frontend expects: archetype, fpl_pct, baseline_snap, reform_snap
    archetypes[
        ["archetype", "fpl_pct", "baseline_snap", "reform_snap"]
    ].to_csv(f"{output_dir}/archetypes.csv", index=False)
    print(f"  Saved {output_dir}/archetypes.csv")

    print("All data generated.")
