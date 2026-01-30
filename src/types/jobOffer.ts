/**
 * TypeScript types for Job Offer Comparison Calculator
 * Allows users to compare current job vs new offer based on actual hourly wage
 * All monetary values stored as MONTHLY amounts (converted to annual for calculations)
 */

export interface JobOffer {
  id: string;
  name: string;
  isCurrentJob: boolean; // Flag to identify if this is current job or new offer

  // Income (monthly)
  grossMonthlySalary: number; // kr/mán - brúttó (fyrir skatta / before tax)
  monthlySalary: number; // kr/mán - nettó (eftir skatta / after tax)

  // Work hours
  weeklyHours: number; // Default 38
  vacationDays: number; // Default 24 for Iceland

  // Commute
  commuteMinutesPerDay: number; // Round trip
  commuteCostMonthly: number; // kr/mán for fuel, parking, etc.

  // Job-related expenses (monthly)
  expenses: JobExpenses;

  // Benefits (monthly values)
  benefits: MonetaryBenefit[];
}

export interface JobExpenses {
  clothing: number; // kr/mán - work clothing
  meals: number; // kr/mán - lunch costs
  other: number; // kr/mán - any other work-related expenses
}

export interface MonetaryBenefit {
  id: string;
  type: BenefitType;
  label: string;
  monthlyValue: number; // kr/mán
}

export type BenefitType =
  | 'phone' // Sími og internet
  | 'car' // Starfsmannabíll
  | 'lunch' // Hádegismatur
  | 'health' // Heilsutrygging
  | 'pension' // Aukalífeyrir
  | 'other'; // Annað

export interface JobOfferMetrics {
  offerId: string;

  // Annual totals (calculated from monthly)
  annualSalary: number;
  annualBenefits: number;
  totalCompensation: number;

  // Annual expenses (calculated from monthly)
  annualExpenses: number;
  annualCommuteCost: number;

  // Net compensation (after job-related expenses)
  netAnnualCompensation: number;

  // Hours
  annualWorkHours: number;
  annualCommuteHours: number;
  totalAnnualHours: number;

  // The key metrics
  actualHourlyWage: number; // Net compensation / total hours
  grossHourlyWage: number; // Total compensation / work hours only
}

export interface JobComparisonResult {
  offers: JobOffer[];
  metrics: JobOfferMetrics[];
  bestOfferId: string;

  // Differences
  hourlyWageDifference: number;
  monthlyNetDifference: number;
  lifeEnergyDifference: number; // hours/year

  // Summary
  plainLanguageSummary: string;
}

// Presets for quick selection
export interface JobCommutePreset {
  id: string;
  label: string;
  description: string;
  minutes: number; // One way in minutes
  costMonthly: number; // kr/mán
}

export interface JobExpensePreset {
  id: string;
  label: string;
  description: string;
  monthlyValue: number; // kr/mán
}

export interface JobBenefitPreset {
  id: string;
  type: BenefitType;
  label: string;
  description: string;
  monthlyValue: number; // kr/mán
}
