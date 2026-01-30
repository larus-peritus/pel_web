/**
 * Expense Baseline Components Barrel Export
 *
 * Exports all expense baseline calculator components and hooks
 */

// EPIC 8: Main Page Component
export { ExpenseBaselineCalculator } from './ExpenseBaselineCalculator';

// EPIC 5: Results Summary Display
export { ResultsSummarySection } from './ResultsSummarySection';
export { TierComparisonDisplay } from './TierComparisonDisplay';
export { CategoryBreakdownChart } from './CategoryBreakdownChart';
export { LifeEnergyComparison } from './LifeEnergyComparison';
export { TierDifferenceTable } from './TierDifferenceTable';

// EPIC 6: Integration Components
export { TierSelector } from './TierSelector';
export type { TierSelectorProps } from './TierSelector';

export { BaselinePrompt } from './BaselinePrompt';
export type { BaselinePromptProps } from './BaselinePrompt';

// Hooks
export {
  useExpenseBaseline,
  useSelectedTier,
  useExpenseByTier,
} from '@/hooks/useExpenseBaseline';
export type {
  UseExpenseBaselineReturn,
  UseSelectedTierReturn,
} from '@/hooks/useExpenseBaseline';
