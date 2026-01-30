import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseInputs } from '@/components/calculator/ExpenseInputs';
import { CalculatorProvider } from '@/context/CalculatorContext';
import type { MoneyExpenses } from '@/types/calculator';

/**
 * Test wrapper with CalculatorProvider
 */
function renderWithProvider(ui: React.ReactElement) {
  return render(<CalculatorProvider>{ui}</CalculatorProvider>);
}

describe('ExpenseInputs', () => {
  describe('Rendering', () => {
    it('renders the card with title and description', () => {
      renderWithProvider(<ExpenseInputs />);

      expect(
        screen.getByRole('heading', { name: 'Work Expenses' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Annual costs directly related to your job')
      ).toBeInTheDocument();
    });

    it('renders all 6 expense input fields', () => {
      renderWithProvider(<ExpenseInputs />);

      expect(screen.getByLabelText('Commute Costs')).toBeInTheDocument();
      expect(screen.getByLabelText('Work Clothing')).toBeInTheDocument();
      expect(screen.getByLabelText('Work Meals')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Decompression Spending')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Extra Childcare')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Other Work Expenses')
      ).toBeInTheDocument();
    });

    it('renders description for each field', () => {
      renderWithProvider(<ExpenseInputs />);

      expect(
        screen.getByText(/Gas, transit, parking, tolls/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Professional attire, uniforms/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Lunches out, coffee/)).toBeInTheDocument();
      expect(screen.getByText(/Retail therapy/)).toBeInTheDocument();
      expect(
        screen.getByText(/Additional childcare costs/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Tools, dues, education/)).toBeInTheDocument();
    });

    it('displays initial total expenses of $0.00', () => {
      renderWithProvider(<ExpenseInputs />);

      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      renderWithProvider(<ExpenseInputs />);

      const commuteInput = screen.getByLabelText('Commute Costs');
      expect(commuteInput).toHaveAttribute('id', 'expense-commute');

      const clothingInput = screen.getByLabelText('Work Clothing');
      expect(clothingInput).toHaveAttribute('id', 'expense-clothing');

      const mealsInput = screen.getByLabelText('Work Meals');
      expect(mealsInput).toHaveAttribute('id', 'expense-meals');
    });

    it('has aria-describedby linking to descriptions', () => {
      renderWithProvider(<ExpenseInputs />);

      const commuteInput = screen.getByLabelText('Commute Costs');
      expect(commuteInput).toHaveAttribute(
        'aria-describedby',
        'expense-commute-desc'
      );

      const mealsInput = screen.getByLabelText('Work Meals');
      expect(mealsInput).toHaveAttribute(
        'aria-describedby',
        'expense-meals-desc'
      );
    });

    it('description elements have correct IDs', () => {
      renderWithProvider(<ExpenseInputs />);

      const commuteDesc = screen.getByText(/Gas, transit, parking/);
      expect(commuteDesc).toHaveAttribute('id', 'expense-commute-desc');

      const mealsDesc = screen.getByText(/Lunches out, coffee/);
      expect(mealsDesc).toHaveAttribute('id', 'expense-meals-desc');
    });
  });

  describe('User Interaction', () => {
    it('updates commute expense when user enters value', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ExpenseInputs />);

      const commuteInput = screen.getByLabelText('Commute Costs');

      // Focus and enter value
      await user.click(commuteInput);
      await user.clear(commuteInput);
      await user.type(commuteInput, '3000');

      // Blur to trigger formatting
      await user.tab();

      await waitFor(() => {
        expect(commuteInput).toHaveValue('$3,000.00');
      });
    });

    it('updates multiple expenses independently', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ExpenseInputs />);

      const commuteInput = screen.getByLabelText('Commute Costs');
      const mealsInput = screen.getByLabelText('Work Meals');

      // Enter commute cost
      await user.click(commuteInput);
      await user.clear(commuteInput);
      await user.type(commuteInput, '3000');
      await user.tab();

      // Enter meals cost
      await user.click(mealsInput);
      await user.clear(mealsInput);
      await user.type(mealsInput, '2000');
      await user.tab();

      await waitFor(() => {
        expect(commuteInput).toHaveValue('$3,000.00');
        expect(mealsInput).toHaveValue('$2,000.00');
      });
    });

    it('calculates and displays total expenses', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ExpenseInputs />);

      const commuteInput = screen.getByLabelText('Commute Costs');
      const clothingInput = screen.getByLabelText('Work Clothing');
      const mealsInput = screen.getByLabelText('Work Meals');

      // Enter expenses
      await user.click(commuteInput);
      await user.type(commuteInput, '3000');
      await user.tab();

      await user.click(clothingInput);
      await user.type(clothingInput, '500');
      await user.tab();

      await user.click(mealsInput);
      await user.type(mealsInput, '2000');
      await user.tab();

      // Check total (should be $5,500.00)
      await waitFor(() => {
        expect(screen.getByText('$5,500.00')).toBeInTheDocument();
      });
    });

    it('handles decimal values correctly', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ExpenseInputs />);

      const otherInput = screen.getByLabelText('Other Work Expenses');

      await user.click(otherInput);
      await user.type(otherInput, '150.50');
      await user.tab();

      await waitFor(() => {
        expect(otherInput).toHaveValue('$150.50');
      });
    });

    it('handles zero values', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ExpenseInputs />);

      const childcareInput = screen.getByLabelText('Extra Childcare');

      await user.click(childcareInput);
      await user.type(childcareInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(childcareInput).toHaveValue('$0.00');
      });
    });

    it('updates total when any expense changes', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ExpenseInputs />);

      const decompressionInput = screen.getByLabelText(
        'Decompression Spending'
      );

      // Initial total should be $0.00
      expect(screen.getByText('$0.00')).toBeInTheDocument();

      // Add decompression expense
      await user.click(decompressionInput);
      await user.type(decompressionInput, '1000');
      await user.tab();

      // Total should update to $1,000.00
      await waitFor(() => {
        expect(screen.getByText('$1,000.00')).toBeInTheDocument();
      });
    });
  });

  describe('Total Calculation', () => {
    it('calculates total with all expenses filled', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ExpenseInputs />);

      // Fill all expense fields
      const expenses = [
        { label: 'Commute Costs', value: '3000' },
        { label: 'Work Clothing', value: '500' },
        { label: 'Work Meals', value: '2000' },
        { label: 'Decompression Spending', value: '1000' },
        { label: 'Extra Childcare', value: '5000' },
        { label: 'Other Work Expenses', value: '500' },
      ];

      for (const expense of expenses) {
        const input = screen.getByLabelText(expense.label);
        await user.click(input);
        await user.clear(input);
        await user.type(input, expense.value);
        await user.tab();
      }

      // Total should be $12,000.00
      await waitFor(() => {
        expect(screen.getByText('$12,000.00')).toBeInTheDocument();
      });
    });

    it('recalculates total when expense is reduced', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ExpenseInputs />);

      const commuteInput = screen.getByLabelText('Commute Costs');

      // Set initial value
      await user.click(commuteInput);
      await user.type(commuteInput, '5000');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('$5,000.00')).toBeInTheDocument();
      });

      // Reduce value
      await user.click(commuteInput);
      await user.clear(commuteInput);
      await user.type(commuteInput, '2000');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('$2,000.00')).toBeInTheDocument();
      });
    });
  });

  describe('Styling', () => {
    it('displays total in error color (red)', () => {
      renderWithProvider(<ExpenseInputs />);

      const totalAmount = screen.getByText('$0.00');
      expect(totalAmount).toHaveClass('text-error-600');
    });

    it('applies correct spacing between fields', () => {
      renderWithProvider(<ExpenseInputs />);

      const cardContent = screen
        .getByText('Commute Costs')
        .closest('.space-y-4');
      expect(cardContent).toHaveClass('space-y-4');
    });
  });

  describe('Integration with Context', () => {
    it('displays default values from context', () => {
      renderWithProvider(<ExpenseInputs />);

      // All inputs should start with default value (0 formatted as currency)
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        // CurrencyInput displays formatted value when not focused
        expect(input).toHaveValue('$0.00');
      });
    });
  });
});
