/**
 * Job Offer Comparison Calculator
 * Calculates actual hourly wage for job offers accounting for
 * all time spent (work + commute) vs net compensation (after job expenses)
 *
 * All monetary inputs are monthly, converted to annual for calculations
 *
 * IMPORTANT: Job offers are typically stated in brúttó (before tax).
 * We calculate nettó (after tax) using the Icelandic tax calculator.
 */

import {
  JobOffer,
  JobOfferMetrics,
  JobComparisonResult,
  JobExpenses,
  MonetaryBenefit,
  BenefitType,
} from '@/types/jobOffer';
import {
  calculateSalaryFromGross,
  calculateGrossFromNet,
} from './icelandicTax';
import { DEFAULT_DEDUCTIONS } from '@/lib/constants/icelandicTax';

/**
 * Calculate metrics for a single job offer
 */
export function calculateOfferMetrics(offer: JobOffer): JobOfferMetrics {
  // 1. Calculate annual salary (monthly × 12)
  const annualSalary = offer.monthlySalary * 12;

  // 2. Calculate annual benefits (monthly × 12)
  const annualBenefits = offer.benefits.reduce(
    (sum, benefit) => sum + benefit.monthlyValue * 12,
    0
  );

  // 3. Total compensation
  const totalCompensation = annualSalary + annualBenefits;

  // 4. Calculate annual expenses (monthly × 12)
  const annualExpenses =
    (offer.expenses.clothing + offer.expenses.meals + offer.expenses.other) * 12;
  const annualCommuteCost = offer.commuteCostMonthly * 12;

  // 5. Net compensation (after job-related expenses)
  const netAnnualCompensation =
    totalCompensation - annualExpenses - annualCommuteCost;

  // 6. Calculate annual work hours
  // Work weeks per year = 52 weeks - (vacation days / 5 days per week)
  const vacationWeeks = offer.vacationDays / 5;
  const workWeeks = 52 - vacationWeeks;
  const annualWorkHours = workWeeks * offer.weeklyHours;

  // 7. Calculate annual commute hours
  // Commute time per day (round trip) × 5 days per week × work weeks
  const commuteHoursPerDay = offer.commuteMinutesPerDay / 60;
  const annualCommuteHours = commuteHoursPerDay * 5 * workWeeks;

  // 8. Calculate total annual hours (work + commute)
  const totalAnnualHours = annualWorkHours + annualCommuteHours;

  // 9. Calculate hourly wages
  const actualHourlyWage =
    totalAnnualHours > 0 ? netAnnualCompensation / totalAnnualHours : 0;
  const grossHourlyWage =
    annualWorkHours > 0 ? totalCompensation / annualWorkHours : 0;

  return {
    offerId: offer.id,
    annualSalary: Math.round(annualSalary),
    annualBenefits: Math.round(annualBenefits),
    totalCompensation: Math.round(totalCompensation),
    annualExpenses: Math.round(annualExpenses),
    annualCommuteCost: Math.round(annualCommuteCost),
    netAnnualCompensation: Math.round(netAnnualCompensation),
    annualWorkHours: Math.round(annualWorkHours),
    annualCommuteHours: Math.round(annualCommuteHours),
    totalAnnualHours: Math.round(totalAnnualHours),
    actualHourlyWage: Math.round(actualHourlyWage),
    grossHourlyWage: Math.round(grossHourlyWage),
  };
}

/**
 * Compare two job offers (current job vs new offer)
 */
