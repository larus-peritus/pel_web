import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseSourceSelector } from '@/components/fiNumber/ExpenseSourceSelector';
import type { ExpenseTier } from '@/types/expenseBaseline';

describe('ExpenseSourceSelector', () => {
  const mockBaselineExpenses = {
    barebones: 250000,
    comfortable: 520000,
    deluxe: 1000000,
  };

  const defaultProps = {
    expenseSource: 'baseline' as const,
    selectedTier: 'comfortable' as ExpenseTier,
    customMonthlyExpense: 0,
    hasBaseline: true,
    baselineExpenses: mockBaselineExpenses,
    onSourceChange: vi.fn(),
    onTierChange: vi.fn(),
    onCustomExpenseChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('renders the component with baseline source selected', () => {
      render(<ExpenseSourceSelector {...defaultProps} />);

      expect(screen.getByText('Veldu útgjaldauppruna')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /nota útgjaldagrunn/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /slá inn sérsniðin útgjöld/i })).toBeInTheDocument();
    });

    it('shows TierSelector when baseline is selected and exists', () => {
      render(<ExpenseSourceSelector {...defaultProps} />);

      expect(screen.getByText('Veldu útgjaldagrunn')).toBeInTheDocument();
    });

    it('shows warning when baseline is selected but does not exist', () => {
      render(<ExpenseSourceSelector {...defaultProps} hasBaseline={false} />);

      expect(screen.getByText('Útgjaldagrunnur ekki til staðar')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /setja upp útgjaldagrunn/i })).toBeInTheDocument();
    });

    it('shows custom expense input when custom source is selected', () => {
      render(
        <ExpenseSourceSelector {...defaultProps} expenseSource="custom" customMonthlyExpense={500000} />
      );

      expect(screen.getByLabelText(/mánaðarleg útgjöld/i)).toBeInTheDocument();
    });

    it('shows info alert about using baseline', () => {
      render(<ExpenseSourceSelector {...defaultProps} />);

      expect(screen.getByText(/ábending/i)).toBeInTheDocument();
      expect(
        screen.getByText(/ef þú hefur sett upp útgjaldagrunn mælum við með/i)
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onSourceChange when baseline radio is clicked', () => {
      const onSourceChange = vi.fn();
      render(<ExpenseSourceSelector {...defaultProps} expenseSource="custom" onSourceChange={onSourceChange} />);

      const baselineRadio = screen.getByRole('radio', { name: /nota útgjaldagrunn/i });
      fireEvent.click(baselineRadio);

      expect(onSourceChange).toHaveBeenCalledWith('baseline');
    });

    it('calls onSourceChange when custom radio is clicked', () => {
      const onSourceChange = vi.fn();
      render(<ExpenseSourceSelector {...defaultProps} onSourceChange={onSourceChange} />);

      const customRadio = screen.getByRole('radio', { name: /slá inn sérsniðin útgjöld/i });
      fireEvent.click(customRadio);

      expect(onSourceChange).toHaveBeenCalledWith('custom');
    });

    it('defaults to comfortable tier when switching to baseline with no tier selected', () => {
      const onTierChange = vi.fn();
      const onSourceChange = vi.fn();
      render(
        <ExpenseSourceSelector
          {...defaultProps}
          expenseSource="custom"
          selectedTier={null}
          onSourceChange={onSourceChange}
          onTierChange={onTierChange}
        />
      );

      const baselineRadio = screen.getByRole('radio', { name: /nota útgjaldagrunn/i });
      fireEvent.click(baselineRadio);

      expect(onSourceChange).toHaveBeenCalledWith('baseline');
      expect(onTierChange).toHaveBeenCalledWith('comfortable');
    });

    it('calls onCustomExpenseChange when custom expense input changes', () => {
      const onCustomExpenseChange = vi.fn();
      render(
        <ExpenseSourceSelector
          {...defaultProps}
          expenseSource="custom"
          customMonthlyExpense={0}
          onCustomExpenseChange={onCustomExpenseChange}
        />
      );

      const input = screen.getByLabelText(/mánaðarleg útgjöld/i);
      fireEvent.change(input, { target: { value: '500000' } });

      expect(onCustomExpenseChange).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('shows error when custom expense is 0', () => {
      render(
        <ExpenseSourceSelector
          {...defaultProps}
          expenseSource="custom"
          customMonthlyExpense={0}
        />
      );

      const input = screen.getByLabelText(/mánaðarleg útgjöld/i);
      fireEvent.change(input, { target: { value: '0' } });
      fireEvent.blur(input);

      expect(screen.getByText('Útgjöld verða að vera jákvæð')).toBeInTheDocument();
    });

    it('shows error when custom expense exceeds 10M ISK', () => {
      render(
        <ExpenseSourceSelector
          {...defaultProps}
          expenseSource="custom"
          customMonthlyExpense={15000000}
        />
      );

      const input = screen.getByLabelText(/mánaðarleg útgjöld/i);
      fireEvent.change(input, { target: { value: '15000000' } });
      fireEvent.blur(input);

      expect(screen.getByText(/útgjöld virðast óraunhæf/i)).toBeInTheDocument();
    });

    it('does not show error for valid custom expense', () => {
      render(
        <ExpenseSourceSelector
          {...defaultProps}
          expenseSource="custom"
          customMonthlyExpense={500000}
        />
      );

      const input = screen.getByLabelText(/mánaðarleg útgjöld/i);
      fireEvent.change(input, { target: { value: '500000' } });
      fireEvent.blur(input);

      expect(screen.queryByText(/útgjöld verða að vera jákvæð/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/útgjöld virðast óraunhæf/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper radio group role', () => {
      render(<ExpenseSourceSelector {...defaultProps} />);

      const radioGroup = screen.getByRole('radiogroup', { name: /veldu útgjaldauppruna/i });
      expect(radioGroup).toBeInTheDocument();
    });

    it('has proper aria-checked attributes', () => {
      render(<ExpenseSourceSelector {...defaultProps} expenseSource="baseline" />);

      const baselineRadio = screen.getByRole('radio', { name: /nota útgjaldagrunn/i });
      const customRadio = screen.getByRole('radio', { name: /slá inn sérsniðin útgjöld/i });

      expect(baselineRadio).toHaveAttribute('aria-checked', 'true');
      expect(customRadio).toHaveAttribute('aria-checked', 'false');
    });

    it('custom input has proper label association', () => {
      render(
        <ExpenseSourceSelector {...defaultProps} expenseSource="custom" customMonthlyExpense={500000} />
      );

      const input = screen.getByLabelText(/mánaðarleg útgjöld/i);
      expect(input).toBeInTheDocument();
    });

    it('shows error message with proper alert role', () => {
      render(
        <ExpenseSourceSelector
          {...defaultProps}
          expenseSource="custom"
          customMonthlyExpense={0}
        />
      );

      const input = screen.getByLabelText(/mánaðarleg útgjöld/i);
      fireEvent.change(input, { target: { value: '0' } });
      fireEvent.blur(input);

      const errorMessages = screen.getAllByRole('alert');
      // The last alert should be the error message, not the info alert
      const errorMessage = errorMessages.find(msg => msg.textContent?.includes('Útgjöld verða að vera jákvæð'));
      expect(errorMessage).toBeDefined();
    });
  });

  describe('Conditional Rendering', () => {
    it('hides TierSelector when baseline not selected', () => {
      render(<ExpenseSourceSelector {...defaultProps} expenseSource="custom" />);

      expect(screen.queryByText('Veldu útgjaldagrunn')).not.toBeInTheDocument();
    });

    it('hides custom input when custom not selected', () => {
      render(<ExpenseSourceSelector {...defaultProps} expenseSource="baseline" />);

      expect(screen.queryByLabelText(/mánaðarleg útgjöld/i)).not.toBeInTheDocument();
    });

    it('shows baseline warning only when baseline selected and not available', () => {
      const { rerender } = render(<ExpenseSourceSelector {...defaultProps} hasBaseline={false} />);

      expect(screen.getByText('Útgjaldagrunnur ekki til staðar')).toBeInTheDocument();

      rerender(<ExpenseSourceSelector {...defaultProps} hasBaseline={true} />);

      expect(screen.queryByText('Útgjaldagrunnur ekki til staðar')).not.toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('applies selected styles to baseline radio when selected', () => {
      render(<ExpenseSourceSelector {...defaultProps} expenseSource="baseline" />);

      const baselineRadio = screen.getByRole('radio', { name: /nota útgjaldagrunn/i });
      expect(baselineRadio).toHaveClass('border-primary-500', 'bg-primary-50');
    });

    it('applies selected styles to custom radio when selected', () => {
      render(<ExpenseSourceSelector {...defaultProps} expenseSource="custom" />);

      const customRadio = screen.getByRole('radio', { name: /slá inn sérsniðin útgjöld/i });
      expect(customRadio).toHaveClass('border-primary-500', 'bg-primary-50');
    });

    it('applies default styles to unselected radio', () => {
      render(<ExpenseSourceSelector {...defaultProps} expenseSource="baseline" />);

      const customRadio = screen.getByRole('radio', { name: /slá inn sérsniðin útgjöld/i });
      expect(customRadio).toHaveClass('border-neutral-200', 'bg-white');
    });
  });
});
