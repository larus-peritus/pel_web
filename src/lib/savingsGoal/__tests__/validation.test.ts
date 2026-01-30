import { describe, it, expect } from 'vitest';
import { validateSavingsGoalInput, canAddGoal } from '../validation';
import type { SavingsGoal } from '@/types/savingsGoal';

describe('validateSavingsGoalInput', () => {
  it('should validate correct input', () => {
    const input = {
      name: 'Útborgun á húsnæði',
      targetAmount: 3000000,
      currentAmount: 750000,
      monthlyContribution: 50000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should reject empty name', () => {
    const input = {
      name: '',
      targetAmount: 3000000,
      currentAmount: 750000,
      monthlyContribution: 50000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Nafn er áskilið');
  });

  it('should reject name with only whitespace', () => {
    const input = {
      name: '   ',
      targetAmount: 3000000,
      currentAmount: 750000,
      monthlyContribution: 50000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Nafn er áskilið');
  });

  it('should reject name longer than 100 characters', () => {
    const input = {
      name: 'a'.repeat(101),
      targetAmount: 3000000,
      currentAmount: 750000,
      monthlyContribution: 50000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Nafn má ekki vera lengra en 100 stafir');
  });

  it('should reject targetAmount = 0', () => {
    const input = {
      name: 'Test',
      targetAmount: 0,
      currentAmount: 0,
      monthlyContribution: 50000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.targetAmount).toBe('Markkrónutala verður að vera stærri en 0');
  });

  it('should reject targetAmount > 1 billion', () => {
    const input = {
      name: 'Test',
      targetAmount: 1_000_000_001,
      currentAmount: 0,
      monthlyContribution: 50000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.targetAmount).toBe(
      'Markkrónutala má ekki vera yfir 1.000.000.000 kr',
    );
  });

  it('should reject negative currentAmount', () => {
    const input = {
      name: 'Test',
      targetAmount: 3000000,
      currentAmount: -100,
      monthlyContribution: 50000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.currentAmount).toBe('Núverandi sparnaður getur ekki verið neikvæður');
  });

  it('should reject currentAmount > targetAmount', () => {
    const input = {
      name: 'Test',
      targetAmount: 1000000,
      currentAmount: 2000000,
      monthlyContribution: 50000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.currentAmount).toBe(
      'Núverandi sparnaður getur ekki verið meiri en markkrónutala',
    );
  });

  it('should reject negative monthlyContribution', () => {
    const input = {
      name: 'Test',
      targetAmount: 3000000,
      currentAmount: 750000,
      monthlyContribution: -1000,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.monthlyContribution).toBe(
      'Mánaðarlegt framlag getur ekki verið neikvætt',
    );
  });

  it('should handle multiple errors simultaneously', () => {
    const input = {
      name: '',
      targetAmount: 0,
      currentAmount: -100,
      monthlyContribution: -50,
    };

    const result = validateSavingsGoalInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.targetAmount).toBeDefined();
    expect(result.errors.currentAmount).toBeDefined();
    expect(result.errors.monthlyContribution).toBeDefined();
  });
});

describe('canAddGoal', () => {
  const createMockGoal = (id: string, isCompleted = false): SavingsGoal => ({
    id,
    name: `Goal ${id}`,
    targetAmount: 1000000,
    currentAmount: 250000,
    monthlyContribution: 50000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    achievedMilestones: [],
    isCompleted,
  });

  it('should return true with 0 goals', () => {
    expect(canAddGoal([])).toBe(true);
  });

  it('should return true with 4 goals', () => {
    const goals = [
      createMockGoal('1'),
      createMockGoal('2'),
      createMockGoal('3'),
      createMockGoal('4'),
    ];
    expect(canAddGoal(goals)).toBe(true);
  });

  it('should return false with 5 goals', () => {
    const goals = [
      createMockGoal('1'),
      createMockGoal('2'),
      createMockGoal('3'),
      createMockGoal('4'),
      createMockGoal('5'),
    ];
    expect(canAddGoal(goals)).toBe(false);
  });

  it('should only count active goals', () => {
    const goals = [
      createMockGoal('1'),
      createMockGoal('2'),
      createMockGoal('3'),
      createMockGoal('4', true),
      createMockGoal('5', true),
    ];
    expect(canAddGoal(goals)).toBe(true); // Only 3 active
  });
});
