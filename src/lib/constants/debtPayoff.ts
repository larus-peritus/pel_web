/**
 * Constants and preset configurations for Debt Payoff vs Invest Analyzer
 * Iceland-specific loan types and typical rates
 */

import type { LoanPreset, RiskLevelPreset, InvestmentAssumptions } from '@/types/debtPayoff';

/**
 * Icelandic loan type presets with typical rates (Updated 2025)
 * Sources: Íslandsbanki, Landsbankinn, Menntasjóðurinn
 */
export const ICELANDIC_LOAN_PRESETS: LoanPreset[] = [
  {
    id: 'verdtryggd-husnaedislan',
    label: 'Verðtryggð húsnæðislán',
    description: 'Verðtryggð íbúðalán frá bönkum eða lífeyrissjóðum (3-5% raunvextir)',
    loanType: 'verdtryggd',
    typicalRate: 0.035, // 3.5% real interest (range 3-5%)
    typicalInflation: 0.05, // ~5% inflation 2025
  },
  {
    id: 'oVerdtryggd-husnaedislan',
    label: 'Óverðtryggð húsnæðislán',
    description: 'Óverðtryggð íbúðalán með föstum vöxtum (8-11%)',
    loanType: 'oVerdtryggd',
    typicalRate: 0.09, // 9% nominal (range 8-11%)
  },
  {
    id: 'bilalan',
    label: 'Bílalán',
    description: 'Bílalán frá bönkum og fjármögnunarfyrirtækjum (10-12%)',
    loanType: 'oVerdtryggd',
    typicalRate: 0.11, // 11% (range 10-12%)
  },
  {
    id: 'kreditkort',
    label: 'Kreditkort',
    description: 'Kreditkortaskuldir - forgangsraða greiðslu! (18-22%)',
    loanType: 'oVerdtryggd',
    typicalRate: 0.20, // 20% (range 18-22%)
  },
  {
    id: 'namslan',
    label: 'Námslán (Menntasjóðurinn)',
    description: 'Námslán frá Menntasjóði námsmanna, breytilegir vextir (hámark 4%)',
    loanType: 'verdtryggd',
    typicalRate: 0.025, // ~2.5% variable (max 4% indexed)
    typicalInflation: 0.05,
  },
  {
    id: 'personulan',
    label: 'Neytandalán',
    description: 'Óverðtryggð neytendalán (12-15%)',
    loanType: 'oVerdtryggd',
    typicalRate: 0.135, // 13.5% (range 12-15%)
  },
];

/**
 * Investment risk level presets with expected returns
 */
export const RISK_LEVEL_PRESETS: RiskLevelPreset[] = [
  {
    riskLevel: 'conservative',
    label: 'Íhaldssamt',
    description: 'Skuldabréf og stöðugir sjóðir',
    expectedReturn: 0.045, // 4-5%
    volatilityWarning: 'Lítil áhætta, stöðug en lág ávöxtun',
  },
  {
    riskLevel: 'moderate',
    label: 'Hóflegt',
    description: 'Blandað safn hlutabréfa og skuldabréfa',
    expectedReturn: 0.065, // 6-7%
    volatilityWarning: 'Meðaláhætta, sögulegt meðaltal fyrir blönduð safn',
  },
  {
    riskLevel: 'aggressive',
    label: 'Áhættusamt',
    description: 'Hlutabréfaþungt safn',
    expectedReturn: 0.09, // 8-10%
    volatilityWarning: 'Mikil áhætta, hærri vænt ávöxtun en meiri sveiflur',
  },
];

/**
 * Default investment assumptions (moderate risk)
 */
export const DEFAULT_INVESTMENT_ASSUMPTIONS: InvestmentAssumptions = {
  expectedAnnualReturn: 0.07, // 7% - historical average for balanced portfolios
  riskLevel: 'moderate',
};

/**
 * Default peace of mind factor (0% = pure math)
 */
export const DEFAULT_PEACE_OF_MIND_FACTOR = 0;

/**
 * Maximum peace of mind factor (10%)
 */
export const MAX_PEACE_OF_MIND_FACTOR = 10;

/**
 * Close call threshold (5% difference)
 */
export const CLOSE_CALL_THRESHOLD = 0.05;

/**
 * Maximum number of saved debt scenarios
 */
export const MAX_DEBT_SCENARIOS = 3;

/**
 * Maximum projection length (months) - safety limit to prevent infinite loops
 */
export const MAX_PROJECTION_MONTHS = 600; // 50 years

/**
 * Minimum balance threshold (kr) - consider debt paid off below this
 */
export const MIN_BALANCE_THRESHOLD = 0.01;

/**
 * Helper function to get preset by ID
 */
export function getPresetById(id: string): LoanPreset | undefined {
  return ICELANDIC_LOAN_PRESETS.find((preset) => preset.id === id);
}

/**
 * Helper function to get risk level preset by risk level
 */
export function getRiskLevelPreset(riskLevel: string): RiskLevelPreset | undefined {
  return RISK_LEVEL_PRESETS.find((preset) => preset.riskLevel === riskLevel);
}

/**
 * Helper function to get all presets by loan type
 */
export function getPresetsByLoanType(loanType: string): LoanPreset[] {
  return ICELANDIC_LOAN_PRESETS.filter((preset) => preset.loanType === loanType);
}
