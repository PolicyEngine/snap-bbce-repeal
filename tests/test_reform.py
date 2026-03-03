"""Gating tests: verify BBCE repeal reform propagates correctly.

These tests confirm that overriding is_tanf_non_cash_eligible to False
actually changes SNAP eligibility for BBCE-eligible households while
preserving SSI categorical eligibility and elderly/disabled exemptions.
"""

import pytest

pytestmark = pytest.mark.microsim


def _snap_eligible(state, ages, employment_income, reform=None):
    """Check if a household is SNAP-eligible.

    Args:
        state: Two-letter state code.
        ages: List of ages for household members.
        employment_income: Annual employment income for first adult.
        reform: Optional Reform class to apply.

    Returns:
        Tuple of (snap_amount, is_eligible).
    """
    from policyengine_us import Simulation

    n = len(ages)
    members = {f"person_{i}": {"age": {"2026": a}} for i, a in enumerate(ages)}
    members["person_0"]["employment_income"] = {"2026": employment_income}

    situation = {
        "people": members,
        "spm_units": {
            "spm_unit": {"members": list(members.keys())}
        },
        "tax_units": {
            "tax_unit": {
                "members": list(members.keys()),
            }
        },
        "families": {
            "family": {"members": list(members.keys())}
        },
        "households": {
            "household": {
                "members": list(members.keys()),
                "state_name": {"2026": state},
            }
        },
        "marital_units": {},
    }

    # Build marital units: pairs of adults, then singles
    adults = [k for k, v in members.items() if v["age"]["2026"] >= 18]
    children = [k for k, v in members.items() if v["age"]["2026"] < 18]
    mu_idx = 0
    i = 0
    while i < len(adults):
        if i + 1 < len(adults):
            situation["marital_units"][f"marital_unit_{mu_idx}"] = {
                "members": [adults[i], adults[i + 1]]
            }
            i += 2
        else:
            situation["marital_units"][f"marital_unit_{mu_idx}"] = {
                "members": [adults[i]]
            }
            i += 1
        mu_idx += 1
    for child in children:
        situation["marital_units"][f"marital_unit_{mu_idx}"] = {
            "members": [child]
        }
        mu_idx += 1

    kwargs = {"situation": situation}
    if reform is not None:
        kwargs["reform"] = reform

    sim = Simulation(**kwargs)
    snap = float(sim.calculate("snap", 2026)[0])
    return snap, snap > 0


class TestBBCERepealPropagation:
    """Test that the reform actually changes SNAP outcomes."""

    def test_bbce_state_household_loses_eligibility(self):
        """A family of 4 in TX at ~$45k (~140% FPL) should be
        SNAP-eligible under baseline (TX BBCE raises gross limit to
        200% FPL and waives net income test) but ineligible under
        reform (falls back to 130% FPL federal gross limit)."""
        from snap_bbce_repeal.reform import get_bbce_repeal_reform

        # Family of 4, ~$45k income (~140% FPL for 4-person HH).
        # TX has BBCE with 200% FPL gross, no net income test.
        income = 45_000

        snap_baseline, baseline_eligible = _snap_eligible(
            "TX", [35, 33, 8, 5], income
        )
        snap_reform, reform_eligible = _snap_eligible(
            "TX", [35, 33, 8, 5], income,
            reform=get_bbce_repeal_reform(),
        )

        assert baseline_eligible, (
            "Baseline: TX family at ~140% FPL should be SNAP-eligible "
            f"via BBCE (got ${snap_baseline:.2f})"
        )
        assert not reform_eligible, (
            "Reform: TX family at ~140% FPL should lose SNAP "
            f"eligibility when BBCE is repealed (got ${snap_reform:.2f})"
        )

    def test_non_bbce_state_unchanged(self):
        """A household in AR (non-BBCE state) should have the same
        SNAP outcome under baseline and reform."""
        from snap_bbce_repeal.reform import get_bbce_repeal_reform

        # Low income, should be eligible regardless
        income = 10_000

        snap_baseline, _ = _snap_eligible("AR", [30], income)
        snap_reform, _ = _snap_eligible(
            "AR", [30], income, reform=get_bbce_repeal_reform()
        )

        assert abs(snap_baseline - snap_reform) < 1.0, (
            f"AR (non-BBCE): SNAP should be unchanged. "
            f"Baseline={snap_baseline:.2f}, Reform={snap_reform:.2f}"
        )

    def test_ssi_categorical_eligibility_preserved(self):
        """An SSI-eligible household should retain SNAP categorical
        eligibility even after BBCE repeal."""
        from policyengine_us import Simulation
        from snap_bbce_repeal.reform import get_bbce_repeal_reform

        situation = {
            "people": {
                "person": {
                    "age": {"2026": 45},
                    "is_ssi_disabled": {"2026": True},
                    "ssi": {"2026": 10_000},
                }
            },
            "spm_units": {"spm_unit": {"members": ["person"]}},
            "tax_units": {"tax_unit": {"members": ["person"]}},
            "families": {"family": {"members": ["person"]}},
            "households": {
                "household": {
                    "members": ["person"],
                    "state_name": {"2026": "CA"},
                }
            },
            "marital_units": {
                "marital_unit": {"members": ["person"]}
            },
        }

        sim = Simulation(
            situation=situation,
            reform=get_bbce_repeal_reform(),
        )
        cat_elig = bool(
            sim.calculate("meets_snap_categorical_eligibility", 2026)[0]
        )
        assert cat_elig, (
            "SSI recipient should retain categorical eligibility "
            "after BBCE repeal"
        )

    def test_elderly_gross_income_exemption_preserved(self):
        """An elderly household above 130% FPL should still be exempt
        from the gross income test (independent of BBCE)."""
        from policyengine_us import Simulation
        from snap_bbce_repeal.reform import get_bbce_repeal_reform

        situation = {
            "people": {
                "person": {
                    "age": {"2026": 70},
                    "employment_income": {"2026": 25_000},
                }
            },
            "spm_units": {"spm_unit": {"members": ["person"]}},
            "tax_units": {"tax_unit": {"members": ["person"]}},
            "families": {"family": {"members": ["person"]}},
            "households": {
                "household": {
                    "members": ["person"],
                    "state_name": {"2026": "CA"},
                }
            },
            "marital_units": {
                "marital_unit": {"members": ["person"]}
            },
        }

        sim = Simulation(
            situation=situation,
            reform=get_bbce_repeal_reform(),
        )
        gross_test = bool(
            sim.calculate("meets_snap_gross_income_test", 2026)[0]
        )
        assert gross_test, (
            "Elderly household should be exempt from gross income test "
            "regardless of BBCE"
        )
