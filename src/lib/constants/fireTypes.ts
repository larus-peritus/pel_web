/**
 * FIRE Type Definitions Configuration
 *
 * Complete definitions for all five FIRE (Financial Independence, Retire Early) types:
 * - LeanFIRE: Minimal expenses, earliest retirement
 * - RegularFIRE: Comfortable expenses, standard approach
 * - CoastFIRE: Let investments grow, work covers current expenses
 * - BaristaFIRE: Part-time work in retirement
 * - FatFIRE: Premium lifestyle, higher target
 *
 * Each type includes Icelandic names, descriptions, pros/cons, examples, and color schemes.
 * Adapted from FIRE community concepts for Icelandic context with realistic ISK amounts.
 */

import type { FIRETypeDefinition, FIRETypeId } from '@/types/fireTypes';

/**
 * Complete FIRE type definitions
 *
 * All five FIRE types with comprehensive Icelandic information including:
 * - Names (Icelandic + English)
 * - Descriptions and taglines
 * - Pros and cons
 * - Best for / not for audience descriptions
 * - Real-world Icelandic examples with ISK amounts
 * - Color schemes for UI
 */
export const FIRE_TYPE_DEFINITIONS: readonly FIRETypeDefinition[] = [
  // ============================================================================
  // LEANFIRE - Sparsamt FIRE
  // ============================================================================
  {
    id: 'leanfire',
    nameIs: 'Sparsamt FIRE',
    nameEn: 'LeanFIRE',
    tagline: 'Lágmarksútgjöld, stysta leiðin til frelsis',
    description:
      'LeanFIRE byggir á mjög lágum útgjöldum og háu sparnaðarhlutfalli. Þú lifir á lágmarkskostnaði til að ná fjármálafrelsi fyrr en með öðrum aðferðum. Á Íslandi er þetta sérstaklega hagkvæmt vegna TR lífeyriskerfisins: með lágum útgjöldum færðu fullan TR lífeyri (~315.000 kr/mán) við 67 ára sem dekkar stóran hluta af þörfum þínum. Notaðu séreign sem brú frá 60-67 - hún skerðir EKKI TR réttindi!',
    expenseTier: 'barebones',
    multiplier: 30, // 30x recommended for Iceland (vs US 25x) due to higher inflation

    pros: [
      'Stysta leiðin til fjármálafrelsis',
      'Krefst minnsta sparnaðar fyrstu árin',
      'Hámarks sveigjanleiki í starfi eftir að hafa náð markinu',
      'Lærir að lifa með minna og meta einfaldleikann',
      'Minni fjármálaáhætta vegna lægri markmiðs',
      'TR lífeyrir dekkar stóran hluta af útgjöldum við 67 ára',
      'Séreign brúar bilið 60-67 án þess að skerða TR',
    ],

    cons: [
      'Krefst mikilla fórna í lífsgæðum',
      'Lítill púði fyrir óvænt útgjöld',
      'Erfitt að viðhalda til lengdar',
      'Félagslegur þrýstingur og einangrun',
      'Takmarkaðir möguleikar til ferðalaga og áhugamála',
    ],

    bestFor: [
      'Fólk með náttúrulega lágar þarfir',
      'Þá sem eru tilbúnir til að lifa sparlega',
      'Ungt fólk sem vill losna við vinnu fljótt',
      'Einstaklingar með sveigjanlegan lífsstíl',
      'Þeir sem meta frjálsan tíma umfram efnislega hluti',
    ],

    notFor: [
      'Fjölskyldufólk með börn',
      'Þeir sem njóta efnislegra hluti',
      'Fólk með dýr áhugamál',
      'Einstaklingar sem þurfa dýran félagslegan lífsstíl',
      'Þá sem hafa heilsufarsvandamál sem krefjast útgjalda',
    ],

    examples: [
      {
        title: 'Einhleypur í Akureyri',
        description:
          'Býr í lítilli íbúð, notar hjól og strætó, eldar heima, takmarkaðar skemmtanir. Nýtur náttúrunnar og einfalds lífsstíls.',
        monthlyExpenses: 250_000,
        fiNumber: 75_000_000,
      },
      {
        title: 'Par í Reykjavík í lítilli íbúð',
        description:
          'Deilir kostnaði, minir húsnæðiskostnaður, eldar heima, ókeypis afþreying. Áhersla á upplifanir umfram hluti.',
        monthlyExpenses: 350_000,
        fiNumber: 105_000_000,
      },
    ],

    color: 'amber',
    icon: '🔥',
  },

  // ============================================================================
  // REGULARFIRE - Venjulegt FIRE
  // ============================================================================
  {
    id: 'regularfire',
    nameIs: 'Venjulegt FIRE',
    nameEn: 'RegularFIRE',
    tagline: 'Klassískt FIRE með þægilegum lífsstíl',
    description:
      'Venjulegt FIRE er hin hefðbundna leið á Íslandi: 30x árleg útgjöld spöruð með 3,3% úttektarreglu (íhaldssöm vegna hærri verðbólgu). Skipuleggðu í þremur fösum: (1) persónulegur sparnaður til 60 ára, (2) séreign brúar 60-67 (skerðir ekki TR!), (3) lífeyrissjóður + TR dekka hluta útgjalda frá 67. Þetta lækkar raunverulega FI-tölu þína verulega.',
    expenseTier: 'comfortable',
    multiplier: 30,

    pros: [
      'Raunsætt markmið fyrir flesta',
      'Núverandi lífsstíll viðhaldið',
      'Íslenskt lífeyriskerfi lækkar FI-tölu',
      'Gott jafnvægi milli sparnaðar og núverandi lífsstíls',
      'Þriggja fasa skipulag nýtir lífeyriskerfi',
    ],

    cons: [
      'Krefst 15-20 ára sparnaðar fyrir flesta',
      'Ekki eins fljótt og LeanFIRE',
      'Krefst aga í sparnaði í langan tíma',
      'Markaðsáhætta yfir áratugalangt sparnaðartímabil',
      'Verðbólguáhætta á Íslandi krefst 30x margfaldara (ekki 25x)',
    ],

    bestFor: [
      'Fólk með hófleg laun og útgjöld',
      'Þá sem vilja halda venjulegum lífsstíl',
      'Miðaldra einstaklingar með stöðugar tekjur',
      'Fjölskyldur með venjulegar þarfir',
      'Þeir sem meta jafnvægi milli sparnaðar og lífs í dag',
    ],

    notFor: [
      'Þá sem vilja hætta að vinna sem fyrst',
      'Fólk sem vill láta lífsstíl aukast með tekjum',
      'Einstaklingar með mjög háar eða lágar tekjur',
      'Þeir sem hafa ekki aga til langtímasparnaðar',
    ],

    examples: [
      {
        title: 'Hjón í Reykjavík',
        description:
          'Þriggja herbergja íbúð, einn bíll, venjulegur matur og skemmtanir, sumarferð á ári. Þægilegur en ekki íburðarmikill lífsstíll.',
        monthlyExpenses: 520_000,
        fiNumber: 156_000_000,
      },
      {
        title: 'Einstætt foreldri með eitt barn',
        description:
          'Tveggja herbergja íbúð, almennir matur og fatnaður, afþreying og uppeldi barns. Þægilegt en sparlegt.',
        monthlyExpenses: 450_000,
        fiNumber: 135_000_000,
      },
    ],

    color: 'green',
    icon: '🎯',
  },

  // ============================================================================
  // COASTFIRE - Sjálfvirkt FIRE
  // ============================================================================
  {
    id: 'coastfire',
    nameIs: 'Sjálfvirkt FIRE',
    nameEn: 'CoastFIRE',
    tagline: 'Sparaðu snemma, láttu vexti klára verkið',
    description:
      'CoastFIRE þýðir að spara nægjanlegt magn snemma og láta fjárfestingar + skyldubundinn lífeyrissjóð vaxa. Á Íslandi: lífeyrissjóður (15,5% af launum) heldur áfram að safnast jafnvel þegar þú "coastar". Við 67 ára færðu lífeyrissjóð + TR sem lækkar FI-þörf þína. Séreign vex líka skattfrjálst og brúar 60-67 án þess að skerða TR.',
    expenseTier: null, // Special: uses comfortable for target, 0 for coasting period
    multiplier: 30,

    pros: [
      'Minni sparnaðarþrýstingur eftir að ná "coast point"',
      'Sveigjanleiki í starfsvali eftir "coast point"',
      'Möguleiki á að taka lægri launuð störf sem veiti meiri lífsfyllingu',
      'Samsettur vöxtur vinnur fyrir þig',
      'Lífeyrissjóður safnast enn þótt þú hættir að spara virkan',
      'Séreign vex skattfrjálst til brúar við 60 ára',
    ],

    cons: [
      'Krefst mikils sparnaðar fyrstu árin',
      'Ekki alveg fjármálafrelsi (vinnur ennþá)',
      'Markaðsáhætta yfir lengri tíma',
      'Krefst þolinmæði og trausts á vaxtavexti',
      'Erfitt að áætla framtíðarávöxtun nákvæmlega',
    ],

    bestFor: [
      'Ungt fólk (<35 ára) með góðar tekjur',
      'Þá sem eru byrjaðir að spara snemma',
      'Fólk sem vill meiri sveigjanleika í dag',
      'Einstaklingar sem njóta vinnunnar sinnar',
      'Þeir sem skilja og treysta samsettum vexti',
    ],

    notFor: [
      'Fólk nálægt eftirlaunum (>50 ára)',
      'Þá sem vilja algjört FIRE fljótt',
      'Einstaklingar sem vilja sleppa því að vinna',
      'Fólk með óstöðugar tekjur',
    ],

    examples: [
      {
        title: '30 ára með 30 milljónir sparaðar',
        description:
          'Hefur sparað hart í nokkur ár. Láttur 30M vaxa til 67 ára við 6% ávöxtun = 156M. Getur hætt sparnaði alveg og valið starf eftir áhuga.',
        monthlyExpenses: 520_000, // Target at retirement
        fiNumber: 156_000_000, // Full target
      },
      {
        title: '28 ára með 25 milljónir sparaðar',
        description:
          'Hættir að spara, vinnur við skemmtilegt en lægra launað starf. Fjárfestingarnar vaxa í næstu 39 ár fram til eftirlaunaaldurs.',
        monthlyExpenses: 450_000,
        fiNumber: 135_000_000,
      },
    ],

    color: 'cyan',
    icon: '🏖️',
  },

  // ============================================================================
  // BARISTAFIRE - Hálfstöðvar FIRE
  // ============================================================================
  {
    id: 'baristafire',
    nameIs: 'Kaffiþjóna FIRE',
    nameEn: 'BaristaFIRE',
    tagline: 'Hluta fjármálafrelsi + hlutastarf = frelsi',
    description:
      'BaristaFIRE er þegar þú hefur náð fjárhagslega sjálfstæði að hluta til og vinnur léttara hlutastarf. Á Íslandi: eftir 67 ára getur þú þénað allt að 200.000 kr/mán í launum án þess að skerða TR lífeyri! Þetta gerir hlutastarf sérstaklega aðlaðandi. Lífeyrissjóður safnast líka áfram með hlutastarfi (15,5% af launum).',
    expenseTier: null, // Special: uses comfortable for expenses, partial coverage
    multiplier: 30,

    pros: [
      'Fljótari en full FIRE',
      'Heldur félagslegum tengslum í gegnum vinnu',
      'Minni sparnaðarkrafur en full FIRE',
      'Sveigjanleiki í vinnutíma og starfsvali',
      'Frítekjumark: 200.000 kr/mán skerðir ekki TR eftir 67 ára',
      'Lífeyrissjóður safnast áfram með hlutastarfi',
      'Heldur starfskunnáttu og viðskiptanetum',
    ],

    cons: [
      'Ekki alveg frjáls frá vinnu',
      'Þarf að finna rétta hlutastarfið',
      'Hlutastarfstekjur gætu ekki haldið í við verðbólgu',
      'Erfiðara að skipuleggja en fullt FIRE',
    ],

    bestFor: [
      'Fólk sem nýtur vinnunnar en vill minni álag',
      'Þá sem vilja snemmbúið "hálfgert FIRE"',
      'Einstaklingar með sveigjanleika í starfi',
      'Fólk sem metur félagslegan þátt vinnu',
      'Þeir sem hafa færni sem auðvelt er að selja á hlutastarfsmarkaði',
    ],

    notFor: [
      'Fólk sem vill alveg hætta vinnu',
      'Einstaklingar með heilsufarsvandamál',
      'Þeir sem hafa ekki sveigjanleg störf',
    ],

    examples: [
      {
        title: 'Með 90 milljónir sparaðar (60% af fullu FIRE)',
        description:
          'Vinnur 15-20 klst á viku við skemmtilegt starf fyrir ~200.000 kr/mán. Portfolíó gefur ~312.000 kr/mán (3,5% af 90M/12). Samtals 512.000 kr/mán fyrir þægilegt líf.',
        monthlyExpenses: 520_000,
        fiNumber: 90_000_000, // 60% of full 150M
      },
      {
        title: 'Sjálfstætt starfandi á hlutastarfi',
        description:
          'Tekur aðeins best borgandi verkefnin, ~10-15 klst/viku. Lífeyrissjóður dekkar 40%, hlutavinna 30%, portfolíó 30%.',
        monthlyExpenses: 450_000,
        fiNumber: 80_000_000,
      },
    ],

    color: 'purple',
    icon: '☕',
  },

  // ============================================================================
  // FATFIRE - Lúxus FIRE
  // ============================================================================
  {
    id: 'fatfire',
    nameIs: 'Lúxus FIRE',
    nameEn: 'FatFIRE',
    tagline: 'Lifa vel, engar hömlur',
    description:
      'FatFIRE er FIRE án þess að draga úr lífsgæðum - ferðalög, veitingahús, áhugamál, sumarhús, allt án takmarkana. Á Íslandi: með svona háar tekjur færðu líklega engan TR lífeyri (tekjumörkin eru ~726k kr/mán). Lífeyrissjóður hjálpar þó - og fjármagnstekjuskattur er 22%. Íhugaðu skattahagræðingu og dreifingu fjárfestinga á milli landa.',
    expenseTier: 'deluxe',
    multiplier: 30,

    pros: [
      'Engar hömlur á lífsstíl eða áhugamálum',
      'Mikill fjárhagslegur púði fyrir óvænt útgjöld',
      'Getur stutt börn og fjölskyldu',
      'Ferðalög og áhugamál án áhyggna',
      'Getur viðhaldið háum lífsgæðum að eilífu',
      'Lífeyrissjóður gefur trausta grunnþjónustu við 67',
    ],

    cons: [
      'Krefst mjög hárra tekna',
      'Tekur langan tíma (20-30 ár fyrir flesta)',
      'Mjög hátt sparnaðarhlutfall nauðsynlegt',
      'Hætta á "lifestyle creep" sem hækkar markið',
      'Markaðsáhætta við stórar upphæðir',
      'Engin TR réttindi - tekjur of háar',
      '22% fjármagnstekjuskattur á úttektir',
    ],

    bestFor: [
      'Hálaunafólk með mjög háar tekjur',
      'Þá sem vilja ekki gefa eftir lífsstíl',
      'Fjölskyldur með börn í dýrum skólum',
      'Fólk með dýr áhugamál (seglbátar, ferðalög, o.fl.)',
      'Einstaklingar sem meta efnislega hluti og upplifanir',
    ],

    notFor: [
      'Fólk með lágar eða meðal tekjur',
      'Þá sem vilja ná FIRE fljótt',
      'Einstaklingar sem meta einfaldleika',
      'Fólk sem vill ekki vinna í 20+ ár',
    ],

    examples: [
      {
        title: 'Hjón með háar tekjur í Reykjavík',
        description:
          'Stór íbúð eða hús, 2 bílar, regluleg ferðalög erlendis, veitingahús oft, dýr áhugamál. Lífsgæði án takmarkana.',
        monthlyExpenses: 1_000_000,
        fiNumber: 300_000_000,
      },
      {
        title: 'Fjölskylda með sumarhús',
        description:
          'Eignarhaldsfélag, sumarhús við Þingvallavatn, jeppi, snjósleðar, bátur. Ferðast oft til útlanda. Engar fjárhagslegar áhyggjur.',
        monthlyExpenses: 1_200_000,
        fiNumber: 360_000_000,
      },
    ],

    color: 'pink',
    icon: '💎',
  },
] as const;

