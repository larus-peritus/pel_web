/**
 * Helper functions for debt scenario management
 * ID generation, export/import functionality
 */

import type { DebtPayoffScenario } from '@/types/debtPayoff';

/**
 * Generate a unique ID for a debt scenario
 *
 * @returns Unique scenario ID
 */
export function generateDebtScenarioId(): string {
  return `debt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export debt scenarios to JSON string
 *
 * @param scenarios - Array of debt scenarios to export
 * @returns JSON string
 */
export function exportScenarios(scenarios: DebtPayoffScenario[]): string {
  return JSON.stringify(scenarios, null, 2);
}

/**
 * Import debt scenarios from JSON string
 *
 * @param json - JSON string to parse
 * @returns Array of debt scenarios
 * @throws Error if JSON is invalid or doesn't match schema
 */
export function importScenarios(json: string): DebtPayoffScenario[] {
  try {
    const parsed = JSON.parse(json);

    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid scenario JSON: expected array');
    }

    // Validate each scenario has required fields
    for (const scenario of parsed) {
      if (!scenario.id || !scenario.name || !scenario.debt || !scenario.investment || !scenario.results) {
        throw new Error('Invalid scenario JSON: missing required fields');
      }
    }

    return parsed as DebtPayoffScenario[];
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid scenario JSON: syntax error');
    }
    throw error;
  }
}

/**
 * Validate a debt scenario object
 *
 * @param scenario - Scenario to validate
 * @returns True if valid, false otherwise
 */
export function isValidScenario(scenario: unknown): scenario is DebtPayoffScenario {
  if (typeof scenario !== 'object' || scenario === null) {
    return false;
  }

  const s = scenario as Record<string, unknown>;

  return (
    typeof s.id === 'string' &&
    typeof s.name === 'string' &&
    typeof s.debt === 'object' &&
    s.debt !== null &&
    typeof s.investment === 'object' &&
    s.investment !== null &&
    typeof s.peacOfMindFactor === 'number' &&
    typeof s.results === 'object' &&
    s.results !== null &&
    typeof s.createdAt === 'string' &&
    typeof s.updatedAt === 'string'
  );
}

/**
 * Sort scenarios by most recently updated
 *
 * @param scenarios - Array of scenarios
 * @returns Sorted array (newest first)
 */
export function sortScenariosByDate(scenarios: DebtPayoffScenario[]): DebtPayoffScenario[] {
  return [...scenarios].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/**
 * Find a scenario by ID
 *
 * @param scenarios - Array of scenarios
 * @param id - Scenario ID to find
 * @returns Scenario or undefined if not found
 */
export function findScenarioById(scenarios: DebtPayoffScenario[], id: string): DebtPayoffScenario | undefined {
  return scenarios.find((s) => s.id === id);
}

/**
 * Remove a scenario by ID
 *
 * @param scenarios - Array of scenarios
 * @param id - Scenario ID to remove
 * @returns New array without the scenario
 */
export function removeScenarioById(scenarios: DebtPayoffScenario[], id: string): DebtPayoffScenario[] {
  return scenarios.filter((s) => s.id !== id);
}

/**
 * Update a scenario by ID
 *
 * @param scenarios - Array of scenarios
 * @param id - Scenario ID to update
 * @param updates - Partial updates to apply
 * @returns New array with updated scenario
 */
export function updateScenarioById(
  scenarios: DebtPayoffScenario[],
  id: string,
  updates: Partial<DebtPayoffScenario>
): DebtPayoffScenario[] {
  return scenarios.map((s) => {
    if (s.id === id) {
      return {
        ...s,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return s;
  });
}
