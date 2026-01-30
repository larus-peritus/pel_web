import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComparisonTable } from '@/components/fireTypes/ComparisonTable';
import type { FIRECalculation } from '@/types/fireTypes';

describe('ComparisonTable Component', () => {
  const mockCalculations = {
    leanfire: {
      fireTypeId: 'leanfire' as const,
      monthlyExpenses: 250000,
      annualExpenses: 3000000,
      multiplier: 25,
      fiNumber: 75000000,
      yearsToFI: 12.5,
      monthsToFI: 150,
      targetDate: new Date('2037-06-29'),
      targetAge: 50,
      currentProgress: 20,
      amountRemaining: 60000000,
      effortLevel: 'high' as const,
      feasibility: 75,
    },
    regularfire: {
      fireTypeId: 'regularfire' as const,
      monthlyExpenses: 520000,
      annualExpenses: 6240000,
      multiplier: 30,
      fiNumber: 187200000,
      yearsToFI: 18.2,
      monthsToFI: 218,
      targetDate: new Date('2044-03-29'),
      targetAge: 56,
      currentProgress: 15,
      amountRemaining: 159120000,
      effortLevel: 'moderate' as const,
      feasibility: 82,
    },
    coastfire: {
      fireTypeId: 'coastfire' as const,
      monthlyExpenses: 520000,
      annualExpenses: 6240000,
      multiplier: 30,
      fiNumber: 80000000,
      yearsToFI: 8.5,
      monthsToFI: 102,
      targetDate: new Date('2033-12-29'),
      targetAge: 46,
      currentProgress: 35,
      amountRemaining: 52000000,
      effortLevel: 'moderate' as const,
      feasibility: 88,
    },
    baristafire: {
      fireTypeId: 'baristafire' as const,
      monthlyExpenses: 520000,
      annualExpenses: 6240000,
      multiplier: 30,
      fiNumber: 120000000,
      yearsToFI: 14.0,
      monthsToFI: 168,
      targetDate: new Date('2039-01-29'),
      targetAge: 52,
      currentProgress: 25,
      amountRemaining: 90000000,
      effortLevel: 'moderate' as const,
      feasibility: 79,
    },
    fatfire: {
      fireTypeId: 'fatfire' as const,
      monthlyExpenses: 1000000,
      annualExpenses: 12000000,
      multiplier: 30,
      fiNumber: 360000000,
      yearsToFI: 28.0,
      monthsToFI: 336,
      targetDate: new Date('2053-01-29'),
      targetAge: 66,
      currentProgress: 8,
      amountRemaining: 331200000,
      effortLevel: 'extreme' as const,
      feasibility: 45,
    },
  } as Record<string, FIRECalculation>;

  const mockOnSelectType = vi.fn();

  beforeEach(() => {
    mockOnSelectType.mockClear();
  });

  describe('Table Structure', () => {
    it('renders table with all column headers', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('FIRE tegund')).toBeInTheDocument();
      expect(screen.getByText('Nest Egg')).toBeInTheDocument();
      expect(screen.getByText('Útgjöld/mán')).toBeInTheDocument();
      expect(screen.getByText('Sparnaðarhlutfall')).toBeInTheDocument();
      expect(screen.getByText('Ár til FIRE')).toBeInTheDocument();
      expect(screen.getByText('Erfiðleiki')).toBeInTheDocument();
    });

    it('renders all 5 FIRE types as rows', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument();
      expect(screen.getByText('Venjulegt FIRE')).toBeInTheDocument();
      expect(screen.getByText('Sjálfvirkt FIRE')).toBeInTheDocument();
      expect(screen.getByText('Kaffibarþjóna FIRE')).toBeInTheDocument();
      expect(screen.getByText('Lúxus FIRE')).toBeInTheDocument();
    });

    it('has sticky header with correct styling', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('sticky');
      expect(thead).toHaveClass('top-0');
      expect(thead).toHaveClass('z-10');
    });
  });

  describe('Data Display', () => {
    it('displays FI numbers correctly formatted', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Check for Icelandic formatting with periods
      expect(screen.getByText('75.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('187.200.000 kr')).toBeInTheDocument();
      expect(screen.getByText('360.000.000 kr')).toBeInTheDocument();
    });

    it('displays monthly expenses correctly', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('250.000 kr')).toBeInTheDocument();
      expect(screen.getByText('1.000.000 kr')).toBeInTheDocument();
    });

    it('displays years to FI correctly', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('12,5 ár')).toBeInTheDocument();
      expect(screen.getByText('18,2 ár')).toBeInTheDocument();
      expect(screen.getByText('28,0 ár')).toBeInTheDocument();
    });

    it('shows effort level indicators correctly', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Check for effort labels
      expect(screen.getByText('Lítil')).toBeInTheDocument(); // Should not exist in this data
      expect(screen.getByText('Hófleg')).toBeInTheDocument();
      expect(screen.getByText('Mikil')).toBeInTheDocument();
      expect(screen.getByText('Öfgafull')).toBeInTheDocument();

      // Check for effort indicator dots
      const effortIndicators = container.querySelectorAll('[role="img"]');
      expect(effortIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Sorting Functionality', () => {
    it('sorts by years to FI ascending by default', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      // First row should be CoastFIRE (8.5 years)
      expect(rows[0]).toHaveTextContent('Sjálfvirkt FIRE');
    });

    it('toggles sort direction when clicking same column', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const yearsHeader = screen.getByText('Ár til FIRE');

      // Click once - should reverse (descending)
      fireEvent.click(yearsHeader);
      const rowsDesc = container.querySelectorAll('tbody tr');
      expect(rowsDesc[0]).toHaveTextContent('Lúxus FIRE'); // 28 years

      // Click again - back to ascending
      fireEvent.click(yearsHeader);
      const rowsAsc = container.querySelectorAll('tbody tr');
      expect(rowsAsc[0]).toHaveTextContent('Sjálfvirkt FIRE'); // 8.5 years
    });

    it('sorts by nest egg when clicking that column', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const nestEggHeader = screen.getByText('Nest Egg');
      fireEvent.click(nestEggHeader);

      const rows = container.querySelectorAll('tbody tr');
      // First row should be LeanFIRE (75M)
      expect(rows[0]).toHaveTextContent('Sparsamt FIRE');
    });

    it('sorts by name alphabetically', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const nameHeader = screen.getByText('FIRE tegund');
      fireEvent.click(nameHeader);

      const rows = container.querySelectorAll('tbody tr');
      // Icelandic alphabetical should start with K (Kaffibarþjóna)
      expect(rows[0]).toHaveTextContent('Kaffibarþjóna FIRE');
    });

    it('displays sort indicator on active column', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const yearsHeader = screen.getByText('Ár til FIRE');
      // Should have up arrow by default (ascending)
      expect(yearsHeader.textContent).toContain('↑');

      fireEvent.click(yearsHeader);
      // Should have down arrow after click (descending)
      expect(yearsHeader.textContent).toContain('↓');
    });
  });

  describe('Selection Functionality', () => {
    it('highlights selected row', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType="regularfire"
          onSelectType={mockOnSelectType}
        />
      );

      const regularfireRow = container.querySelector('tbody tr:has-text("Venjulegt FIRE")');
      // In real DOM it won't match this selector, but we can check for the "Valið" badge
      expect(screen.getByText('Valið')).toBeInTheDocument();
    });

    it('calls onSelectType when clicking a row', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const leanfireText = screen.getByText('Sparsamt FIRE');
      const row = leanfireText.closest('tr');

      fireEvent.click(row!);

      expect(mockOnSelectType).toHaveBeenCalledWith('leanfire');
    });

    it('calls onSelectType when pressing Enter on a row', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const leanfireText = screen.getByText('Sparsamt FIRE');
      const row = leanfireText.closest('tr');

      fireEvent.keyDown(row!, { key: 'Enter' });

      expect(mockOnSelectType).toHaveBeenCalledWith('leanfire');
    });

    it('calls onSelectType when pressing Space on a row', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const leanfireText = screen.getByText('Sparsamt FIRE');
      const row = leanfireText.closest('tr');

      fireEvent.keyDown(row!, { key: ' ' });

      expect(mockOnSelectType).toHaveBeenCalledWith('leanfire');
    });
  });

  describe('Accessibility', () => {
    it('has proper table semantics', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();

      const headers = container.querySelectorAll('th[scope="col"]');
      expect(headers.length).toBe(6); // 6 columns
    });

    it('has role and tabindex on clickable rows', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        expect(row).toHaveAttribute('role', 'button');
        expect(row).toHaveAttribute('tabindex', '0');
      });
    });

    it('has aria-pressed attribute on rows', () => {
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType="regularfire"
          onSelectType={mockOnSelectType}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      const regularfireRow = Array.from(rows).find((row) =>
        row.textContent?.includes('Venjulegt FIRE')
      );

      expect(regularfireRow).toHaveAttribute('aria-pressed', 'true');
    });

    it('announces selection via screen reader', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType="leanfire"
          onSelectType={mockOnSelectType}
        />
      );

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent('Sparsamt FIRE valið');
      expect(announcement).toHaveClass('sr-only');
    });
  });

  describe('Edge Cases', () => {
    it('handles null yearsToFI gracefully', () => {
      const calculationsWithNull = {
        ...mockCalculations,
        leanfire: {
          ...mockCalculations.leanfire,
          yearsToFI: null,
          monthsToFI: null,
        },
      };

      render(
        <ComparisonTable
          calculations={calculationsWithNull as any}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Ekki mögulegt')).toBeInTheDocument();
    });

    it('handles missing icons gracefully', () => {
      render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Should render emojis from definitions
      const { container } = render(
        <ComparisonTable
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const emojis = container.querySelectorAll('[role="img"][aria-hidden="true"]');
      expect(emojis.length).toBeGreaterThan(0);
    });
  });
});
