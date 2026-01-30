/**
 * Export/Import utilities for user data
 *
 * Allows users to export all their calculator settings and data to a JSON file,
 * and import it later (or on a different browser/device).
 */

/**
 * All storage keys that contain user data (not UI preferences)
 */
export const EXPORTABLE_STORAGE_KEYS = [
  'actual-hourly-wage-calculator', // Main calculator (expense baseline, FI number, etc.)
  'pensionAwareFire_state', // Pension-aware FIRE calculator
  'leanFire_state', // LeanFIRE calculator
  'oneTimePurchase_state', // One-time purchase calculator
  'travelVacation_state', // Travel/vacation calculator
  'savings_goals', // Savings goals
  'savings_goals_completed', // Completed savings goals
  'cascadingCutSettings', // Cascading cut calculator
] as const;

/**
 * Human-readable names for storage keys (Icelandic)
 */
export const STORAGE_KEY_LABELS: Record<string, string> = {
  'actual-hourly-wage-calculator': 'Aðal reiknivél (útgjöld, FI-tala, sparnaðarskýrsla)',
  pensionAwareFire_state: 'Lífeyristengd FIRE reiknivél',
  leanFire_state: 'LeanFIRE reiknivél',
  oneTimePurchase_state: 'Einskiptiskaup reiknivél',
  travelVacation_state: 'Ferðalög og frí reiknivél',
  savings_goals: 'Sparnaðarmarkmið',
  savings_goals_completed: 'Kláruð sparnaðarmarkmið',
  cascadingCutSettings: 'Keðjuverkandi niðurskurður',
};

/**
 * Export data structure
 */
export interface ExportData {
  version: number;
  exportedAt: string;
  source: string;
  data: Record<string, unknown>;
}

/**
 * Export result
 */
export interface ExportResult {
  success: boolean;
  filename?: string;
  error?: string;
  keysExported: string[];
}

/**
 * Import result
 */
export interface ImportResult {
  success: boolean;
  error?: string;
  keysImported: string[];
  keysSkipped: string[];
}

/**
 * Get all exportable data from localStorage
 */
export function getExportableData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  for (const key of EXPORTABLE_STORAGE_KEYS) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) {
        // Try to parse as JSON, otherwise store as string
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    } catch (error) {
      console.warn(`Failed to read ${key} from localStorage:`, error);
    }
  }

  return data;
}

/**
 * Export all user data to a JSON file
 */
export function exportUserData(): ExportResult {
  try {
    const data = getExportableData();
    const keysExported = Object.keys(data);

    if (keysExported.length === 0) {
      return {
        success: false,
        error: 'Engin gögn til að flytja út. Þú hefur ekki slegið inn neinar upplýsingar enn.',
        keysExported: [],
      };
    }

    const exportData: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      source: 'peninganaedalifid',
      data,
    };

    // Create blob and download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const filename = `peninganaedalifid-gogn-${date}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      filename,
      keysExported,
    };
  } catch (error) {
    console.error('Export failed:', error);
    return {
      success: false,
      error: 'Villa kom upp við útflutning gagna. Vinsamlegast reyndu aftur.',
      keysExported: [],
    };
  }
}

/**
 * Validate import data structure
 */
export function validateImportData(data: unknown): data is ExportData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check required fields
  if (typeof obj.version !== 'number') return false;
  if (typeof obj.exportedAt !== 'string') return false;
  if (typeof obj.source !== 'string') return false;
  if (typeof obj.data !== 'object' || obj.data === null) return false;

  // Check source
  if (obj.source !== 'peninganaedalifid') {
    return false;
  }

  return true;
}

/**
 * Import user data from a JSON file content
 */
export function importUserData(fileContent: string): ImportResult {
  try {
    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(fileContent);
    } catch {
      return {
        success: false,
        error: 'Skráin er ekki gild JSON skrá.',
        keysImported: [],
        keysSkipped: [],
      };
    }

    // Validate structure
    if (!validateImportData(parsed)) {
      return {
        success: false,
        error: 'Skráin er ekki gild útflutningsskrá frá Peningana eða lífið.',
        keysImported: [],
        keysSkipped: [],
      };
    }

    const keysImported: string[] = [];
    const keysSkipped: string[] = [];

    // Import each key
    for (const [key, value] of Object.entries(parsed.data)) {
      // Only import known keys for security
      if (!EXPORTABLE_STORAGE_KEYS.includes(key as (typeof EXPORTABLE_STORAGE_KEYS)[number])) {
        keysSkipped.push(key);
        continue;
      }

      try {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
        keysImported.push(key);
      } catch (error) {
        console.warn(`Failed to import ${key}:`, error);
        keysSkipped.push(key);
      }
    }

    if (keysImported.length === 0) {
      return {
        success: false,
        error: 'Engin gögn fundust í skránni sem hægt er að flytja inn.',
        keysImported: [],
        keysSkipped,
      };
    }

    return {
      success: true,
      keysImported,
      keysSkipped,
    };
  } catch (error) {
    console.error('Import failed:', error);
    return {
      success: false,
      error: 'Villa kom upp við innflutning gagna. Vinsamlegast reyndu aftur.',
      keysImported: [],
      keysSkipped: [],
    };
  }
}

/**
 * Read file content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