/**
 * FIRE type ordering for display
 *
 * Order from most conservative (LeanFIRE) to most aggressive (FatFIRE).
 */
export const FIRE_TYPE_ORDER: readonly FIRETypeId[] = [
  'leanfire',
  'regularfire',
  'coastfire',
  'baristafire',
  'fatfire',
] as const;

/**
 * Default FIRE type (most recommended for average Icelander)
 */
export const DEFAULT_FIRE_TYPE: FIRETypeId = 'regularfire';

/**
 * Color schemes for each FIRE type (Tailwind classes)
 *
 * Used for consistent theming across UI components.
 */
export const FIRE_TYPE_COLORS: Record<
  FIRETypeId,
  {
    bg: string;
    border: string;
    text: string;
    accent: string;
    hover: string;
  }
> = {
  leanfire: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-900',
    accent: 'bg-amber-500',
    hover: 'hover:bg-amber-100',
  },
  regularfire: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-900',
    accent: 'bg-green-500',
    hover: 'hover:bg-green-100',
  },
  coastfire: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-300',
    text: 'text-cyan-900',
    accent: 'bg-cyan-500',
    hover: 'hover:bg-cyan-100',
  },
  baristafire: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-900',
    accent: 'bg-purple-500',
    hover: 'hover:bg-purple-100',
  },
  fatfire: {
    bg: 'bg-pink-50',
    border: 'border-pink-300',
    text: 'text-pink-900',
    accent: 'bg-pink-500',
    hover: 'hover:bg-pink-100',
  },
} as const;

