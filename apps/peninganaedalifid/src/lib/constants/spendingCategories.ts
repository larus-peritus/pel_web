/**
 * Spending Category Constants
 * Icelandic labels and descriptions for lifestyle inflation categories
 */

import type { SpendingCategory } from '@/types/calculator';

/**
 * Icelandic labels for spending categories
 */
export const SPENDING_CATEGORY_LABELS: Record<SpendingCategory, string> = {
  housing: 'Húsnæði',
  food: 'Matur',
  transportation: 'Samgöngur',
  subscriptions: 'Áskriftir',
  convenience: 'Þægindi',
  clothing: 'Fatnaður',
  entertainment: 'Skemmtun',
  health: 'Heilsa',
  other: 'Annað',
};

/**
 * Icelandic descriptions for spending categories
 */
export const SPENDING_CATEGORY_DESCRIPTIONS: Record<SpendingCategory, string> = {
  housing: 'Leiga/veð, rafmagn, hiti, internet',
  food: 'Matvörur, veitingastaðir, kaffihús',
  transportation: 'Bensín, strætó, bílaviðhald, bílastæði',
  subscriptions: 'Netflix, Spotify, líkamsrækt',
  convenience: 'Matur heim, taxi, skyndikaupur',
  clothing: 'Föt, skór, fylgihlutir',
  entertainment: 'Kvikmyndir, tónleikar, tölvuleikir',
  health: 'Lyfseðlar, sjúkraþjálfun, tannlæknir',
  other: 'Gjafir, heimilisbúnaður, dýrahald',
};

/**
 * Array of all spending categories for iteration
 */
export const SPENDING_CATEGORIES: SpendingCategory[] = [
  'housing',
  'food',
  'transportation',
  'subscriptions',
  'convenience',
  'clothing',
  'entertainment',
  'health',
  'other',
];

/**
 * Get all spending categories
 */
export function getAllCategories(): SpendingCategory[] {
  return SPENDING_CATEGORIES;
}

/**
 * Get Icelandic label for a category
 */
export function getCategoryLabel(category: SpendingCategory): string {
  return SPENDING_CATEGORY_LABELS[category];
}

/**
 * Get Icelandic description for a category
 */
export function getCategoryDescription(category: SpendingCategory): string {
  return SPENDING_CATEGORY_DESCRIPTIONS[category];
}
