import type {
  CalculatorInputs,
  ValidationResult,
  Period,
  SpendingData,
  SpendingCategory,
} from '@/types/calculator';
import { SPENDING_CATEGORY_LABELS } from '@/lib/constants/spendingCategories';

/**
 * Validate all calculator inputs
 * Returns validation result with field-specific error messages
 */
export function validateInputs(inputs: CalculatorInputs): ValidationResult {
  const errors: Record<string, string> = {};

  // Income validation
  if (inputs.income.grossAnnualIncome < 0) {
    errors['income.grossAnnualIncome'] = 'Income must be positive';
  }
  if (inputs.income.grossAnnualIncome > 100000000) {
    errors['income.grossAnnualIncome'] = 'Income seems unusually high';
  }

  if (inputs.income.workHoursPerWeek < 1 || inputs.income.workHoursPerWeek > 100) {
    errors['income.workHoursPerWeek'] = 'Hours must be between 1 and 100';
  }

  if (inputs.income.vacationDays < 0 || inputs.income.vacationDays > 60) {
    errors['income.vacationDays'] = 'Vacation days must be between 0 and 60';
  }

  if (inputs.income.additionalIncome < 0) {
    errors['income.additionalIncome'] = 'Additional income cannot be negative';
  }

  // Expense validation (all must be >= 0)
  const expenseFields: (keyof typeof inputs.moneyExpenses)[] = [
    'commute', 'clothing', 'meals', 'decompression', 'childcareDelta', 'other'
  ];
  
  for (const key of expenseFields) {
    const value = inputs.moneyExpenses[key];
    if (value < 0) {
      errors[`moneyExpenses.${key}`] = 'Expenses cannot be negative';
    }
    if (value > 1000000) {
      errors[`moneyExpenses.${key}`] = 'Expense amount seems unusually high';
    }
  }

  // Time validation (all must be >= 0 and reasonable)
  const timeFields: (keyof typeof inputs.timeExpenses)[] = [
    'commute', 'gettingReady', 'decompression', 'workIllness'
  ];
  
  for (const key of timeFields) {
    const value = inputs.timeExpenses[key];
    if (value < 0) {
      errors[`timeExpenses.${key}`] = 'Time cannot be negative';
    }
    if (value > 40) {
      errors[`timeExpenses.${key}`] = 'Time seems unusually high (max 40 hours/week)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate a single field value
 */
export function validateField(
  section: 'income' | 'moneyExpenses' | 'timeExpenses',
  field: string,
  value: number
): string | null {
  if (value < 0) {
    return 'Value cannot be negative';
  }

  if (section === 'income') {
    if (field === 'workHoursPerWeek' && (value < 1 || value > 100)) {
      return 'Hours must be between 1 and 100';
    }
    if (field === 'vacationDays' && (value < 0 || value > 60)) {
      return 'Vacation days must be between 0 and 60';
    }
    if (field === 'grossAnnualIncome' && value > 100000000) {
      return 'Income seems unusually high';
    }
  }

  if (section === 'moneyExpenses' && value > 1000000) {
    return 'Expense amount seems unusually high';
  }

  if (section === 'timeExpenses' && value > 40) {
    return 'Time seems unusually high (max 40 hours/week)';
  }

  return null;
}

/**
 * Validate a period (for lifestyle inflation)
 * @param period - Period data to validate (without ID)
 * @returns Validation result
 */
export function validatePeriod(period: Omit<Period, 'id'>): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  if (!period.name || period.name.trim() === '') {
    errors['name'] = 'Nafn má ekki vera tómt';
  }
  if (period.name && period.name.length > 100) {
    errors['name'] = 'Nafn má ekki vera lengra en 100 stafir';
  }

  // Year validation
  if (period.year < 2020 || period.year > 2030) {
    errors['year'] = 'Ár verður að vera á milli 2020 og 2030';
  }

  // Month validation (optional, but if provided must be 1-12)
  if (period.month !== undefined && period.month !== null) {
    if (period.month < 1 || period.month > 12) {
      errors['month'] = 'Mánuður verður að vera á milli 1 og 12';
    }
  }

  // Income validation
  if (period.income < 0) {
    errors['income'] = 'Tekjur geta ekki verið neikvæðar';
  }

  // Spending validation
  const spendingErrors = validateSpending(period.spending);
  if (!spendingErrors.isValid) {
    Object.assign(errors, spendingErrors.errors);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate spending data
 * @param spending - Spending data to validate
 * @returns Validation result
 */
export function validateSpending(spending: SpendingData): ValidationResult {
  const errors: Record<string, string> = {};

  const categories: SpendingCategory[] = [
    'housing',
    'food',
    'transportation',
    'subscriptions',
    'convenience',
    'clothing',
    'entertainment',
    'health',
    'other',
  ];

  for (const category of categories) {
    const value = spending[category];

    // Must be non-negative
    if (value < 0) {
      errors[`spending.${category}`] = `${SPENDING_CATEGORY_LABELS[category]} geta ekki verið neikvæðar`;
    }

    // Sanity check - not too large
    if (value > 10000000) {
      errors[`spending.${category}`] = `${SPENDING_CATEGORY_LABELS[category]} virðist óeðlilega hátt`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
