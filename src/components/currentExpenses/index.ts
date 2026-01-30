/**
 * Current Expense Report Components
 */

// Epic 9: Main Page Integration
export { CurrentExpenseReportCalculator } from './CurrentExpenseReportCalculator';

// Expense Wizard
export { ExpenseWizard } from './ExpenseWizard';

export { ExpenseDashboard } from './ExpenseDashboard';
export { QuickStats } from './QuickStats';
export { CategoryBreakdownChart } from './CategoryBreakdownChart';
export { EssentialBreakdownChart } from './EssentialBreakdownChart';
export { TopExpensesList } from './TopExpensesList';
export { RecommendationPanel } from './RecommendationPanel';

// Epic 3: Category Editor UI
export { CategoryExpenseEditor } from './CategoryExpenseEditor';
export { CategoryAccordion } from './CategoryAccordion';
export { LineItemRow } from './LineItemRow';
export { AddLineItemButton } from './AddLineItemButton';
export { AddCustomCategoryModal } from './AddCustomCategoryModal';

// Epic 5: Baseline Comparison View
export { BaselineComparisonView } from './BaselineComparisonView';
export { TierMatchIndicator } from './TierMatchIndicator';
export { CategoryComparisonTable } from './CategoryComparisonTable';
export { OverspendingHighlights } from './OverspendingHighlights';

export type { CategoryExpenseEditorProps } from './CategoryExpenseEditor';
export type { CategoryAccordionProps } from './CategoryAccordion';
export type { LineItemRowProps } from './LineItemRow';
export type { AddLineItemButtonProps } from './AddLineItemButton';
export type { AddCustomCategoryModalProps } from './AddCustomCategoryModal';
export type { BaselineComparisonViewProps } from './BaselineComparisonView';
export type { TierMatchIndicatorProps } from './TierMatchIndicator';
export type { CategoryComparisonTableProps } from './CategoryComparisonTable';
export type { OverspendingHighlightsProps } from './OverspendingHighlights';
