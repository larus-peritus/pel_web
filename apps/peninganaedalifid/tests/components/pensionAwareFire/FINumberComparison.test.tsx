/**
 * Tests for FINumberComparison Component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FINumberComparison } from '@/components/pensionAwareFire/FINumberComparison';

describe('FINumberComparison', () => {
  // ============================================================================
  // Rendering Tests
  // ============================================================================

  describe('Rendering', () => {
    it('renders component with all sections', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
          yearsEarlier={8.5}
        />
      );

      // Header
      expect(screen.getByText('FI-tölu samanburður')).toBeInTheDocument();
      expect(screen.getByText(/Hefðbundin FIRE vs. Lífeyristengd FIRE/)).toBeInTheDocument();

      // Traditional FI
      expect(screen.getByText('Hefðbundin FI')).toBeInTheDocument();
      expect(screen.getByText('144.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('(30x árleg útgjöld)')).toBeInTheDocument();

      // Pension-Adjusted FI
      expect(screen.getByText('Lífeyristengd FI')).toBeInTheDocument();
      expect(screen.getByText('38.500.000 kr')).toBeInTheDocument();
      expect(screen.getByText('(raunveruleg þörf)')).toBeInTheDocument();

      // Savings box
      expect(screen.getByText('Þú sparar:')).toBeInTheDocument();
      expect(screen.getByText('105.500.000 kr')).toBeInTheDocument();
      expect(screen.getByText('(73% minni!)')).toBeInTheDocument();
    });

    it('renders years earlier section when provided', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
          yearsEarlier={8.5}
        />
      );

      expect(screen.getByText(/Eða getur hætt 8.5 árum fyrr!/)).toBeInTheDocument();
    });

    it('does not render years earlier section when null', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
          yearsEarlier={null}
        />
      );

      expect(screen.queryByText(/árum fyrr/)).not.toBeInTheDocument();
    });

    it('does not render years earlier section when zero', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
          yearsEarlier={0}
        />
      );

      expect(screen.queryByText(/árum fyrr/)).not.toBeInTheDocument();
    });

    it('does not render years earlier section when undefined', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      expect(screen.queryByText(/árum fyrr/)).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // Number Formatting Tests
  // ============================================================================

  describe('Number Formatting', () => {
    it('formats traditional FI number correctly', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      // Should use Icelandic formatting with periods as thousands separators
      expect(screen.getByText('144.000.000 kr')).toBeInTheDocument();
    });

    it('formats pension-adjusted FI number correctly', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      expect(screen.getByText('38.500.000 kr')).toBeInTheDocument();
    });

    it('formats savings amount correctly', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      expect(screen.getByText('105.500.000 kr')).toBeInTheDocument();
    });

    it('formats percentage correctly with no decimals', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      // Should round percentage to 0 decimals
      expect(screen.getByText('(73% minni!)')).toBeInTheDocument();
    });

    it('formats years earlier with 1 decimal', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
          yearsEarlier={8.5}
        />
      );

      expect(screen.getByText(/8.5 árum fyrr/)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Calculation Tests
  // ============================================================================

  describe('Calculations', () => {
    it('correctly shows savings difference', () => {
      const traditionalFI = 144_000_000;
      const pensionAdjustedFI = 38_500_000;
      const savings = traditionalFI - pensionAdjustedFI; // 105,500,000

      render(
        <FINumberComparison
          traditionalFI={traditionalFI}
          pensionAdjustedFI={pensionAdjustedFI}
          savings={savings}
          savingsPercent={73.3}
        />
      );

      expect(screen.getByText('105.500.000 kr')).toBeInTheDocument();
    });

    it('correctly displays percentage reduction', () => {
      const traditionalFI = 144_000_000;
      const pensionAdjustedFI = 38_500_000;
      const savingsPercent = ((traditionalFI - pensionAdjustedFI) / traditionalFI) * 100; // ~73.3%

      render(
        <FINumberComparison
          traditionalFI={traditionalFI}
          pensionAdjustedFI={pensionAdjustedFI}
          savings={105_500_000}
          savingsPercent={savingsPercent}
        />
      );

      // Should round to 73%
      expect(screen.getByText('(73% minni!)')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Edge Case Tests
  // ============================================================================

  describe('Edge Cases', () => {
    it('handles case where both FI numbers are equal (retiring at 67+)', () => {
      render(
        <FINumberComparison
          traditionalFI={50_000_000}
          pensionAdjustedFI={49_950_000}
          savings={50_000} // Less than 100k threshold
          savingsPercent={0.1}
        />
      );

      // Should show minimal difference message
      expect(screen.getByText(/Þar sem þú ætlar að hætta nálægt 67 ára aldri/)).toBeInTheDocument();
      expect(screen.queryByText('Þú sparar:')).not.toBeInTheDocument();
    });

    it('handles small but significant difference (just over 100k)', () => {
      render(
        <FINumberComparison
          traditionalFI={50_000_000}
          pensionAdjustedFI={49_800_000}
          savings={200_000} // Just over 100k threshold
          savingsPercent={0.4}
        />
      );

      // Should show savings box
      expect(screen.getByText('Þú sparar:')).toBeInTheDocument();
      expect(screen.getByText('200.000 kr')).toBeInTheDocument();
    });

    it('handles very large FI numbers', () => {
      render(
        <FINumberComparison
          traditionalFI={500_000_000}
          pensionAdjustedFI={150_000_000}
          savings={350_000_000}
          savingsPercent={70}
        />
      );

      expect(screen.getByText('500.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('150.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('350.000.000 kr')).toBeInTheDocument();
    });

    it('handles small FI numbers', () => {
      render(
        <FINumberComparison
          traditionalFI={10_000_000}
          pensionAdjustedFI={3_000_000}
          savings={7_000_000}
          savingsPercent={70}
        />
      );

      expect(screen.getByText('10.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('3.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('7.000.000 kr')).toBeInTheDocument();
    });

    it('handles fractional years earlier correctly', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
          yearsEarlier={12.3456}
        />
      );

      // Should round to 1 decimal
      expect(screen.getByText(/12.3 árum fyrr/)).toBeInTheDocument();
    });

    it('handles negative years earlier (should not display)', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
          yearsEarlier={-5}
        />
      );

      // Should not show years earlier for negative values
      expect(screen.queryByText(/árum fyrr/)).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // Visual Styling Tests
  // ============================================================================

  describe('Visual Styling', () => {
    it('applies green success styling to pension-adjusted FI column', () => {
      const { container } = render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      // Check for green gradient classes in pension-adjusted column
      const pensionCard = container.querySelector('.from-green-50');
      expect(pensionCard).toBeInTheDocument();
    });

    it('applies gradient background to savings box', () => {
      const { container } = render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      // Check for green gradient in savings box
      const savingsBox = container.querySelector('.from-green-100');
      expect(savingsBox).toBeInTheDocument();
    });

    it('shows arrow connector between columns', () => {
      const { container } = render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      // Arrow should be present (text content)
      expect(container.textContent).toContain('→');
    });
  });

  // ============================================================================
  // Content Tests
  // ============================================================================

  describe('Content', () => {
    it('displays explanation text for savings benefit', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      expect(
        screen.getByText(/Með því að taka tillit til lífeyris þarftu/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Íslenski lífeyrissjóðurinn og TR greiða fyrir stórum hluta/i)
      ).toBeInTheDocument();
    });

    it('displays help text explaining both FI types', () => {
      render(
        <FINumberComparison
          traditionalFI={144_000_000}
          pensionAdjustedFI={38_500_000}
          savings={105_500_000}
          savingsPercent={73.3}
        />
      );

      expect(screen.getByText(/Hefðbundin FI:/)).toBeInTheDocument();
      expect(screen.getByText(/Lífeyristengd FI:/)).toBeInTheDocument();
      expect(screen.getByText(/Gerir ráð fyrir engum lífeyristekjum/)).toBeInTheDocument();
      expect(screen.getByText(/Tekur tillit til séreigns/)).toBeInTheDocument();
    });

    it('displays edge case explanation when difference is minimal', () => {
      render(
        <FINumberComparison
          traditionalFI={50_000_000}
          pensionAdjustedFI={49_950_000}
          savings={50_000}
          savingsPercent={0.1}
        />
      );

      expect(
        screen.getByText(/Þar sem þú ætlar að hætta nálægt 67 ára aldri \(eða síðar\)/i)
      ).toBeInTheDocument();
    });
  });
});
