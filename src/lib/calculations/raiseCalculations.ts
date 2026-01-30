/**
 * Raise Calculation Orchestrator
 * Feature ID: 2.3.2
 *
 * Orchestrates tax, FI, and life energy calculations to produce
 * complete raise analysis with plain language summaries.
 *
 * References:
 * - REQ-CALC-001, REQ-CALC-002, REQ-CALC-003
 * - US-1, US-2, US-3
 */

import type {
  RaiseInputs,
  RaiseResults,
  LifeEnergyResults,
  RaiseSummary,
} from '@/types/raise';
import { calculateIcelandicTax } from './icelandicTax';
import { compareFIImpact } from './fiCalculations';
import { getUtsvarRate } from '@/lib/constants/icelandicTax';
import { FI_DEFAULTS } from '@/lib/constants/icelandicTax';

/**
 * Calculate complete raise analysis
 *
 * Orchestrates all calculations:
 * 1. Tax calculations for current and proposed salary
 * 2. FI impact (if FI context provided)
 * 3. Life energy analysis
 * 4. Plain language summary
 * 5. Warning generation
 *
 * @param inputs - Raise calculation inputs
 * @param actualHourlyWage - User's actual hourly wage from main calculator
 * @returns Complete raise analysis results
 */
export function calculateRaiseResults(
  inputs: RaiseInputs,
  actualHourlyWage: number
): RaiseResults {
  // Get útsvar rate (from municipality or custom input)
  const utsvarRate = inputs.customUtsvarRate ?? getUtsvarRate(inputs.municipality ?? '');

  // Calculate taxes for current salary
  const currentTax = calculateIcelandicTax(inputs.currentGrossAnnual, utsvarRate);

  // Calculate taxes for proposed salary
  const proposedTax = calculateIcelandicTax(inputs.proposedGrossAnnual, utsvarRate);

  // Calculate income differences
  const grossIncreaseAnnual = inputs.proposedGrossAnnual - inputs.currentGrossAnnual;
  const grossIncreaseMonthly = grossIncreaseAnnual / 12;
  const netIncreaseAnnual = proposedTax.netAnnual - currentTax.netAnnual;
  const netIncreaseMonthly = netIncreaseAnnual / 12;

  // Calculate effective tax rate on the increase
  const effectiveTaxRateOnIncrease =
    grossIncreaseAnnual > 0
      ? ((grossIncreaseAnnual - netIncreaseAnnual) / grossIncreaseAnnual) * 100
      : 0;

  // Calculate FI impact (if FI context provided)
  const fiImpact = inputs.fiContext
    ? compareFIImpact(currentTax.netAnnual, proposedTax.netAnnual, inputs.fiContext)
    : undefined;

  // Calculate life energy impact
  const lifeEnergy = calculateLifeEnergyResults(
    currentTax.netAnnual,
    proposedTax.netAnnual,
    inputs.currentWorkHoursWeek,
    inputs.proposedWorkHoursWeek ?? inputs.currentWorkHoursWeek,
    actualHourlyWage
  );

  // Build results object (without summary/warnings yet)
  const results: RaiseResults = {
    currentTax,
    proposedTax,
    grossIncreaseAnnual,
    grossIncreaseMonthly,
    netIncreaseAnnual,
    netIncreaseMonthly,
    effectiveTaxRateOnIncrease,
    fiImpact,
    lifeEnergy,
    summary: {} as RaiseSummary, // Will be filled next
    warnings: [],
  };

  // Generate plain language summary
  results.summary = generateRaiseSummary(results, inputs);

  // Generate warnings
  results.warnings = generateWarnings(results, inputs);

  return results;
}

/**
 * Calculate life energy results
 *
 * True hourly wage = Net annual income / Annual work hours
 * Annual work hours = Weekly hours × 50 weeks/year
 *
 * @param currentNetAnnual - Current net annual income
 * @param proposedNetAnnual - Proposed net annual income
 * @param currentHoursWeek - Current work hours per week
 * @param proposedHoursWeek - Proposed work hours per week
 * @param actualHourlyWage - Actual hourly wage from main calculator (unused in MVP)
 * @returns Life energy calculation results
 */
function calculateLifeEnergyResults(
  currentNetAnnual: number,
  proposedNetAnnual: number,
  currentHoursWeek: number,
  proposedHoursWeek: number,
  actualHourlyWage: number
): LifeEnergyResults {
  // Calculate annual work hours (50 weeks/year = 52 weeks - 2 weeks unpaid time off)
  const currentAnnualHours = currentHoursWeek * FI_DEFAULTS.weeksPerYear;
  const proposedAnnualHours = proposedHoursWeek * FI_DEFAULTS.weeksPerYear;

  // Calculate true hourly wage for each scenario
  const currentTrueHourlyWage = currentNetAnnual / currentAnnualHours;
  const proposedTrueHourlyWage = proposedNetAnnual / proposedAnnualHours;

  // Calculate change
  const hourlyWageChange = proposedTrueHourlyWage - currentTrueHourlyWage;
  const hourlyWageChangePercent =
    currentTrueHourlyWage > 0
      ? (hourlyWageChange / currentTrueHourlyWage) * 100
      : 0;

  // Calculate annual life energy gain
  // This is the extra income divided by the proposed hourly wage
  const netIncreaseAnnual = proposedNetAnnual - currentNetAnnual;
  const annualLifeEnergyGain =
    proposedTrueHourlyWage > 0 ? netIncreaseAnnual / proposedTrueHourlyWage : 0;

  return {
    currentTrueHourlyWage,
    proposedTrueHourlyWage,
    hourlyWageChange,
    hourlyWageChangePercent,
    annualLifeEnergyGain,
  };
}

