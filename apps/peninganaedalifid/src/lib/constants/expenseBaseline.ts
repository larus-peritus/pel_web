/**
 * Constants and default values for the Expense Baseline Tool (Útgjaldagrunnur)
 * Feature ID: 2.1.11
 *
 * Default expense categories with Icelandic labels and realistic ISK values
 * based on Icelandic cost of living.
 *
 * Total defaults:
 * - Barebones (Lágmarks): 250,000 kr/month
 * - Comfortable (Þægilegt): 520,000 kr/month
 * - Deluxe (Lúxus): 1,000,000 kr/month
 */

import type { ExpenseCategoryConfig, ExpenseTier, TierColorScheme } from '@/types/expenseBaseline';

/**
 * Schema version for migrations
 */
export const EXPENSE_BASELINE_VERSION = 1;

/**
 * Default expense categories with Icelandic labels and defaults
 * 
 * Based on requirements-expense-baseline.md, these are the 10 standard categories
 * with realistic ISK amounts for Icelandic cost of living.
 */
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategoryConfig[] = [
  {
    id: 'husnaedi',
    nameIs: 'Húsnæði',
    nameEn: 'Housing',
    icon: '🏠',
    description: 'Leiga, húsnæðislán, fasteignagjöld, viðhald, húseigendatrygging',
    defaults: { barebones: 120000, comfortable: 200000, deluxe: 350000 },
    subcategories: ['Leiga/afborgun', 'Fasteignagjöld', 'Viðhald', 'Trygging'],
  },
  {
    id: 'matur',
    nameIs: 'Matur',
    nameEn: 'Food',
    icon: '🍽️',
    description: 'Matvöruinnkaup, veitingastaðir, kaffi, sælgæti',
    defaults: { barebones: 40000, comfortable: 70000, deluxe: 120000 },
    subcategories: ['Matvörur', 'Veitingastaðir', 'Kaffi/sælgæti'],
  },
  {
    id: 'samgongur',
    nameIs: 'Samgöngur',
    nameEn: 'Transport',
    icon: '🚗',
    description: 'Bílakostnaður, eldsneyti, tryggingar, almenningssamgöngur',
    defaults: { barebones: 15000, comfortable: 40000, deluxe: 80000 },
    subcategories: ['Bílakaup/leiga', 'Eldsneyti', 'Trygging', 'Strætó'],
  },
  {
    id: 'heilsa',
    nameIs: 'Heilsa',
    nameEn: 'Healthcare',
    icon: '🏥',
    description: 'Sjúkratryggingar, lyf, tannlækningar, sjónlækningar',
    defaults: { barebones: 5000, comfortable: 15000, deluxe: 30000 },
    subcategories: ['Lyf', 'Tannlækningar', 'Sjónlækningar', 'Annað'],
  },
  {
    id: 'tryggingar',
    nameIs: 'Tryggingar',
    nameEn: 'Insurance',
    icon: '🛡️',
    description: 'Líftrygging, örorkutrygging, aðrar persónutryggingar',
    defaults: { barebones: 5000, comfortable: 15000, deluxe: 25000 },
    subcategories: ['Líftrygging', 'Örorkutrygging', 'Annað'],
  },
  {
    id: 'veitur',
    nameIs: 'Veitur',
    nameEn: 'Utilities',
    icon: '💡',
    description: 'Rafmagn, vatn, hiti, internet, sími',
    defaults: { barebones: 20000, comfortable: 35000, deluxe: 50000 },
    subcategories: ['Rafmagn', 'Hiti/vatn', 'Internet', 'Sími'],
  },
  {
    id: 'personuleg',
    nameIs: 'Persónuleg',
    nameEn: 'Personal',
    icon: '👤',
    description: 'Fatnaður, snyrtivörur, persónuleg umhirða',
    defaults: { barebones: 10000, comfortable: 25000, deluxe: 50000 },
    subcategories: ['Fatnaður', 'Snyrtivörur', 'Hárgreiðsla'],
  },
  {
    id: 'askriftir',
    nameIs: 'Áskriftir',
    nameEn: 'Subscriptions',
    icon: '📱',
    description: 'Streymisþjónustur, líkamsrækt, hugbúnaður, tímarit',
    defaults: { barebones: 5000, comfortable: 15000, deluxe: 30000 },
    subcategories: ['Streymisþjónustur', 'Líkamsrækt', 'Hugbúnaður', 'Tímarit'],
  },
  {
    id: 'ferdalog',
    nameIs: 'Ferðalög',
    nameEn: 'Travel',
    icon: '✈️',
    description: 'Flugfargjöld, hótel, bílaleiga, frí',
    defaults: { barebones: 0, comfortable: 30000, deluxe: 100000 },
    subcategories: ['Flugfargjöld', 'Gisting', 'Bílaleiga', 'Innanlandsferðir'],
  },
  {
    id: 'afthreying',
    nameIs: 'Afþreying',
    nameEn: 'Entertainment',
    icon: '🎬',
    description: 'Áhugamál, félagslíf, tónleikar, kvikmyndir',
    defaults: { barebones: 5000, comfortable: 25000, deluxe: 70000 },
    subcategories: ['Áhugamál', 'Félagslíf', 'Tónleikar', 'Kvikmyndir'],
  },
  {
    id: 'born',
    nameIs: 'Börn',
    nameEn: 'Children',
    icon: '👶',
    description: 'Leikskóli, skólagjöld, tómstundir, fatnaður',
    defaults: { barebones: 15000, comfortable: 40000, deluxe: 80000 },
    subcategories: ['Leikskóli', 'Skólagjöld', 'Tómstundir', 'Fatnaður'],
  },
  {
    id: 'annad',
    nameIs: 'Annað',
    nameEn: 'Other',
    icon: '📦',
    description: 'Ýmislegt, óvænt útgjöld, gjafir',
    defaults: { barebones: 5000, comfortable: 20000, deluxe: 45000 },
    subcategories: ['Ýmislegt', 'Óvænt', 'Gjafir'],
  },
];

