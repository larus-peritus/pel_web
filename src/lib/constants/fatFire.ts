/**
 * Constants and default values for FatFIRE Planner (Lúxus FIRE Áætlun)
 *
 * FatFIRE = Financial Independence with luxurious lifestyle, no compromise.
 * This module contains all constants for premium lifestyle planning adapted
 * for Icelandic cost of living.
 */

import type { WishListCategoryConfig } from '@/types/fatFire';

/**
 * Default FatFIRE calculation parameters
 *
 * These defaults reflect the FatFIRE philosophy:
 * - Higher multiplier (30x) for extra safety margin
 * - Premium base expenses for deluxe Icelandic living
 * - Conservative return rate assumptions
 */
export const FATFIRE_DEFAULTS = {
  // FI multiplier (30x = 3.33% withdrawal rate)
  MULTIPLIER: 30,

  // Expected annual return rate (conservative for long-term planning)
  EXPECTED_RETURN: 0.06, // 6% real return

  // Base monthly expenses (premium Icelandic lifestyle)
  BASE_MONTHLY_EXPENSES: 700_000, // ISK (Deluxe tier from expense baseline)

  // Annual splurge budget (spontaneous luxury spending)
  SPLURGE_BUDGET_ANNUAL: 2_000_000, // ISK (comfortable splurge level)

  // Premium housing cost (Reykjavík 101/105 or equivalent)
  PREMIUM_HOUSING_MONTHLY: 300_000, // ISK

  // International travel budget (essential for remote Iceland)
  INTERNATIONAL_TRAVEL_ANNUAL: 600_000, // ISK
} as const;

/**
 * FI multiplier options for FatFIRE
 *
 * FatFIRE typically uses higher multipliers (28x-33x) for extra security.
 * This provides lower withdrawal rates and higher confidence in perpetual withdrawals.
 */
export const MULTIPLIER_OPTIONS = [
  {
    value: 28,
    label: '28x',
    withdrawalRate: 3.57,
    description: 'Íhaldssöm - 3,57% úttektarhlutfall',
    explanation: 'Nokkuð örugg úttekt með góðum mörkum',
  },
  {
    value: 30,
    label: '30x',
    withdrawalRate: 3.33,
    description: 'Mjög íhaldssöm - 3,33% úttektarhlutfall',
    explanation: 'Mjög há öryggi fyrir lúxuslíf í eftirlaun',
    isDefault: true,
  },
  {
    value: 33,
    label: '33x',
    withdrawalRate: 3.03,
    description: 'Ofur íhaldssöm - 3,03% úttektarhlutfall',
    explanation: 'Hámarks öryggi með rúmum mörkum',
  },
] as const;

/**
 * Expected return rate presets
 *
 * Conservative assumptions for long-term portfolio growth.
 * Real returns (after inflation).
 */
export const RETURN_PRESETS = [
  {
    value: 0.05,
    label: '5%',
    description: 'Íhaldssamt',
    explanation: 'Mjög varfærin áætlun, góð fyrir nálæga eftirlaun',
  },
  {
    value: 0.06,
    label: '6%',
    description: 'Miðlungs',
    explanation: 'Hefðbundin langtíma áætlun',
    isDefault: true,
  },
  {
    value: 0.07,
    label: '7%',
    description: 'Bjartsýn',
    explanation: 'Söguleg meðalávöxtun, ætti að ganga vel til lengri tíma',
  },
] as const;

/**
 * Splurge budget presets (annual amounts in ISK)
 *
 * Guidance for annual discretionary luxury spending.
 * These are added on top of base expenses for guilt-free splurging.
 */
export const SPLURGE_PRESETS = [
  {
    value: 1_000_000,
    label: 'Hóflegt',
    description: '1.000.000 kr/ár',
    monthlyEquivalent: 83_333,
    weeklyEquivalent: 19_230,
    examples: 'Nokkur ferðir, smákaup, gjafir',
  },
  {
    value: 2_000_000,
    label: 'Þægilegt',
    description: '2.000.000 kr/ár',
    monthlyEquivalent: 166_667,
    weeklyEquivalent: 38_461,
    examples: 'Alþjóðlegar ferðir, lúxuskaup, upplifanir',
    isDefault: true,
  },
  {
    value: 3_000_000,
    label: 'Rausnarlegt',
    description: '3.000.000 kr/ár',
    monthlyEquivalent: 250_000,
    weeklyEquivalent: 57_692,
    examples: 'Tíðar lúxusferðir, stór kaup, dýrmætar gjafir',
  },
] as const;

/**
 * Wish list categories with Icelandic labels and examples
 *
 * Premium lifestyle categories for FatFIRE planning.
 * Each category includes realistic examples adapted for Iceland.
 */
