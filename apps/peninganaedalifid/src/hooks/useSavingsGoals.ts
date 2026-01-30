/**
 * Custom hook for managing savings goals
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type {
  SavingsGoal,
  SavingsGoalInput,
  SavingsGoalCalculations,
  SavingsSummary,
  SortOption,
} from '@/types/savingsGoal';
import type { CalculatorInputs } from '@/types/calculator';
import { validateSavingsGoalInput, canAddGoal } from '@/lib/savingsGoal/validation';
import {
  calculateSavingsGoal,
  calculateSavingsSummary,
  createEmptyAnalysis,
} from '@/lib/savingsGoal/calculations';
import { STORAGE_KEYS } from '@/lib/savingsGoal/storage';
import { safeGetItem } from '@/lib/storage/localStorage';
import { STORAGE_KEY, STORAGE_VERSION } from '@/lib/defaults';
import { calculateResults } from '@/lib/calculations';

// Type for the stored calculator state
interface StoredCalculatorState {
  version: number;
  currentInputs: CalculatorInputs;
  // Other fields exist but we only need currentInputs
}

/**
 * Main hook for managing savings goals
 * Handles CRUD operations, calculations, and localStorage persistence
 */
export function useSavingsGoals() {
  const [goals, setGoals] = useLocalStorage<SavingsGoal[]>(STORAGE_KEYS.GOALS, []);
  const [actualHourlyWage, setActualHourlyWage] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('progress-desc');

  // Load actual hourly wage from wage calculator
  useEffect(() => {
    const stored = safeGetItem<StoredCalculatorState>(STORAGE_KEY);
    if (stored && stored.version === STORAGE_VERSION && stored.currentInputs) {
      // Only calculate if we have valid income data
      if (stored.currentInputs.income?.grossAnnualIncome > 0) {
        const results = calculateResults(stored.currentInputs);
        if (results?.actualHourlyWage) {
          setActualHourlyWage(results.actualHourlyWage);
        }
      }
    }
  }, []);

  // Add goal (max 5)
  const addGoal = useCallback(
    (input: SavingsGoalInput) => {
      // Validate input
      const validation = validateSavingsGoalInput(input);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Check max goals
      if (!canAddGoal(goals)) {
        throw new Error(
          'Hámark náð. Þú getur haft allt að 5 markmið í einu. Ljúktu markmiði til að bæta við nýju.',
        );
      }

      const newGoal: SavingsGoal = {
        id: crypto.randomUUID(),
        name: input.name,
        targetAmount: input.targetAmount,
        currentAmount: input.currentAmount,
        monthlyContribution: input.monthlyContribution,
        createdAt: new Date(),
        updatedAt: new Date(),
        achievedMilestones: [],
        isCompleted: false,
        sortOrder: goals.length,
      };

      setGoals([...goals, newGoal]);
    },
    [goals, setGoals],
  );

  // Update goal
  const updateGoal = useCallback(
    (id: string, updates: Partial<SavingsGoalInput>) => {
      const goalIndex = goals.findIndex((g) => g.id === id);
      if (goalIndex === -1) return;

      const goal = goals[goalIndex];
      const updatedInput = {
        name: updates.name ?? goal.name,
        targetAmount: updates.targetAmount ?? goal.targetAmount,
        currentAmount: updates.currentAmount ?? goal.currentAmount,
        monthlyContribution: updates.monthlyContribution ?? goal.monthlyContribution,
      };

      // Validate updated input
      const validation = validateSavingsGoalInput(updatedInput);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Check if milestones need to be updated
      const oldProgress = (goal.currentAmount / goal.targetAmount) * 100;
      const newProgress = (updatedInput.currentAmount / updatedInput.targetAmount) * 100;
      const achievedMilestones = [...goal.achievedMilestones];

      // Check if new milestones were achieved
      const milestones = [10, 25, 50, 75, 100];
      for (const milestone of milestones) {
        if (
          newProgress >= milestone &&
          oldProgress < milestone &&
          !achievedMilestones.includes(milestone)
        ) {
          achievedMilestones.push(milestone);
        }
      }

      const updatedGoal: SavingsGoal = {
        ...goal,
        ...updatedInput,
        updatedAt: new Date(),
        achievedMilestones,
      };

      const newGoals = [...goals];
      newGoals[goalIndex] = updatedGoal;
      setGoals(newGoals);
    },
    [goals, setGoals],
  );

  // Delete goal
  const deleteGoal = useCallback(
    (id: string) => {
      setGoals(goals.filter((g) => g.id !== id));
    },
    [goals, setGoals],
  );

  // Mark as completed
  const markAsCompleted = useCallback(
    (id: string) => {
      const goalIndex = goals.findIndex((g) => g.id === id);
      if (goalIndex === -1) return;

      const updatedGoal: SavingsGoal = {
        ...goals[goalIndex],
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date(),
      };

      const newGoals = [...goals];
      newGoals[goalIndex] = updatedGoal;
      setGoals(newGoals);
    },
    [goals, setGoals],
  );

  // Get calculations for a goal
  const getCalculations = useCallback(
    (goal: SavingsGoal): SavingsGoalCalculations => {
      if (!actualHourlyWage) {
        return {
          progressPercentage: 0,
          hoursWorked: 0,
          hoursRemaining: 0,
          formattedHoursWorked: '0 klukkustundir',
          formattedHoursRemaining: '0 klukkustundir',
          monthsToGoal: null,
          estimatedCompletionDate: null,
          status: 'started',
          statusColor: 'red',
          nextMilestone: null,
        };
      }

      return calculateSavingsGoal(goal, actualHourlyWage);
    },
    [actualHourlyWage],
  );

  // Get summary
  const getSummary = useCallback((): SavingsSummary => {
    if (!actualHourlyWage) {
      return createEmptyAnalysis();
    }

    return calculateSavingsSummary(goals, actualHourlyWage);
  }, [goals, actualHourlyWage]);

  // Sort goals
  const sortedGoals = useMemo(() => {
    if (!actualHourlyWage) return goals;

    const activeGoals = goals.filter((g) => !g.isCompleted);

    let sorted = [...activeGoals];

    switch (sortBy) {
      case 'progress-desc': {
        sorted.sort((a, b) => {
          const progressA = (a.currentAmount / a.targetAmount) * 100;
          const progressB = (b.currentAmount / b.targetAmount) * 100;
          return progressB - progressA;
        });
        break;
      }
      case 'progress-asc': {
        sorted.sort((a, b) => {
          const progressA = (a.currentAmount / a.targetAmount) * 100;
          const progressB = (b.currentAmount / b.targetAmount) * 100;
          return progressA - progressB;
        });
        break;
      }
      case 'amount-desc': {
        sorted.sort((a, b) => b.targetAmount - a.targetAmount);
        break;
      }
      case 'amount-asc': {
        sorted.sort((a, b) => a.targetAmount - b.targetAmount);
        break;
      }
      case 'time-desc':
      case 'time-asc': {
        const goalsWithTime: Array<{ goal: SavingsGoal; months: number | null }> = sorted.map(
          (goal) => {
            const remaining = goal.targetAmount - goal.currentAmount;
            const months =
              goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : null;
            return { goal, months };
          },
        );

        // Sort: null values (no monthly contribution) come last
        goalsWithTime.sort((a, b) => {
          if (a.months === null && b.months === null) return 0;
          if (a.months === null) return 1;
          if (b.months === null) return -1;

          if (sortBy === 'time-desc') {
            return b.months - a.months;
          } else {
            return a.months - b.months;
          }
        });

        sorted = goalsWithTime.map((item) => item.goal);
        break;
      }
      case 'manual': {
        sorted.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        break;
      }
    }

    return sorted;
  }, [goals, sortBy, actualHourlyWage]);

  // Can add more goals
  const canAddMore = canAddGoal(goals);

  return {
    goals: sortedGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    markAsCompleted,
    getCalculations,
    getSummary,
    actualHourlyWage,
    sortBy,
    setSortBy,
    canAddMore,
  };
}
