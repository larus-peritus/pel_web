/**
 * Calculation functions for convenience expense tracking
 * Calculates summaries, workday comparisons, and goal progress
 */

import type {
  ConvenienceExpense,
  ConvenienceExpenseSummary,
  ConvenienceGoal,
  ConvenienceCategory,
} from '@/types/calculator';
import { getLast7Days, getLast30Days, getExpensesInDateRange } from '../utils/dateUtils';

/**
 * Icelandic labels for convenience expense categories
 */
export const CONVENIENCE_CATEGORY_LABELS: Record<ConvenienceCategory, string> = {
  delivery: 'Heimsending',
  taxi: 'Leigubíll',
  prepared: 'Tilbúinn matur',
  restaurant: 'Mathús',
  impulse: 'Kaup í vinnu',
  other: 'Annað',
};

/**
 * Common convenience expenses with preset values (in ISK)
 * These are typical Icelandic services with average costs
 */
export const COMMON_CONVENIENCE_EXPENSES: Omit<ConvenienceExpense, 'id' | 'date' | 'isWorkday'>[] = [
  // Delivery services
  { amount: 4500, category: 'delivery', note: 'Wolt heimsending' },
  { amount: 3800, category: 'delivery', note: 'AHA heimsending' },
  { amount: 3200, category: 'delivery', note: 'Dominos pizza' },

  // Taxi/ride-share
  { amount: 3500, category: 'taxi', note: 'Hreyfill heim frá vinnu' },
  { amount: 2000, category: 'taxi', note: 'Hreyfill stuttt' },
  { amount: 5000, category: 'taxi', note: 'Hreyfill langt' },
  { amount: 2500, category: 'taxi', note: 'Bolt' },

  // Prepared meals
  { amount: 1500, category: 'prepared', note: '10-11 tilbúinn matur' },
  { amount: 1800, category: 'prepared', note: 'Bónus tilbúinn matur' },
  { amount: 2200, category: 'prepared', note: 'Nettó tilbúinn matur' },

  // Restaurants
  { amount: 2500, category: 'restaurant', note: 'Skyndibitastaður' },
  { amount: 4000, category: 'restaurant', note: 'Mathús hádegi' },

  // Impulse purchases
  { amount: 3000, category: 'impulse', note: 'Netkaup' },
  { amount: 2000, category: 'impulse', note: 'Verslunarkaup' },
];

/**
 * Generate a unique ID for a convenience expense
 */
