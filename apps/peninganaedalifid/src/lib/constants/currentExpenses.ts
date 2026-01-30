/**
 * Constants and default configuration for Current Expense Report
 * All text in Icelandic, amounts in ISK
 */

import type { ExpenseCategoryConfig } from '@/types/currentExpenses';

/**
 * Version for schema migrations
 */
export const CURRENT_EXPENSE_VERSION = 1;

/**
 * Default expense categories with Icelandic names and suggested line items
 * Based on realistic Icelandic spending patterns
 */
export const DEFAULT_CURRENT_EXPENSE_CATEGORIES: ExpenseCategoryConfig[] = [
  {
    id: 'husnaedi',
    name: 'Húsnæði',
    icon: '🏠',
    suggestedLineItems: [
      'Leiga/húsnæðislán',
      'Fasteignagjöld',
      'Húseigendatrygging',
      'Viðhald',
      'Íbúðafélagsgjöld',
    ],
    order: 1,
  },
  {
    id: 'matur',
    name: 'Matur',
    icon: '🍽️',
    suggestedLineItems: [
      'Matarinnkaup',
      'Veitingastaðir',
      'Kaffihús',
      'Vinnuhádegismatur',
      'Skyndibiti',
    ],
    order: 2,
  },
  {
    id: 'samgongur',
    name: 'Samgöngur',
    icon: '🚗',
    suggestedLineItems: [
      'Bílakostnaður/leiga',
      'Eldsneyti',
      'Bifreiðatrygging',
      'Bílastæði',
      'Strætó pass',
      'Viðhald/viðgerðir',
      'Tollur',
    ],
    order: 3,
  },
  {
    id: 'veitur',
    name: 'Veitur',
    icon: '💡',
    suggestedLineItems: [
      'Rafmagn (Orkuveita)',
      'Hiti/vatn',
      'Internet (Síminn/Vodafone/Nova)',
      'Farsími',
    ],
    order: 4,
  },
  {
    id: 'askriftir',
    name: 'Áskriftir',
    icon: '📱',
    suggestedLineItems: [
      'Streymisþjónustur',
      'Líkamsræktarstöð',
      'Dagblöð/tímarit',
      'Software/apps',
      'Gaming (PlayStation Plus, Xbox)',
      'Cloud storage',
      'Aðrar áskriftir',
    ],
    order: 5,
  },
  {
    id: 'heilsa',
    name: 'Heilsa',
    icon: '🏥',
    suggestedLineItems: [
      'Lyf',
      'Tannlæknir',
      'Sjónlæknir',
      'Sálfræðingur/meðferð',
      'Bætiefni',
      'Nudd/líkamsmeðferð',
    ],
    order: 6,
  },
  {
    id: 'tryggingar',
    name: 'Tryggingar',
    icon: '🛡️',
    suggestedLineItems: [
      'Líftrygging',
      'Sjúkdómatrygging',
      'Örorkutrygging',
      'Heimilistrygging',
      'Ferðatrygging',
      'Gæludýratrygging',
    ],
    order: 7,
  },
  {
    id: 'personuleg',
    name: 'Persónuleg umhirða',
    icon: '👤',
    suggestedLineItems: [
      'Fatnaður',
      'Snyrtivörur',
      'Hárgreiðsla',
      'Persónuleg umhirða',
      'Skór',
    ],
    order: 8,
  },
  {
    id: 'ferdalog',
    name: 'Ferðalög',
    icon: '✈️',
    suggestedLineItems: [
      'Flugfargjöld',
      'Hótel/gisting',
      'Bílaleiga',
      'Matur á ferðalagi',
      'Afþreying á ferðalagi',
      'Ferðatrygging',
      'Innanlandsferðir',
    ],
    order: 9,
  },
  {
    id: 'afthreying',
    name: 'Afþreying',
    icon: '🎬',
    suggestedLineItems: [
      'Kvikmyndir',
      'Tónleikar',
      'Íþróttir',
      'Félagslíf',
      'Áhugamál',
      'Bækur',
    ],
    order: 10,
  },
  {
    id: 'born',
    name: 'Börn',
    icon: '👶',
    suggestedLineItems: [
      'Leikskóli',
      'Skólagjöld',
      'Tómstundir',
      'Barnafatnaður',
      'Barnabækur/leikföng',
    ],
    order: 11,
  },
  {
    id: 'annad',
    name: 'Annað',
    icon: '📦',
    suggestedLineItems: [
      'Gjafir',
      'Góðgerðarframlög',
      'Ýmislegt',
    ],
    order: 12,
  },
];

/**
 * Color schemes for categories (for UI styling)
 * Using Tailwind CSS classes for consistent theming
 */
