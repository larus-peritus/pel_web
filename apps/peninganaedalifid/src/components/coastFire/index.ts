/**
 * Coast FIRE Components - Barrel Export
 *
 * Export all public components for the Coast FIRE Calculator (Ró FIRE Reiknivél).
 *
 * Epic 3, Task 3.6
 */

// Main calculator component
export { CoastFIRECalculator } from './CoastFIRECalculator';
export type { CoastFIRECalculatorProps } from './CoastFIRECalculator';

// Input components
export { CoastFIREInputs } from './CoastFIREInputs';
export type { CoastFIREInputsProps } from './CoastFIREInputs';

// Results components
export { CoastFIREResults } from './CoastFIREResults';
export type { CoastFIREResultsProps } from './CoastFIREResults';

export { CoastFIREStatus } from './CoastFIREStatus';
export type { CoastFIREStatusProps } from './CoastFIREStatus';

// Dashboard card component
export { CoastFIRECard } from './CoastFIRECard';
export type { CoastFIRECardProps } from './CoastFIRECard';

// Visualization components
export { GrowthProjectionChart } from './GrowthProjectionChart';
export type { GrowthProjectionChartProps } from './GrowthProjectionChart';

// Epic 5: Advanced Features
export { ScenarioComparisonTable } from './ScenarioComparisonTable';
export type { ScenarioComparisonTableProps } from './ScenarioComparisonTable';

export { LifeEnergyDisplay } from './LifeEnergyDisplay';
export type { LifeEnergyDisplayProps } from './LifeEnergyDisplay';

export { ActionSuggestionsPanel } from './ActionSuggestionsPanel';
export type { ActionSuggestionsPanelProps } from './ActionSuggestionsPanel';

// Epic 6: Integration Components
export { BaselineChangeNotification } from './BaselineChangeNotification';
export type { BaselineChangeNotificationProps } from './BaselineChangeNotification';

// Epic 7: Educational Content and Polish
export { EducationalIntro } from './EducationalIntro';
export type { EducationalIntroProps } from './EducationalIntro';

// Re-export types from types file for convenience
export type {
  CoastFIREInputs as CoastFIREInputsType,
  CoastFIREResult,
  CoastFIREStatus as CoastFIREStatusType,
  CoastFIREState,
  CoastFIREData,
  CoastFIRELifeEnergy,
  ScenarioResult,
  GrowthProjection,
  ActionSuggestion,
  CalculationAssumptions,
  FINumberBreakdown,
  ChartMilestone,
  ScenarioType,
  FINumberSource,
} from '@/types/coastFire';
