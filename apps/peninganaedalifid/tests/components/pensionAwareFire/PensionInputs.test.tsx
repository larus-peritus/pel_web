/**
 * Tests for PensionInputs Component
 *
 * Covers:
 * - Component rendering
 * - Three collapsible sections (Lífeyrissjóður, Séreign, TR)
 * - Live séreign projection updates
 * - Live TR estimate updates
 * - Quick-fill button functionality
 * - User interactions and state updates
 * - Accessibility
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PensionInputs } from '@/components/pensionAwareFire/PensionInputs';
import * as CalculatorContext from '@/context/CalculatorContext';
import * as pensionCalculations from '@/lib/calculations/pensionAwareFire';
import { PENSION_AWARE_DEFAULTS } from '@/lib/constants/pensionAwareFire';
import type { PensionAwareFireState } from '@/types/pensionAwareFire';

// Mock the useCalculator hook
vi.mock('@/context/CalculatorContext');

// Mock calculation functions
vi.mock('@/lib/calculations/pensionAwareFire', () => ({
  calculateProjectedSereign: vi.fn(),
  calculateTREstimate: vi.fn(),
}));

describe('PensionInputs', () => {
  const mockUpdatePensionAwareFireState = vi.fn();
  const mockUseCalculator = vi.mocked(CalculatorContext.useCalculator);

  const defaultState: PensionAwareFireState = {
    currentAge: 35,
    targetRetirementAge: 55,
    monthlyExpenses: 300_000,
    expenseSource: 'manual',
    expenseTier: 'comfortable',
    currentSavings: 0,
    monthlySavings: 200_000,
    investmentReturn: 0.05,
    lifeyrissjodur: {
      expectedMonthlyAmount: 300_000,
      startAge: 67,
    },
    sereign: {
      currentBalance: 0,
      monthlyContribution: 0,
      employeeContributionPercent: 0.04,
      employerMatchPercent: 0.02,
    },
    tr: {
      expectFullTR: true,
      manualOverrideAmount: null,
    },
    savedScenarios: [],
    lastUpdated: new Date(),
    version: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useCalculator hook
    mockUseCalculator.mockReturnValue({
      pensionAwareFire: defaultState,
      updatePensionAwareFireState: mockUpdatePensionAwareFireState,
    } as any);

    // Mock calculation functions
    vi.mocked(pensionCalculations.calculateProjectedSereign).mockReturnValue({
      balanceAt60: 5_000_000,
      monthlyWithdrawal60to67: 60_000,
    });

    vi.mocked(pensionCalculations.calculateTREstimate).mockReturnValue({
      estimatedMonthly: 380_000,
      reductionPercent: 0,
      incomeAboveExemption: 0,
      isFullTR: true,
      isZeroTR: false,
    });
  });

  // ============================================================================
  // RENDERING TESTS
  // ============================================================================

  describe('Rendering', () => {
    it('renders the component with all sections', () => {
      render(<PensionInputs />);

      expect(screen.getByText('Lífeyrisupplýsingar')).toBeInTheDocument();
      expect(screen.getByText('Lífeyrissjóður (skyldusparnaður)')).toBeInTheDocument();
      expect(screen.getByText('Séreignarsparnaður (frjáls)')).toBeInTheDocument();
      expect(screen.getByText('TR Ellilífeyrir (ríkislífeyrir)')).toBeInTheDocument();
    });

    it('renders quick-fill button', () => {
      render(<PensionInputs />);

      const quickFillButton = screen.getByRole('button', { name: /nota dæmigerð gildi/i });
      expect(quickFillButton).toBeInTheDocument();
    });

    it('shows loading state when no state available', () => {
      mockUseCalculator.mockReturnValue({
        pensionAwareFire: null,
        updatePensionAwareFireState: mockUpdatePensionAwareFireState,
      } as any);

      render(<PensionInputs />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('all sections are expanded by default', () => {
      render(<PensionInputs />);

      // Check that inputs from all sections are visible
      expect(screen.getByLabelText(/væntanlegar mánaðarlegar greiðslur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/núverandi staða/i)).toBeInTheDocument();
      expect(screen.getByText(/áætlaður tr lífeyrir/i)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // LÍFEYRISSJÓÐUR SECTION TESTS
  // ============================================================================

  describe('Lífeyrissjóður Section', () => {
    it('renders lífeyrissjóður inputs', () => {
      render(<PensionInputs />);

      expect(screen.getByLabelText(/væntanlegar mánaðarlegar greiðslur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/upphaf greiðslna/i)).toBeInTheDocument();
    });

    it('displays current lífeyrissjóður values', () => {
      render(<PensionInputs />);

      const amountInput = screen.getByLabelText(/væntanlegar mánaðarlegar greiðslur/i);
      expect(amountInput).toHaveValue('300.000 kr');

      const startAgeSelect = screen.getByLabelText(/upphaf greiðslna/i);
      expect(startAgeSelect).toHaveValue('67');
    });

    it('updates lífeyrissjóður expected amount', () => {
      render(<PensionInputs />);

      const amountInput = screen.getByLabelText(/væntanlegar mánaðarlegar greiðslur/i);

      fireEvent.focus(amountInput);
      fireEvent.change(amountInput, { target: { value: '400000' } });
      fireEvent.blur(amountInput);

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        lifeyrissjodur: {
          expectedMonthlyAmount: 400_000,
          startAge: 67,
        },
      });
    });

    it('updates lífeyrissjóður start age', () => {
      render(<PensionInputs />);

      const startAgeSelect = screen.getByLabelText(/upphaf greiðslna/i);

      fireEvent.change(startAgeSelect, { target: { value: '62' } });

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        lifeyrissjodur: {
          expectedMonthlyAmount: 300_000,
          startAge: 62,
        },
      });
    });

    it('shows age options from 62 to 72', () => {
      render(<PensionInputs />);

      const startAgeSelect = screen.getByLabelText(/upphaf greiðslna/i) as HTMLSelectElement;
      const options = Array.from(startAgeSelect.options).map(opt => opt.value);

      expect(options).toContain('62');
      expect(options).toContain('67');
      expect(options).toContain('72');
      expect(options.length).toBe(11); // 62-72 inclusive
    });

    it('displays help text for lífeyrissjóður', () => {
      render(<PensionInputs />);

      expect(screen.getByText(/flestir fá um 300.000-400.000 kr\/mán/i)).toBeInTheDocument();
    });

    it('collapses and expands lífeyrissjóður section', () => {
      render(<PensionInputs />);

      const header = screen.getByText('Lífeyrissjóður (skyldusparnaður)').closest('div')?.parentElement;
      expect(header).toBeInTheDocument();

      // Initially expanded
      expect(screen.getByLabelText(/væntanlegar mánaðarlegar greiðslur/i)).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(header!);
      expect(screen.queryByLabelText(/væntanlegar mánaðarlegar greiðslur/i)).not.toBeInTheDocument();

      // Click to expand again
      fireEvent.click(header!);
      expect(screen.getByLabelText(/væntanlegar mánaðarlegar greiðslur/i)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // SÉREIGN SECTION TESTS
  // ============================================================================

  describe('Séreign Section', () => {
    it('renders séreign inputs', () => {
      render(<PensionInputs />);

      expect(screen.getByLabelText(/núverandi staða/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mánaðarlegt framlag/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mótframlag vinnuveitanda/i)).toBeInTheDocument();
    });

    it('displays current séreign values', () => {
      render(<PensionInputs />);

      const balanceInput = screen.getByLabelText(/núverandi staða/i);
      expect(balanceInput).toHaveValue('0 kr');

      const contributionInput = screen.getByLabelText(/mánaðarlegt framlag/i);
      expect(contributionInput).toHaveValue('0 kr');

      const matchSlider = screen.getByLabelText(/mótframlag vinnuveitanda/i);
      expect(matchSlider).toHaveValue('2'); // 2% = 0.02 * 100
    });

    it('updates séreign current balance', () => {
      render(<PensionInputs />);

      const balanceInput = screen.getByLabelText(/núverandi staða/i);

      fireEvent.focus(balanceInput);
      fireEvent.change(balanceInput, { target: { value: '1000000' } });
      fireEvent.blur(balanceInput);

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        sereign: {
          currentBalance: 1_000_000,
          monthlyContribution: 0,
          employerMatchPercent: 0.02,
        },
      });
    });

    it('updates séreign monthly contribution', () => {
      render(<PensionInputs />);

      const contributionInput = screen.getByLabelText(/mánaðarlegt framlag/i);

      fireEvent.focus(contributionInput);
      fireEvent.change(contributionInput, { target: { value: '50000' } });
      fireEvent.blur(contributionInput);

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        sereign: {
          currentBalance: 0,
          monthlyContribution: 50_000,
          employerMatchPercent: 0.02,
        },
      });
    });

    it('updates employer match percentage via slider', () => {
      render(<PensionInputs />);

      const matchSlider = screen.getByLabelText(/mótframlag vinnuveitanda/i);

      fireEvent.change(matchSlider, { target: { value: '4' } });

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        sereign: {
          currentBalance: 0,
          monthlyContribution: 0,
          employerMatchPercent: 0.04, // 4% / 100
        },
      });
    });

    it('displays projected séreign balance at 60', () => {
      render(<PensionInputs />);

      expect(screen.getByText(/áætluð staða við 60 ára aldur/i)).toBeInTheDocument();
      expect(screen.getByText('5.000.000 kr')).toBeInTheDocument();
    });

    it('calls calculateProjectedSereign with current state', () => {
      render(<PensionInputs />);

      expect(pensionCalculations.calculateProjectedSereign).toHaveBeenCalledWith(defaultState);
    });

    it('displays help text for séreign', () => {
      render(<PensionInputs />);

      expect(screen.getByText(/séreign er aðgengileg frá 60 ára aldri/i)).toBeInTheDocument();
    });

    it('collapses and expands séreign section', () => {
      render(<PensionInputs />);

      const header = screen.getByText('Séreignarsparnaður (frjáls)').closest('div')?.parentElement;
      expect(header).toBeInTheDocument();

      // Initially expanded
      expect(screen.getByLabelText(/núverandi staða/i)).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(header!);
      expect(screen.queryByLabelText(/núverandi staða/i)).not.toBeInTheDocument();

      // Click to expand again
      fireEvent.click(header!);
      expect(screen.getByLabelText(/núverandi staða/i)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // TR SECTION TESTS
  // ============================================================================

  describe('TR Ellilífeyrir Section', () => {
    it('displays auto-calculated TR estimate', () => {
      render(<PensionInputs />);

      expect(screen.getByText(/áætlaður tr lífeyrir/i)).toBeInTheDocument();
      expect(screen.getByText('380.000 kr')).toBeInTheDocument();
    });

    it('calls calculateTREstimate with current state', () => {
      render(<PensionInputs />);

      expect(pensionCalculations.calculateTREstimate).toHaveBeenCalledWith(defaultState);
    });

    it('shows full TR badge when isFullTR is true', () => {
      render(<PensionInputs />);

      expect(screen.getByText('Fullur TR')).toBeInTheDocument();
    });

    it('shows zero TR badge when isZeroTR is true', () => {
      vi.mocked(pensionCalculations.calculateTREstimate).mockReturnValue({
        estimatedMonthly: 0,
        reductionPercent: 100,
        incomeAboveExemption: 800_000,
        isFullTR: false,
        isZeroTR: true,
      });

      render(<PensionInputs />);

      expect(screen.getByText('Enginn TR')).toBeInTheDocument();
    });

    it('shows reduction details when TR is reduced', () => {
      vi.mocked(pensionCalculations.calculateTREstimate).mockReturnValue({
        estimatedMonthly: 250_000,
        reductionPercent: 34.2,
        incomeAboveExemption: 163_500,
        isFullTR: false,
        isZeroTR: false,
      });

      render(<PensionInputs />);

      expect(screen.getByText(/skerðing:/i)).toBeInTheDocument();
      expect(screen.getByText(/34\.2%/i)).toBeInTheDocument();
    });

    it('displays TR explanation text', () => {
      render(<PensionInputs />);

      expect(screen.getByText(/tekjutengdur lífeyrir/i)).toBeInTheDocument();
      expect(screen.getByText(/séreign telst ekki til tekna/i)).toBeInTheDocument();
    });

    it('renders link to official TR calculator', () => {
      render(<PensionInputs />);

      const link = screen.getByRole('link', { name: /opinber tr reiknivél/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://www.tr.is/ellilifeyrir/reiknivel/');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('collapses and expands TR section', () => {
      render(<PensionInputs />);

      const header = screen.getByText('TR Ellilífeyrir (ríkislífeyrir)').closest('div')?.parentElement;
      expect(header).toBeInTheDocument();

      // Initially expanded
      expect(screen.getByText(/áætlaður tr lífeyrir/i)).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(header!);
      expect(screen.queryByText(/áætlaður tr lífeyrir/i)).not.toBeInTheDocument();

      // Click to expand again
      fireEvent.click(header!);
      expect(screen.getByText(/áætlaður tr lífeyrir/i)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // QUICK-FILL FUNCTIONALITY
  // ============================================================================

  describe('Quick-Fill Button', () => {
    it('fills typical values when clicked', () => {
      render(<PensionInputs />);

      const quickFillButton = screen.getByRole('button', { name: /nota dæmigerð gildi/i });
      fireEvent.click(quickFillButton);

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        lifeyrissjodur: {
          expectedMonthlyAmount: 300_000,
          startAge: 67,
        },
        sereign: {
          currentBalance: 5_000_000, // From average scenario
          monthlyContribution: 10_000, // From average scenario
          employerMatchPercent: 0.02,
        },
        tr: {
          expectFullTR: true,
          manualOverrideAmount: null,
        },
      });
    });
  });

  // ============================================================================
  // LIVE UPDATES
  // ============================================================================

  describe('Live Updates', () => {
    it('updates séreign projection when state changes', () => {
      const { rerender } = render(<PensionInputs />);

      const updatedState = {
        ...defaultState,
        sereign: {
          currentBalance: 1_000_000,
          monthlyContribution: 50_000,
          employerMatchPercent: 0.04,
        },
      };

      mockUseCalculator.mockReturnValue({
        pensionAwareFire: updatedState,
        updatePensionAwareFireState: mockUpdatePensionAwareFireState,
      } as any);

      vi.mocked(pensionCalculations.calculateProjectedSereign).mockReturnValue({
        balanceAt60: 15_000_000,
        monthlyWithdrawal60to67: 180_000,
      });

      rerender(<PensionInputs />);

      expect(screen.getByText('15.000.000 kr')).toBeInTheDocument();
    });

    it('updates TR estimate when lífeyrissjóður changes', () => {
      const { rerender } = render(<PensionInputs />);

      const updatedState = {
        ...defaultState,
        lifeyrissjodur: {
          expectedMonthlyAmount: 500_000,
          startAge: 67,
        },
      };

      mockUseCalculator.mockReturnValue({
        pensionAwareFire: updatedState,
        updatePensionAwareFireState: mockUpdatePensionAwareFireState,
      } as any);

      vi.mocked(pensionCalculations.calculateTREstimate).mockReturnValue({
        estimatedMonthly: 172_475,
        reductionPercent: 54.6,
        incomeAboveExemption: 463_500,
        isFullTR: false,
        isZeroTR: false,
      });

      rerender(<PensionInputs />);

      expect(screen.getByText('172.475 kr')).toBeInTheDocument();
      expect(screen.getByText(/54\.6%/i)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // ACCESSIBILITY
  // ============================================================================

  describe('Accessibility', () => {
    it('has proper ARIA labels for inputs', () => {
      render(<PensionInputs />);

      expect(screen.getByLabelText(/væntanlegar mánaðarlegar greiðslur/i)).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText(/upphaf greiðslna/i)).toBeInTheDocument(); // native select doesn't have role
      expect(screen.getByLabelText(/núverandi staða/i)).toHaveAttribute('type', 'text');
    });

    it('has proper heading structure', () => {
      render(<PensionInputs />);

      const mainHeading = screen.getByRole('heading', { name: /lífeyrisupplýsingar/i });
      expect(mainHeading).toBeInTheDocument();
    });

    it('collapsible sections are clickable', () => {
      render(<PensionInputs />);

      const lifeyrissjodurHeader = screen.getByText('Lífeyrissjóður (skyldusparnaður)');
      expect(lifeyrissjodurHeader).toBeInTheDocument();

      // Verify it's inside a clickable element
      const headerParent = lifeyrissjodurHeader.closest('div')?.parentElement;
      expect(headerParent).toBeInTheDocument();
    });
  });
});