export const WISH_LIST_CATEGORIES: WishListCategoryConfig[] = [
  {
    id: 'premium-housing',
    labelIs: 'Lúxus húsnæði',
    labelEn: 'Premium Housing',
    icon: '🏡',
    examples: 'Sumarbústaður, íbúð í 101/105, stærri íbúð',
    defaultMonthlyCost: 200_000,
  },
  {
    id: 'international-travel',
    labelIs: 'Alþjóðlegar ferðir',
    labelEn: 'International Travel',
    icon: '✈️',
    examples: 'Fyrsta flokk, lúxushótel, tíðari ferðir',
    defaultMonthlyCost: 100_000,
  },
  {
    id: 'premium-healthcare',
    labelIs: 'Lúxus heilsugæsla',
    labelEn: 'Premium Healthcare',
    icon: '🏥',
    examples: 'Sjúkratrygging, einkaheilsugæsla, spa og vellíðan',
    defaultMonthlyCost: 50_000,
  },
  {
    id: 'luxury-experiences',
    labelIs: 'Lúxusupplifanir',
    labelEn: 'Luxury Experiences',
    icon: '🎭',
    examples: 'Fínborðun, tónleikar, sýningar, íþróttaviðburðir',
    defaultMonthlyCost: 80_000,
  },
  {
    id: 'high-end-dining',
    labelIs: 'Framúrskarandi matur',
    labelEn: 'High-End Dining',
    icon: '🍷',
    examples: 'Veitingahúsaáskrift, vínklúbbur, matarsmiður',
    defaultMonthlyCost: 60_000,
  },
  {
    id: 'premium-vehicles',
    labelIs: 'Lúxusbílar',
    labelEn: 'Premium Vehicles',
    icon: '🚗',
    examples: 'Tesla, lúxus jeppi, bátur',
    defaultMonthlyCost: 100_000,
  },
  {
    id: 'hobby-collections',
    labelIs: 'Áhugamál og safn',
    labelEn: 'Hobbies & Collections',
    icon: '🎨',
    examples: 'List, úr, vín, skartgripir, tækjabúnaður',
    defaultMonthlyCost: 50_000,
  },
  {
    id: 'other',
    labelIs: 'Annað',
    labelEn: 'Other',
    icon: '💎',
    examples: 'Sérsniðnar lúxusvörur',
    defaultMonthlyCost: 50_000,
  },
];

/**
 * Premium color theme for FatFIRE
 *
 * Gold and amber tones convey luxury, aspiration, and abundance.
 * These colors are used throughout the FatFIRE UI for a premium feel.
 */
export const PREMIUM_COLORS = {
  // Primary gold/amber tones
  primary: '#D4AF37', // Gold
  primaryLight: '#F4E5C2', // Light gold
  primaryDark: '#B8941E', // Dark gold

  // Accent colors
  amber: '#FFBF00', // Amber
  rose: '#FFD700', // Rose gold
  bronze: '#CD7F32', // Bronze

  // Background tones
  bgLight: '#FFFBF0', // Cream
  bgWarm: '#FFF8E7', // Warm white

  // Text colors
  textGold: '#8B7355', // Muted gold for text
  textDark: '#4A3F35', // Dark brown for contrast

  // Chart colors (gold gradient)
  chart: ['#FFD700', '#F4E5C2', '#D4AF37', '#B8941E', '#8B7355'],
} as const;

/**
 * FatFIRE calculation limits and constraints
 */
export const FATFIRE_LIMITS = {
  // Multiplier range
  MIN_MULTIPLIER: 25, // Minimum for FatFIRE (warn if below 28x)
  MAX_MULTIPLIER: 40, // Maximum realistic multiplier
  WARNING_MULTIPLIER_THRESHOLD: 28, // Warn if below this for FatFIRE

  // Expected return range
  MIN_RETURN_RATE: 0, // 0%
  MAX_RETURN_RATE: 0.15, // 15%
  WARNING_RETURN_LOW: 0.04, // Warn if below 4%
  WARNING_RETURN_HIGH: 0.08, // Warn if above 8%

  // Splurge budget limits
  MIN_SPLURGE_BUDGET: 0,
  MAX_SPLURGE_BUDGET: 10_000_000, // 10M ISK/year
  WARNING_SPLURGE_PERCENTAGE: 0.3, // Warn if >30% of base expenses

  // Wish list limits
  MAX_WISH_LIST_ITEMS: 50, // Maximum number of wish list items
  MIN_ITEM_COST: 0,
  MAX_ITEM_COST: 5_000_000, // 5M ISK/month per item
  WARNING_WISH_LIST_RATIO: 3, // Warn if wish list > 3x base expenses

  // Scenario limits
  MAX_SCENARIOS: 5, // Maximum comparison scenarios

  // Timeline limits
  MIN_AGE: 18,
  MAX_AGE: 100,
  WARNING_TIMELINE_YEARS: 25, // Warn if timeline > 25 years
  MAX_TIMELINE_YEARS: 100, // Maximum projection years

  // Savings limits
  MIN_SAVINGS: 0,
  MAX_SAVINGS: 100_000_000_000, // 100 billion ISK
  MIN_ANNUAL_SAVINGS: 0,
  MAX_ANNUAL_SAVINGS: 100_000_000, // 100M ISK/year
} as const;

/**
 * Milestone percentages for FatFIRE progress tracking
 *
 * These are the standard milestones shown in timeline projections.
 */
