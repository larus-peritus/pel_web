import { describe, it, expect } from 'vitest';
import {
  formatSavingsLifeEnergy,
  getGoalStatus,
  getStatusColor,
  getNextMilestone,
  calculateSavingsGoal,
  calculateSavingsSummary,
  createEmptyAnalysis,
} from '../calculations';
import type { SavingsGoal } from '@/types/savingsGoal';

describe('formatSavingsLifeEnergy', () => {
  it('should format hours correctly', () => {
    expect(formatSavingsLifeEnergy(5)).toBe('5 klukkustundir');
    expect(formatSavingsLifeEnergy(1)).toBe('1 klukkustund');
    expect(formatSavingsLifeEnergy(0)).toBe('0 klukkustundir');
  });

  it('should format work days correctly', () => {
    expect(formatSavingsLifeEnergy(16)).toBe('2 vinnudagar');
    expect(formatSavingsLifeEnergy(8)).toBe('1 vinnudagur');
    expect(formatSavingsLifeEnergy(40)).toBe('5 vinnudagar');
  });

  it('should format work weeks correctly', () => {
    expect(formatSavingsLifeEnergy(200)).toBe('5 vinnuvikur');
    expect(formatSavingsLifeEnergy(80)).toBe('2 vinnuvikur');
  });

  it('should handle edge cases', () => {
    expect(formatSavingsLifeEnergy(-10)).toBe('0 klukkustundir');
    expect(formatSavingsLifeEnergy(Infinity)).toBe('∞ klukkustundir');
  });
});

describe('getGoalStatus', () => {
  it('should return correct status for each range', () => {
    expect(getGoalStatus(0)).toBe('started');
    expect(getGoalStatus(33)).toBe('started');
    expect(getGoalStatus(34)).toBe('progressing');
    expect(getGoalStatus(66)).toBe('progressing');
    expect(getGoalStatus(67)).toBe('almost-there');
    expect(getGoalStatus(99)).toBe('almost-there');
    expect(getGoalStatus(100)).toBe('achieved');
    expect(getGoalStatus(150)).toBe('achieved');
  });
});

describe('getStatusColor', () => {
  it('should return correct color for each status', () => {
    expect(getStatusColor('started')).toBe('red');
    expect(getStatusColor('progressing')).toBe('yellow');
    expect(getStatusColor('almost-there')).toBe('blue');
    expect(getStatusColor('achieved')).toBe('green');
  });
});

describe('getNextMilestone', () => {
  it('should return first milestone for low progress', () => {
    expect(getNextMilestone(5, [])).toBe(10);
  });

  it('should return next milestone after achieved ones', () => {
    expect(getNextMilestone(30, [10, 25])).toBe(50);
  });

  it('should return null when all milestones achieved', () => {
    expect(getNextMilestone(100, [10, 25, 50, 75, 100])).toBeNull();
  });

  it('should handle edge cases', () => {
    expect(getNextMilestone(0, [])).toBe(10);
    expect(getNextMilestone(99, [10, 25, 50, 75])).toBe(100);
  });
});

