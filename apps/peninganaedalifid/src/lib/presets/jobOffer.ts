/**
 * Presets for Job Offer Comparison Calculator
 * All monetary values in ISK per month (kr/mán)
 */

import type {
  JobCommutePreset,
  JobExpensePreset,
  JobBenefitPreset,
  BenefitType,
} from '@/types/jobOffer';

/**
 * Commute presets
 * Includes both time (one-way minutes) and monthly cost
 */
export const JOB_COMMUTE_PRESETS: JobCommutePreset[] = [
  {
    id: 'commute-remote',
    label: 'Heimavinna',
    description: 'Vinna að heiman',
    minutes: 0,
    costMonthly: 0,
  },
  {
    id: 'commute-short',
    label: 'Stutt',
    description: '~10-15 mín',
    minutes: 15,
    costMonthly: 14000, // ~170.000/12
  },
  {
    id: 'commute-medium',
    label: 'Meðal',
    description: '~25-30 mín',
    minutes: 30,
    costMonthly: 33000, // ~400.000/12
  },
  {
    id: 'commute-long',
    label: 'Löng',
    description: '~45-60 mín',
    minutes: 45,
    costMonthly: 67000, // ~800.000/12
  },
  {
    id: 'commute-very-long',
    label: 'Mjög löng',
    description: '60+ mín',
    minutes: 60,
    costMonthly: 117000, // ~1.400.000/12
  },
];

/**
 * Clothing expense presets (monthly)
 */
export const JOB_CLOTHING_PRESETS: JobExpensePreset[] = [
  {
    id: 'clothing-none',
    label: 'Í boði',
    description: 'Vinnufatnaður í boði',
    monthlyValue: 0,
  },
  {
    id: 'clothing-casual',
    label: 'Frjálslegt',
    description: 'Almennur fatnaður',
    monthlyValue: 2500, // ~30.000/12
  },
  {
    id: 'clothing-business',
    label: 'Hálf-formlegt',
    description: 'Faglegur fatnaður',
    monthlyValue: 9000, // ~110.000/12
  },
  {
    id: 'clothing-formal',
    label: 'Formlegt',
    description: 'Jakkaföt/formlegt',
    monthlyValue: 23000, // ~280.000/12
  },
];

/**
 * Meal expense presets (monthly lunch costs)
 */
export const JOB_MEAL_PRESETS: JobExpensePreset[] = [
  {
    id: 'meals-provided',
    label: 'Í boði',
    description: 'Matur í boði á vinnustað',
    monthlyValue: 0,
  },
  {
    id: 'meals-bring',
    label: 'Tek nesti',
    description: 'Nesti að heiman',
    monthlyValue: 6000, // ~70.000/12
  },
  {
    id: 'meals-occasional',
    label: 'Stundum',
    description: 'Kaupi 1-2x/viku',
    monthlyValue: 17000, // ~200.000/12
  },
  {
    id: 'meals-daily',
    label: 'Daglega',
    description: 'Kaupi daglega',
    monthlyValue: 42000, // ~500.000/12
  },
];

/**
 * Benefit presets (monthly value)
 * These are common benefits that can be quickly added
 */
export const JOB_BENEFIT_PRESETS: JobBenefitPreset[] = [
  {
    id: 'benefit-phone',
    type: 'phone',
    label: 'Sími og internet',
    description: 'Símakostnaður og internet greitt',
    monthlyValue: 8000, // ~96.000/ár
  },
  {
    id: 'benefit-car',
    type: 'car',
    label: 'Starfsmannabíll',
    description: 'Bíll í boði',
    monthlyValue: 50000, // ~600.000/ár
  },
  {
    id: 'benefit-lunch',
    type: 'lunch',
    label: 'Hádegismatur',
    description: 'Hádegismatur greiddur',
    monthlyValue: 30000, // ~360.000/ár
  },
  {
    id: 'benefit-health',
    type: 'health',
    label: 'Heilsutrygging',
    description: 'Viðbótar heilsutrygging',
    monthlyValue: 15000, // ~180.000/ár
  },
  {
    id: 'benefit-pension',
    type: 'pension',
    label: 'Aukalífeyrir',
    description: 'Viðbótarlífeyrissjóður',
    monthlyValue: 25000, // ~300.000/ár
  },
];

/**
 * Get benefit label by type
 */
export function getBenefitLabelByType(type: BenefitType): string {
  const labels: Record<BenefitType, string> = {
    phone: 'Sími og internet',
    car: 'Starfsmannabíll',
    lunch: 'Hádegismatur',
    health: 'Heilsutrygging',
    pension: 'Aukalífeyrir',
    other: 'Annað',
  };
  return labels[type];
}

/**
 * Find commute preset by minutes (approximate match)
 */
export function findCommutePreset(minutes: number): JobCommutePreset | null {
  if (minutes === 0) return JOB_COMMUTE_PRESETS[0];
  if (minutes <= 20) return JOB_COMMUTE_PRESETS[1];
  if (minutes <= 35) return JOB_COMMUTE_PRESETS[2];
  if (minutes <= 50) return JOB_COMMUTE_PRESETS[3];
  return JOB_COMMUTE_PRESETS[4];
}

/**
 * Find expense preset by value (exact match)
 */
export function findExpensePreset(
  presets: JobExpensePreset[],
  value: number
): JobExpensePreset | null {
  return presets.find((p) => p.monthlyValue === value) ?? null;
}