/**
 * Icelandic labels for the three tiers
 */
export const TIER_LABELS: Record<ExpenseTier, string> = {
  barebones: 'Lágmarks',
  comfortable: 'Þægilegt',
  deluxe: 'Lúxus',
};

/**
 * Icelandic descriptions for the three tiers
 */
export const TIER_DESCRIPTIONS: Record<ExpenseTier, string> = {
  barebones: 'Lágmarksþörf til að lifa af',
  comfortable: 'Þægileg lífsgæði',
  deluxe: 'Kjöraðstæður án áhyggjum',
};

/**
 * Color schemes for the three tiers
 * Using Tailwind CSS classes for visual distinction
 */
export const TIER_COLORS: Record<ExpenseTier, TierColorScheme> = {
  barebones: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    accent: 'bg-amber-500',
  },
  comfortable: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    accent: 'bg-green-500',
  },
  deluxe: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-800',
    accent: 'bg-purple-500',
  },
};

/**
 * Default category order for consistent display
 */
export const DEFAULT_CATEGORY_ORDER: Record<string, number> = {
  husnaedi: 0,
  matur: 1,
  samgongur: 2,
  heilsa: 3,
  tryggingar: 4,
  veitur: 5,
  personuleg: 6,
  askriftir: 7,
  ferdalog: 8,
  afthreying: 9,
  born: 10,
  annad: 11,
};

/**
 * Verify that default totals match requirements
 * Barebones: ~245,000 kr, Comfortable: ~530,000 kr, Deluxe: ~1,030,000 kr
 */
const verifyTotals = () => {
  const totals = DEFAULT_EXPENSE_CATEGORIES.reduce(
    (acc, cat) => ({
      barebones: acc.barebones + cat.defaults.barebones,
      comfortable: acc.comfortable + cat.defaults.comfortable,
      deluxe: acc.deluxe + cat.defaults.deluxe,
    }),
    { barebones: 0, comfortable: 0, deluxe: 0 }
  );

  const EXPECTED = {
    barebones: 245000,
    comfortable: 530000,
    deluxe: 1030000,
  };

  if (
    totals.barebones !== EXPECTED.barebones ||
    totals.comfortable !== EXPECTED.comfortable ||
    totals.deluxe !== EXPECTED.deluxe
  ) {
    console.warn('DEFAULT_EXPENSE_CATEGORIES totals do not match requirements:', {
      expected: EXPECTED,
      actual: totals,
    });
  }
};

// Verify totals in development
if (process.env.NODE_ENV === 'development') {
  verifyTotals();
}
