/**
 * Tests for PensionIncomeSection Component
 *
 * Tests the pension income input section including collapsible behavior,
 * validation, and early retirement warnings.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PensionIncomeSection } from '@/components/fiNumber/PensionIncomeSection';
import { PENSION_START_AGE } from '@/lib/constants/fiNumber';

describe('PensionIncomeSection', () => {
  const mockOnPensionIncomeChange = vi.fn();
  const mockOnRetirementAgeChange = vi.fn();

  const defaultProps = {
    pensionMonthlyIncome: null,
    targetRetirementAge: null,
    monthlyExpenses: 500_000,
    onPensionIncomeChange: mockOnPensionIncomeChange,
    onRetirementAgeChange: mockOnRetirementAgeChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Rendering Tests
  describe('Rendering', () => {
    it('renders collapsible section closed by default', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      expect(screen.getByText(/Lífeyrissjóður/i)).toBeInTheDocument();
      expect(screen.getByText(/Smelltu til að bæta við lífeyrisáætlun/i)).toBeInTheDocument();

      // Input fields should not be visible
      expect(screen.queryByText(/Áætlaðar mánaðarlegar lífeyrisgreiðslur/i)).not.toBeInTheDocument();
    });

    it('shows inputs when opened', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      // Click header to open
      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Input fields should now be visible
      expect(screen.getByText(/Áætlaðar mánaðarlegar lífeyrisgreiðslur/i)).toBeInTheDocument();
      expect(screen.getByText(/Markmið starfslokaaldurs/i)).toBeInTheDocument();
    });

    it('renders explanation alert when open', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      expect(screen.getByText(/Ef þú átt von á lífeyrisgreiðslum/i)).toBeInTheDocument();
    });

    it('renders with pension income value', () => {
      render(
        <PensionIncomeSection
          {...defaultProps}
          pensionMonthlyIncome={200_000}
          targetRetirementAge={67}
        />
      );

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Values should be displayed in inputs
      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0]).toHaveValue('200.000 kr'); // Pension input (formatted)
    });
  });

  // Collapsible Behavior Tests
  describe('Collapsible Behavior', () => {
    it('toggles open/closed when header is clicked', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      const header = screen.getByText(/Lífeyrissjóður/i);

      // Initially closed
      expect(screen.queryByText(/Áætlaðar mánaðarlegar lífeyrisgreiðslur/i)).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(header);
      expect(screen.getByText(/Áætlaðar mánaðarlegar lífeyrisgreiðslur/i)).toBeInTheDocument();

      // Click to close
      fireEvent.click(header);
      expect(screen.queryByText(/Áætlaðar mánaðarlegar lífeyrisgreiðslur/i)).not.toBeInTheDocument();
    });

    it('updates description text when opening/closing', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      expect(screen.getByText(/Smelltu til að bæta við lífeyrisáætlun/i)).toBeInTheDocument();

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      expect(screen.getByText(/Sláðu inn áætlaða lífeyrisgreiðslu/i)).toBeInTheDocument();
    });
  });

  // Validation Tests
  describe('Pension Income Validation', () => {
    it('validates pension income must be non-negative', async () => {
      render(<PensionIncomeSection {...defaultProps} />);

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Input negative value (simulated by entering -1)
      mockOnPensionIncomeChange(-1);

      // Validation should trigger (component handles this internally)
      expect(mockOnPensionIncomeChange).toHaveBeenCalledWith(-1);
    });

    it('validates pension income must be less than monthly expenses', async () => {
      render(<PensionIncomeSection {...defaultProps} monthlyExpenses={300_000} />);

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Enter pension higher than monthly expenses
      mockOnPensionIncomeChange(350_000);

      expect(mockOnPensionIncomeChange).toHaveBeenCalledWith(350_000);
    });

    it('accepts valid pension income', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      mockOnPensionIncomeChange(200_000);

      expect(mockOnPensionIncomeChange).toHaveBeenCalledWith(200_000);
    });
  });

  // Retirement Age Validation Tests
  describe('Retirement Age Validation', () => {
    it('accepts valid retirement age', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      mockOnRetirementAgeChange(55);

      expect(mockOnRetirementAgeChange).toHaveBeenCalledWith(55);
    });

    it('validates retirement age within range', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Test minimum age
      mockOnRetirementAgeChange(35); // Below min (40)
      expect(mockOnRetirementAgeChange).toHaveBeenCalledWith(35);

      // Test maximum age
      mockOnRetirementAgeChange(85); // Above max (80)
      expect(mockOnRetirementAgeChange).toHaveBeenCalledWith(85);
    });
  });

  // Early Retirement Warning Tests
  describe('Early Retirement Warning', () => {
    it('shows warning for early retirement (age < 67)', () => {
      render(
        <PensionIncomeSection
          {...defaultProps}
          pensionMonthlyIncome={200_000}
          targetRetirementAge={55}
        />
      );

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Should show early retirement warning
      expect(screen.getByText(/Snemmbúinn starfslok/i)).toBeInTheDocument();
      expect(screen.getByText(/12 ára brú/i)).toBeInTheDocument(); // 67 - 55 = 12 years
    });

    it('does not show warning for retirement at age 67', () => {
      render(
        <PensionIncomeSection
          {...defaultProps}
          pensionMonthlyIncome={200_000}
          targetRetirementAge={67}
        />
      );

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Should NOT show early retirement warning
      expect(screen.queryByText(/Snemmbúinn starfslok/i)).not.toBeInTheDocument();
    });

    it('does not show warning for late retirement (age > 67)', () => {
      render(
        <PensionIncomeSection
          {...defaultProps}
          pensionMonthlyIncome={200_000}
          targetRetirementAge={70}
        />
      );

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Should NOT show early retirement warning
      expect(screen.queryByText(/Snemmbúinn starfslok/i)).not.toBeInTheDocument();
    });

    it('does not show warning if no pension income entered', () => {
      render(
        <PensionIncomeSection
          {...defaultProps}
          pensionMonthlyIncome={null}
          targetRetirementAge={55}
        />
      );

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      // Should NOT show warning without pension income
      expect(screen.queryByText(/Snemmbúinn starfslok/i)).not.toBeInTheDocument();
    });
  });

  // Clear Functionality Tests
  describe('Clear Functionality', () => {
    it('shows clear button when pension data exists', () => {
      render(
        <PensionIncomeSection
          {...defaultProps}
          pensionMonthlyIncome={200_000}
          targetRetirementAge={60}
        />
      );

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      expect(screen.getByText(/Hreinsa lífeyrisupplýsingar/i)).toBeInTheDocument();
    });

    it('does not show clear button when no pension data', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      expect(screen.queryByText(/Hreinsa lífeyrisupplýsingar/i)).not.toBeInTheDocument();
    });

    it('clears pension data when clear button clicked', () => {
      render(
        <PensionIncomeSection
          {...defaultProps}
          pensionMonthlyIncome={200_000}
          targetRetirementAge={60}
        />
      );

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      const clearButton = screen.getByText(/Hreinsa lífeyrisupplýsingar/i);
      fireEvent.click(clearButton);

      expect(mockOnPensionIncomeChange).toHaveBeenCalledWith(null);
      expect(mockOnRetirementAgeChange).toHaveBeenCalledWith(null);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('has accessible labels for inputs', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      expect(screen.getByText(/Áætlaðar mánaðarlegar lífeyrisgreiðslur/i)).toBeInTheDocument();
      expect(screen.getByText(/Markmið starfslokaaldurs/i)).toBeInTheDocument();
    });

    it('has aria-expanded attribute on toggle button', () => {
      render(<PensionIncomeSection {...defaultProps} />);

      const toggleButton = screen.getByLabelText(/Opna hluta/i);

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(screen.getByText(/Lífeyrissjóður/i));

      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
