/**
 * TypeScript types for Savings Goal Tracker
 * Based on "Your Money or Your Life" Chapter 4
 */

/**
 * Goal status based on progress percentage
 */
export type GoalStatus = 'started' | 'progressing' | 'almost-there' | 'achieved';

/**
 * Status color for visual feedback
 */
export type StatusColor = 'red' | 'yellow' | 'blue' | 'green';

/**
 * Sort options for goal list
 */
export type SortOption =
  | 'progress-desc'
  | 'progress-asc'
  | 'amount-desc'
  | 'amount-asc'
  | 'time-desc'
  | 'time-asc'
  | 'manual';

/**
 * Represents a single savings goal
 */
export interface SavingsGoal {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Target amount in ISK */
  targetAmount: number;

  /** Current savings amount in ISK */
  currentAmount: number;

  /** Monthly contribution in ISK */
  monthlyContribution: number;

  /** Creation timestamp */
  createdAt: Date;

  /** Last updated timestamp */
  updatedAt: Date;

  /** Milestones achieved (10%, 25%, 50%, 75%, 100%) */
  achievedMilestones: number[];

  /** Whether goal is completed */
  isCompleted: boolean;

  /** Completion date if completed */
  completedAt?: Date;

  /** Custom sort order for manual sorting */
  sortOrder?: number;
}

/**
 * Input type for creating/editing goals
 */
export interface SavingsGoalInput {
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
}

/**
 * Calculated values for a savings goal
 */
export interface SavingsGoalCalculations {
  /** Progress percentage (0-100+) */
  progressPercentage: number;

  /** Hours of life energy worked */
  hoursWorked: number;

  /** Hours of life energy remaining */
  hoursRemaining: number;

  /** Formatted string for hours worked */
  formattedHoursWorked: string;

  /** Formatted string for hours remaining */
  formattedHoursRemaining: string;

  /** Months until goal achieved (if monthly contribution > 0) */
  monthsToGoal: number | null;

  /** Estimated completion date */
  estimatedCompletionDate: Date | null;

  /** Status category */
  status: GoalStatus;

  /** Status color */
  statusColor: StatusColor;

  /** Next milestone percentage */
  nextMilestone: number | null;
}

/**
 * Summary of all savings goals
 */
export interface SavingsSummary {
  /** Total number of active goals */
  totalGoals: number;

  /** Total target amount across all goals */
  totalTargetAmount: number;

  /** Total current savings across all goals */
  totalCurrentAmount: number;

  /** Weighted average progress percentage */
  overallProgress: number;

  /** Total hours of life energy worked */
  totalHoursWorked: number;

  /** Total hours of life energy remaining */
  totalHoursRemaining: number;

  /** Formatted total hours worked */
  formattedTotalHoursWorked: string;

  /** Formatted total hours remaining */
  formattedTotalHoursRemaining: string;
}

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    targetAmount?: string;
    currentAmount?: string;
    monthlyContribution?: string;
  };
}
