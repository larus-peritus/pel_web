import { render, screen, fireEvent } from '@testing-library/react';
import { IncomeInputs } from '@/components/calculator/IncomeInputs';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { describe, it, expect } from 'vitest';

/**
 * Test suite for IncomeInputs component
 */
describe('IncomeInputs', () => {
  // Helper to render component with provider
  const renderIncomeInputs = () => {
    return render(
      <CalculatorProvider>
        <IncomeInputs />
      </CalculatorProvider>
    );
  };

  describe('Rendering', () => {
    it('renders the income section heading', () => {
      renderIncomeInputs();
      const heading = screen.getByText('Income');
      expect(heading).toBeTruthy();
    });

    it('renders the section description', () => {
      renderIncomeInputs();
      const description = screen.getByText(
        'Enter your annual income and work schedule'
      );
      expect(description).toBeTruthy();
    });

    it('renders gross annual income input', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Gross Annual Income');
      expect(input).toBeTruthy();
      expect(input.getAttribute('id')).toBe('gross-income');
    });

    it('renders hours per week input', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Hours per Week');
      expect(input).toBeTruthy();
      expect(input.getAttribute('id')).toBe('hours-per-week');
    });

    it('renders weeks per year input', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Weeks per Year');
      expect(input).toBeTruthy();
      expect(input.getAttribute('id')).toBe('weeks-per-year');
    });

    it('renders additional income input', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Additional Income (Optional)');
      expect(input).toBeTruthy();
      expect(input.getAttribute('id')).toBe('additional-income');
    });

    it('displays help text for gross income', () => {
      renderIncomeInputs();
      const helpText = screen.getByText(
        'Your total salary before taxes and deductions'
      );
      expect(helpText).toBeTruthy();
    });

    it('displays help text for additional income', () => {
      renderIncomeInputs();
      const helpText = screen.getByText(
        'Bonuses, side income, or other earnings'
      );
      expect(helpText).toBeTruthy();
    });
  });

  describe('Default Values', () => {
    it('displays default gross income value', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText(
        'Gross Annual Income'
      ) as HTMLInputElement;
      // Default is 0, should show formatted as $0.00
      expect(input.value).toBe('$0.00');
    });

    it('displays default hours per week value', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Hours per Week') as HTMLInputElement;
      // Default is 40
      expect(input.value).toBe('40');
    });

    it('displays default weeks per year value', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText(
        'Weeks per Year'
      ) as HTMLInputElement;
      // Default is 50
      expect(input.value).toBe('50');
    });

    it('displays default additional income value', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText(
        'Additional Income (Optional)'
      ) as HTMLInputElement;
      // Default is 0
      expect(input.value).toBe('$0.00');
    });
  });

  describe('Input Interactions', () => {
    it('updates gross income when changed', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText(
        'Gross Annual Income'
      ) as HTMLInputElement;

      // Focus to show raw value
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '50000' } });
      expect(input.value).toBe('50000');

      // Blur to format
      fireEvent.blur(input);
      expect(input.value).toBe('$50,000.00');
    });

    it('updates hours per week when changed', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText(
        'Hours per Week'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '35' } });
      expect(input.value).toBe('35');
    });

    it('updates weeks per year when changed', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText(
        'Weeks per Year'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '48' } });
      expect(input.value).toBe('48');
    });

    it('updates additional income when changed', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText(
        'Additional Income (Optional)'
      ) as HTMLInputElement;

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '5000' } });
      expect(input.value).toBe('5000');

      fireEvent.blur(input);
      expect(input.value).toBe('$5,000.00');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on gross income', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Gross Annual Income');
      expect(input.getAttribute('aria-describedby')).toBe('gross-income-desc');
    });

    it('has proper ARIA attributes on additional income', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Additional Income (Optional)');
      expect(input.getAttribute('aria-describedby')).toBe(
        'additional-income-desc'
      );
    });

    it('labels are associated with inputs', () => {
      renderIncomeInputs();

      // Check all inputs have proper labels
      expect(screen.getByLabelText('Gross Annual Income')).toBeTruthy();
      expect(screen.getByLabelText('Hours per Week')).toBeTruthy();
      expect(screen.getByLabelText('Weeks per Year')).toBeTruthy();
      expect(screen.getByLabelText('Additional Income (Optional)')).toBeTruthy();
    });
  });

  describe('Validation Constraints', () => {
    it('hours per week has min and max constraints', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Hours per Week');
      expect(input.getAttribute('min')).toBe('1');
      expect(input.getAttribute('max')).toBe('100');
      expect(input.getAttribute('step')).toBe('1');
    });

    it('weeks per year has min and max constraints', () => {
      renderIncomeInputs();
      const input = screen.getByLabelText('Weeks per Year');
      expect(input.getAttribute('min')).toBe('1');
      expect(input.getAttribute('max')).toBe('52');
      expect(input.getAttribute('step')).toBe('1');
    });
  });

  describe('Layout', () => {
    it('hours and weeks inputs are in a grid layout', () => {
      renderIncomeInputs();
      const hoursLabel = screen.getByText('Hours per Week');
      const weeksLabel = screen.getByText('Weeks per Year');

      // Both labels should be siblings within a grid container
      const hoursContainer = hoursLabel.parentElement;
      const weeksContainer = weeksLabel.parentElement;
      const gridContainer = hoursContainer?.parentElement;

      expect(gridContainer?.className).toContain('grid');
      expect(gridContainer?.className).toContain('grid-cols-2');
      expect(gridContainer?.className).toContain('gap-4');
      expect(weeksContainer?.parentElement).toBe(gridContainer);
    });

    it('uses Card component with elevated variant', () => {
      const { container } = renderIncomeInputs();
      // Card component should apply elevated variant classes
      const card = container.querySelector('.bg-white.rounded-xl.shadow-sm');
      expect(card).toBeTruthy();
    });
  });
});