export const MILESTONE_PERCENTAGES = [25, 50, 75, 100] as const;

/**
 * Milestone labels in Icelandic
 */
export const MILESTONE_LABELS = {
  25: '25% FI - Fyrsta fjórðungur',
  50: '50% FI - Helmingi náð',
  75: '75% FI - Þrír fjórðu',
  100: '100% FI - FatFIRE náð! 🎉',
} as const;

/**
 * Default premium Icelandic expense breakdown
 *
 * Realistic deluxe tier expenses for Reykjavík premium lifestyle.
 * These match the Expense Baseline Tool's Deluxe tier.
 */
export const DEFAULT_DELUXE_EXPENSES = {
  housing: 300_000, // Premium Reykjavík 101/105 or mortgage equivalent
  food: 100_000, // Fine dining, premium groceries, delivery
  transport: 70_000, // Premium vehicle, maintenance, parking
  entertainment: 80_000, // Subscriptions, experiences, hobbies
  personal: 50_000, // Premium grooming, clothing, wellness
  healthcare: 30_000, // Private insurance, wellness programs
  other: 50_000, // Miscellaneous luxury
  travel: 50_000, // Monthly allocation (600k/year for international)
} as const;

/**
 * Educational content keys for tooltips
 *
 * These keys map to educational content shown throughout the UI.
 */
export const FATFIRE_TOOLTIPS = {
  MULTIPLIER_30X:
    '30x margfaldari = 3,33% úttektarhlutfall. Gefur mjög hátt öryggi fyrir lúxuslíf í eftirlaun samkvæmt Trinity rannsókninni.',
  SPLURGE_BUDGET:
    'Aukaútgjaldaáætlun fyrir sjálfsprottnar lúxusvörur án sektarkenndar. Ferðir, kaup, upplifanir, gjafir.',
  WISH_LIST_PRIORITY:
    'Nauðsynlegt = innifalið í grunn FI númeri. Gott-að-hafa = sýnt sérstaklega fyrir samanburð.',
  PREMIUM_HOUSING:
    'Lúxus húsnæði í Reykjavík 101/105, strönd, eða sumarbústaður. Íslenskt framúrskarandi húsnæði.',
  INTERNATIONAL_TRAVEL:
    'Ísland er afskekkt - alþjóðlegar ferðir eru dýrar en nauðsynlegar fyrir marga FatFIRE lífsstíla.',
  ABUNDANCE_MINDSET:
    'FatFIRE er ekki um sparnaðarbúskap - það er um að lifa fullkomlega án fjárhagslegra áhyggjanna.',
  LEAN_VS_FAT:
    'FatFIRE krefst meiri sparnaðar en veitir fullkomna lífsstílsfrelsi. LeanFIRE krefst sparnaðar og malamiðlana.',
} as const;

/**
 * Helper function to get wish list category configuration by ID
 */
export function getWishListCategory(id: string): WishListCategoryConfig | undefined {
  return WISH_LIST_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Helper function to get multiplier option by value
 */
export function getMultiplierOption(value: number) {
  return MULTIPLIER_OPTIONS.find((opt) => opt.value === value);
}

/**
 * Helper function to get return preset by value
 */
export function getReturnPreset(value: number) {
  return RETURN_PRESETS.find((preset) => preset.value === value);
}

/**
 * Helper function to get splurge preset by value
 */
export function getSplurgePreset(value: number) {
  return SPLURGE_PRESETS.find((preset) => preset.value === value);
}

/**
 * Helper function to calculate total default deluxe expenses
 */
export function getTotalDefaultDeluxeExpenses(): number {
  return Object.values(DEFAULT_DELUXE_EXPENSES).reduce((sum, val) => sum + val, 0);
}

/**
 * Helper function to validate if multiplier is appropriate for FatFIRE
 */
export function isFatFireMultiplier(multiplier: number): boolean {
  return multiplier >= FATFIRE_LIMITS.WARNING_MULTIPLIER_THRESHOLD;
}

/**
 * Helper function to validate if return rate is realistic
 */
export function isRealisticReturnRate(rate: number): boolean {
  return (
    rate >= FATFIRE_LIMITS.WARNING_RETURN_LOW && rate <= FATFIRE_LIMITS.WARNING_RETURN_HIGH
  );
}

/**
 * Helper function to check if splurge budget is excessive
 */
export function isExcessiveSplurgeBudget(
  splurgeBudgetAnnual: number,
  baseMonthlyExpenses: number
): boolean {
  const splurgeMonthly = splurgeBudgetAnnual / 12;
  const ratio = splurgeMonthly / baseMonthlyExpenses;
  return ratio > FATFIRE_LIMITS.WARNING_SPLURGE_PERCENTAGE;
}

/**
 * Helper function to check if wish list is very aggressive
 */
export function isAggressiveWishList(
  wishListMonthly: number,
  baseMonthlyExpenses: number
): boolean {
  const ratio = wishListMonthly / baseMonthlyExpenses;
  return ratio > FATFIRE_LIMITS.WARNING_WISH_LIST_RATIO;
}
