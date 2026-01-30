/**
 * Data export and import functionality
 *
 * Handles exporting application data to JSON files and importing from backups.
 * Includes version management and data validation for safe migrations.
 */

/**
 * Application state that can be persisted and exported
 *
 * This interface will be extended as features are added to the application.
 * For now, it contains only the core version tracking fields.
 */
export interface StoredState {
  /** Schema version for migrations */
  version: string;
  /** ISO timestamp of when data was exported (optional, added during export) */
  exportedAt?: string;
  /** Application version at time of export (optional, added during export) */
  appVersion?: string;
  // Future fields will be added here as features are implemented:
  // calculator?: CalculatorData;
  // scenarios?: Scenario[];
}

/** Current version of the storage schema */
const CURRENT_VERSION = '1.0.0';

/**
 * Export all data as a downloadable JSON file
 *
 * @param data - The application state to export
 *
 * @example
 * ```ts
 * const state: StoredState = { version: '1.0.0' };
 * exportData(state); // Downloads life-energy-data-2026-01-19.json
 * ```
 */
export function exportData(data: StoredState): void {
  // Add metadata to the export
  const exportData: StoredState = {
    ...data,
    version: data.version || CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || CURRENT_VERSION,
  };

  // Create JSON blob
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create download link
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().split('T')[0];
  const filename = `life-energy-data-${date}.json`;

  // Trigger download
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file
 *
 * @param file - The File object to import
 * @returns Promise resolving to the validated and migrated state
 * @throws Error if file cannot be read, parsed, or validated
 *
 * @example
 * ```ts
 * const file = event.target.files[0];
 * try {
 *   const state = await importData(file);
 *   console.log('Data imported successfully:', state);
 * } catch (error) {
 *   console.error('Import failed:', error.message);
 * }
 * ```
 */
export async function importData(file: File): Promise<StoredState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        // Parse JSON
        const result = event.target?.result;
        if (typeof result !== 'string') {
          reject(new Error('Failed to read file contents'));
          return;
        }

        const data = JSON.parse(result);

        // Validate structure
        if (!isValidStoredState(data)) {
          reject(
            new Error(
              'Invalid file format. Please select a valid backup file exported from this application.'
            )
          );
          return;
        }

        // Migrate if needed
        const migratedData = migrateState(data);

        resolve(migratedData);
      } catch (error) {
        if (error instanceof SyntaxError) {
          reject(
            new Error(
              'Failed to parse file. The file may be corrupted or not a valid JSON file.'
            )
          );
        } else if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error('An unexpected error occurred while importing data'));
        }
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try again.'));
    };

    // Read file as text
    reader.readAsText(file);
  });
}

/**
 * Type guard to validate stored state structure
 *
 * @param data - Unknown data to validate
 * @returns true if data matches StoredState interface
 *
 * @example
 * ```ts
 * const data = JSON.parse(fileContents);
 * if (isValidStoredState(data)) {
 *   // TypeScript now knows data is StoredState
 *   console.log(data.version);
 * }
 * ```
 */
export function isValidStoredState(data: unknown): data is StoredState {
  // Must be an object
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  // Must have version field that is a string
  const obj = data as Record<string, unknown>;
  if (typeof obj.version !== 'string' || !obj.version) {
    return false;
  }

  // Optional fields should have correct types if present
  if (obj.exportedAt !== undefined && typeof obj.exportedAt !== 'string') {
    return false;
  }

  if (obj.appVersion !== undefined && typeof obj.appVersion !== 'string') {
    return false;
  }

  // Basic structure is valid
  return true;
}

/**
 * Migrate data from older versions to current version
 *
 * @param data - The stored state to migrate
 * @returns Migrated state at current version
 *
 * @example
 * ```ts
 * const oldData: StoredState = { version: '0.9.0' };
 * const newData = migrateState(oldData);
 * console.log(newData.version); // '1.0.0'
 * ```
 */
export function migrateState(data: StoredState): StoredState {
  let migrated = { ...data };

  // Parse version for comparison
  const currentParts = CURRENT_VERSION.split('.').map(Number);
  const dataParts = migrated.version.split('.').map(Number);

  // Helper to compare versions
  const isOlderVersion = (
    current: number[],
    compare: number[]
  ): boolean => {
    for (let i = 0; i < 3; i++) {
      if ((compare[i] || 0) < (current[i] || 0)) return true;
      if ((compare[i] || 0) > (current[i] || 0)) return false;
    }
    return false;
  };

  // Only migrate if data is from an older version
  if (!isOlderVersion(currentParts, dataParts)) {
    return migrated;
  }

  // Migration logic for future versions
  // Example:
  // if (dataParts[0] === 0) {
  //   // Migrate from 0.x.x to 1.x.x
  //   migrated = {
  //     ...migrated,
  //     version: '1.0.0',
  //     // Add any structural changes needed
  //   };
  // }

  // Update version to current
  migrated.version = CURRENT_VERSION;

  return migrated;
}
