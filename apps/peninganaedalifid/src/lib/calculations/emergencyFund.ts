/**
 * Emergency Fund Freedom Meter - Calculation Functions
 *
 * Pure functions for calculating emergency fund metrics:
 * - Months of freedom (financial runway)
 * - Life energy hours protected
 * - Risk assessment
 * - Target progress tracking
 */

import type {
  EmergencyFundData,
  EmergencyFundResults,
  RiskRating,
  RiskLevel,
  TargetProgress,
  ColorScheme,
} from '@/types/emergencyFund';

/**
 * Calculate months of freedom (financial runway)
 *
 * @param balance - Current emergency fund balance in ISK
 * @param monthlyExpenses - Monthly essential expenses in ISK
 * @returns Number of months the emergency fund will cover
 */
export const calculateMonthsOfFreedom = (
  balance: number,
  monthlyExpenses: number
): number => {
  if (monthlyExpenses <= 0) return 0;
  return balance / monthlyExpenses;
};

/**
 * Calculate weeks of freedom (for < 1 month scenarios)
 *
 * @param months - Months of freedom value
 * @returns Weeks of freedom (using 4.33 weeks per month average)
 */
export const calculateWeeksOfFreedom = (months: number): number => {
  return months * 4.33; // Average weeks per month
};

/**
 * Calculate life energy hours protected by emergency fund
 * Requires Actual Hourly Wage from main calculator
 *
 * @param balance - Current emergency fund balance in ISK
 * @param actualHourlyWage - Actual hourly wage from main calculator (null if not available)
 * @returns Life energy hours, or null if AWH not available
 */
export const calculateLifeEnergyHours = (
  balance: number,
  actualHourlyWage: number | null
): number | null => {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;
  return balance / actualHourlyWage;
};

/**
 * Convert hours to work-weeks (40-hour weeks)
 *
 * @param hours - Total hours
 * @returns Number of 40-hour work-weeks
 */
export const hoursToWorkWeeks = (hours: number): number => {
  return hours / 40;
};

/**
 * Convert hours to years (365 days × 24 hours)
 *
 * @param hours - Total hours
 * @returns Number of years
 */
export const hoursToYears = (hours: number): number => {
  return hours / 8760; // 365 * 24
};

/**
 * Get color scheme for a specific risk level
 *
 * @param level - Risk level
 * @returns Tailwind color scheme
 */
const getColorScheme = (level: RiskLevel): ColorScheme => {
  const schemes: Record<RiskLevel, ColorScheme> = {
    underfunded: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
    },
    minimal: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300',
    },
    moderate: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    strong: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
    },
    excellent: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
    },
  };

  return schemes[level];
};

/**
 * Calculate risk rating based on months of freedom
 * Uses 5-tier system: Underfunded → Minimal → Moderate → Strong → Excellent
 *
 * @param months - Months of freedom
 * @returns Complete risk rating with explanation and recommendation
 */
export const calculateRiskRating = (months: number): RiskRating => {
  if (months < 1) {
    return {
      level: 'underfunded',
      label: 'Vanfjármögnuð',
      color: getColorScheme('underfunded'),
      explanation:
        'Þinn neyðarsjóður nær ekki eins mánaðar útgjöldum. Þetta er áhættusamt.',
      recommendation:
        'Byrjaðu strax að leggja til hliðar. Jafnvel lítið framlag mánaðarlega gerir mikið.',
    };
  }

  if (months < 3) {
    return {
      level: 'minimal',
      label: 'Lágmarks',
      color: getColorScheme('minimal'),
      explanation:
        'Þú hefur grunn vernd, en 3 mánuðir eru lágmarkið fyrir fjármálaöryggi.',
      recommendation:
        'Haltu áfram að byggja upp - markmiðið er 3 mánuðir sem fyrsta áfangi.',
    };
  }

  if (months < 6) {
    return {
      level: 'moderate',
      label: 'Hóflegt',
      color: getColorScheme('moderate'),
      explanation:
        'Góður grunnur! Þú hefur náð fyrsta markmiðinu. 6 mánuðir gefa meiri sveigjanleika.',
      recommendation: null,
    };
  }

  if (months < 12) {
    return {
      level: 'strong',
      label: 'Sterkur',
      color: getColorScheme('strong'),
      explanation: 'Mjög gott! Þú hefur sterka vörn gegn óvæntum atvikum.',
      recommendation: null,
    };
  }

  return {
    level: 'excellent',
    label: 'Framúrskarandi',
    color: getColorScheme('excellent'),
    explanation:
      'Frábært! Þú hefur náð langtíma fjármálaöryggi. Íhugaðu fjárfestingarleiðir.',
    recommendation: null,
  };
};

