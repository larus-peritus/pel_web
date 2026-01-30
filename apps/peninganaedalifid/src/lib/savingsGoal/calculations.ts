/**
 * Calculation functions for savings goals
 */

import type {
  SavingsGoal,
  SavingsGoalCalculations,
  SavingsSummary,
  GoalStatus,
  StatusColor,
} from '@/types/savingsGoal';
import { dollarsToLifeEnergy, addMonths, roundToDecimal } from './utils';

/**
 * Format life energy for savings goals
 * Adapts to show hours, work days, or work weeks
 * @param hours - Hours of life energy
 * @returns Formatted string in Icelandic
 */
export function formatSavingsLifeEnergy(hours: number): string {
  if (hours < 0) return '0 klukkustundir';
  if (!isFinite(hours)) return '∞ klukkustundir';

  // < 8 hours: show hours
  if (hours < 8) {
    const rounded = roundToDecimal(hours, 1);
    return `${rounded} ${rounded === 1 ? 'klukkustund' : 'klukkustundir'}`;
  }

  // 8-80 hours: show work days
  if (hours < 80) {
    const days = roundToDecimal(hours / 8, 1);
    return `${days} ${days === 1 ? 'vinnudagur' : 'vinnudagar'}`;
  }

  // >= 80 hours: show work weeks
  const weeks = roundToDecimal(hours / 40, 1);
  return `${weeks} ${weeks === 1 ? 'vinnuvika' : 'vinnuvikur'}`;
}

/**
 * Determine goal status based on progress percentage
 * @param progressPercentage - Progress as percentage (0-100+)
 * @returns Goal status
 */
export function getGoalStatus(progressPercentage: number): GoalStatus {
  if (progressPercentage >= 100) return 'achieved';
  if (progressPercentage >= 67) return 'almost-there';
  if (progressPercentage >= 34) return 'progressing';
  return 'started';
}

/**
 * Get status color for a given status
 * @param status - Goal status
 * @returns Color name
 */
export function getStatusColor(status: GoalStatus): StatusColor {
  const colorMap: Record<GoalStatus, StatusColor> = {
    started: 'red',
    progressing: 'yellow',
    'almost-there': 'blue',
    achieved: 'green',
  };

  return colorMap[status];
}

/**
 * Get next milestone that hasn't been achieved
 * @param progressPercentage - Current progress percentage
 * @param achievedMilestones - Array of achieved milestone percentages
 * @returns Next milestone or null if all achieved
 */
export function getNextMilestone(
  progressPercentage: number,
  achievedMilestones: number[],
): number | null {
  const milestones = [10, 25, 50, 75, 100];

  for (const milestone of milestones) {
    if (progressPercentage < milestone && !achievedMilestones.includes(milestone)) {
      return milestone;
    }
  }

  return null;
}

/**
 * Calculate all derived values for a savings goal
 * @param goal - The savings goal
 * @param actualHourlyWage - User's actual hourly wage from calculator
 * @returns All calculated values
 */
export function calculateSavingsGoal(
  goal: SavingsGoal,
  actualHourlyWage: number,
): SavingsGoalCalculations {
  // Progress percentage
  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;

  // Life energy calculations
  const hoursWorked = dollarsToLifeEnergy(goal.currentAmount, actualHourlyWage);
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const hoursRemaining = dollarsToLifeEnergy(remainingAmount, actualHourlyWage);

  // Format hours
  const formattedHoursWorked = formatSavingsLifeEnergy(hoursWorked);
  const formattedHoursRemaining = formatSavingsLifeEnergy(hoursRemaining);

  // Time to goal calculation
  let monthsToGoal: number | null = null;
  let estimatedCompletionDate: Date | null = null;

  if (goal.monthlyContribution > 0 && remainingAmount > 0) {
    monthsToGoal = Math.ceil(remainingAmount / goal.monthlyContribution);
    estimatedCompletionDate = addMonths(new Date(), monthsToGoal);
  }

  // Status determination
  const status = getGoalStatus(progressPercentage);
  const statusColor = getStatusColor(status);

  // Next milestone
  const nextMilestone = getNextMilestone(progressPercentage, goal.achievedMilestones);

  return {
    progressPercentage,
    hoursWorked,
    hoursRemaining,
    formattedHoursWorked,
    formattedHoursRemaining,
    monthsToGoal,
    estimatedCompletionDate,
    status,
    statusColor,
    nextMilestone,
  };
}

/**
 * Calculate summary across all goals
 * @param goals - Array of all savings goals
 * @param actualHourlyWage - User's actual hourly wage
 * @returns Summary of all goals
 */
export function calculateSavingsSummary(
  goals: SavingsGoal[],
  actualHourlyWage: number,
): SavingsSummary {
  const activeGoals = goals.filter((g) => !g.isCompleted);

  const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  const overallProgress =
    totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  const totalHoursWorked = dollarsToLifeEnergy(totalCurrentAmount, actualHourlyWage);
  const totalHoursRemaining = dollarsToLifeEnergy(
    Math.max(0, totalTargetAmount - totalCurrentAmount),
    actualHourlyWage,
  );

  return {
    totalGoals: activeGoals.length,
    totalTargetAmount,
    totalCurrentAmount,
    overallProgress,
    totalHoursWorked,
    totalHoursRemaining,
    formattedTotalHoursWorked: formatSavingsLifeEnergy(totalHoursWorked),
    formattedTotalHoursRemaining: formatSavingsLifeEnergy(totalHoursRemaining),
  };
}

/**
 * Create an empty summary for when there are no goals
 * @returns Empty summary object
 */
export function createEmptyAnalysis(): SavingsSummary {
  return {
    totalGoals: 0,
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    overallProgress: 0,
    totalHoursWorked: 0,
    totalHoursRemaining: 0,
    formattedTotalHoursWorked: '0 klukkustundir',
    formattedTotalHoursRemaining: '0 klukkustundir',
  };
}
