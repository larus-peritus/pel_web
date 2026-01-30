/**
 * LeanFIRE Planner Constants
 *
 * Iceland-specific barebones expenses, location comparison data, frugality tips,
 * and default values for the LeanFIRE (Lágmarks FIRE) calculator.
 *
 * This file contains:
 * - Default barebones expenses for Reykjavík and Landsbyggð
 * - FI multiplier options (25x and 30x)
 * - Reduction percentage options
 * - Frugality tip templates
 * - Location pros/cons data
 */

import type {
  CategoryExpenses,
  FIMultiplier,
  ReductionPercent,
  FrugalityTip,
  TipDifficulty,
  ExpenseCategory,
} from '@/types/leanFire';

// ============================================================================
// DEFAULT BAREBONES EXPENSES
// ============================================================================

/**
 * Default barebones monthly expenses for Reykjavík
 *
 * Total: 240,000 ISK/month (2,880,000 ISK/year)
 *
 * Based on minimum viable living costs in Iceland's capital.
 * Sources: Statistics Iceland, actual LeanFIRE practitioners
 */
export const DEFAULT_BAREBONES_REYKJAVIK: CategoryExpenses = {
  housing: 120_000, // Shared apartment or studio in outer Reykjavík
  food: 40_000, // Budget grocery shopping (Bónus, Krónan)
  transport: 12_000, // Strætó bus pass
  healthcare: 5_000, // Co-pays, medications (after universal coverage)
  insurance: 8_000, // Basic renters insurance, minimal extras
  utilities: 25_000, // Electricity, internet, phone (shared if possible)
  personal: 10_000, // Hygiene, clothing (secondhand)
  entertainment: 15_000, // Free/low-cost activities, minimal subscriptions
  other: 5_000, // Buffer for unexpected expenses
};

/**
 * Default barebones monthly expenses for Landsbyggð (rural Iceland)
 *
 * Total: 200,000 ISK/month (2,400,000 ISK/year)
 *
 * Lower costs due to cheaper housing and reduced entertainment/transport needs.
 */
export const DEFAULT_BAREBONES_LANDSBYGGD: CategoryExpenses = {
  housing: 80_000, // Cheaper rural housing
  food: 45_000, // Slightly higher due to less competition (fewer discount stores)
  transport: 20_000, // Car necessary in rural areas (used car, minimal driving)
  healthcare: 5_000, // Same co-pays as Reykjavík
  insurance: 10_000, // Car insurance required
  utilities: 20_000, // Lower electricity costs, cheaper internet packages
  personal: 10_000, // Same as Reykjavík
  entertainment: 7_000, // Fewer paid activities, more outdoor/free options
  other: 3_000, // Lower buffer due to fewer unexpected costs
};

// ============================================================================
// FI MULTIPLIER OPTIONS
// ============================================================================

/**
 * FI multiplier options with Icelandic context
 *
 * - 25x = 4% withdrawal rate (US standard, more aggressive)
 * - 30x = 3.33% withdrawal rate (recommended for Iceland due to higher inflation)
 */
export const FI_MULTIPLIER_OPTIONS: Array<{
  value: FIMultiplier;
  label: string;
  description: string;
  withdrawalRate: number;
  recommended: boolean;
}> = [
  {
    value: 25,
    label: '25x',
    description: '4% úttektarhlutfall (árásargjarn)',
    withdrawalRate: 0.04,
    recommended: false,
  },
  {
    value: 30,
    label: '30x',
    description: '3,33% úttektarhlutfall (mælt með fyrir Ísland)',
    withdrawalRate: 0.0333,
    recommended: true,
  },
];

/**
 * Default FI multiplier (30x recommended for Iceland)
 */
export const DEFAULT_FI_MULTIPLIER: FIMultiplier = 30;

// ============================================================================
// REDUCTION PERCENTAGE OPTIONS
// ============================================================================

/**
 * Reduction percentage options for expense scenarios
 *
 * Standard reduction levels for "what if I cut X?" modeling
 */