/**
 * Get purpose explanation for a target milestone
 *
 * @param months - Target months (3, 6, or 12)
 * @returns Icelandic explanation of target purpose
 */
const getTargetPurpose = (months: number): string => {
  const purposes: Record<number, string> = {
    3: 'Lágmarksöryggi fyrir smærri neyðartilvik og skammtíma atvinnutap',
    6: 'Mælt með fyrir flesta - bætir við öryggi og sveigjanleika',
    12: 'Sterkur grunnur fyrir langtíma fjármálaöryggi og frelsismarkmið',
  };
  return purposes[months] || '';
};

/**
 * Calculate progress toward emergency fund targets
 * Standard targets: 3, 6, and 12 months
 *
 * @param balance - Current emergency fund balance
 * @param monthlyExpenses - Monthly essential expenses
 * @returns Array of target progress objects (3, 6, 12 months)
 */
export const calculateTargetProgress = (
  balance: number,
  monthlyExpenses: number
): TargetProgress[] => {
  const targets = [3, 6, 12];

  return targets.map((months) => {
    const targetAmount = months * monthlyExpenses;
    const progress = Math.min(100, (balance / targetAmount) * 100);
    const isAchieved = balance >= targetAmount;
    const amountRemaining = Math.max(0, targetAmount - balance);

    return {
      months,
      targetAmount,
      currentAmount: balance,
      progress,
      isAchieved,
      amountRemaining,
      purpose: getTargetPurpose(months),
    };
  });
};

/**
 * Calculate all emergency fund metrics
 * Main orchestration function that coordinates all calculations
 *
 * @param data - Emergency fund input data
 * @param actualHourlyWage - Actual hourly wage from main calculator (null if not available)
 * @returns Complete emergency fund results
 */
export const calculateEmergencyFundResults = (
  data: EmergencyFundData,
  actualHourlyWage: number | null
): EmergencyFundResults => {
  const { balance, monthlyExpenses } = data;

  // Primary calculation
  const monthsOfFreedom = calculateMonthsOfFreedom(balance, monthlyExpenses);

  // Weeks display (if < 1 month)
  const weeksOfFreedom =
    monthsOfFreedom < 1 ? calculateWeeksOfFreedom(monthsOfFreedom) : null;

  // Life energy calculations (null if AWH not available)
  const lifeEnergyHours = calculateLifeEnergyHours(balance, actualHourlyWage);
  const lifeEnergyWorkWeeks = lifeEnergyHours
    ? hoursToWorkWeeks(lifeEnergyHours)
    : null;
  const lifeEnergyYears = lifeEnergyHours
    ? hoursToYears(lifeEnergyHours)
    : null;

  // Risk assessment
  const riskRating = calculateRiskRating(monthsOfFreedom);

  // Target progress
  const targets = calculateTargetProgress(balance, monthlyExpenses);

  return {
    monthsOfFreedom,
    weeksOfFreedom,
    lifeEnergyHours,
    lifeEnergyWorkWeeks,
    lifeEnergyYears,
    riskRating,
    riskLevel: riskRating.level,
    targets,
  };
};
