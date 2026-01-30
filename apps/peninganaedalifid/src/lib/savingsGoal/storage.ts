/**
 * Storage functions for savings goals export/import
 */

import type { SavingsGoal } from '@/types/savingsGoal';

/**
 * Storage key constants
 */
export const STORAGE_KEYS = {
  GOALS: 'savings_goals',
  COMPLETED_GOALS: 'savings_goals_completed',
} as const;

/**
 * Export data structure
 */
interface ExportData {
  version: string;
  exportDate: string;
  goals: SavingsGoal[];
}

/**
 * Export savings goals to JSON file
 * @param goals - Array of goals to export
 */
export function exportSavingsGoals(goals: SavingsGoal[]): void {
  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    goals,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  link.href = url;
  link.download = `sparnadarmarkmidin-${date}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Import savings goals from JSON file
 * @param file - The file to import
 * @returns Promise resolving to array of goals
 */
export async function importSavingsGoals(file: File): Promise<SavingsGoal[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ExportData;

        // Validate structure
        if (!data.goals || !Array.isArray(data.goals)) {
          throw new Error('Invalid file format');
        }

        // Validate and parse each goal
        const goals: SavingsGoal[] = data.goals.map((g: any) => ({
          ...g,
          createdAt: new Date(g.createdAt),
          updatedAt: new Date(g.updatedAt),
          completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
        }));

        resolve(goals);
      } catch (error) {
        reject(
          new Error(
            'Ekki tókst að flytja inn. Vinsamlegast veldu gilda sparnaðarmarkmið skrá.',
          ),
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Villa við að lesa skrá'));
    };

    reader.readAsText(file);
  });
}
