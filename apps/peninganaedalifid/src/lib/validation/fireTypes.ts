/**
 * Validation functions for FIRE Type Explorer
 *
 * Validates user financial inputs and FIRE assumptions before calculations.
 * All error messages are in Icelandic for user-facing display.
 */

import {
  UserFinancialInputs,
  FIREAssumptions,
  FIREInputValidationResult,
  FIRE_INPUT_LIMITS,
} from '@/types/fireTypes';

/**
 * Validate user financial inputs
 *
 * Checks all user inputs against validation rules and returns
 * detailed error/warning messages in Icelandic.
 *
 * @param inputs - User financial inputs to validate
 * @returns Validation result with isValid flag and error/warning messages
 */
export function validateUserInputs(
  inputs: Partial<UserFinancialInputs>
): FIREInputValidationResult {
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];

  // Validate current age
  if (inputs.currentAge !== undefined) {
    if (inputs.currentAge < FIRE_INPUT_LIMITS.age.min) {
      errors.push({
        field: 'currentAge',
        message: `Aldur verður að vera að minnsta kosti ${FIRE_INPUT_LIMITS.age.min} ára`,
      });
    } else if (inputs.currentAge > FIRE_INPUT_LIMITS.age.max) {
      errors.push({
        field: 'currentAge',
        message: `Aldur verður að vera í mesta lagi ${FIRE_INPUT_LIMITS.age.max} ára`,
      });
    }

    if (inputs.currentAge > 60) {
      warnings.push({
        field: 'currentAge',
        message: 'Þú ert að byrja seint - íhugaðu að tala við fjármálaráðgjafa',
      });
    }
  }

  // Validate target retirement age
  if (inputs.targetRetirementAge !== undefined && inputs.targetRetirementAge !== null) {
    if (inputs.targetRetirementAge < FIRE_INPUT_LIMITS.targetAge.min) {
      errors.push({
        field: 'targetRetirementAge',
        message: `Markaldur verður að vera að minnsta kosti ${FIRE_INPUT_LIMITS.targetAge.min} ára`,
      });
    } else if (inputs.targetRetirementAge > FIRE_INPUT_LIMITS.targetAge.max) {
      errors.push({
        field: 'targetRetirementAge',
        message: `Markaldur verður að vera í mesta lagi ${FIRE_INPUT_LIMITS.targetAge.max} ára`,
      });
    }

    // Check target age is greater than current age
    if (inputs.currentAge !== undefined && inputs.targetRetirementAge <= inputs.currentAge) {
      errors.push({
        field: 'targetRetirementAge',
        message: 'Markaldur verður að vera hærri en núverandi aldur',
      });
    }

    // Warning for very early retirement
    if (inputs.targetRetirementAge < 40) {
      warnings.push({
        field: 'targetRetirementAge',
        message: 'Mjög snemma starfslok - gakktu úr skugga um að þú hafir reiknað rétt',
      });
    }
  }

  // Validate current net worth
  if (inputs.currentNetWorth !== undefined) {
    if (inputs.currentNetWorth < FIRE_INPUT_LIMITS.netWorth.min) {
      errors.push({
        field: 'currentNetWorth',
        message: 'Hrein eign getur ekki verið neikvæð',
      });
    } else if (inputs.currentNetWorth > FIRE_INPUT_LIMITS.netWorth.max) {
      errors.push({
        field: 'currentNetWorth',
        message: 'Hrein eign virðist óraunhæf - athugaðu innslátt',
      });
    }
  }

  // Validate annual income
  if (inputs.annualIncome !== undefined) {
    if (inputs.annualIncome <= 0) {
      errors.push({
        field: 'annualIncome',
        message: 'Árstekjur verða að vera hærri en 0 kr',
      });
    } else if (inputs.annualIncome > FIRE_INPUT_LIMITS.income.max) {
      errors.push({
        field: 'annualIncome',
        message: 'Árstekjur virðast óraunhæfar - athugaðu innslátt',
      });
    }

    if (inputs.annualIncome < 2_000_000) {
      warnings.push({
        field: 'annualIncome',
        message: 'Lágar tekjur - FIRE markmið geta verið erfið að ná',
      });
    }
  }

  // Validate annual savings
  if (inputs.annualSavings !== undefined) {
    if (inputs.annualSavings < 0) {
      errors.push({
        field: 'annualSavings',
        message: 'Árlegur sparnaður getur ekki verið neikvæður',
      });
    } else if (inputs.annualSavings > FIRE_INPUT_LIMITS.savings.max) {
      errors.push({
        field: 'annualSavings',
        message: 'Árlegur sparnaður virðist óraunhæfur - athugaðu innslátt',
      });
    }

    // Check savings vs income
    if (
      inputs.annualIncome !== undefined &&
      inputs.annualIncome > 0 &&
      inputs.annualSavings > inputs.annualIncome
    ) {
      errors.push({
        field: 'annualSavings',
        message: 'Árlegur sparnaður getur ekki verið hærri en árstekjur',
      });
    }
  }

  // Validate savings rate
  if (inputs.savingsRate !== undefined) {
    if (inputs.savingsRate < FIRE_INPUT_LIMITS.savingsRate.min) {
      errors.push({
        field: 'savingsRate',
        message: `Sparnaðarhlutfall verður að vera að minnsta kosti ${FIRE_INPUT_LIMITS.savingsRate.min}%`,
      });
    } else if (inputs.savingsRate > FIRE_INPUT_LIMITS.savingsRate.max) {
      errors.push({
        field: 'savingsRate',
        message: `Sparnaðarhlutfall getur ekki verið hærra en ${FIRE_INPUT_LIMITS.savingsRate.max}%`,
      });
    }

    if (inputs.savingsRate < 10) {
      warnings.push({
        field: 'savingsRate',
        message: 'Lágt sparnaðarhlutfall - íhugaðu að auka sparnað til að ná FIRE fyrr',
      });
    } else if (inputs.savingsRate > 70) {
      warnings.push({
        field: 'savingsRate',
        message: 'Mjög hátt sparnaðarhlutfall - gakktu úr skugga um að lífsgæði þín séu viðunandi',
      });
    }
  }

  // Validate monthly expenses
  if (inputs.monthlyExpenses) {
    const { barebones, comfortable, deluxe } = inputs.monthlyExpenses;

    if (barebones !== undefined) {
      if (barebones < FIRE_INPUT_LIMITS.expenses.min) {
        errors.push({
          field: 'monthlyExpenses.barebones',
          message: `Lágmarks útgjöld virðast of lág (lágmark ${FIRE_INPUT_LIMITS.expenses.min.toLocaleString('is-IS')} kr)`,
        });
      } else if (barebones > FIRE_INPUT_LIMITS.expenses.max) {
        errors.push({
          field: 'monthlyExpenses.barebones',
          message: `Lágmarks útgjöld virðast óraunhæf (hámark ${FIRE_INPUT_LIMITS.expenses.max.toLocaleString('is-IS')} kr)`,
        });
      }
    }

    if (comfortable !== undefined) {
      if (comfortable < FIRE_INPUT_LIMITS.expenses.min) {
        errors.push({
          field: 'monthlyExpenses.comfortable',
          message: `Þægileg útgjöld virðast of lág (lágmark ${FIRE_INPUT_LIMITS.expenses.min.toLocaleString('is-IS')} kr)`,
        });
      } else if (comfortable > FIRE_INPUT_LIMITS.expenses.max) {
        errors.push({
          field: 'monthlyExpenses.comfortable',
          message: `Þægileg útgjöld virðast óraunhæf (hámark ${FIRE_INPUT_LIMITS.expenses.max.toLocaleString('is-IS')} kr)`,
        });
      }
    }

    if (deluxe !== undefined) {
      if (deluxe < FIRE_INPUT_LIMITS.expenses.min) {
        errors.push({
          field: 'monthlyExpenses.deluxe',
          message: `Lúxus útgjöld virðast of lág (lágmark ${FIRE_INPUT_LIMITS.expenses.min.toLocaleString('is-IS')} kr)`,
        });
      } else if (deluxe > FIRE_INPUT_LIMITS.expenses.max) {
        errors.push({
          field: 'monthlyExpenses.deluxe',
          message: `Lúxus útgjöld virðast óraunhæf (hámark ${FIRE_INPUT_LIMITS.expenses.max.toLocaleString('is-IS')} kr)`,
        });
      }
    }

    // Check expense tier ordering
    if (
      barebones !== undefined &&
      comfortable !== undefined &&
      barebones > comfortable
    ) {
      warnings.push({
        field: 'monthlyExpenses',
        message: 'Lágmarks útgjöld eru hærri en þægileg útgjöld - athugaðu innslátt',
      });
    }

    if (
      comfortable !== undefined &&
      deluxe !== undefined &&
      comfortable > deluxe
    ) {
      warnings.push({
        field: 'monthlyExpenses',
        message: 'Þægileg útgjöld eru hærri en lúxus útgjöld - athugaðu innslátt',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate FIRE assumptions
 *
 * Checks withdrawal rate, growth rate, inflation rate, and pension parameters.
 *
 * @param assumptions - FIRE assumptions to validate
 * @returns Validation result with isValid flag and error/warning messages
 */
export function validateAssumptions(
  assumptions: Partial<FIREAssumptions>
): FIREInputValidationResult {
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];

  // Validate withdrawal rate (2-10%)
  if (assumptions.withdrawalRate !== undefined) {
    if (assumptions.withdrawalRate < 0.02) {
      errors.push({
        field: 'withdrawalRate',
        message: 'Úttektarhlutfall verður að vera að minnsta kosti 2%',
      });
    } else if (assumptions.withdrawalRate > 0.10) {
      errors.push({
        field: 'withdrawalRate',
        message: 'Úttektarhlutfall getur ekki verið hærra en 10%',
      });
    }

    if (assumptions.withdrawalRate > 0.05) {
      warnings.push({
        field: 'withdrawalRate',
        message: 'Úttektarhlutfall yfir 5% gæti verið áhættusamt til lengri tíma',
      });
    } else if (assumptions.withdrawalRate < 0.03) {
      warnings.push({
        field: 'withdrawalRate',
        message: 'Úttektarhlutfall undir 3% er mjög varfærið - þú gætir sparað of mikið',
      });
    }
  }

  // Validate expected growth rate (0-15%)
  if (assumptions.expectedGrowthRate !== undefined) {
    if (assumptions.expectedGrowthRate < 0) {
      errors.push({
        field: 'expectedGrowthRate',
        message: 'Vænt ávöxtun getur ekki verið neikvæð',
      });
    } else if (assumptions.expectedGrowthRate > 0.15) {
      errors.push({
        field: 'expectedGrowthRate',
        message: 'Vænt ávöxtun yfir 15% er óraunhæf',
      });
    }

    if (assumptions.expectedGrowthRate > 0.10) {
      warnings.push({
        field: 'expectedGrowthRate',
        message: 'Vænt ávöxtun yfir 10% er bjartsýn - íhugaðu varfærnari spá',
      });
    } else if (assumptions.expectedGrowthRate < 0.04) {
      warnings.push({
        field: 'expectedGrowthRate',
        message: 'Vænt ávöxtun undir 4% er svartsýn - þú gætir ofmetið áhættu',
      });
    }
  }

  // Validate inflation rate (0-10%)
  if (assumptions.inflationRate !== undefined) {
    if (assumptions.inflationRate < 0) {
      errors.push({
        field: 'inflationRate',
        message: 'Verðbólga getur ekki verið neikvæð í þessum útreikningum',
      });
    } else if (assumptions.inflationRate > 0.10) {
      errors.push({
        field: 'inflationRate',
        message: 'Verðbólga yfir 10% er óraunhæf til lengri tíma',
      });
    }

    if (assumptions.inflationRate > 0.05) {
      warnings.push({
        field: 'inflationRate',
        message: 'Verðbólga yfir 5% er há - gakktu úr skugga um að þetta sé raunhæft',
      });
    }
  }

  // Validate pension age (55-75)
  if (assumptions.pensionAge !== undefined) {
    if (assumptions.pensionAge < 55) {
      errors.push({
        field: 'pensionAge',
        message: 'Lífeyrisaldur getur ekki verið lægri en 55 ára',
      });
    } else if (assumptions.pensionAge > 75) {
      errors.push({
        field: 'pensionAge',
        message: 'Lífeyrisaldur getur ekki verið hærri en 75 ára',
      });
    }

    if (assumptions.pensionAge !== 67) {
      warnings.push({
        field: 'pensionAge',
        message: 'Athugið: Núverandi lífeyrisaldur á Íslandi er 67 ára',
      });
    }
  }

  // Validate pension monthly estimate
  if (
    assumptions.pensionMonthlyEstimate !== undefined &&
    assumptions.pensionMonthlyEstimate !== null
  ) {
    if (assumptions.pensionMonthlyEstimate < 0) {
      errors.push({
        field: 'pensionMonthlyEstimate',
        message: 'Áætlaðar lífeyrisgreiðslur geta ekki verið neikvæðar',
      });
    } else if (assumptions.pensionMonthlyEstimate > 1_000_000) {
      warnings.push({
        field: 'pensionMonthlyEstimate',
        message: 'Áætlaðar lífeyrisgreiðslur virðast mjög háar - athugaðu innslátt',
      });
    }
  }

  // Cross-field validation: growth rate should be higher than inflation
  if (
    assumptions.expectedGrowthRate !== undefined &&
    assumptions.inflationRate !== undefined
  ) {
    const realReturn = assumptions.expectedGrowthRate - assumptions.inflationRate;
    if (realReturn < 0.01) {
      warnings.push({
        field: 'expectedGrowthRate',
        message: 'Raunávöxtun (ávöxtun - verðbólga) er mjög lág - íhugaðu að breyta forsendum',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