export const REDUCTION_PERCENTAGE_OPTIONS: Array<{
  value: ReductionPercent;
  label: string;
  description: string;
}> = [
  {
    value: 10,
    label: '10%',
    description: 'Lítil minnkun - auðvelt að framkvæma',
  },
  {
    value: 25,
    label: '25%',
    description: 'Miðlungs minnkun - krefst nokkurrar fyrirhafnar',
  },
  {
    value: 50,
    label: '50%',
    description: 'Mikil minnkun - verulegar breytingar',
  },
  {
    value: 100,
    label: '100%',
    description: 'Útrýma flokki algjörlega',
  },
];

// ============================================================================
// LOCATION PROS AND CONS
// ============================================================================

/**
 * Advantages and disadvantages of each location
 */
export const LOCATION_PROS_CONS = {
  reykjavik: {
    pros: [
      'Betri atvinnumöguleikar og hærri laun',
      'Fleiri félags- og menningartengd tækifæri',
      'Betri almenningssamgöngur (Strætó)',
      'Auðveldara að lifa án bíls',
      'Fleiri verslunarmöguleikar (Bónus, Krónan, Costco)',
      'Öflugra heilbrigðiskerfi og sérfræðingar',
      'Fjölbreyttara menningarlíf (kvikmyndahús, tónleikar)',
    ],
    cons: [
      'Mun hærri húsnæðiskostnaður',
      'Meiri samkeppni um húsnæði',
      'Meiri streita og mannfjöldi',
      'Erfiðara að komast í náttúruna',
      'Meiri freistingar til neyslu',
      'Meiri loftmengun og hávaði',
    ],
  },
  landsbyggd: {
    pros: [
      'Mun lægri húsnæðiskostnaður',
      'Rólegt og friðsælt umhverfi',
      'Nær náttúrunni - ókeypis afþreying',
      'Minni freistingar til neyslu',
      'Sterkara samfélag',
      'Lægri vatnstofnsgjöld og fasteignagjöld',
    ],
    cons: [
      'Færri atvinnumöguleikar',
      'Bíll oftast nauðsynlegur',
      'Hærri matvörukostnaður (færri afsláttarverslanir)',
      'Takmarkaður aðgangur að heilbrigðisþjónustu',
      'Færri félags- og menningartengd tækifæri',
      'Erfiðara að finna húsnæði til leigu',
      'Lengri vegalengdir í vinnu/verslanir',
    ],
  },
};

// ============================================================================
// FRUGALITY TIP TEMPLATES
// ============================================================================

/**
 * Frugality tip database organized by category
 *
 * Each tip includes:
 * - category: Related expense category
 * - title: Short Icelandic title
 * - description: Actionable Icelandic description
 * - difficulty: Implementation difficulty
 * - potentialSavingsRange: Estimated monthly savings range [min, max] in ISK
 * - icelandicResources: Iceland-specific resources/stores/services
 */
