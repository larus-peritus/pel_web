/**
 * Icelandic text content for Debt Payoff vs Invest Analyzer
 * All UI text, labels, error messages, and guidance in Icelandic
 */

import type { LoanType, PayoffStrategy } from '@/types/debtPayoff';

/**
 * Loan type labels (Icelandic)
 */
export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  verdtryggd: 'Verðtryggð lán',
  oVerdtryggd: 'Óverðtryggð lán',
  other: 'Önnur lán',
};

/**
 * Recommendation labels (Icelandic)
 */
export const RECOMMENDATION_LABELS = {
  debt: 'Borga aukalega á skuld',
  invest: 'Fjárfesta aukapeninginn',
} as const;

/**
 * Payoff strategy labels (Icelandic)
 */
export const STRATEGY_LABELS: Record<PayoffStrategy, string> = {
  avalanche: 'Hæstu vextir fyrst (Avalanche)',
  snowball: 'Lægstu skuldir fyrst (Snowball)',
};

/**
 * Error messages (Icelandic)
 */
export const ERROR_MESSAGES = {
  balanceTooLow: 'Staða verður að vera hærri en 0 kr',
  balanceTooHigh: 'Staða virðist óeðlilega há (yfir 100 milljónir kr)',
  rateTooLow: 'Vextir verða að vera 0% eða hærri',
  rateTooHigh: 'Vextir of háir (yfir 50%)',
  inflationTooLow: 'Verðbólga verður að vera 0% eða hærri',
  inflationTooHigh: 'Verðbólga of há (yfir 20%)',
  minimumPaymentTooLow: 'Lágmarksgreiðsla verður að vera hærri en 0 kr',
  minimumPaymentInsufficient: 'Lágmarksgreiðsla verður að vera hærri en mánaðarlegir vextir til að greiða niður lán',
  extraPaymentNegative: 'Aukagreiðsla má ekki vera neikvæð',
  extraPaymentTooHigh: 'Aukagreiðsla virðist óeðlilega há',
  returnTooLow: 'Vænt ávöxtun verður að vera 0% eða hærri',
  returnTooHigh: 'Vænt ávöxtun virðist óraunhæf (yfir 20% á ári)',
  peacOfMindTooLow: 'Skuldleysis-stuðull verður að vera 0% eða hærri',
  peacOfMindTooHigh: 'Skuldleysis-stuðull má ekki vera hærri en 10%',
  nameRequired: 'Heiti er nauðsynlegt',
  nameTooLong: 'Heiti má ekki vera lengra en 50 stafir',
} as const;

/**
 * Tooltip explanations (Icelandic)
 */
export const TOOLTIPS = {
  loanType: 'Veldu gerð láns. Verðtryggð lán eru tengd verðbólgu, óverðtryggð hafa fasta vexti.',
  currentBalance: 'Núverandi eftirstöðvar lánsins í krónum',
  nominalInterestRate: 'Árlegir vextir á láninu. T.d. 7,5% = 0,075',
  inflationRate: 'Vænt árleg verðbólga fyrir verðtryggð lán. Venjulega 2-4%.',
  minimumPayment: 'Lágmarks mánaðarleg greiðsla á láninu',
  extraPayment: 'Aukaupphæð sem þú gætir greitt á lánið eða fjárfest í staðinn',
  expectedReturn: 'Vænt árleg ávöxtun fjárfestingar. Sögulegt meðaltal hlutabréfa er ~7-8%.',
  peacOfMind: 'Tilfinningalegt gildi þess að vera skuldlaus. 0% = hreint stærðfræðileg ákvörðun, 7-10% = mikil ósk um að losna við skuldir.',
  riskLevel: 'Áhættustig fjárfestingar hefur áhrif á vænta ávöxtun og sveiflur',
} as const;

/**
 * Section headings (Icelandic)
 */
export const HEADINGS = {
  mainTitle: 'Borga skuld eða fjárfesta?',
  debtInput: 'Upplýsingar um skuld',
  investmentInput: 'Forsendur fjárfestingar',
  peacOfMind: 'Skuldleysis-stuðull',
  results: 'Niðurstöður',
  recommendation: 'Ráðlegging',
  comparison: 'Samanburður',
  debtScenario: 'Skuldagreiðslur',
  investmentScenario: 'Fjárfesting',
  scenarios: 'Vistaðar atburðarásir',
  presets: 'Algengar lánategundir á Íslandi',
} as const;

/**
 * Button labels (Icelandic)
 */