/**
 * Generate plain language summary in Icelandic
 *
 * Creates human-readable summary of raise impact:
 * - After-tax monthly increase
 * - FI date impact (if applicable)
 * - Life energy gain
 * - Hourly wage change
 *
 * @param results - Calculation results
 * @param inputs - Original inputs
 * @returns Plain language summary
 */
export function generateRaiseSummary(
  results: RaiseResults,
  inputs: RaiseInputs
): RaiseSummary {
  const { netIncreaseMonthly } = results;
  const { hourlyWageChange } = results.lifeEnergy;

  // Format headline
  const headline =
    netIncreaseMonthly >= 0
      ? `Þú færð ${formatISK(netIncreaseMonthly)} aukalega eftir skatta á mánuði`
      : `Þú tapar ${formatISK(Math.abs(netIncreaseMonthly))} á mánuði eftir skatta`;

  // FI impact (if calculated)
  let fiImpact: string | undefined;
  if (results.fiImpact) {
    const months = results.fiImpact.accelerationMonths;
    if (months > 0) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (years > 0 && remainingMonths > 0) {
        fiImpact = `FI dagsetning færist ${years} ári og ${remainingMonths} mánuðum nær`;
      } else if (years > 0) {
        fiImpact = `FI dagsetning færist ${years} ${years === 1 ? 'ári' : 'árum'} nær`;
      } else {
        fiImpact = `FI dagsetning færist ${months} ${months === 1 ? 'mánuði' : 'mánuðum'} nær`;
      }
    } else if (months < 0) {
      const absMonths = Math.abs(months);
      const years = Math.floor(absMonths / 12);
      const remainingMonths = absMonths % 12;
      if (years > 0 && remainingMonths > 0) {
        fiImpact = `FI dagsetning seinkar um ${years} ár og ${remainingMonths} mánuði`;
      } else if (years > 0) {
        fiImpact = `FI dagsetning seinkar um ${years} ${years === 1 ? 'ár' : 'ár'}`;
      } else {
        fiImpact = `FI dagsetning seinkar um ${absMonths} ${absMonths === 1 ? 'mánuði' : 'mánuðum'}`;
      }
    } else {
      fiImpact = 'Engin breyting á FI dagsetningu';
    }
  }

  // Life energy impact
  const lifeEnergyHours = Math.round(results.lifeEnergy.annualLifeEnergyGain);
  const lifeEnergyImpact =
    lifeEnergyHours >= 0
      ? `Þetta er jafngildir ${lifeEnergyHours} klukkustundum af frelsi á ári miðað upphaflegt raunverulegt tímakaup`
      : `Þetta kostar þig ${Math.abs(lifeEnergyHours)} klukkustundir af frelsi á ári miðað upphaflegt raunverulegt tímakaup`;

  // Hourly wage change
  const hourlyWageChangeText =
    hourlyWageChange >= 0
      ? `Raunveruleg tímakaup þín hækka um ${formatISK(hourlyWageChange)}`
      : `Raunveruleg tímakaup þín lækka um ${formatISK(Math.abs(hourlyWageChange))}`;

  return {
    headline,
    fiImpact,
    lifeEnergyImpact,
    hourlyWageChange: hourlyWageChangeText,
  };
}

/**
 * Generate warnings based on calculation results
 *
 * Warning types:
 * - High effective tax rate (>40%)
 * - Small real increase (<5% of current net)
 * - Negative hourly wage change despite raise
 * - FI delay (lifestyle inflation)
 * - Tax bracket crossing
 *
 * @param results - Calculation results
 * @param inputs - Original inputs
 * @returns Array of warning messages in Icelandic
 */
export function generateWarnings(
  results: RaiseResults,
  inputs: RaiseInputs
): string[] {
  const warnings: string[] = [];

  // High tax rate warning
  if (results.effectiveTaxRateOnIncrease > 40) {
    warnings.push(
      `${Math.round(results.effectiveTaxRateOnIncrease)}% af hækkuninni fer í skatta`
    );
  }

  // Small increase warning
  const percentIncrease =
    (results.netIncreaseAnnual / results.currentTax.netAnnual) * 100;
  if (percentIncrease > 0 && percentIncrease < 5) {
    warnings.push('Lítil raunveruleg hækkun - athugaðu heildarlaun og kjör');
  }

  // Negative hourly wage despite raise
  if (
    results.lifeEnergy.hourlyWageChange < 0 &&
    results.netIncreaseMonthly > 0
  ) {
    warnings.push('Tímakaup þín lækka þrátt fyrir launahækkun vegna aukinna vinnustunda');
  }

  // FI delay warning
  if (results.fiImpact && results.fiImpact.accelerationMonths < 0) {
    warnings.push('Þetta seinkir FI dagsetningu þinni - varúð við lífsstílsverðbólgu');
  }

  return warnings;
}

/**
 * Format ISK currency (simple formatting for summary)
 * @param amount - Amount in ISK
 * @returns Formatted string with thousands separator
 */
function formatISK(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    + ' kr';
}
