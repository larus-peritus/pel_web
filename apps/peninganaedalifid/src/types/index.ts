/**
 * Types barrel export
 * Centralizes all TypeScript type definitions for clean imports
 */

// Calculator types
export type {
  IncomeInputs,
  MoneyExpenses,
  TimeExpenses,
  CalculatorInputs,
  CalculationResults,
  ExpenseBreakdownItem,
  TimeBreakdownItem,
  Scenario,
  Preset,
  StoredState,
  ValidationResult,
  PresetCategory,
} from './calculator';

// Raise/Bonus calculator types
export type {
  Municipality,
  TaxBracket,
  TaxConfig,
  FIContext,
  RaiseInputs,
  TaxResults,
  FIResults,
  LifeEnergyResults,
  RaiseSummary,
  RaiseResults,
  RaiseScenario,
} from './raise';

// Additional Income types
export type {
  NewExpenses,
  AdditionalTime,
  AdditionalIncomeInputs,
  AdditionalIncomeResults,
  RecommendationLevel,
  MarginalTaxResult,
} from './additionalIncome';
