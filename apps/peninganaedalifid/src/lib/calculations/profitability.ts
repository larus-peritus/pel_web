/**
 * Profitability grading calculations for Job Profit/Loss Scorecard
 *
 * Calculates job profitability grade based on the reduction from gross
 * to actual hourly wage, following "Your Money or Your Life" methodology.
 */

import type {
  CalculationResults,
  ProfitabilityGrade,
  ProfitabilityAssessment,
} from '@/types/calculator';
import {
  GRADE_LABELS,
  GRADE_EXPLANATIONS,
} from '@/lib/constants/profitability';

/**
 * Determine profitability grade based on percentage reduction
 *
 * Grade thresholds:
 * - A: < 15% reduction (excellent job)
 * - B: 15-30% reduction (good job)
 * - C: 30-45% reduction (average job)
 * - D: 45-60% reduction (poor job)
 * - F: >= 60% reduction or wage <= 0 (failing job)
 */
function determineGrade(
  percentageReduction: number,
  actualHourlyWage: number
): ProfitabilityGrade {
  // F grade if wage is zero or negative
  if (actualHourlyWage <= 0) {
    return 'F';
  }

  // Grade based on percentage reduction
  if (percentageReduction < 15) return 'A';
  if (percentageReduction < 30) return 'B';
  if (percentageReduction < 45) return 'C';
  if (percentageReduction < 60) return 'D';
  return 'F';
}

/**
 * Map grade to severity level for color coding
 */
function getGradeSeverity(grade: ProfitabilityGrade): 'success' | 'warning' | 'error' {
  switch (grade) {
    case 'A':
    case 'B':
      return 'success';
    case 'C':
    case 'D':
      return 'warning';
    case 'F':
      return 'error';
  }
}

/**
 * Calculate "invisible hours" - the gap between time invested and value received
 *
 * The concept:
 * - You invest X hours/week (work + commute + extra time)
 * - Your net income (after work costs) equals Y hours at your nominal rate
 * - The gap (X - Y) = "invisible hours" lost to costs and unpaid time
 *
 * Example:
 * - Work 35 hrs + 5 hrs commute = 40 hrs invested
 * - Earn 600,000 kr/month, costs 100,000 kr → net 500,000 kr
 * - Nominal rate: 600,000 / (35 × 4.33) = 3,959 kr/hr
 * - Equivalent hours: 500,000 / 3,959 = 126 hrs/month = 29 hrs/week
 * - Invisible hours: 40 - 29 = 11 hrs/week
 */
function calculateInvisibleHours(
  totalWeeklyHours: number,
  netAnnualIncome: number,
  nominalHourlyWage: number
): {
  totalHoursInvested: number;
  equivalentHoursAtNominal: number;
  invisibleHours: number;
  totalHoursInvestedMonthly: number;
  equivalentHoursAtNominalMonthly: number;
  invisibleHoursMonthly: number;
} {
  // If nominal wage is zero or negative, can't calculate
  if (nominalHourlyWage <= 0) {
    return {
      totalHoursInvested: totalWeeklyHours,
      equivalentHoursAtNominal: 0,
      invisibleHours: totalWeeklyHours,
      totalHoursInvestedMonthly: totalWeeklyHours * 4.33,
      equivalentHoursAtNominalMonthly: 0,
      invisibleHoursMonthly: totalWeeklyHours * 4.33,
    };
  }

  // Weekly calculations
  const totalHoursInvested = totalWeeklyHours;
  const weeklyNetIncome = netAnnualIncome / 52;
  const equivalentHoursAtNominal = weeklyNetIncome / nominalHourlyWage;
  const invisibleHours = totalHoursInvested - equivalentHoursAtNominal;

  // Monthly calculations (× 4.33 weeks/month)
  const totalHoursInvestedMonthly = totalHoursInvested * 4.33;
  const equivalentHoursAtNominalMonthly = equivalentHoursAtNominal * 4.33;
  const invisibleHoursMonthly = invisibleHours * 4.33;

  return {
    totalHoursInvested,
    equivalentHoursAtNominal,
    invisibleHours,
    totalHoursInvestedMonthly,
    equivalentHoursAtNominalMonthly,
    invisibleHoursMonthly,
  };
}

/**
 * Calculate complete profitability assessment from calculation results
 *
 * Returns null if results are invalid or missing required data.
 *
 * @param results - Calculator results from CalculatorContext
 * @returns Profitability assessment or null
 */
export function calculateProfitabilityGrade(
  results: CalculationResults | null
): ProfitabilityAssessment | null {
  // Return null if no results
  if (!results) return null;

  // Return null if required data is missing
  if (
    results.actualHourlyWage === undefined ||
    results.percentageReduction === undefined ||
    results.netAnnualIncome === undefined ||
    results.nominalHourlyWage === undefined ||
    results.totalWeeklyHours === undefined
  ) {
    return null;
  }

  const {
    actualHourlyWage,
    percentageReduction,
    netAnnualIncome,
    nominalHourlyWage,
    totalWeeklyHours,
  } = results;

  // Determine grade
  const grade = determineGrade(percentageReduction, actualHourlyWage);

  // Get Icelandic labels
  const gradeLabel = GRADE_LABELS[grade];
  const gradeExplanation = GRADE_EXPLANATIONS[grade];

  // Calculate invisible hours
  const invisibleHoursData = calculateInvisibleHours(
    totalWeeklyHours,
    netAnnualIncome,
    nominalHourlyWage
  );

  // Determine if this is a profit (positive invisible hours means loss)
  // isProfit = true when you're getting MORE value than time invested (rare)
  const isProfit = invisibleHoursData.invisibleHours <= 0;

  // Get severity for color coding
  const severity = getGradeSeverity(grade);

  return {
    grade,
    percentageReduction,
    totalHoursInvested: invisibleHoursData.totalHoursInvested,
    equivalentHoursAtNominal: invisibleHoursData.equivalentHoursAtNominal,
    invisibleHours: invisibleHoursData.invisibleHours,
    totalHoursInvestedMonthly: invisibleHoursData.totalHoursInvestedMonthly,
    equivalentHoursAtNominalMonthly: invisibleHoursData.equivalentHoursAtNominalMonthly,
    invisibleHoursMonthly: invisibleHoursData.invisibleHoursMonthly,
    gradeLabel,
    gradeExplanation,
    isProfit,
    severity,
  };
}