export const BUTTONS = {
  calculate: 'Reikna',
  save: 'Vista',
  load: 'Hlaða inn',
  delete: 'Eyða',
  export: 'Flytja út',
  import: 'Flytja inn',
  clear: 'Hreinsa',
  apply: 'Nota',
  cancel: 'Hætta við',
  confirm: 'Staðfesta',
} as const;

/**
 * Field labels (Icelandic)
 */
export const FIELD_LABELS = {
  loanType: 'Tegund láns',
  currentBalance: 'Núverandi staða',
  nominalInterestRate: 'Vextir',
  inflationRate: 'Verðbólga',
  minimumPayment: 'Lágmarksgreiðsla',
  extraPayment: 'Aukagreiðsla',
  expectedReturn: 'Vænt ávöxtun',
  riskLevel: 'Áhættustig',
  peacOfMindFactor: 'Skuldleysis-stuðull',
  scenarioName: 'Heiti atburðarásar',
} as const;

/**
 * Risk level guidance (Icelandic)
 */
export const RISK_GUIDANCE = {
  conservative: 'Lítil áhætta, stöðug ávöxtun (~4-5%)',
  moderate: 'Meðaláhætta, sögulegt meðaltal (~6-7%)',
  aggressive: 'Mikil áhætta, hærri vænt ávöxtun (~8-10%)',
  historicalNote: 'Sögulegt meðaltal hlutabréfa: ~7-8% langtíma',
  volatilityWarning: 'Athugið: Ávöxtun fjárfestinga er ekki tryggð og getur sveiflast mikið',
} as const;

/**
 * Peace of mind labels (Icelandic)
 */
export const PEACE_OF_MIND_LABELS = {
  0: 'Stærðfræðileg',
  3: 'Hóflegt',
  5: 'Miðlungs',
  7: 'Sterkt',
  10: 'Mjög sterkt',
  explanation: 'Þetta táknar tilfinningalegt gildi þess að vera skuldlaus. Hærri gildi benda til þess að þú metur friðarhug af skuldleysi hærra en hrein stærðfræði.',
} as const;

/**
 * Disclaimer text (Icelandic)
 */
export const DISCLAIMER = 'Þetta er fræðsluverkfæri, ekki fjármálaráðgjöf. Hugsaðu um áhættu og persónulegar aðstæður.';

/**
 * Close call messaging (Icelandic)
 */
export const CLOSE_CALL_MESSAGE = {
  heading: 'Afar lítill munur!',
  body: 'Munurinn á valmöguleikum er minni en 5%. Í þessum tilfellum ætti persónuleg íhugun að vega þyngra en hrein stærðfræði.',
  suggestion: 'Hugleiddu skuldleysis-stuðulinn til að sjá hvernig tilfinningar gætu breytt ákvörðuninni.',
} as const;

/**
 * Result labels (Icelandic)
 */
export const RESULT_LABELS = {
  financialAdvantage: 'Fjárhagslegur ávinningur',
  lifeEnergy: 'Lífsorkutími',
  percentage: 'Prósenta',
  reasoning: 'Rökstuðningur',
  debtFreeMonth: 'Skuldlaus eftir',
  totalInterest: 'Heildarvextir',
  finalInvestment: 'Lokastaða fjárfestingar',
  breakEven: 'Jafnvægispunktur',
  netWorth: 'Hrein eign',
  months: 'mánuði',
  hours: 'vinnutímar',
  days: 'dagar',
} as const;

/**
 * Helper function to format months to readable text (Icelandic)
 */
export function formatMonthsText(months: number): string {
  if (months === 1) return '1 mánuði';
  if (months === 12) return '1 ári';
  if (months < 12) return `${months} mánuðum`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years === 1 ? '1 ári' : `${years} árum`;
  }

  const yearText = years === 1 ? '1 ári' : `${years} árum`;
  const monthText = remainingMonths === 1 ? '1 mánuði' : `${remainingMonths} mánuðum`;

  return `${yearText} og ${monthText}`;
}

/**
 * Helper function to format life energy hours (Icelandic)
 */
export function formatLifeEnergyText(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} mínútur`;
  }

  if (hours < 24) {
    return hours === 1 ? '1 vinnutíma' : `${Math.round(hours)} vinnutímar`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);

  if (remainingHours === 0) {
    return days === 1 ? '1 dag' : `${days} daga`;
  }

  const dayText = days === 1 ? '1 dag' : `${days} daga`;
  const hourText = remainingHours === 1 ? '1 vinnutíma' : `${remainingHours} vinnutímar`;

  return `${dayText} og ${hourText}`;
}
