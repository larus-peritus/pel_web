import type { Preset, PresetCategory, MoneyExpenses, TimeExpenses } from '@/types/calculator';

/**
 * Commute preset with both cost and time
 */
export interface CommutePresetValues {
  cost: number; // Yearly cost in ISK
  timeHoursPerWeek: number; // Weekly commute hours
  oneWayMinutes: number; // One-way commute time in minutes (for display)
}

export interface CommutePreset {
  id: string;
  label: string;
  description: string;
  values: CommutePresetValues;
}

/**
 * Commute presets - from remote work to long commutes
 * Cost values in ISK (yearly), time values in weekly hours
 *
 * Time conversion: one-way minutes × 2 (round trip) × 5 (days) / 60 = hours/week
 */
export const COMMUTE_PRESETS: CommutePreset[] = [
  {
    id: 'commute-none',
    label: 'Heimavinna',
    description: 'Vinna heima, enginn ferðakostnaður eða tími',
    values: { cost: 0, timeHoursPerWeek: 0, oneWayMinutes: 0 },
  },
  {
    id: 'commute-short',
    label: 'Stutt vegalengd',
    description: '~15 mín hvor leið',
    values: { cost: 170000, timeHoursPerWeek: 2.5, oneWayMinutes: 15 }, // 15 * 2 * 5 / 60 = 2.5
  },
  {
    id: 'commute-medium',
    label: 'Meðal vegalengd',
    description: '~30 mín hvor leið',
    values: { cost: 400000, timeHoursPerWeek: 5, oneWayMinutes: 30 }, // 30 * 2 * 5 / 60 = 5
  },
  {
    id: 'commute-long',
    label: 'Löng vegalengd',
    description: '~45 mín hvor leið',
    values: { cost: 800000, timeHoursPerWeek: 7.5, oneWayMinutes: 45 }, // 45 * 2 * 5 / 60 = 7.5
  },
  {
    id: 'commute-very-long',
    label: 'Mjög löng vegalengd',
    description: '~60 mín hvor leið',
    values: { cost: 1400000, timeHoursPerWeek: 10, oneWayMinutes: 60 }, // 60 * 2 * 5 / 60 = 10
  },
];

/**
 * Work clothing presets
 * Values in ISK (Icelandic króna)
 */
export const CLOTHING_PRESETS: Preset[] = [
  {
    id: 'clothing-uniform',
    category: 'clothing',
    label: 'Einkennisfatnaður í boði',
    description: 'Vinnuveitandi útvegar vinnufatnað',
    values: { clothing: 0 },
  },
  {
    id: 'clothing-casual',
    category: 'clothing',
    label: 'Frjálslegur',
    description: 'Lágmarks vinnufatnaður þarf',
    values: { clothing: 30000 },
  },
  {
    id: 'clothing-business-casual',
    category: 'clothing',
    label: 'Hálf-formlegt',
    description: 'Nokkur faglegur fatnaður krafist',
    values: { clothing: 110000 },
  },
  {
    id: 'clothing-professional',
    category: 'clothing',
    label: 'Formlegt',
    description: 'Jakkaföt, formlegt klæðaburður',
    values: { clothing: 280000 },
  },
];

/**
 * Work meals presets
 * Values in ISK (Icelandic króna)
 */
export const MEAL_PRESETS: Preset[] = [
  {
    id: 'meals-provided',
    category: 'meals',
    label: 'Matur í boði',
    description: 'Vinnuveitandi sér um máltíðir',
    values: { meals: 0 },
  },
  {
    id: 'meals-bring',
    category: 'meals',
    label: 'Tek nesti',
    description: 'Tek nesti flesta daga',
    values: { meals: 70000 },
  },
  {
    id: 'meals-occasional',
    category: 'meals',
    label: 'Kaupi stundum',
    description: 'Kaupi hádegismat 1-2x í viku',
    values: { meals: 200000 },
  },
  {
    id: 'meals-daily',
    category: 'meals',
    label: 'Kaupi daglega',
    description: 'Kaupi hádegismat flesta vinnudaga',
    values: { meals: 500000 },
  },
];

/**
 * Get all presets for a category (excluding commute which uses CommutePreset)
 */
export function getPresetsByCategory(category: Exclude<PresetCategory, 'commute'>): Preset[] {
  switch (category) {
    case 'clothing':
      return CLOTHING_PRESETS;
    case 'meals':
      return MEAL_PRESETS;
    default:
      return [];
  }
}

/**
 * Get all standard presets (excluding commute)
 */
export function getAllPresets(): Preset[] {
  return [...CLOTHING_PRESETS, ...MEAL_PRESETS];
}

/**
 * Detect which preset matches current values (for non-commute categories)
 * Returns null if values don't match any preset
 */
export function detectPreset(
  category: Exclude<PresetCategory, 'commute'>,
  currentValues: Partial<MoneyExpenses & TimeExpenses>
): Preset | null {
  const presets = getPresetsByCategory(category);

  for (const preset of presets) {
    const presetValue = preset.values[category];
    const currentValue = currentValues[category];

    if (presetValue === currentValue) {
      return preset;
    }
  }

  return null;
}

/**
 * Find a preset by ID (non-commute presets only)
 */
export function getPresetById(id: string): Preset | null {
  return getAllPresets().find(p => p.id === id) ?? null;
}

/**
 * Detect which commute preset matches current values
 * Checks both cost and time values
 */
export function detectCommutePreset(
  commuteCost: number,
  commuteTimeHours: number
): CommutePreset | null {
  for (const preset of COMMUTE_PRESETS) {
    if (preset.values.cost === commuteCost && preset.values.timeHoursPerWeek === commuteTimeHours) {
      return preset;
    }
  }
  return null;
}
