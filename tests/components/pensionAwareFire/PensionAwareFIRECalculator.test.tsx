/**
 * Tests for PensionAwareFIRECalculator main container component
 *
 * Coverage:
 * - Component rendering
 * - Loading state
 * - Hero section display
 * - Back button functionality
 * - Educational intro integration
 * - Expense baseline status alerts
 * - Sub-component orchestration
 * - Results conditional rendering
 * - State initialization
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PensionAwareFIRECalculator } from '@/components/pensionAwareFire/PensionAwareFIRECalculator';
import { useCalculator } from '@/context/CalculatorContext';
import { PENSION_AWARE_DEFAULTS } from '@/lib/constants/pensionAwareFire';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

// Mock child components
vi.mock('@/components/pensionAwareFire/PensionEducationalIntro', () => ({
  PensionEducationalIntro: ({ collapsed, onToggle, onDismiss }: any) => (
    <div data-testid="pension-educational-intro">
      <button onClick={onToggle}>Toggle Intro</button>
      <button onClick={onDismiss}>Dismiss Intro</button>
      {!collapsed && <div>Educational Content</div>}
    </div>
  ),
}));

vi.mock('@/components/pensionAwareFire/BasicInputs', () => ({
  BasicInputs: () => <div data-testid="basic-inputs">Basic Inputs</div>,
}));

vi.mock('@/components/pensionAwareFire/PensionInputs', () => ({
  PensionInputs: () => <div data-testid="pension-inputs">Pension Inputs</div>,
}));

vi.mock('@/components/pensionAwareFire/PhaseTimeline', () => ({
  PhaseTimeline: () => <div data-testid="phase-timeline">Phase Timeline</div>,
}));

vi.mock('@/components/pensionAwareFire/FINumberComparison', () => ({
  FINumberComparison: () => <div data-testid="fi-number-comparison">FI Comparison</div>,
}));

vi.mock('@/components/pensionAwareFire/PhaseBreakdown', () => ({
  PhaseBreakdown: () => <div data-testid="phase-breakdown">Phase Breakdown</div>,
}));

vi.mock('@/components/pensionAwareFire/ScenarioComparison', () => ({
  ScenarioComparison: () => <div data-testid="scenario-comparison">Scenario Comparison</div>,
}));

const mockUseCalculator = useCalculator as unknown as ReturnType<typeof vi.fn>;

describe('PensionAwareFIRECalculator', () => {
  const mockInitializePensionAwareFire = vi.fn();

  const defaultMockContext = {
    pensionAwareFire: {
      ...PENSION_AWARE_DEFAULTS,
      savedScenarios: [],
    },
    pensionAwareFireResults: null,
    initializePensionAwareFire: mockInitializePensionAwareFire,
    expenseBaselineResults: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCalculator.mockReturnValue(defaultMockContext);
  });

  describe('Loading State', () => {
    it('should show loading state when pensionAwareFire is null', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: null,
      });

      render(<PensionAwareFIRECalculator />);

      // Should show loading skeleton
      const loadingElements = screen.getAllByRole('generic').filter(
        (el) => el.className.includes('animate-pulse')
      );
      expect(loadingElements.length).toBeGreaterThan(0);
    });

    it('should call initializePensionAwareFire when state is null', async () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: null,
      });

      render(<PensionAwareFIRECalculator />);

      await waitFor(() => {
        expect(mockInitializePensionAwareFire).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Hero Section', () => {
    it('should render hero section with badge, title, and subtitle', () => {
      render(<PensionAwareFIRECalculator />);

      // Badge
      expect(screen.getByText('🎯')).toBeInTheDocument();
      expect(screen.getByText('Lífeyristengd FIRE')).toBeInTheDocument();

      // Title
      expect(screen.getByText('Lífeyristengd FIRE Reiknivél')).toBeInTheDocument();

      // Subtitle
      expect(
        screen.getByText(
          'Reiknaðu raunverulega FI-tölu þína með tilliti til íslenska lífeyriskerfisins'
        )
      ).toBeInTheDocument();
    });

    it('should show back button when onBack prop is provided', () => {
      const mockOnBack = vi.fn();
      render(<PensionAwareFIRECalculator onBack={mockOnBack} />);

      const backButton = screen.getByText('Til baka í FIRE reiknivélalista');
      expect(backButton).toBeInTheDocument();

      fireEvent.click(backButton);
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should not show back button when onBack prop is not provided', () => {
      render(<PensionAwareFIRECalculator />);

      expect(screen.queryByText('Til baka í FIRE reiknivélalista')).not.toBeInTheDocument();
    });
  });

  describe('Educational Intro', () => {
    it('should render educational intro component', () => {
      render(<PensionAwareFIRECalculator />);

      expect(screen.getByTestId('pension-educational-intro')).toBeInTheDocument();
    });

    it('should start with intro collapsed', () => {
      render(<PensionAwareFIRECalculator />);

      // Should not show educational content initially
      expect(screen.queryByText('Educational Content')).not.toBeInTheDocument();
    });

    it('should toggle intro collapsed state', () => {
      render(<PensionAwareFIRECalculator />);

      const toggleButton = screen.getByText('Toggle Intro');

      // Initially collapsed
      expect(screen.queryByText('Educational Content')).not.toBeInTheDocument();

      // Toggle to expanded
      fireEvent.click(toggleButton);
      expect(screen.getByText('Educational Content')).toBeInTheDocument();

      // Toggle back to collapsed
      fireEvent.click(toggleButton);
      expect(screen.queryByText('Educational Content')).not.toBeInTheDocument();
    });

    it('should dismiss intro when dismiss button is clicked', () => {
      render(<PensionAwareFIRECalculator />);

      const dismissButton = screen.getByText('Dismiss Intro');
      expect(screen.getByTestId('pension-educational-intro')).toBeInTheDocument();

      fireEvent.click(dismissButton);

      expect(screen.queryByTestId('pension-educational-intro')).not.toBeInTheDocument();
    });
  });

  describe('Expense Baseline Status', () => {
    it('should show info alert when no expense baseline exists', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        expenseBaselineResults: null,
      });

      render(<PensionAwareFIRECalculator />);

      expect(screen.getByText('Sjálfgefin gildi notuð')).toBeInTheDocument();
      expect(
        screen.getByText(/Reiknivélin notar sjálfgefin útgjöld fyrir Ísland/)
      ).toBeInTheDocument();
      expect(screen.getByText('Útgjaldagrunnlínu')).toHaveAttribute('href', '/utgjaldareiknivel');
    });

    it('should show success alert when expense baseline is connected', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        expenseBaselineResults: {
          totals: {
            barebones: 240_000,
            comfortable: 300_000,
            deluxe: 400_000,
          },
          categories: {},
        },
      });

      render(<PensionAwareFIRECalculator />);

      expect(screen.getByText('Tengd við útgjaldagrunnlínu')).toBeInTheDocument();
      expect(
        screen.getByText(/Útgjaldagildi eru sjálfkrafa tengd við þína/)
      ).toBeInTheDocument();
    });
  });

  describe('Input Components', () => {
    it('should render BasicInputs component', () => {
      render(<PensionAwareFIRECalculator />);

      expect(screen.getByTestId('basic-inputs')).toBeInTheDocument();
    });

    it('should render PensionInputs component', () => {
      render(<PensionAwareFIRECalculator />);

      expect(screen.getByTestId('pension-inputs')).toBeInTheDocument();
    });
  });

  describe('Results Section', () => {
    it('should not show results when pensionAwareFireResults is null', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFireResults: null,
      });

      render(<PensionAwareFIRECalculator />);

      // No results components should be rendered
      expect(screen.queryByTestId('fi-number-comparison')).not.toBeInTheDocument();
      expect(screen.queryByTestId('phase-timeline')).not.toBeInTheDocument();
      expect(screen.queryByTestId('phase-breakdown')).not.toBeInTheDocument();
      expect(screen.queryByTestId('scenario-comparison')).not.toBeInTheDocument();
    });

    it('should show all results components when pensionAwareFireResults exists', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFireResults: {
          phases: [
            {
              name: 'Gap Phase',
              startAge: 45,
              endAge: 60,
              duration: 15,
              monthlyIncome: 300_000,
              monthlyExpenses: 300_000,
              surplus: 0,
              fundingRequired: 54_000_000,
              remainingFunds: 0,
            },
          ],
          traditionalFINumber: 144_000_000,
          pensionAdjustedFINumber: 54_000_000,
          savingsDifference: 90_000_000,
          percentageReduction: 62.5,
          timeToFITraditional: null,
          timeToFIAdjusted: null,
          yearsEarlier: null,
          projectedSereign: {
            balanceAt60: 0,
            monthlyWithdrawal60to67: 0,
            willCoverGap: false,
            shortfall: 0,
          },
          projectedTR: {
            fullTR: 380_000,
            lifeyrissjodurMonthly: 200_000,
            incomeAboveExemption: 163_500,
            reduction: 73_575,
            actualTR: 306_425,
            isFullTR: false,
            isZeroTR: false,
          },
          warnings: [],
        },
      });

      render(<PensionAwareFIRECalculator />);

      // All results components should be rendered
      expect(screen.getByTestId('fi-number-comparison')).toBeInTheDocument();
      expect(screen.getByTestId('phase-timeline')).toBeInTheDocument();
      expect(screen.getByTestId('phase-breakdown')).toBeInTheDocument();
      expect(screen.getByTestId('scenario-comparison')).toBeInTheDocument();
    });

    it('should render results components in correct order', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFireResults: {
          phases: [],
          traditionalFINumber: 144_000_000,
          pensionAdjustedFINumber: 54_000_000,
          savingsDifference: 90_000_000,
          percentageReduction: 62.5,
          timeToFITraditional: null,
          timeToFIAdjusted: null,
          yearsEarlier: null,
          projectedSereign: {
            balanceAt60: 0,
            monthlyWithdrawal60to67: 0,
            willCoverGap: false,
            shortfall: 0,
          },
          projectedTR: {
            fullTR: 380_000,
            lifeyrissjodurMonthly: 200_000,
            incomeAboveExemption: 163_500,
            reduction: 73_575,
            actualTR: 306_425,
            isFullTR: false,
            isZeroTR: false,
          },
          warnings: [],
        },
      });

      const { container } = render(<PensionAwareFIRECalculator />);

      // Get all result components
      const fiComparison = screen.getByTestId('fi-number-comparison');
      const timeline = screen.getByTestId('phase-timeline');
      const breakdown = screen.getByTestId('phase-breakdown');
      const scenarios = screen.getByTestId('scenario-comparison');

      // Verify order by comparing their positions in the DOM
      const allElements = Array.from(container.querySelectorAll('[data-testid]'));
      const fiIndex = allElements.indexOf(fiComparison);
      const timelineIndex = allElements.indexOf(timeline);
      const breakdownIndex = allElements.indexOf(breakdown);
      const scenariosIndex = allElements.indexOf(scenarios);

      // FINumberComparison should come first
      expect(fiIndex).toBeLessThan(timelineIndex);
      // Timeline should come before breakdown
      expect(timelineIndex).toBeLessThan(breakdownIndex);
      // Breakdown should come before scenarios
      expect(breakdownIndex).toBeLessThan(scenariosIndex);
    });
  });

  describe('State Management', () => {
    it('should not call initialize when state already exists', () => {
      render(<PensionAwareFIRECalculator />);

      // Initialize should not be called if state exists
      expect(mockInitializePensionAwareFire).not.toHaveBeenCalled();
    });

    it('should handle state initialization', async () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: null,
      });

      const { rerender } = render(<PensionAwareFIRECalculator />);

      // Should call initialize
      await waitFor(() => {
        expect(mockInitializePensionAwareFire).toHaveBeenCalledTimes(1);
      });

      // Simulate state being set
      mockUseCalculator.mockReturnValue(defaultMockContext);
      rerender(<PensionAwareFIRECalculator />);

      // Should now show content instead of loading
      expect(screen.getByText('Lífeyristengd FIRE Reiknivél')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<PensionAwareFIRECalculator />);

      // Should have heading
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Lífeyristengd FIRE Reiknivél');
    });

    it('should have accessible back button', () => {
      const mockOnBack = vi.fn();
      render(<PensionAwareFIRECalculator onBack={mockOnBack} />);

      const backButton = screen.getByText('Til baka í FIRE reiknivélalista').closest('button');
      expect(backButton).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Styling', () => {
    it('should have gradient background', () => {
      const { container } = render(<PensionAwareFIRECalculator />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.className).toContain('bg-gradient-to-b');
      expect(mainDiv.className).toContain('from-blue-50');
    });

    it('should have blue-indigo-purple hero gradient', () => {
      const { container } = render(<PensionAwareFIRECalculator />);

      // Find the hero section (parent of the title)
      const heroSection = container.querySelector('.bg-gradient-to-br');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection?.className).toContain('from-blue-100');
      expect(heroSection?.className).toContain('via-indigo-50');
      expect(heroSection?.className).toContain('to-purple-50');
    });

    it('should use consistent spacing between sections', () => {
      const { container } = render(<PensionAwareFIRECalculator />);

      // Container should have space-y-8 for consistent spacing
      const mainContent = container.querySelector('.space-y-8');
      expect(mainContent).toBeInTheDocument();
    });
  });
});