export const FRUGALITY_TIP_TEMPLATES: Array<{
  category: ExpenseCategory;
  title: string;
  description: string;
  difficulty: TipDifficulty;
  potentialSavingsRange: [number, number];
  icelandicResources?: string[];
}> = [
  // ============================================================================
  // HOUSING TIPS
  // ============================================================================
  {
    category: 'housing',
    title: 'Deildu íbúð eða herbergi',
    description:
      'Finndu íbúðarfélaga til að deila húsnæðiskostnaði. Hægt að minnka leigu um 30-50% með því að deila 2-3 herbergja íbúð.',
    difficulty: 'moderate',
    potentialSavingsRange: [30_000, 60_000],
    icelandicResources: ['Facebook - Íbúðir til leigu', 'Leigulistinn.is'],
  },
  {
    category: 'housing',
    title: 'Íhugaðu flutning út fyrir höfuðborgarsvæðið',
    description:
      'Íbúðir á landsbyggðinni eru almennt 30-50% ódýrari en í Reykjavík. Skoðaðu störf í dreifbýli eða fjarvinnumöguleika.',
    difficulty: 'hard',
    potentialSavingsRange: [40_000, 70_000],
    icelandicResources: [
      'Vinna.is (leit eftir staðsetningu)',
      'Akureyri, Akranes, Selfoss',
    ],
  },
  {
    category: 'housing',
    title: 'Gerðu langtímaleigu samning',
    description:
      'Semdu um langtímaleigu (1-2 ár) til að fá lægra verð. Margir leigusalar gefa afslátt fyrir stöðugleika.',
    difficulty: 'easy',
    potentialSavingsRange: [5_000, 15_000],
  },
  {
    category: 'housing',
    title: 'Leitaðu að húsi með veitum innifaldar',
    description:
      'Sum leiguíbúðir innihalda hita, rafmagn, eða internet. Þetta getur sparað verulega upphæð.',
    difficulty: 'easy',
    potentialSavingsRange: [10_000, 25_000],
  },
  {
    category: 'housing',
    title: 'Íhugaðu stúdíóíbúð eða smærra pláss',
    description:
      'Minni fermetrar = lægri húsaleiga og lægri hita-/rafmagnskostnaður. 30-40 fm nægir fyrir einn einstakling.',
    difficulty: 'moderate',
    potentialSavingsRange: [15_000, 30_000],
  },

  // ============================================================================
  // FOOD TIPS
  // ============================================================================
  {
    category: 'food',
    title: 'Verslaðu í afsláttarverslunum',
    description:
      'Keyptu allt í Bónus eða Krónan. Forðastu dýrari verslanir eins og Hagkaup nema fyrir tilboð.',
    difficulty: 'easy',
    potentialSavingsRange: [8_000, 15_000],
    icelandicResources: ['Bónus', 'Krónan', 'Netverslun (heimsending frí)'],
  },
  {
    category: 'food',
    title: 'Eldaðu allt heima',
    description:
      'Útrýmdu veitingastöðum og skyndibitum. Ein skyndibitamáltíð kostar jafnmikið og heill dagur af heimaelduðum mat.',
    difficulty: 'moderate',
    potentialSavingsRange: [15_000, 30_000],
  },
  {
    category: 'food',
    title: 'Skipuleggðu máltíðir fyrirfram',
    description:
      'Gerðu vikulega matarskrá og innkaupalista. Þetta kemur í veg fyrir impulse-kaup og matarsóun.',
    difficulty: 'easy',
    potentialSavingsRange: [5_000, 10_000],
  },
  {
    category: 'food',
    title: 'Kauptu í magni og frjósaðu niður',
    description:
      'Kauptu stór pakka af kjöti/fiski þegar á tilboði. Skipttu í skammta og frjósaðu niður.',
    difficulty: 'easy',
    potentialSavingsRange: [5_000, 12_000],
    icelandicResources: ['Costco (stór pakkar)', 'Bónus dagstilboð'],
  },
  {
    category: 'food',
    title: 'Komdu með mat í vinnuna',
    description:
      'Ekki kaupa hádegismat úti. Matarboxi frá heimili kostar 500-1.000 kr vs 2.000-3.000 kr úti.',
    difficulty: 'easy',
    potentialSavingsRange: [20_000, 40_000],
  },
  {
    category: 'food',
    title: 'Drekka vatn í stað gosdrykki',
    description:
      'Íslenskt kranavatn er gjaldfrjálst og hágæða. Útrýmdu gosdrykkjum og ávaxtasöfum.',
    difficulty: 'easy',
    potentialSavingsRange: [3_000, 8_000],
  },
  {
    category: 'food',
    title: 'Kauptu eigin vörumerki',
    description:
      'X-tra (Bónus) og Góðir Vilji (Krónan) eru 30-50% ódýrari en vörumerki.',
    difficulty: 'easy',
    potentialSavingsRange: [4_000, 10_000],
    icelandicResources: ['X-tra (Bónus)', 'Góðir Vilji (Krónan)'],
  },

  // ============================================================================
  // TRANSPORT TIPS
  // ============================================================================
  {
    category: 'transport',
    title: 'Notaðu Strætó eða hjólaðu',
    description:
      'Strætó kort kostar ~12.000 kr/mán. Hjól er enn ódýrara og hreyfing fylgir með.',
    difficulty: 'moderate',
    potentialSavingsRange: [15_000, 40_000],
    icelandicResources: ['Strætó.is', 'Hjólaleigu - WOW Cyclery'],
  },
  {
    category: 'transport',
    title: 'Ef nauðsynlegt með bíl, kauptu notaðan',
    description:
      'Kauptu áreiðanlegan notaðan bíl (Toyota Corolla, Yaris). Forðastu bílalán.',
    difficulty: 'moderate',
    potentialSavingsRange: [10_000, 30_000],
    icelandicResources: ['Bílamarkaðurinn', 'bilaleigan.is'],
  },
  {
    category: 'transport',
    title: 'Skipulagðu ekturnar - sameina erindi',
    description:
      'Sameina alla erindi í eina ferð. Minnkaðu ekna kílómetra um 30-50%.',
    difficulty: 'easy',
    potentialSavingsRange: [3_000, 8_000],
  },
  {
    category: 'transport',
    title: 'Samgöngukostur - deildu bíl',
    description:
      'Finndu samstarfsfólk til að deila ekið til vinnu. Skiptast á að aka.',
    difficulty: 'moderate',
    potentialSavingsRange: [8_000, 20_000],
  },
  {
    category: 'transport',
    title: 'Kauptu ódýrara eldsneyti',
    description:
      'Notaðu ódýrustu bensínstöðvar (Dælan, Costco). Forðastu N1, Orkan X.',
    difficulty: 'easy',
    potentialSavingsRange: [2_000, 5_000],
    icelandicResources: ['Dælan', 'Costco bensínstöð', 'Atlantsolía'],
  },

  // ============================================================================
  // ENTERTAINMENT TIPS
  // ============================================================================
  {
    category: 'entertainment',
    title: 'Notaðu bókasafn í stað bóka-/kvikmyndakaupa',
    description:
      'Bókasöfn bjóða ókeypis bækur, kvikmyndir, tónlist og rafbækur. Allur fjölskyldan getur fengið kort.',
    difficulty: 'easy',
    potentialSavingsRange: [3_000, 10_000],
    icelandicResources: ['Borgarbókasafn Reykjavíkur', 'Rafbækur á Bokasafn.is'],
  },
  {
    category: 'entertainment',
    title: 'Njóttu náttúrunnar - ókeypis göngur',
    description:
      'Ísland er full af ókeypis göngu- og útivistarsvæðum. Þetta er besta afþreyingin.',
    difficulty: 'easy',
    potentialSavingsRange: [5_000, 15_000],
    icelandicResources: ['Útivist.is', 'Gönguleiðir Reykjavíkur'],
  },
  {
    category: 'entertainment',
    title: 'Sleppa áskriftum - Netflix, Stöð 2, osfrv.',
    description:
      'Hætta öllum streymisáskriftum. Notaðu ókeypis efni, bókasafn, eða RÚV.',
    difficulty: 'moderate',
    potentialSavingsRange: [5_000, 15_000],
  },
  {
    category: 'entertainment',
    title: 'Fundið ókeypis viðburði',
    description:
      'Reykjavík er full af ókeypis viðburðum: tónleikar, fyrirlestrar, sýningar.',
    difficulty: 'easy',
    potentialSavingsRange: [3_000, 10_000],
    icelandicResources: ['Grapevine events', 'Harpa - fríir tónleikar', 'Myndlistarsöfn'],
  },
  {
    category: 'entertainment',
    title: 'Spilaðu íþróttir/leiki með vinum í stað bars',
    description:
      'Áfengi á barnum er dýrt. Bjóðið upp á leiki heima eða útivistarupplifun.',
    difficulty: 'moderate',
    potentialSavingsRange: [10_000, 30_000],
  },

  // ============================================================================
  // PERSONAL TIPS
  // ============================================================================
  {
    category: 'personal',
    title: 'Kauptu fatnað í notuðum fatabúðum',
    description:
      'Sparisjóður, Góði hirðirinn, og Rauði krossinn hafa gæða notaðan fatnað fyrir brot af nýju verði.',
    difficulty: 'easy',
    potentialSavingsRange: [3_000, 8_000],
    icelandicResources: ['Sparisjóður Reykjavíkur', 'Góði hirðirinn', 'Rauði krossinn'],
  },
  {
    category: 'personal',
    title: 'Klipptu hárið sjálf/ur eða hjá vini',
    description:
      'Hárgreiðsla kostar 5.000-10.000 kr. Keyptu klippivél fyrir 5.000 kr og sparaðu árlega.',
    difficulty: 'moderate',
    potentialSavingsRange: [2_000, 6_000],
  },
  {
    category: 'personal',
    title: 'Gerðu eigin snyrtivörur',
    description:
      'Margir sápubollar, andlitsvörur, osfrv. hægt að gera heima fyrir brot af verðinu.',
    difficulty: 'hard',
    potentialSavingsRange: [2_000, 5_000],
  },
  {
    category: 'personal',
    title: 'Forðastu "impulse" kaup',
    description:
      'Settu 30 daga bið-regluna: Ef þú vilt enn hlut eftir 30 daga, kauptu hann þá.',
    difficulty: 'moderate',
    potentialSavingsRange: [5_000, 20_000],
  },

  // ============================================================================
  // UTILITIES TIPS
  // ============================================================================
  {
    category: 'utilities',
    title: 'Berðu saman rafmagns- og internetveitur',
    description:
      'Notaðu samanburðarveitur til að finna ódýrustu rafmagns- og internetveituna.',
    difficulty: 'easy',
    potentialSavingsRange: [2_000, 5_000],
    icelandicResources: ['Orkusalan.is', 'Samanburður á Orkulind.is'],
  },
  {
    category: 'utilities',
    title: 'Lækkaðu hitastig og notaðu minni rafmagn',
    description:
      'Lækkið hitastig um 1-2°C og slökkva ljós. Sparar verulega á rafmagnsreikningi.',
    difficulty: 'easy',
    potentialSavingsRange: [3_000, 8_000],
  },
  {
    category: 'utilities',
    title: 'Fáðu einfaldara símafyrirkomulag',
    description:
      'Breyttu í ódýrasta símafyrirkomulagið (Nova, Vodafone basic). Þarft ekki ótakmarkað gagnamagn.',
    difficulty: 'easy',
    potentialSavingsRange: [2_000, 5_000],
    icelandicResources: ['Nova', 'Síminn', 'Vodafone'],
  },

  // ============================================================================
  // HEALTHCARE/INSURANCE TIPS
  // ============================================================================
  {
    category: 'healthcare',
    title: 'Notaðu heilsugæslu í stað bráðamóttöku',
    description:
      'Heilsugæsla er ódýrari en bráðamóttaka. Bókaðu tíma þegar ekki bráðavandamál.',
    difficulty: 'easy',
    potentialSavingsRange: [1_000, 3_000],
  },
  {
    category: 'insurance',
    title: 'Endurskoðaðu tryggingar - lágmarkaðu',
    description:
      'Farðu yfir allar tryggingar. Þarft ekki allt "extra" coverage. Lágmarkaðu við nauðsynlegt.',
    difficulty: 'moderate',
    potentialSavingsRange: [2_000, 8_000],
  },
];

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default LeanFIRE settings
 */
