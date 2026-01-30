/**
 * Calculation Functions Barrel Export
 *
 * Exports all calculation-related functions for the Actual Hourly Wage Calculator.
 */

export {
  calculateNominalWage,
  calculateTotalMoneyExpenses,
  calculateTotalExtraTime,
  calculateActualWage,
  calculateResults,
} from './wage';

export {
  dollarsToLifeEnergy,
  formatLifeEnergy,
  formatDollarsAsLifeEnergy,
} from './lifeEnergy';

export {
  generateExpenseBreakdown,
  generateTimeBreakdown,
  getTotalExpenses,
  getTotalWeeklyHours,
} from './breakdown';

export {
  calculateTotalCost,
  calculateLifeEnergyCost,
  calculateOpportunityCost,
  calculateStaycationComparison,
  calculateFIImpact,
  calculateTripResult,
  compareTrips,
  applyPreset,
  formatLifeEnergy as formatTravelLifeEnergy,
  formatDelay,
} from './travelVacation';

export {
  calculateInflationScore,
  calculateChangeSeverity,
  analyzeCategoryChanges,
  detectQuietUpgrades,
  calculateFIImpact as calculateLifestyleFIImpact,
  calculateSalaryUtilization,
  getSuggestionsForCategory,
  generateAlerts,
  createEmptyAnalysis,
  analyzeInflation,
} from './lifestyleInflation';

export {
  calculateProfitabilityGrade,
} from './profitability';

export {
  calculateIcelandicTax,
  getTaxBracket,
  calculateMarginalTax,
  generateRecommendation,
  calculateAdditionalIncomeResults,
  ICELANDIC_TAX_BRACKETS,
} from './additionalIncome';

export {
  calculateMonthsOfFreedom,
  calculateWeeksOfFreedom,
  calculateLifeEnergyHours,
  hoursToWorkWeeks,
  hoursToYears,
  calculateRiskRating,
  calculateTargetProgress,
  calculateEmergencyFundResults,
} from './emergencyFund';

export {
  calculateStandardAmortization,
  calculateIndexedAmortization,
  calculateInvestmentGrowth,
  findBreakEvenPoint,
  generateReasoning,
  calculatePeaceOfMindAdjustment,
  compareDebtVsInvestment,
} from './debtPayoff';

export {
  calculateLifeEnergy,
  calculateFutureValue,
  calculateFIDateShift,
  calculateCategoryImpact,
  calculateAllCategoryImpacts,
  sortCategoryImpacts,
  getImpactIndicator,
  getGradientClass,
  formatMonths,
} from './cutImpact';

export {
  calculateMinimumFINumber,
  calculateGeographicComparison,
  calculateReductionScenario,
  calculateTotalReductions,
  calculateYearsToFI,
  generateFrugalityTips,
  calculateFrugalityTipImpact,
  calculateLifeEnergy as calculateLeanFireLifeEnergy,
  calculateLeanFireResults,
} from './leanFire';

export {
  calculateGapToFI,
  isCoastFIRE,
  calculateNetIncome,
  calculatePartTimeAnnualIncome,
  calculateReducedFINumber,
  calculateTimelineProjection,
  calculateLifeEnergy as calculateBaristaFireLifeEnergy,
  calculateScenarioResult,
  calculateBaristaFireResults,
} from './baristaFire';

export {
  calculateWithdrawal4Percent,
  calculateWithdrawalVariable,
  calculateWithdrawalGuardrails,
  calculatePensionIncome,
  calculateYearlyExpenses,
  calculatePortfolioReturn,
  calculateFutureValue as calculateRetirementFutureValue,
  calculateYearsToRetirement,
  calculateWithdrawal,
  estimateTypicalPension,
  calculateTotalPensionIncome,
  prepareSimulationConfig,
} from './retirementSimulator';
