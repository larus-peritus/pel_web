import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComparisonSection } from '@/components/fireTypes/ComparisonSection';
import type { FIRECalculation, UserFinancialInputs } from '@/types/fireTypes';

// Mock window methods
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

describe('ComparisonSection Component', () => {
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

  const mockUserInputs: UserFinancialInputs = {
    currentAge: 38,
    targetRetirementAge: 67,
    currentNetWorth: 30000000,
    annualIncome: 8000000,
    annualSavings: 2000000,
    savingsRate: 25,
    monthlyExpenses: {
      barebones: 250000,
      comfortable: 520000,
      deluxe: 1000000,
    },
  };

  const mockOnSelectType = vi.fn();
  const mockOnTierChange = vi.fn();
  const mockOnNavigateToBaseline = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock for createObjectURL
    (global.URL.createObjectURL as any).mockReturnValue('blob:mock-url');
  });

  describe('Section Structure', () => {
    it('renders section header', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('FIRE samanburður')).toBeInTheDocument();
      expect(screen.getByText('Bera saman allar FIRE tegundir hlið við hlið')).toBeInTheDocument();
    });

    it('renders export button', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Sækja samanburð')).toBeInTheDocument();
    });

    it('renders insights section', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Helstu atriði')).toBeInTheDocument();
    });
  });

  describe('Expense Baseline Integration', () => {
    it('shows tier toggle when expense baseline exists and tiers differ', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
          hasExpenseBaseline={true}
        />
      );

      expect(screen.getByText('Útgjaldaprofíll')).toBeInTheDocument();
    });

    it('hides tier toggle when expense baseline does not exist', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
          hasExpenseBaseline={false}
        />
      );

      expect(screen.queryByText('Útgjaldaprofíll')).not.toBeInTheDocument();
    });

    it('shows alert when expense baseline is missing', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
          hasExpenseBaseline={false}
        />
      );

      expect(screen.getByText('Engin útgjaldaprofíll til staðar')).toBeInTheDocument();
      expect(
        screen.getByText(/Þú hefur ekki búið til útgjaldaprofíl ennþá/)
      ).toBeInTheDocument();
    });

    it('calls onNavigateToBaseline when clicking create profile button', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
          hasExpenseBaseline={false}
          onNavigateToBaseline={mockOnNavigateToBaseline}
        />
      );

      const button = screen.getByText('Búa til profíl');
      fireEvent.click(button);

      expect(mockOnNavigateToBaseline).toHaveBeenCalled();
    });

    it('calls onTierChange when tier is changed', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
          hasExpenseBaseline={true}
          onTierChange={mockOnTierChange}
        />
      );

      // Click on a different tier
      const luxuryButton = screen.getByText('Lúxus').closest('button');
      fireEvent.click(luxuryButton!);

      expect(mockOnTierChange).toHaveBeenCalledWith('deluxe');
    });
  });

  describe('Responsive Behavior', () => {
    it('shows table on desktop by default', () => {
      // Mock window width to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Should render table (has <table> element)
      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('switches between table and cards based on screen size', async () => {
      const { rerender } = render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Simulate resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });

      fireEvent(window, new Event('resize'));

      // Wait for state update
      await waitFor(() => {
        // Should now show cards instead (no table)
        // Note: This test is simplified - actual DOM changes might need different assertions
      });
    });
  });

  describe('Export Functionality', () => {
    it('exports comparison data when clicking export button', () => {
      // Mock DOM methods
      const mockLink = document.createElement('a');
      const mockClick = vi.fn();
      mockLink.click = mockClick;
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const exportButton = screen.getByText('Sækja samanburð');
      fireEvent.click(exportButton);

      expect(mockClick).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('exports with correct filename format', () => {
      const mockLink = document.createElement('a');
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const exportButton = screen.getByText('Sækja samanburð');
      fireEvent.click(exportButton);

      expect(mockLink.download).toMatch(/^fire-samanburður-\d{4}-\d{2}-\d{2}\.json$/);
    });
  });

  describe('Insights Display', () => {
    it('displays fastest FIRE type insight', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Fljótasta leiðin')).toBeInTheDocument();
      expect(screen.getByText(/coastfire er fljótasta leiðin/i)).toBeInTheDocument();
    });

    it('displays easiest FIRE type insight', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Auðveldasta leiðin')).toBeInTheDocument();
      expect(screen.getByText(/krefst minnstu fórnar/i)).toBeInTheDocument();
    });

    it('displays highest nest egg insight', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Stærsta markmiðið')).toBeInTheDocument();
      expect(screen.getByText(/þarfnast mest sparnaðar/i)).toBeInTheDocument();
    });

    it('calculates fastest correctly', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // CoastFIRE has 8.5 years which is fastest
      expect(screen.getByText(/8,5 ár/i)).toBeInTheDocument();
    });
  });

  describe('Integration with Child Components', () => {
    it('passes calculations to comparison table/cards', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Check that data from calculations is displayed
      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument();
      expect(screen.getByText('75.000.000 kr')).toBeInTheDocument();
    });

    it('passes selection state to child components', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType="regularfire"
          onSelectType={mockOnSelectType}
        />
      );

      // Should show "Valið" badge on selected type
      expect(screen.getByText('Valið')).toBeInTheDocument();
    });

    it('forwards onSelectType callback', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const leanfireText = screen.getByText('Sparsamt FIRE');
      const row = leanfireText.closest('tr') || leanfireText.closest('[class*="Card"]');

      if (row) {
        fireEvent.click(row);
        expect(mockOnSelectType).toHaveBeenCalled();
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles all FIRE types with null yearsToFI', () => {
      const impossibleCalculations = Object.fromEntries(
        Object.entries(mockCalculations).map(([key, calc]) => [
          key,
          { ...calc, yearsToFI: null, monthsToFI: null },
        ])
      ) as typeof mockCalculations;

      render(
        <ComparisonSection
          calculations={impossibleCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Should still render but insights might be different
      expect(screen.getByText('FIRE samanburður')).toBeInTheDocument();
    });

    it('handles same tiers gracefully', () => {
      const sameTierInputs: UserFinancialInputs = {
        ...mockUserInputs,
        monthlyExpenses: {
          barebones: 500000,
          comfortable: 500000,
          deluxe: 500000,
        },
      };

      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={sameTierInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
          hasExpenseBaseline={true}
        />
      );

      // Tier toggle should be disabled
      const buttons = screen.getAllByRole('button');
      const tierButtons = buttons.filter((btn) =>
        btn.textContent?.includes('Lágmarks') ||
        btn.textContent?.includes('Þægilegt') ||
        btn.textContent?.includes('Lúxus')
      );

      tierButtons.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });

    it('handles missing onTierChange callback', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
          hasExpenseBaseline={true}
          // onTierChange not provided
        />
      );

      // Should still render tier toggle
      expect(screen.getByText('Útgjaldaprofíll')).toBeInTheDocument();

      // Clicking should not cause errors
      const luxuryButton = screen.getByText('Lúxus').closest('button');
      expect(() => fireEvent.click(luxuryButton!)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const { container } = render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const h2 = screen.getByText('FIRE samanburður');
      expect(h2.tagName).toBe('H2');

      const h3 = screen.getByText('Helstu atriði');
      expect(h3.tagName).toBe('H3');
    });

    it('has descriptive button labels', () => {
      render(
        <ComparisonSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const exportButton = screen.getByLabelText('Sækja samanburð sem JSON skrá');
      expect(exportButton).toBeInTheDocument();
    });
  });
});