export const LEANFIRE_DEFAULTS = {
  fiMultiplier: DEFAULT_FI_MULTIPLIER,
  investmentReturn: 0.05, // 5% annual return
  selectedLocation: 'reykjavik' as const,
  version: 1,
};

/**
 * Validation ranges for LeanFIRE inputs
 */
export const LEANFIRE_RANGES = {
  monthlyExpenses: {
    min: 0,
    max: 1_000_000,
  },
  currentSavings: {
    min: 0,
    max: 100_000_000,
  },
  currentAge: {
    min: 18,
    max: 100,
  },
  savingsRate: {
    min: 0,
    max: 1_000_000,
  },
  investmentReturn: {
    min: 0,
    max: 0.2, // 20% max
  },
};

// ============================================================================
// EXPENSE BASELINE CATEGORY MAPPING
// ============================================================================

/**
 * Mapping from expense baseline category IDs (Icelandic) to LeanFire category keys (English)
 *
 * This allows the LeanFIRE calculator to use values from the expense baseline.
 * Not all expense baseline categories have a direct LeanFire equivalent.
 */
export const EXPENSE_BASELINE_TO_LEANFIRE: Record<string, ExpenseCategory | null> = {
  husnaedi: 'housing',
  matur: 'food',
  samgongur: 'transport',
  heilsa: 'healthcare',
  tryggingar: 'insurance',
  veitur: 'utilities',
  personuleg: 'personal',
  afthreying: 'entertainment',
  annad: 'other',
  // Categories without direct mapping (will be aggregated into 'other')
  askriftir: null, // Subscriptions - could be entertainment
  ferdalog: null, // Travel - could be entertainment
  born: null, // Children - no mapping
};