describe('calculateSavingsGoal', () => {
  const createMockGoal = (overrides?: Partial<SavingsGoal>): SavingsGoal => ({
    id: '1',
    name: 'Test Goal',
    targetAmount: 1000000,
    currentAmount: 250000,
    monthlyContribution: 50000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    achievedMilestones: [],
    isCompleted: false,
    ...overrides,
  });

  it('should calculate correctly with normal inputs', () => {
    const goal = createMockGoal();
    const result = calculateSavingsGoal(goal, 2500);

    expect(result.progressPercentage).toBe(25);
    expect(result.hoursWorked).toBe(100); // 250000 / 2500
    expect(result.hoursRemaining).toBe(300); // 750000 / 2500
    expect(result.monthsToGoal).toBe(15); // 750000 / 50000
    expect(result.status).toBe('started');
    expect(result.statusColor).toBe('red');
    expect(result.nextMilestone).toBe(50); // Next milestone after 25%
  });

  it('should handle 0% progress', () => {
    const goal = createMockGoal({ currentAmount: 0 });
    const result = calculateSavingsGoal(goal, 2500);

    expect(result.progressPercentage).toBe(0);
    expect(result.hoursWorked).toBe(0);
    expect(result.status).toBe('started');
  });

  it('should handle 100% progress', () => {
    const goal = createMockGoal({ currentAmount: 1000000 });
    const result = calculateSavingsGoal(goal, 2500);

    expect(result.progressPercentage).toBe(100);
    expect(result.hoursRemaining).toBe(0);
    expect(result.status).toBe('achieved');
    expect(result.statusColor).toBe('green');
  });

  it('should handle over 100% progress', () => {
    const goal = createMockGoal({ currentAmount: 1500000 });
    const result = calculateSavingsGoal(goal, 2500);

    expect(result.progressPercentage).toBe(150);
    expect(result.hoursRemaining).toBe(0);
    expect(result.status).toBe('achieved');
  });

  it('should handle zero wage', () => {
    const goal = createMockGoal();
    const result = calculateSavingsGoal(goal, 0);

    expect(result.hoursWorked).toBe(Infinity);
    expect(result.hoursRemaining).toBe(Infinity);
  });

  it('should handle no monthly contribution', () => {
    const goal = createMockGoal({ monthlyContribution: 0 });
    const result = calculateSavingsGoal(goal, 2500);

    expect(result.monthsToGoal).toBeNull();
    expect(result.estimatedCompletionDate).toBeNull();
  });
});

describe('calculateSavingsSummary', () => {
  const createMockGoal = (id: string, overrides?: Partial<SavingsGoal>): SavingsGoal => ({
    id,
    name: `Goal ${id}`,
    targetAmount: 1000000,
    currentAmount: 250000,
    monthlyContribution: 50000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    achievedMilestones: [],
    isCompleted: false,
    ...overrides,
  });

  it('should calculate summary for single goal', () => {
    const goals = [createMockGoal('1')];
    const result = calculateSavingsSummary(goals, 2500);

    expect(result.totalGoals).toBe(1);
    expect(result.totalTargetAmount).toBe(1000000);
    expect(result.totalCurrentAmount).toBe(250000);
    expect(result.overallProgress).toBe(25);
    expect(result.totalHoursWorked).toBe(100);
    expect(result.totalHoursRemaining).toBe(300);
  });

  it('should calculate summary for multiple goals', () => {
    const goals = [createMockGoal('1'), createMockGoal('2'), createMockGoal('3')];
    const result = calculateSavingsSummary(goals, 2500);

    expect(result.totalGoals).toBe(3);
    expect(result.totalTargetAmount).toBe(3000000);
    expect(result.totalCurrentAmount).toBe(750000);
    expect(result.overallProgress).toBe(25);
  });

  it('should only count active goals', () => {
    const goals = [
      createMockGoal('1'),
      createMockGoal('2', { isCompleted: true }),
      createMockGoal('3', { isCompleted: true }),
    ];
    const result = calculateSavingsSummary(goals, 2500);

    expect(result.totalGoals).toBe(1);
    expect(result.totalTargetAmount).toBe(1000000);
  });

  it('should handle empty array', () => {
    const result = calculateSavingsSummary([], 2500);

    expect(result.totalGoals).toBe(0);
    expect(result.totalTargetAmount).toBe(0);
    expect(result.totalCurrentAmount).toBe(0);
    expect(result.overallProgress).toBe(0);
  });
});

describe('createEmptyAnalysis', () => {
  it('should return empty summary', () => {
    const result = createEmptyAnalysis();

    expect(result.totalGoals).toBe(0);
    expect(result.totalTargetAmount).toBe(0);
    expect(result.totalCurrentAmount).toBe(0);
    expect(result.overallProgress).toBe(0);
    expect(result.totalHoursWorked).toBe(0);
    expect(result.totalHoursRemaining).toBe(0);
    expect(result.formattedTotalHoursWorked).toBe('0 klukkustundir');
    expect(result.formattedTotalHoursRemaining).toBe('0 klukkustundir');
  });
});