export function compareOffers(offers: JobOffer[]): JobComparisonResult {
  if (offers.length < 2) {
    throw new Error('Þarf að minnsta kosti 2 tilboð til að bera saman');
  }

  // Calculate metrics for each offer
  const metrics = offers.map(calculateOfferMetrics);

  // Find the best offer (highest actual hourly wage)
  const sortedMetrics = [...metrics].sort(
    (a, b) => b.actualHourlyWage - a.actualHourlyWage
  );
  const bestMetric = sortedMetrics[0];
  const otherMetric = sortedMetrics[1];

  // Calculate differences
  const hourlyWageDifference =
    bestMetric.actualHourlyWage - otherMetric.actualHourlyWage;
  const monthlyNetDifference =
    (bestMetric.netAnnualCompensation - otherMetric.netAnnualCompensation) / 12;
  const lifeEnergyDifference =
    otherMetric.totalAnnualHours - bestMetric.totalAnnualHours;

  // Get offer objects
  const bestOffer = offers.find((o) => o.id === bestMetric.offerId)!;
  const otherOffer = offers.find((o) => o.id === otherMetric.offerId)!;

  // Generate plain language summary
  const lifeEnergyDays = Math.round(Math.abs(lifeEnergyDifference) / 8);
  const lifeEnergyWeeks =
    Math.round((Math.abs(lifeEnergyDifference) / 40) * 10) / 10;

  let summary = '';

  if (bestOffer.isCurrentJob) {
    // Current job is better
    summary = `Núverandi starf þitt borgar ${hourlyWageDifference.toLocaleString('is-IS')} kr/klst meira en nýja tilboðið. `;
    if (monthlyNetDifference > 0) {
      summary += `Þú myndir tapa ${Math.abs(Math.round(monthlyNetDifference)).toLocaleString('is-IS')} kr/mán í nettó með nýja tilboðinu.`;
    }
  } else {
    // New offer is better
    summary = `Nýja tilboðið borgar ${hourlyWageDifference.toLocaleString('is-IS')} kr/klst meira en núverandi starf. `;
    if (monthlyNetDifference > 0) {
      summary += `Þú myndir græða ${Math.abs(Math.round(monthlyNetDifference)).toLocaleString('is-IS')} kr/mán meira í nettó.`;
    }
  }

  if (lifeEnergyDifference !== 0) {
    const moreOrLess = lifeEnergyDifference > 0 ? 'færri' : 'fleiri';
    summary += ` ${bestOffer.name} krefst ${Math.abs(lifeEnergyDifference).toLocaleString('is-IS')} ${moreOrLess} vinnustundir á ári (${lifeEnergyDays} dagar).`;
  }

  return {
    offers,
    metrics,
    bestOfferId: bestMetric.offerId,
    hourlyWageDifference,
    monthlyNetDifference,
    lifeEnergyDifference,
    plainLanguageSummary: summary,
  };
}

/**
 * Create empty job offer with Icelandic defaults
 */
export function createEmptyOffer(
  id: string,
  name: string = '',
  isCurrentJob: boolean = false
): JobOffer {
  return {
    id,
    name,
    isCurrentJob,
    grossMonthlySalary: 0, // brúttó (fyrir skatta)
    monthlySalary: 0, // nettó (eftir skatta)
    weeklyHours: 38, // Standard full-time in Iceland (38 hours)
    vacationDays: 24, // Standard Icelandic vacation
    commuteMinutesPerDay: 0,
    commuteCostMonthly: 0,
    expenses: {
      clothing: 0,
      meals: 0,
      other: 0,
    },
    benefits: [],
  };
}

/**
 * Calculate nettó from brúttó using Icelandic tax calculator
 */
export function calculateNetFromGross(grossMonthly: number): number {
  if (grossMonthly <= 0) return 0;
  const result = calculateSalaryFromGross(grossMonthly, 14.48, DEFAULT_DEDUCTIONS);
  return Math.round(result.netMonthly);
}

/**
 * Calculate brúttó from nettó using reverse calculation
 */
export function calculateGrossFromNetSalary(netMonthly: number): number {
  if (netMonthly <= 0) return 0;
  const result = calculateGrossFromNet(netMonthly, 14.48, DEFAULT_DEDUCTIONS);
  return Math.round(result.grossMonthly);
}

/**
 * Create job offer from main calculator data
 *
 * The main calculator provides nettó (after tax) income.
 * We reverse-calculate to get brúttó (before tax) since
 * job offers are typically stated in brúttó.
 */
export function createOfferFromCalculatorData(
  id: string,
  name: string,
  data: {
    monthlyNetIncome: number; // nettó from main calculator (eftir skatta)
    weeklyWorkHours: number;
    vacationDays: number;
    commuteTimeWeekly: number; // hours per week
    commuteCostMonthly: number;
    clothingMonthly: number;
    mealsMonthly: number;
  }
): JobOffer {
  // Convert weekly commute hours to daily minutes (round trip)
  // commuteTimeWeekly hours / 5 days * 60 min/hour = minutes per day
  const commuteMinutesPerDay = (data.commuteTimeWeekly / 5) * 60;

  // Reverse calculate brúttó from nettó
  const grossMonthlySalary = calculateGrossFromNetSalary(data.monthlyNetIncome);

  return {
    id,
    name,
    isCurrentJob: true,
    grossMonthlySalary, // brúttó (fyrir skatta)
    monthlySalary: data.monthlyNetIncome, // nettó (eftir skatta)
    weeklyHours: data.weeklyWorkHours,
    vacationDays: data.vacationDays,
    commuteMinutesPerDay: Math.round(commuteMinutesPerDay),
    commuteCostMonthly: data.commuteCostMonthly,
    expenses: {
      clothing: data.clothingMonthly,
      meals: data.mealsMonthly,
      other: 0,
    },
    benefits: [],
  };
}

/**
 * Generate unique benefit ID
 */
export function generateBenefitId(): string {
  return `benefit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Create a new benefit with default values
 */
export function createBenefit(
  type: BenefitType = 'other',
  label: string = '',
  monthlyValue: number = 0
): MonetaryBenefit {
  return {
    id: generateBenefitId(),
    type,
    label,
    monthlyValue,
  };
}

/**
 * Format number with Icelandic thousand separators
 */
export function formatISK(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
