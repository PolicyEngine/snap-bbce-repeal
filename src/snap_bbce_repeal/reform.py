"""Reform definition: repeal SNAP BBCE.

BBCE (Broad-Based Categorical Eligibility) allows states to override
federal SNAP income/asset limits by deeming households categorically
eligible through TANF-funded non-cash benefits.

In PolicyEngine-US, BBCE eligibility flows through:
  is_tanf_non_cash_eligible -> meets_snap_categorical_eligibility -> snap

We repeal BBCE by overriding is_tanf_non_cash_eligible to always return
False. This preserves:
  - SSI categorical eligibility (separate program in the categorical
    eligibility parameter list)
  - Elderly/disabled gross income exemption (coded independently in
    meets_snap_gross_income_test)

We use update_variable (not parameter changes) to bypass the
exhaustive_parameter_dependencies caching on the snap variable.
"""

from policyengine_us.model_api import *  # noqa: F403


class is_tanf_non_cash_eligible(Variable):  # noqa: F405
    value_type = bool
    entity = SPMUnit  # noqa: F405
    definition_period = YEAR  # noqa: F405
    label = "TANF non-cash benefit eligibility (BBCE repealed)"

    def formula(spm_unit, period, parameters):
        # Always False: BBCE is repealed, no one qualifies through
        # TANF non-cash benefits.
        import numpy as np

        return np.zeros(spm_unit.count, dtype=bool)


def get_bbce_repeal_reform():
    """Return a Reform that repeals BBCE."""
    from policyengine_core.reforms import Reform

    class repeal_bbce(Reform):
        def apply(self):
            self.update_variable(is_tanf_non_cash_eligible)

    return repeal_bbce
