/**
 * FI Number Builder Components
 *
 * Barrel export file for all FI Number Builder components.
 * Provides clean import paths for all public components and types.
 *
 * Usage:
 * import { FINumberBuilderCalculator, MultiplierSelector } from '@/components/fiNumber';
 *
 * EPIC 9, Task 9.3
 */

// Main Calculator Component
export { FINumberBuilderCalculator } from './FINumberBuilderCalculator';

// Input Components
export { ExpenseSourceSelector } from './ExpenseSourceSelector';
export type { ExpenseSourceSelectorProps } from './ExpenseSourceSelector';

export { MultiplierSelector } from './MultiplierSelector';
export type { MultiplierSelectorProps } from './MultiplierSelector';

// Results Components
export { ResultsDisplay } from './ResultsDisplay';
export type { ResultsDisplayProps } from './ResultsDisplay';

// Scenario Comparison Components
export { ScenarioComparison } from './ScenarioComparison';
export type { ScenarioComparisonProps } from './ScenarioComparison';

export { ScenarioComparisonChart } from './ScenarioComparisonChart';
export type { ScenarioComparisonChartProps } from './ScenarioComparisonChart';

// Pension Integration Components
export { PensionIncomeSection } from './PensionIncomeSection';
export type { PensionIncomeSectionProps } from './PensionIncomeSection';

export { PensionAdjustedResults } from './PensionAdjustedResults';
export type { PensionAdjustedResultsProps } from './PensionAdjustedResults';

// Iceland Three-Phase Planning Component
export { ThreePhasePlanningSection } from './ThreePhasePlanningSection';
export type { ThreePhasePlanningSectionProps } from './ThreePhasePlanningSection';

// Life Energy Display
export { LifeEnergyDisplay } from './LifeEnergyDisplay';
export type { LifeEnergyDisplayProps } from './LifeEnergyDisplay';

// Prompt and Educational Components
export { AWHPrompt } from './AWHPrompt';

export { EducationalPanel } from './EducationalPanel';
export type { EducationalPanelProps } from './EducationalPanel';

export { IcelandicContextAlert } from './IcelandicContextAlert';
export type { IcelandicContextAlertProps } from './IcelandicContextAlert';

// Re-export types from @/types/fiNumber for convenience
export type {
  FINumberBuilderState,
  FINumberResults,
  ExpenseSource,
  StandardMultiplier,
  ScenarioResult,
  PensionAdjustedResult,
  FINumberLifeEnergy,
  ScenarioComparisonResult,
  PensionEstimate,
} from '@/types/fiNumber';
