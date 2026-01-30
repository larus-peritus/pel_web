/**
 * Hook for managing milestone achievement notifications
 */

'use client';

import { useEffect, useRef } from 'react';
import type { SavingsGoal, SavingsGoalCalculations } from '@/types/savingsGoal';

/**
 * Milestone notification callback type
 */
export type MilestoneCallback = (goalId: string, goalName: string, milestone: number) => void;

/**
 * Hook for detecting and notifying when milestones are achieved
 * @param goal - The savings goal
 * @param calculations - Calculated values for the goal
 * @param onMilestoneAchieved - Callback when milestone is achieved
 */
export function useMilestoneNotification(
  goal: SavingsGoal,
  calculations: SavingsGoalCalculations,
  onMilestoneAchieved?: MilestoneCallback,
) {
  const previousProgressRef = useRef<number>(0);

  useEffect(() => {
    if (!onMilestoneAchieved) return;

    const progress = calculations.progressPercentage;
    const milestones = [10, 25, 50, 75, 100];

    for (const milestone of milestones) {
      // Check if we've crossed this milestone
      if (
        progress >= milestone &&
        previousProgressRef.current < milestone &&
        !goal.achievedMilestones.includes(milestone)
      ) {
        onMilestoneAchieved(goal.id, goal.name, milestone);
      }
    }

    previousProgressRef.current = progress;
  }, [calculations.progressPercentage, goal, onMilestoneAchieved]);
}