export const CATEGORY_COLORS: Record<string, string> = {
  husnaedi: 'text-blue-600 bg-blue-50 border-blue-200',
  matur: 'text-green-600 bg-green-50 border-green-200',
  samgongur: 'text-orange-600 bg-orange-50 border-orange-200',
  veitur: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  askriftir: 'text-purple-600 bg-purple-50 border-purple-200',
  heilsa: 'text-red-600 bg-red-50 border-red-200',
  tryggingar: 'text-teal-600 bg-teal-50 border-teal-200',
  personuleg: 'text-pink-600 bg-pink-50 border-pink-200',
  ferdalog: 'text-sky-600 bg-sky-50 border-sky-200',
  afthreying: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  born: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  annad: 'text-gray-600 bg-gray-50 border-gray-200',
};

/**
 * Thresholds for generating recommendations
 * All amounts in ISK
 */
export const RECOMMENDATION_THRESHOLDS = {
  subscription: {
    medium: 10000, // 10k ISK/month
    high: 20000,   // 20k ISK/month
  },
  commute: {
    medium: 30000, // 30k ISK/month
    high: 50000,   // 50k ISK/month
  },
  housingPercentage: {
    medium: 30,    // 30% of total expenses
    high: 40,      // 40% of total expenses
  },
  baselineDifference: {
    medium: 50000, // 50k ISK difference from baseline
    high: 100000,  // 100k ISK difference from baseline
  },
} as const;

/**
 * Recommendation messages in Icelandic
 * Placeholders: {amount}, {percentage}
 */
export const RECOMMENDATION_MESSAGES = {
  subscription: {
    title: 'Áskriftir eru verulegur hluti útgjalda',
    message: 'Þú ert að eyða {amount} í áskriftir á mánuði. Subscription Burn Meter getur hjálpað þér að fínstilla.',
    actionLabel: 'Greina áskriftir',
    actionUrl: '/subscription-burn-meter',
  },
  commute: {
    title: 'Samgöngur eru há í útgjöldum',
    message: 'Samgöngukostnaður er {amount} á mánuði. Athugaðu valkosti með Commute Calculator.',
    actionLabel: 'Greina samgöngur',
    actionUrl: '/commute-calculator',
  },
  housing: {
    title: 'Húsnæði er stór hluti útgjalda',
    message: 'Húsnæði er {percentage} af útgjöldum. Housing Calculator getur hjálpað með greiningu.',
    actionLabel: 'Greina húsnæði',
    actionUrl: '/housing-calculator',
  },
  baseline: {
    title: 'Verulegur munur á raunverulegum útgjöldum og áætlun',
    message: 'Núverandi útgjöld eru {amount} {direction} áætlun. Íhugaðu að uppfæra útgjaldagrunn.',
    actionLabel: 'Uppfæra útgjaldagrunn',
    actionUrl: '/utgjaldareiknivel',
  },
} as const;

/**
 * Essential expense classification
 * Determines which expenses are "required" vs "discretionary"
 */

// Categories where ALL items are essential
export const ESSENTIAL_CATEGORIES: string[] = [
  'husnaedi',    // Housing - rent, mortgage, property tax
  'heilsa',      // Health - medicine, doctors
  'tryggingar',  // Insurance - life, disability
];

// Categories where ALL items are non-essential
export const NON_ESSENTIAL_CATEGORIES: string[] = [
  'askriftir',   // Subscriptions - gym, streaming, apps
  'ferdalog',    // Travel - flights, hotels, vacations
  'afthreying',  // Entertainment - movies, concerts, hobbies
];

// Specific non-essential items within otherwise essential/mixed categories
export const NON_ESSENTIAL_ITEMS: Record<string, string[]> = {
  matur: [
    'Veitingastaðir',
    'Kaffihús',
    'Skyndibiti',
  ],
  born: [
    'Barnabækur/leikföng',
  ],
  personuleg: [
    'Hárgreiðsla',
  ],
  annad: [
    'Gjafir',
    'Góðgerðarframlög',
    'Ýmislegt',
  ],
};

/**
 * Determine if a line item is essential based on category and label
 */
export function isItemEssential(categoryId: string, label: string): boolean {
  // If category is fully essential, all items are essential
  if (ESSENTIAL_CATEGORIES.includes(categoryId)) {
    return true;
  }

  // If category is fully non-essential, all items are non-essential
  if (NON_ESSENTIAL_CATEGORIES.includes(categoryId)) {
    return false;
  }

  // Mixed categories - check if item is in non-essential list
  const nonEssentialItems = NON_ESSENTIAL_ITEMS[categoryId] || [];
  if (nonEssentialItems.some(item => label.toLowerCase().includes(item.toLowerCase()))) {
    return false;
  }

  // Default: items in samgongur, veitur, matur, born, personuleg are essential
  // unless explicitly marked as non-essential above
  const defaultEssentialCategories = ['samgongur', 'veitur', 'matur', 'born', 'personuleg'];
  return defaultEssentialCategories.includes(categoryId);
}
