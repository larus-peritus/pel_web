/**
 * Tests for PensionAdjustedResults Component
 *
 * Tests the pension-adjusted FI number display including full FI,
 * pension-adjusted FI, and bridge amount calculations.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PensionAdjustedResults } from '@/components/fiNumber/PensionAdjustedResults';
import type { PensionAdjustedResult } from '@/types/fiNumber';

describe('PensionAdjustedResults', () => {
  const basePensionAdjusted: PensionAdjustedResult = {
    pensionMonthlyIncome: 200_000,
    pensionAnnualIncome: 2_400_000,
    reducedAnnualExpenses: 3_600_000,
    pensionAdjustedFI: 108_000_000,
    targetRetirementAge: 67,
    pensionStartAge: 67,
    bridgeYears: 0,
    bridgeAmount: 0,
    totalNeeded: 108_000_000,
  };

  const earlyRetirementPensionAdjusted: PensionAdjustedResult = {
    ...basePensionAdjusted,
    targetRetirementAge: 55,
    bridgeYears: 12,
    bridgeAmount: 72_000_000,
    totalNeeded: 180_000_000,
  };

  const defaultProps = {
    fullFINumber: 180_000_000,
    pensionAdjusted: basePensionAdjusted,
    multiplier: 30,
    withdrawalRate: 0.0333,
  };

  // Rendering Tests
  describe('Rendering', () => {
    it('renders total needed prominently', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.getByText(/Heildarþörf með lífeyri/i)).toBeInTheDocument();
      expect(screen.getByText(/108.000.000 kr/i)).toBeInTheDocument();
    });

    it('renders all three sections', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.getByText(/Full FI-tala \(án lífeyris\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Lífeyrisaðlöguð FI-tala/i)).toBeInTheDocument();
    });

    it('renders full FI number section', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.getByText(/180.000.000 kr/i)).toBeInTheDocument();
      expect(screen.getByText(/Sparnaður sem þarf ef enginn lífeyrir væri til staðar/i)).toBeInTheDocument();
    });

    it('renders pension-adjusted FI section', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.getAllByText(/108.000.000 kr/i)[1]).toBeInTheDocument(); // Pension-adjusted FI (second occurrence)
      expect(screen.getByText(/Sparnaður sem þarf þegar lífeyrir greiðir hluta útgjalda/i)).toBeInTheDocument();
    });

    it('renders pension income details', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.getByText(/200.000 kr\/mán/i)).toBeInTheDocument();
      expect(screen.getByText(/2.400.000 kr\/ár/i)).toBeInTheDocument();
    });

    it('renders reduced expenses after pension', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.getByText(/3.600.000 kr\/ár/i)).toBeInTheDocument();
    });
  });

  // Bridge Amount Tests (Early Retirement)
  describe('Bridge Amount Section', () => {
    it('shows bridge section for early retirement', () => {
      render(
        <PensionAdjustedResults
          {...defaultProps}
          pensionAdjusted={earlyRetirementPensionAdjusted}
        />
      );

      expect(screen.getByText(/Brúarsparnaður/i)).toBeInTheDocument();
      expect(screen.getByText(/72.000.000 kr/i)).toBeInTheDocument();
      expect(screen.getByText(/12 ár/i)).toBeInTheDocument();
    });

    it('does not show bridge section for retirement at 67', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.queryByText(/Brúarsparnaður/i)).not.toBeInTheDocument();
    });

    it('shows bridge explanation text', () => {
      render(
        <PensionAdjustedResults
          {...defaultProps}
          pensionAdjusted={earlyRetirementPensionAdjusted}
        />
      );

      expect(screen.getByText(/Þú þarft þennan auka sparnað til að standa straum af útgjöldum frá 55 ára aldri/i)).toBeInTheDocument();
    });

    it('calculates total with bridge amount for early retirement', () => {
      render(
        <PensionAdjustedResults
          {...defaultProps}
          pensionAdjusted={earlyRetirementPensionAdjusted}
        />
      );

      // Total should be 180M (72M bridge + 108M pension-adjusted)
      expect(screen.getByText(/180.000.000 kr/i)).toBeInTheDocument();
    });
  });

  // Savings Display Tests
  describe('Savings Display', () => {
    it('shows savings from pension', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      // Savings = 180M - 108M = 72M
      expect(screen.getByText(/72.000.000 kr/i)).toBeInTheDocument();
      expect(screen.getByText(/Sparnaður/i)).toBeInTheDocument();
    });

    it('shows savings percentage', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      // Percentage = (72M / 180M) * 100 = 40%
      expect(screen.getByText(/40,0%/i)).toBeInTheDocument();
      expect(screen.getByText(/lægra en án lífeyris/i)).toBeInTheDocument();
    });

    it('handles zero savings correctly', () => {
      const noSavingsPensionAdjusted: PensionAdjustedResult = {
        ...basePensionAdjusted,
        pensionAdjustedFI: 180_000_000,
        totalNeeded: 180_000_000,
      };

      render(
        <PensionAdjustedResults
          {...defaultProps}
          pensionAdjusted={noSavingsPensionAdjusted}
        />
      );

      // Should not show savings badge if savings = 0
      expect(screen.queryByText(/Sparnaður/i)).not.toBeInTheDocument();
    });
  });

  // Calculation Formula Tests
  describe('Calculation Formula', () => {
    it('shows formula for retirement at 67 (no bridge)', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.getByText(/Lífeyrisaðlöguð FI-tala =/i)).toBeInTheDocument();
      expect(screen.getAllByText(/108.000.000 kr/i)).toHaveLength(2); // Hero + formula
    });

    it('shows formula with bridge for early retirement', () => {
      render(
        <PensionAdjustedResults
          {...defaultProps}
          pensionAdjusted={earlyRetirementPensionAdjusted}
        />
      );

      expect(screen.getByText(/Brúarsparnaður:/i)).toBeInTheDocument();
      expect(screen.getByText(/\+ Lífeyrisaðlagað:/i)).toBeInTheDocument();
    });
  });

  // Visual Elements Tests
  describe('Visual Elements', () => {
    it('uses success variant for total display', () => {
      const { container } = render(<PensionAdjustedResults {...defaultProps} />);

      // Check for success color classes
      const hero = container.querySelector('.bg-gradient-to-br.from-success-50');
      expect(hero).toBeInTheDocument();
    });

    it('shows appropriate badges', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      expect(screen.getByText(/Viðmiðun/i)).toBeInTheDocument(); // Full FI badge
      expect(screen.getByText(/Eftir 67 ára/i)).toBeInTheDocument(); // Pension-adjusted badge
    });

    it('shows bridge years badge for early retirement', () => {
      render(
        <PensionAdjustedResults
          {...defaultProps}
          pensionAdjusted={earlyRetirementPensionAdjusted}
        />
      );

      expect(screen.getByText(/12 ár/i)).toBeInTheDocument(); // Bridge years badge
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles very large pension amounts', () => {
      const largePensionAdjusted: PensionAdjustedResult = {
        ...basePensionAdjusted,
        pensionMonthlyIncome: 900_000,
        pensionAnnualIncome: 10_800_000,
        reducedAnnualExpenses: 1_200_000,
        pensionAdjustedFI: 36_000_000,
        totalNeeded: 36_000_000,
      };

      render(
        <PensionAdjustedResults
          {...defaultProps}
          fullFINumber={360_000_000}
          pensionAdjusted={largePensionAdjusted}
        />
      );

      expect(screen.getByText(/36.000.000 kr/i)).toBeInTheDocument();
    });

    it('handles zero bridge amount', () => {
      const { container } = render(<PensionAdjustedResults {...defaultProps} />);

      // Should not render bridge section
      expect(screen.queryByText(/Brúarsparnaður/i)).not.toBeInTheDocument();
    });

    it('handles very early retirement (long bridge)', () => {
      const veryEarlyRetirement: PensionAdjustedResult = {
        ...basePensionAdjusted,
        targetRetirementAge: 45,
        bridgeYears: 22,
        bridgeAmount: 132_000_000,
        totalNeeded: 240_000_000,
      };

      render(
        <PensionAdjustedResults
          {...defaultProps}
          pensionAdjusted={veryEarlyRetirement}
        />
      );

      expect(screen.getByText(/22 ár/i)).toBeInTheDocument();
      expect(screen.getByText(/132.000.000 kr/i)).toBeInTheDocument();
    });
  });

  // Formatting Tests
  describe('Number Formatting', () => {
    it('formats currency amounts correctly (Icelandic)', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      // Check for Icelandic number formatting (dots as thousand separators)
      expect(screen.getByText(/180\.000\.000 kr/i)).toBeInTheDocument();
      expect(screen.getAllByText(/108\.000\.000 kr/i)).toHaveLength(2);
      expect(screen.getByText(/200\.000 kr/i)).toBeInTheDocument();
    });

    it('formats percentages correctly', () => {
      render(<PensionAdjustedResults {...defaultProps} />);

      // Percentage should use comma as decimal separator (Icelandic)
      expect(screen.getByText(/40,0%/i)).toBeInTheDocument();
    });
  });
});