/**
 * Reverse mapping from LeanFire category keys to expense baseline IDs
 */
export const LEANFIRE_TO_EXPENSE_BASELINE: Record<ExpenseCategory, string> = {
  housing: 'husnaedi',
  food: 'matur',
  transport: 'samgongur',
  healthcare: 'heilsa',
  insurance: 'tryggingar',
  utilities: 'veitur',
  personal: 'personuleg',
  entertainment: 'afthreying',
  other: 'annad',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get default barebones expenses for a location
 */
export function getDefaultBarebonesExpenses(
  location: 'reykjavik' | 'landsbyggd'
): CategoryExpenses {
  return location === 'reykjavik'
    ? DEFAULT_BAREBONES_REYKJAVIK
    : DEFAULT_BAREBONES_LANDSBYGGD;
}

/**
 * Get total monthly expenses from CategoryExpenses
 */
export function getTotalMonthly(expenses: CategoryExpenses): number {
  return (
    expenses.housing +
    expenses.food +
    expenses.transport +
    expenses.healthcare +
    expenses.insurance +
    expenses.utilities +
    expenses.personal +
    expenses.entertainment +
    expenses.other
  );
}

/**
 * Get FI multiplier details
 */
export function getFIMultiplierDetails(multiplier: FIMultiplier) {
  return FI_MULTIPLIER_OPTIONS.find((opt) => opt.value === multiplier);
}

/**
 * Get reduction percentage details
 */
export function getReductionPercentageDetails(percent: ReductionPercent) {
  return REDUCTION_PERCENTAGE_OPTIONS.find((opt) => opt.value === percent);
}

/**
 * Get frugality tips for a category
 */
export function getTipsForCategory(category: ExpenseCategory) {
  return FRUGALITY_TIP_TEMPLATES.filter((tip) => tip.category === category);
}

/**
 * Estimate potential savings for a tip based on current expense level
 */
export function estimateTipSavings(
  tip: (typeof FRUGALITY_TIP_TEMPLATES)[number],
  currentExpense: number
): number {
  const [minSavings, maxSavings] = tip.potentialSavingsRange;

  // If current expense is very low, potential savings are minimal
  if (currentExpense < minSavings) {
    return Math.min(currentExpense * 0.1, minSavings);
  }

  // Use midpoint of range as estimate
  return Math.floor((minSavings + maxSavings) / 2);
}

/**
 * Get expense value for a LeanFire category from expense baseline
 *
 * @param expenseBaseline - The expense baseline from context
 * @param leanFireCategory - The LeanFire category key (e.g., 'food')
 * @param tier - The expense tier to get (defaults to 'barebones')
 * @returns The expense amount from baseline, or null if not found
 */
export function getExpenseFromBaseline(
  expenseBaseline: { categories: Array<{ id: string; values: { barebones: number; comfortable: number; deluxe: number } }> } | null,
  leanFireCategory: ExpenseCategory,
  tier: 'barebones' | 'comfortable' | 'deluxe' = 'barebones'
): number | null {
  if (!expenseBaseline || !expenseBaseline.categories) {
    return null;
  }

  const baselineCategoryId = LEANFIRE_TO_EXPENSE_BASELINE[leanFireCategory];
  if (!baselineCategoryId) {
    return null;
  }

  const category = expenseBaseline.categories.find((c) => c.id === baselineCategoryId);
  if (!category) {
    return null;
  }

  return category.values[tier];
}

/**
 * Get all expense values from baseline mapped to LeanFire categories
 *
 * @param expenseBaseline - The expense baseline from context
 * @param tier - The expense tier to get (defaults to 'barebones')
 * @returns CategoryExpenses with values from baseline, or null values where not found
 */
export function getAllExpensesFromBaseline(
  expenseBaseline: { categories: Array<{ id: string; values: { barebones: number; comfortable: number; deluxe: number } }> } | null,
  tier: 'barebones' | 'comfortable' | 'deluxe' = 'barebones'
): CategoryExpenses | null {
  if (!expenseBaseline || !expenseBaseline.categories) {
    return null;
  }

  const result: Partial<CategoryExpenses> = {};
  const allCategories: ExpenseCategory[] = [
    'housing',
    'food',
    'transport',
    'healthcare',
    'insurance',
    'utilities',
    'personal',
    'entertainment',
    'other',
  ];

  for (const leanFireCategory of allCategories) {
    const value = getExpenseFromBaseline(expenseBaseline, leanFireCategory, tier);
    result[leanFireCategory] = value ?? 0;
  }

  return result as CategoryExpenses;
}
