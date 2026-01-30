/**
 * Icelandic text constants for Job Profit/Loss Scorecard
 *
 * All user-facing text for the profitability grading system.
 */

import type { ProfitabilityGrade } from '@/types/calculator';

/**
 * Grade labels in Icelandic
 */
export const GRADE_LABELS = {
  A: 'Framúrskarandi',
  B: 'Gott',
  C: 'Í meðallagi',
  D: 'Slæmt',
  F: 'Mjög slæmt',
} as const;

/**
 * Grade explanations in Icelandic
 */
export const GRADE_EXPLANATIONS = {
  A: 'Starfið þitt er mjög hagkvæmt. Þú heldur í yfir 85% af brúttólaunum þínum eftir að allur vinnukostnaður er dreginn frá.',
  B: 'Starfið þitt er nokkuð hagkvæmt. Þú heldur í 70-85% af brúttólaunum þínum eftir að allur vinnukostnaður er dreginn frá.',
  C: 'Starfið þitt er í meðallagi. Þú tapar 30-45% af brúttólaunum þínum í vinnukostnað. Íhugaðu hvort hægt sé að lækka útgjöld eða tíma.',
  D: 'Starfið þitt er ekki hagkvæmt. Þú tapar 45-60% af brúttólaunum þínum í vinnukostnað. Þetta kallar á breytingar.',
  F: 'Starfið þitt er mjög óhagkvæmt. Þú tapar yfir 60% af brúttólaunum þínum í vinnukostnað, eða launin eru of lág. Alvarleg endurskoðun er nauðsynleg.',
} as const;

/**
 * Section titles and labels for the scorecard
 */
export const PROFITABILITY_LABELS = {
  // Section titles
  cardTitle: 'Hagkvæmniseinkunn starfs',
  gradeSection: 'Einkunn',
  netLifeEnergySection: 'Nettó lífsorka',
  incomeBreakdownSection: 'Tekjuyfirlit',
  timeBreakdownSection: 'Tímayfirlit',
  summarySection: 'Samantekt',

  // Net life energy labels
  weeklyLifeEnergy: 'Nettó lífsorka á viku',
  monthlyLifeEnergy: 'Nettó lífsorka á mánuði',
  profit: 'Hagnaður',
  loss: 'Tap',

  // Income breakdown labels
  grossIncome: 'Brúttótekjur',
  totalExpenses: 'Heildarkostnaður',
  netIncome: 'Nettótekjur',
  perYear: 'á ári',

  // Time breakdown labels
  baseHours: 'Grunnvinnustundir',
  extraHours: 'Aukastundir',
  totalHours: 'Heildarvinnustundir',
  perWeek: 'á viku',
  hoursPerDay: 'klst/dag að meðaltali',

  // Units
  hours: 'klst',
  hoursShort: 'klst',
} as const;

/**
 * Helper function to get grade label
 */
export function getGradeLabel(grade: ProfitabilityGrade): string {
  return GRADE_LABELS[grade];
}

/**
 * Helper function to get grade explanation
 */
export function getGradeExplanation(grade: ProfitabilityGrade): string {
  return GRADE_EXPLANATIONS[grade];
}