export function generateExpenseId(): string {
  return `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate expense summary with life energy and category breakdowns
 *
 * @param expenses - Array of all convenience expenses
 * @param actualHourlyWage - User's actual hourly wage (ISK/hour)
 * @returns Summary with weekly, monthly, annual totals and breakdowns
 */
export function calculateExpenseSummary(
  expenses: ConvenienceExpense[],
  actualHourlyWage: number
): ConvenienceExpenseSummary {
  // Get date ranges
  const { startDate: weekStart, endDate: weekEnd } = getLast7Days();
  const { startDate: monthStart, endDate: monthEnd } = getLast30Days();

  // Filter expenses by date range
  const weeklyExpenses = getExpensesInDateRange(expenses, weekStart, weekEnd);
  const monthlyExpenses = getExpensesInDateRange(expenses, monthStart, monthEnd);

  // Calculate totals
  const totalWeekly = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalMonthly = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAnnualized = totalMonthly * 12;

  // Calculate life energy (protect against division by zero)
  const wage = actualHourlyWage || 1; // Avoid division by zero
  const lifeEnergyWeekly = totalWeekly / wage;
  const lifeEnergyMonthly = totalMonthly / wage;
  const lifeEnergyAnnualized = totalAnnualized / wage / 24; // Convert to days

  // Calculate workday vs weekend comparison
  const workdayExpenses = monthlyExpenses.filter((exp) => exp.isWorkday);
  const weekendExpenses = monthlyExpenses.filter((exp) => !exp.isWorkday);

  const workdayTotal = workdayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const weekendTotal = weekendExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const workdayCount = workdayExpenses.length || 1; // Avoid division by zero
  const weekendCount = weekendExpenses.length || 1; // Avoid division by zero

  const workdayAverage = workdayTotal / workdayCount;
  const weekendAverage = weekendTotal / weekendCount;
  const workdayPremium = workdayAverage - weekendAverage;

  // Annual impact: 52 weeks × 5 workdays = 260 workdays per year
  const annualWorkdayPremium = workdayPremium * 260;

  // Category breakdown
  const categoryTotals: Record<ConvenienceCategory, { total: number; count: number }> = {
    delivery: { total: 0, count: 0 },
    taxi: { total: 0, count: 0 },
    prepared: { total: 0, count: 0 },
    restaurant: { total: 0, count: 0 },
    impulse: { total: 0, count: 0 },
    other: { total: 0, count: 0 },
  };

  monthlyExpenses.forEach((expense) => {
    categoryTotals[expense.category].total += expense.amount;
    categoryTotals[expense.category].count += 1;
  });

  const byCategory = (Object.keys(categoryTotals) as ConvenienceCategory[])
    .map((category) => ({
      category,
      label: CONVENIENCE_CATEGORY_LABELS[category],
      total: categoryTotals[category].total,
      count: categoryTotals[category].count,
      percentage: totalMonthly > 0 ? (categoryTotals[category].total / totalMonthly) * 100 : 0,
    }))
    .filter((cat) => cat.count > 0) // Only include categories with expenses
    .sort((a, b) => b.total - a.total); // Sort by total (highest first)

  return {
    totalWeekly,
    totalMonthly,
    totalAnnualized,
    lifeEnergyWeekly,
    lifeEnergyMonthly,
    lifeEnergyAnnualized,
    workdayAverage,
    weekendAverage,
    workdayPremium,
    annualWorkdayPremium,
    byCategory,
  };
}

/**
 * Calculate workday vs weekend comparison
 *
 * @param expenses - Array of all convenience expenses
 * @returns Detailed comparison of workday vs weekend spending
 */
export interface WorkdayComparisonData {
  workdayAverage: number;
  weekendAverage: number;
  workdayTotal: number;
  weekendTotal: number;
  workdayCount: number;
  weekendCount: number;
  difference: number;
  differencePercent: number;
  annualImpact: number;
}

export function calculateWorkdayComparison(
  expenses: ConvenienceExpense[]
): WorkdayComparisonData {
  const { startDate, endDate } = getLast30Days();
  const monthlyExpenses = getExpensesInDateRange(expenses, startDate, endDate);

  const workdayExpenses = monthlyExpenses.filter((exp) => exp.isWorkday);
  const weekendExpenses = monthlyExpenses.filter((exp) => !exp.isWorkday);

  const workdayTotal = workdayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const weekendTotal = weekendExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const workdayCount = workdayExpenses.length || 1;
  const weekendCount = weekendExpenses.length || 1;

  const workdayAverage = workdayTotal / workdayCount;
  const weekendAverage = weekendTotal / weekendCount;

  const difference = workdayAverage - weekendAverage;
  const differencePercent =
    weekendAverage > 0 ? (difference / weekendAverage) * 100 : 0;

  // Annual impact: 52 weeks × 5 workdays = 260 workdays per year
  const annualImpact = difference * 260;

  return {
    workdayAverage,
    weekendAverage,
    workdayTotal,
    weekendTotal,
    workdayCount,
    weekendCount,
    difference,
    differencePercent,
    annualImpact,
  };
}

/**
 * Calculate progress towards a goal
 *
 * @param goal - Monthly spending goal
 * @param currentMonthly - Current monthly spending
 * @param actualHourlyWage - User's actual hourly wage
 * @returns Progress percentage, savings, and annual impact
 */
export interface GoalProgressData {
  progress: number; // Percentage (0-100+)
  isOnTrack: boolean; // true if current <= target
  savings: number; // ISK saved (if on track)
  savingsLifeEnergy: number; // Hours saved (if on track)
  annualSavings: number; // Annual ISK savings (if on track)
  annualSavingsLifeEnergy: number; // Annual hours saved (if on track)
}

export function calculateGoalProgress(
  goal: ConvenienceGoal,
  currentMonthly: number,
  actualHourlyWage: number
): GoalProgressData {
  const progress = goal.monthlyTarget > 0 ? (currentMonthly / goal.monthlyTarget) * 100 : 0;
  const isOnTrack = currentMonthly <= goal.monthlyTarget;

  const savings = isOnTrack ? goal.monthlyTarget - currentMonthly : 0;
  const wage = actualHourlyWage || 1;
  const savingsLifeEnergy = savings / wage;

  const annualSavings = savings * 12;
  const annualSavingsLifeEnergy = annualSavings / wage;

  return {
    progress,
    isOnTrack,
    savings,
    savingsLifeEnergy,
    annualSavings,
    annualSavingsLifeEnergy,
  };
}