/**
 * Helper: Get FIRE type definition by ID
 */
export const getFIRETypeDefinition = (id: FIRETypeId): FIRETypeDefinition => {
  const definition = FIRE_TYPE_DEFINITIONS.find((def) => def.id === id);
  if (!definition) {
    throw new Error(`FIRE type definition not found: ${id}`);
  }
  return definition;
};

/**
 * Helper: Get FIRE type color scheme
 */
export const getFIRETypeColors = (id: FIRETypeId) => {
  return FIRE_TYPE_COLORS[id];
};

/**
 * Helper: Check if FIRE type is tier-based
 *
 * Returns true if the FIRE type directly maps to an expense tier.
 */
export const isTierBasedFIREType = (id: FIRETypeId): boolean => {
  const definition = getFIRETypeDefinition(id);
  return definition.expenseTier !== null;
};

/**
 * Helper: Get all tier-based FIRE types
 */
export const getTierBasedFIRETypes = (): FIRETypeDefinition[] => {
  return FIRE_TYPE_DEFINITIONS.filter((def) => def.expenseTier !== null);
};

/**
 * Helper: Get all special FIRE types (CoastFIRE, BaristaFIRE)
 */
export const getSpecialFIRETypes = (): FIRETypeDefinition[] => {
  return FIRE_TYPE_DEFINITIONS.filter((def) => def.expenseTier === null);
};
