import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserFinancialInputs } from '@/components/fireTypes/UserFinancialInputs';
import { CalculatorProvider } from '@/context/CalculatorContext';

// Mock context
const mockUpdateFIRETypePreferences = vi.fn();

const MockProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <CalculatorProvider>{children}</CalculatorProvider>
);

describe('UserFinancialInputs Component', () => {
  beforeEach(() => {
    mockUpdateFIRETypePreferences.mockClear();
  });

  describe('Rendering', () => {
    it('renders all input sections', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      // Check section headers
      expect(screen.getByText(/Aldur og tímarammi/i)).toBeInTheDocument();
      expect(screen.getByText(/Núverandi fjárhagsstaða/i)).toBeInTheDocument();
      expect(screen.getByText(/Tekjur og sparnaður/i)).toBeInTheDocument();
    });

    it('renders all required input fields', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      expect(screen.getByLabelText(/Núverandi aldur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Markaldur starfsloka/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Hrein eign/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mánaðartekjur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mánaðarlegur sparnaður/i)).toBeInTheDocument();
    });

    it('renders with default values', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const ageInput = screen.getByLabelText(/Núverandi aldur/i) as HTMLInputElement;
      expect(ageInput.value).toBe('30');

      const netWorthInput = screen.getByLabelText(/Hrein eign/i) as HTMLInputElement;
      expect(netWorthInput.value).toBe('0 kr');
    });

    it('displays savings rate calculation', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Sparnaðarhlutfall/i)).toBeInTheDocument();
      // Default: 100,000 / 500,000 = 20%
      expect(screen.getByText(/20\.0%/)).toBeInTheDocument();
    });
  });

  describe('Input Changes', () => {
    it('updates age input correctly', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const ageInput = screen.getByLabelText(/Núverandi aldur/i) as HTMLInputElement;
      fireEvent.change(ageInput, { target: { value: '35' } });

      expect(ageInput.value).toBe('35');
    });

    it('updates net worth input correctly', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const netWorthInput = screen.getByLabelText(/Hrein eign/i) as HTMLInputElement;

      // Focus to show raw number
      fireEvent.focus(netWorthInput);
      fireEvent.change(netWorthInput, { target: { value: '5000000' } });

      expect(netWorthInput.value).toBe('5000000');
    });

    it('recalculates savings rate when income changes', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const incomeInput = screen.getByLabelText(/Mánaðartekjur/i) as HTMLInputElement;

      fireEvent.focus(incomeInput);
      fireEvent.change(incomeInput, { target: { value: '1000000' } });
      fireEvent.blur(incomeInput);

      await waitFor(() => {
        // 100,000 / 1,000,000 = 10%
        expect(screen.getByText(/10\.0%/)).toBeInTheDocument();
      });
    });

    it('recalculates savings rate when savings changes', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const savingsInput = screen.getByLabelText(/Mánaðarlegur sparnaður/i) as HTMLInputElement;

      fireEvent.focus(savingsInput);
      fireEvent.change(savingsInput, { target: { value: '250000' } });
      fireEvent.blur(savingsInput);

      await waitFor(() => {
        // 250,000 / 500,000 = 50%
        expect(screen.getByText(/50\.0%/)).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('shows error for age below minimum', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const ageInput = screen.getByLabelText(/Núverandi aldur/i);
      fireEvent.change(ageInput, { target: { value: '15' } });

      await waitFor(() => {
        expect(screen.getByText(/Aldur verður að vera að minnsta kosti 18 ára/i)).toBeInTheDocument();
      });
    });

    it('shows error for age above maximum', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const ageInput = screen.getByLabelText(/Núverandi aldur/i);
      fireEvent.change(ageInput, { target: { value: '95' } });

      await waitFor(() => {
        expect(screen.getByText(/Aldur verður að vera í mesta lagi 80 ára/i)).toBeInTheDocument();
      });
    });

    it('shows warning for late start age', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const ageInput = screen.getByLabelText(/Núverandi aldur/i);
      fireEvent.change(ageInput, { target: { value: '65' } });

      await waitFor(() => {
        expect(screen.getByText(/byrja seint/i)).toBeInTheDocument();
      });
    });

    it('shows error when target age is less than current age', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const ageInput = screen.getByLabelText(/Núverandi aldur/i);
      const targetAgeInput = screen.getByLabelText(/Markaldur starfsloka/i);

      fireEvent.change(ageInput, { target: { value: '40' } });
      fireEvent.change(targetAgeInput, { target: { value: '35' } });

      await waitFor(() => {
        expect(screen.getByText(/Markaldur verður að vera hærri en núverandi aldur/i)).toBeInTheDocument();
      });
    });

    it('shows warning for low income', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const incomeInput = screen.getByLabelText(/Mánaðartekjur/i);

      fireEvent.focus(incomeInput);
      fireEvent.change(incomeInput, { target: { value: '150000' } });
      fireEvent.blur(incomeInput);

      await waitFor(() => {
        expect(screen.getByText(/Lágar tekjur/i)).toBeInTheDocument();
      });
    });
  });

  describe('Expense Baseline Integration', () => {
    it('displays expense baseline info when available', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Mánaðarleg útgjöld þín:/i)).toBeInTheDocument();
      expect(screen.getByText(/Lágmarks \(barebones\):/i)).toBeInTheDocument();
      expect(screen.getByText(/Þægileg \(comfortable\):/i)).toBeInTheDocument();
      expect(screen.getByText(/Lúxus \(deluxe\):/i)).toBeInTheDocument();
    });

    it('shows fallback message when no expense baseline', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Notum sjálfgefin gildi/i)).toBeInTheDocument();
    });
  });

  describe('Help Text', () => {
    it('displays help text for all inputs', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Aldurinn þinn í dag/i)).toBeInTheDocument();
      expect(screen.getByText(/hvaða aldri viltu hætta að vinna/i)).toBeInTheDocument();
      expect(screen.getByText(/Heildarverðmæti eigna/i)).toBeInTheDocument();
      expect(screen.getByText(/Tekjur þínar á mánuði eftir skatta/i)).toBeInTheDocument();
      expect(screen.getByText(/Hversu mikið sparar þú/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const ageInput = screen.getByLabelText(/Núverandi aldur/i);
      expect(ageInput).toHaveAttribute('type', 'number');

      const targetAgeInput = screen.getByLabelText(/Markaldur starfsloka/i);
      expect(targetAgeInput).toBeInTheDocument();
    });

    it('marks required fields appropriately', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const ageInput = screen.getByLabelText(/Núverandi aldur/i);
      expect(ageInput).toBeRequired();
    });
  });

  describe('Savings Rate Display', () => {
    it('shows correct savings rate percentage', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/20\.0%/)).toBeInTheDocument();
      expect(screen.getByText(/Þú sparar 20\.0% af tekjum þínum/i)).toBeInTheDocument();
    });

    it('displays savings rate in ISK format', () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/100\.000 kr af 500\.000 kr/i)).toBeInTheDocument();
    });

    it('handles zero income gracefully', async () => {
      render(
        <MockProviderWrapper>
          <UserFinancialInputs />
        </MockProviderWrapper>
      );

      const incomeInput = screen.getByLabelText(/Mánaðartekjur/i);

      fireEvent.focus(incomeInput);
      fireEvent.change(incomeInput, { target: { value: '0' } });
      fireEvent.blur(incomeInput);

      await waitFor(() => {
        // Should show 0% or handle gracefully
        const savingsRate = screen.getByText(/Sparnaðarhlutfall/i).closest('div');
        expect(savingsRate).toBeInTheDocument();
      });
    });
  });
});
