/**
 * Tests for PhaseBreakdown Component
 *
 * Tests:
 * - Rendering with different phase configurations
 * - Collapsible behavior
 * - Income source display accuracy
 * - Funding chain visualization
 * - Surplus/deficit highlighting
 * - Empty state
 * - Expand/collapse all functionality
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhaseBreakdown } from '@/components/pensionAwareFire/PhaseBreakdown';
import type { RetirementPhase } from '@/types/pensionAwareFire';

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
  formatCurrency: (value: number) => {
    if (value === 0) return '0';
    return value.toLocaleString('is-IS', { maximumFractionDigits: 0 });
  },
}));

describe('PhaseBreakdown', () => {
  // Test data - single phase (full pension with surplus)
  const singlePhaseWithSurplus: RetirementPhase = {
    id: 'full-pension',
    nameIs: 'Fullur lífeyrir',
    nameEn: 'Full Pension',
    startAge: 67,
    endAge: 90,
    durationYears: 23,
    incomeSources: {
      savingsWithdrawal: 0,
      investmentReturns: 20_000,
      sereign: 0,
      lifeyrissjodur: 350_000,
      tr: 220_000,
      total: 590_000,
    },
    monthlyExpenses: 300_000,
    requiredAtStart: 0,
    remainingAtEnd: 15_000_000,
    isSelfFunded: false,
    hasSurplus: true,
    surplusAmount: 290_000,
  };

  // Test data - gap phase (self-funded)
  const gapPhase: RetirementPhase = {
    id: 'gap',
    nameIs: 'Biðtími (sjálfsfjármagnað)',
    nameEn: 'Gap Period (Self-Funded)',
    startAge: 52,
    endAge: 60,
    durationYears: 8,
    incomeSources: {
      savingsWithdrawal: 240_000,
      investmentReturns: 100_000,
      sereign: 0,
      lifeyrissjodur: 0,
      tr: 0,
      total: 340_000,
    },
    monthlyExpenses: 240_000,
    requiredAtStart: 23_040_000,
    remainingAtEnd: 5_000_000,
    isSelfFunded: true,
    hasSurplus: false,
    surplusAmount: 0,
  };

  // Test data - séreign bridge phase
  const bridgePhase: RetirementPhase = {
    id: 'sereign-bridge',
    nameIs: 'Séreign-brú',
    nameEn: 'Private Pension Bridge',
    startAge: 60,
    endAge: 67,
    durationYears: 7,
    incomeSources: {
      savingsWithdrawal: 60_000,
      investmentReturns: 40_000,
      sereign: 180_000,
      lifeyrissjodur: 0,
      tr: 0,
      total: 280_000,
    },
    monthlyExpenses: 300_000,
    requiredAtStart: 8_000_000,
    remainingAtEnd: 2_000_000,
    isSelfFunded: false,
    hasSurplus: false,
    surplusAmount: 0,
  };

  describe('Rendering', () => {
    it('renders empty state when no phases provided', () => {
      render(<PhaseBreakdown phases={[]} />);

      expect(screen.getByText('Engar eftirlaunafasar til að sýna.')).toBeInTheDocument();
    });

    it('renders single phase correctly', () => {
      render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      expect(screen.getByText('Yfirlit eftir stigum')).toBeInTheDocument();
      expect(screen.getByText('Stig 1:')).toBeInTheDocument();
      expect(screen.getByText('Fullur lífeyrir')).toBeInTheDocument();
      expect(screen.getByText('(67-90 ára)')).toBeInTheDocument();
      expect(screen.getByText('23 ár')).toBeInTheDocument();
    });

    it('renders all three phases in correct order', () => {
      render(<PhaseBreakdown phases={[gapPhase, bridgePhase, singlePhaseWithSurplus]} />);

      const phaseHeaders = screen.getAllByText(/Stig \d:/);
      expect(phaseHeaders).toHaveLength(3);

      // Verify phase numbers
      expect(screen.getByText('Stig 1:')).toBeInTheDocument();
      expect(screen.getByText('Stig 2:')).toBeInTheDocument();
      expect(screen.getByText('Stig 3:')).toBeInTheDocument();

      // Verify phase names
      expect(screen.getByText('Biðtími (sjálfsfjármagnað)')).toBeInTheDocument();
      expect(screen.getByText('Séreign-brú')).toBeInTheDocument();
      expect(screen.getByText('Fullur lífeyrir')).toBeInTheDocument();
    });
  });

  describe('Collapsible Behavior', () => {
    it('shows all phases expanded by default', () => {
      render(<PhaseBreakdown phases={[gapPhase, bridgePhase]} />);

      // Check that content is visible (income/expense sections)
      expect(screen.getAllByText('Tekjur')).toHaveLength(2);
      expect(screen.getAllByText('Útgjöld')).toHaveLength(2);
    });

    it('collapses phase when header is clicked', () => {
      render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      // Initially expanded
      expect(screen.getByText('Tekjur')).toBeInTheDocument();

      // Click header to collapse
      const header = screen.getByText('Fullur lífeyrir').closest('div[class*="cursor-pointer"]');
      fireEvent.click(header!);

      // Content should be hidden
      expect(screen.queryByText('Tekjur')).not.toBeInTheDocument();
    });

    it('expands collapsed phase when header is clicked again', () => {
      render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      const header = screen.getByText('Fullur lífeyrir').closest('div[class*="cursor-pointer"]');

      // Collapse
      fireEvent.click(header!);
      expect(screen.queryByText('Tekjur')).not.toBeInTheDocument();

      // Expand again
      fireEvent.click(header!);
      expect(screen.getByText('Tekjur')).toBeInTheDocument();
    });

    it('expands all phases when "Opna öll" is clicked', () => {
      render(<PhaseBreakdown phases={[gapPhase, bridgePhase]} />);

      // Collapse all first
      const collapseAllButton = screen.getByText('Loka öllum');
      fireEvent.click(collapseAllButton);

      // Verify all collapsed
      expect(screen.queryAllByText('Tekjur')).toHaveLength(0);

      // Expand all
      const expandAllButton = screen.getByText('Opna öll');
      fireEvent.click(expandAllButton);

      // Verify all expanded
      expect(screen.getAllByText('Tekjur')).toHaveLength(2);
    });

    it('collapses all phases when "Loka öllum" is clicked', () => {
      render(<PhaseBreakdown phases={[gapPhase, bridgePhase]} />);

      // Initially all expanded
      expect(screen.getAllByText('Tekjur')).toHaveLength(2);

      // Collapse all
      const collapseAllButton = screen.getByText('Loka öllum');
      fireEvent.click(collapseAllButton);

      // Verify all collapsed
      expect(screen.queryAllByText('Tekjur')).toHaveLength(0);
    });
  });

  describe('Income Sources Display', () => {
    it('displays all income sources for gap phase', () => {
      render(<PhaseBreakdown phases={[gapPhase]} />);

      // Gap phase only has savings withdrawal and investment returns
      expect(screen.getByText('• Sparnaður úttekt:')).toBeInTheDocument();
      expect(screen.getByText('• Ávöxtun:')).toBeInTheDocument();
      expect(screen.getAllByText('240.000 kr').length).toBeGreaterThan(0);
      expect(screen.getByText('~100.000 kr')).toBeInTheDocument();
    });

    it('displays séreign income in bridge phase', () => {
      render(<PhaseBreakdown phases={[bridgePhase]} />);

      expect(screen.getByText('• Séreign:')).toBeInTheDocument();
      expect(screen.getByText('180.000 kr')).toBeInTheDocument();
    });

    it('displays all pension sources in full pension phase', () => {
      render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      expect(screen.getByText('• Lífeyrissjóður:')).toBeInTheDocument();
      expect(screen.getByText('• TR:')).toBeInTheDocument();
      expect(screen.getByText('350.000 kr')).toBeInTheDocument();
      expect(screen.getByText('220.000 kr')).toBeInTheDocument();
    });

    it('calculates and displays total income correctly', () => {
      render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      // Total income should be displayed
      expect(screen.getByText('~590.000 kr/mán')).toBeInTheDocument();
    });

    it('does not display zero income sources', () => {
      render(<PhaseBreakdown phases={[gapPhase]} />);

      // Gap phase has no pension income, so these should not appear
      expect(screen.queryByText('• Séreign:')).not.toBeInTheDocument();
      expect(screen.queryByText('• Lífeyrissjóður:')).not.toBeInTheDocument();
      expect(screen.queryByText('• TR:')).not.toBeInTheDocument();
    });
  });

  describe('Expenses Display', () => {
    it('displays monthly expenses correctly', () => {
      render(<PhaseBreakdown phases={[gapPhase]} />);

      expect(screen.getByText('• Mánaðarleg:')).toBeInTheDocument();
      // The value appears twice (once in expenses, once in total)
      expect(screen.getAllByText('240.000 kr').length).toBeGreaterThan(0);
    });
  });

  describe('Surplus/Deficit Indicators', () => {
    it('displays surplus indicator when phase has surplus', () => {
      render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      expect(screen.getByText(/Afgangur:/)).toBeInTheDocument();
      expect(screen.getByText('290.000 kr/mán')).toBeInTheDocument();
    });

    it('displays deficit indicator when income < expenses', () => {
      const phaseWithDeficit: RetirementPhase = {
        ...bridgePhase,
        incomeSources: {
          ...bridgePhase.incomeSources,
          total: 280_000,
        },
        monthlyExpenses: 300_000,
        hasSurplus: false,
        surplusAmount: 0,
      };

      render(<PhaseBreakdown phases={[phaseWithDeficit]} />);

      expect(screen.getByText(/Halli:/)).toBeInTheDocument();
      expect(screen.getByText('20.000 kr/mán')).toBeInTheDocument();
    });

    it('does not display surplus indicator when surplus is zero', () => {
      const phaseNoSurplus: RetirementPhase = {
        ...gapPhase,
        hasSurplus: false,
        surplusAmount: 0,
      };

      render(<PhaseBreakdown phases={[phaseNoSurplus]} />);

      expect(screen.queryByText(/Afgangur:/)).not.toBeInTheDocument();
    });
  });

  describe('Funding Requirements', () => {
    it('displays required funding at start of phase', () => {
      render(<PhaseBreakdown phases={[gapPhase]} />);

      expect(screen.getByText('Þörf í upphafi stigs:')).toBeInTheDocument();
      expect(screen.getByText('23.040.000 kr')).toBeInTheDocument();
    });

    it('displays remaining balance at end of phase', () => {
      render(<PhaseBreakdown phases={[gapPhase]} />);

      expect(screen.getByText('Staða í lok stigs:')).toBeInTheDocument();
      expect(screen.getByText(/~5\.000\.000 kr/)).toBeInTheDocument();
    });

    it('shows "flutt í næsta stig" for non-final phases with remainder', () => {
      render(<PhaseBreakdown phases={[gapPhase, bridgePhase]} />);

      // Gap phase (first phase) should show transfer text
      expect(screen.getByText(/\(flutt í næsta stig\)/)).toBeInTheDocument();
    });

    it('does not show "flutt í næsta stig" for final phase', () => {
      render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      // Final phase should not show transfer text
      expect(screen.queryByText(/\(flutt í næsta stig\)/)).not.toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('applies correct border color for gap phase', () => {
      const { container } = render(<PhaseBreakdown phases={[gapPhase]} />);

      const card = container.querySelector('[class*="border-red-300"]');
      expect(card).toBeInTheDocument();
    });

    it('applies correct border color for bridge phase', () => {
      const { container } = render(<PhaseBreakdown phases={[bridgePhase]} />);

      const card = container.querySelector('[class*="border-amber-300"]');
      expect(card).toBeInTheDocument();
    });

    it('applies correct border color for full pension phase', () => {
      const { container } = render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      const card = container.querySelector('[class*="border-green-300"]');
      expect(card).toBeInTheDocument();
    });

    it('applies correct header gradient for each phase type', () => {
      const { container } = render(<PhaseBreakdown phases={[gapPhase, bridgePhase, singlePhaseWithSurplus]} />);

      expect(container.querySelector('[class*="from-red-50"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="from-amber-50"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="from-green-50"]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders semantic HTML structure', () => {
      render(<PhaseBreakdown phases={[gapPhase]} />);

      // Headers should be semantic
      expect(screen.getByRole('heading', { name: /Yfirlit eftir stigum/ })).toBeInTheDocument();
    });

    it('includes aria-hidden on decorative icons', () => {
      const { container } = render(<PhaseBreakdown phases={[singlePhaseWithSurplus]} />);

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('uses buttons with proper type attribute', () => {
      render(<PhaseBreakdown phases={[gapPhase]} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Integration - Multiple Phases', () => {
    it('displays funding chain across all three phases', () => {
      render(<PhaseBreakdown phases={[gapPhase, bridgePhase, singlePhaseWithSurplus]} />);

      // Gap phase ends with remainder
      expect(screen.getByText('23.040.000 kr')).toBeInTheDocument(); // Gap start
      expect(screen.getByText(/~5\.000\.000 kr.*\(flutt í næsta stig\)/)).toBeInTheDocument(); // Gap end

      // Bridge phase starts with funding, ends with remainder
      expect(screen.getByText('8.000.000 kr')).toBeInTheDocument(); // Bridge start
      expect(screen.getByText(/~2\.000\.000 kr.*\(flutt í næsta stig\)/)).toBeInTheDocument(); // Bridge end

      // Full pension phase starts with no funding needed (covered by pensions)
      // and ends with large surplus
      expect(screen.getByText('0 kr')).toBeInTheDocument(); // Full pension start
      expect(screen.getByText(/~15\.000\.000 kr/)).toBeInTheDocument(); // Full pension end
    });
  });
});
