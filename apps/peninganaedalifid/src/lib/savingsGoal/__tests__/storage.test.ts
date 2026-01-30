import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportSavingsGoals, importSavingsGoals, STORAGE_KEYS } from '../storage';
import type { SavingsGoal } from '@/types/savingsGoal';

describe('STORAGE_KEYS', () => {
  it('should have correct keys', () => {
    expect(STORAGE_KEYS.GOALS).toBe('savings_goals');
    expect(STORAGE_KEYS.COMPLETED_GOALS).toBe('savings_goals_completed');
  });
});

describe('exportSavingsGoals', () => {
  const createMockGoal = (): SavingsGoal => ({
    id: '1',
    name: 'Test Goal',
    targetAmount: 1000000,
    currentAmount: 250000,
    monthlyContribution: 50000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    achievedMilestones: [10, 25],
    isCompleted: false,
  });

  beforeEach(() => {
    // Mock DOM APIs
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
    document.createElement = vi.fn((tag) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: vi.fn(),
        } as any;
      }
      return {} as any;
    });
  });

  it('should create download with correct filename format', () => {
    const goals = [createMockGoal()];
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    document.createElement = vi.fn(() => mockLink as any);

    exportSavingsGoals(goals);

    expect(mockLink.download).toMatch(/^sparnadarmarkmidin-\d{4}-\d{2}-\d{2}\.json$/);
  });

  it('should create valid JSON structure', () => {
    const goals = [createMockGoal()];
    let capturedBlob: Blob | null = null;

    global.URL.createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob;
      return 'mock-url';
    });

    exportSavingsGoals(goals);

    expect(capturedBlob).toBeTruthy();
    expect(capturedBlob?.type).toBe('application/json');
  });

  it('should trigger download', () => {
    const goals = [createMockGoal()];
    const clickMock = vi.fn();
    const mockLink = {
      href: '',
      download: '',
      click: clickMock,
    };
    document.createElement = vi.fn(() => mockLink as any);

    exportSavingsGoals(goals);

    expect(clickMock).toHaveBeenCalled();
  });

  it('should revoke URL after download', () => {
    const goals = [createMockGoal()];
    const revokeURLMock = vi.fn();
    global.URL.revokeObjectURL = revokeURLMock;

    exportSavingsGoals(goals);

    expect(revokeURLMock).toHaveBeenCalledWith('mock-url');
  });
});

describe('importSavingsGoals', () => {
  const createMockFile = (content: string): File => {
    return new File([content], 'test.json', { type: 'application/json' });
  };

  const validData = {
    version: '1.0',
    exportDate: '2024-01-01T00:00:00.000Z',
    goals: [
      {
        id: '1',
        name: 'Test Goal',
        targetAmount: 1000000,
        currentAmount: 250000,
        monthlyContribution: 50000,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        achievedMilestones: [10, 25],
        isCompleted: false,
      },
    ],
  };

  it('should parse valid file', async () => {
    const file = createMockFile(JSON.stringify(validData));
    const goals = await importSavingsGoals(file);

    expect(goals).toHaveLength(1);
    expect(goals[0].name).toBe('Test Goal');
    expect(goals[0].targetAmount).toBe(1000000);
    expect(goals[0].createdAt).toBeInstanceOf(Date);
    expect(goals[0].updatedAt).toBeInstanceOf(Date);
  });

  it('should parse dates correctly', async () => {
    const file = createMockFile(JSON.stringify(validData));
    const goals = await importSavingsGoals(file);

    expect(goals[0].createdAt).toBeInstanceOf(Date);
    expect(goals[0].updatedAt).toBeInstanceOf(Date);
    expect(goals[0].createdAt.getFullYear()).toBe(2024);
  });

  it('should handle completedAt when present', async () => {
    const dataWithCompletedAt = {
      ...validData,
      goals: [
        {
          ...validData.goals[0],
          completedAt: '2024-06-01T00:00:00.000Z',
        },
      ],
    };

    const file = createMockFile(JSON.stringify(dataWithCompletedAt));
    const goals = await importSavingsGoals(file);

    expect(goals[0].completedAt).toBeInstanceOf(Date);
    expect(goals[0].completedAt!.getMonth()).toBe(5); // June (0-indexed)
  });

  it('should handle completedAt when undefined', async () => {
    const file = createMockFile(JSON.stringify(validData));
    const goals = await importSavingsGoals(file);

    expect(goals[0].completedAt).toBeUndefined();
  });

  it('should reject invalid JSON', async () => {
    const file = createMockFile('invalid json');

    await expect(importSavingsGoals(file)).rejects.toThrow(
      'Ekki tókst að flytja inn. Vinsamlegast veldu gilda sparnaðarmarkmið skrá.',
    );
  });

  it('should reject missing goals array', async () => {
    const invalidData = {
      version: '1.0',
      exportDate: '2024-01-01T00:00:00.000Z',
    };

    const file = createMockFile(JSON.stringify(invalidData));

    await expect(importSavingsGoals(file)).rejects.toThrow(
      'Ekki tókst að flytja inn. Vinsamlegast veldu gilda sparnaðarmarkmið skrá.',
    );
  });

  it('should reject non-array goals', async () => {
    const invalidData = {
      version: '1.0',
      exportDate: '2024-01-01T00:00:00.000Z',
      goals: 'not an array',
    };

    const file = createMockFile(JSON.stringify(invalidData));

    await expect(importSavingsGoals(file)).rejects.toThrow(
      'Ekki tókst að flytja inn. Vinsamlegast veldu gilda sparnaðarmarkmið skrá.',
    );
  });
});
