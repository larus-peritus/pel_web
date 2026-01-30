/**
 * Constants and default configuration for Savings Report
 * All text in Icelandic, amounts in ISK
 */

import type { SavingsCategoryConfig, SavingsRateLevel } from '@/types/savingsReport';

/**
 * Version for schema migrations
 */
export const SAVINGS_REPORT_VERSION = 1;

/**
 * Default savings categories with Icelandic names
 * Based on Icelandic financial planning best practices
 */
export const DEFAULT_SAVINGS_CATEGORIES: SavingsCategoryConfig[] = [
  {
    id: 'neydarsjodur',
    name: 'Neyðarsjóður',
    icon: '🛡️',
    description: '3-6 mánaða útgjöld í varasjóði fyrir óvænt atvik',
    order: 1,
  },
  {
    id: 'skammtima',
    name: 'Skammtímasparnaður',
    icon: '📅',
    description: 'Markmið innan 2 ára - frí, bíll, húsgögn, o.fl.',
    order: 2,
  },
  {
    id: 'langtima',
    name: 'Langtímasparnaður',
    icon: '🎯',
    description: 'Markmið yfir 2 ár - útborgun, menntun, stærri kaup',
    order: 3,
  },
  {
    id: 'fjarfestingar',
    name: 'Fjárfestingar',
    icon: '📈',
    description: 'Hlutabréf, sjóðir, ETF, og aðrar fjárfestingar',
    order: 4,
  },
  {
    id: 'lifeyrissjodur',
    name: 'Lífeyrissjóður',
    icon: '🏖️',
    description: 'Lífeyrissjóðir, þ.m.t. mótframlag vinnuveitanda',
    order: 5,
  },
  {
    id: 'serstakur',
    name: 'Sérstakur sjóður',
    icon: '⭐',
    description: 'Sérsniðið markmið sem þú skilgreinir sjálf/ur',
    order: 6,
  },
  {
    id: 'annad',
    name: 'Annað',
    icon: '📦',
    description: 'Ýmis sparnaður sem fellur ekki undir aðra flokka',
    order: 7,
  },
];

/**
 * Category colors for charts and UI
 */
export const SAVINGS_CATEGORY_COLORS: Record<string, string> = {
  neydarsjodur: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  skammtima: 'text-blue-600 bg-blue-50 border-blue-200',
  langtima: 'text-purple-600 bg-purple-50 border-purple-200',
  fjarfestingar: 'text-amber-600 bg-amber-50 border-amber-200',
  lifeyrissjodur: 'text-teal-600 bg-teal-50 border-teal-200',
  serstakur: 'text-pink-600 bg-pink-50 border-pink-200',
  annad: 'text-gray-600 bg-gray-50 border-gray-200',
};

/**
 * Chart colors for pie/donut charts
 */
export const SAVINGS_CHART_COLORS = [
  '#10b981', // emerald-500 - neydarsjodur
  '#3b82f6', // blue-500 - skammtima
  '#8b5cf6', // purple-500 - langtima
  '#f59e0b', // amber-500 - fjarfestingar
  '#14b8a6', // teal-500 - lifeyrissjodur
  '#ec4899', // pink-500 - serstakur
  '#6b7280', // gray-500 - annad
];

/**
 * Savings rate threshold definitions
 */
export const SAVINGS_RATE_THRESHOLDS = {
  critical: { max: 10, level: 'critical' as const },
  low: { max: 20, level: 'low' as const },
  moderate: { max: 30, level: 'moderate' as const },
  good: { max: 50, level: 'good' as const },
  excellent: { max: 70, level: 'excellent' as const },
  exceptional: { max: 100, level: 'exceptional' as const },
};

/**
 * Savings rate messages with FI estimates
 * Messages in Icelandic with context about FI timeline
 */
export const SAVINGS_RATE_MESSAGES: Record<
  SavingsRateLevel,
  { messageIs: string; fiEstimateYears: number | null }
> = {
  critical: {
    messageIs: 'Mjög lágur sparnaður - erfiðleikar með að ná fjárhagsfrelsi. Íhugaðu að auka tekjur eða minnka útgjöld.',
    fiEstimateYears: null,
  },
  low: {
    messageIs: 'Lágmarks sparnaður - þetta er undir meðaltali. Reyndu að auka sparnaðinn til að ná fjárhagsfrelsi fyrr.',
    fiEstimateYears: 50,
  },
  moderate: {
    messageIs: 'Góður grunnur - þetta er í kringum meðaltal Íslendinga. Þú ert á réttri leið!',
    fiEstimateYears: 30,
  },
  good: {
    messageIs: 'Mjög gott! Þú ert á góðri leið til fjárhagsfrelsis. Haltu áfram svona!',
    fiEstimateYears: 20,
  },
  excellent: {
    messageIs: 'Framúrskarandi! Með þessum hraða gætirðu náð fjárhagsfrelsi á 10-15 árum.',
    fiEstimateYears: 12,
  },
  exceptional: {
    messageIs: 'Ótrúlegt! Þú ert á hraðri leið til fjárhagsfrelsis. Mögulega innan 7-10 ára!',
    fiEstimateYears: 8,
  },
};
