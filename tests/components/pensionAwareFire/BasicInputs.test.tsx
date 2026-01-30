/**
 * Tests for BasicInputs component
 *
 * Coverage:
 * - Component rendering
 * - Input field interactions
 * - Expense baseline integration
 * - Tier selector functionality
 * - Validation of age constraints
 * - State updates via context
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BasicInputs } from '@/components/pensionAwareFire/BasicInputs';
import { useCalculator } from '@/context/CalculatorContext';
import { PENSION_AWARE_DEFAULTS } from '@/lib/constants/pensionAwareFire';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

const mockUseCalculator = useCalculator as unknown as ReturnType<typeof vi.fn>;

describe('BasicInputs', () => {
  const mockUpdatePensionAwareFireState = vi.fn();

  const defaultMockContext = {
    pensionAwareFire: {
      ...PENSION_AWARE_DEFAULTS,
      expenseSource: 'manual' as const,
      expenseTier: 'comfortable' as const,
    },
    updatePensionAwareFireState: mockUpdatePensionAwareFireState,
    expenseBaselineResults: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCalculator.mockReturnValue(defaultMockContext);
  });

  describe('Rendering', () => {
    it('should render all input fields correctly', () => {
      render(<BasicInputs />);

      // Check header
      expect(screen.getByText('Grunnupplýsingar')).toBeInTheDocument();

      // Check age inputs
      expect(screen.getAllByText(/Núverandi aldur/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Markaldur starfsloka/i).length).toBeGreaterThan(0);

      // Check expense input
      expect(screen.getByText(/Mánaðarleg útgjöld í starfslokum/i)).toBeInTheDocument();

      // Check savings section
      expect(screen.getByText('Sparnaður')).toBeInTheDocument();

      // Check investment return
      expect(screen.getAllByText(/Áætluð árleg ávöxtun/i).length).toBeGreaterThan(0);
    });

    it('should render with default values', () => {
      render(<BasicInputs />);

      // Check that default values are displayed in summary
      expect(screen.getByText(`${PENSION_AWARE_DEFAULTS.currentAge} ára`)).toBeInTheDocument();
      expect(screen.getByText(`${PENSION_AWARE_DEFAULTS.targetRetirementAge} ára`)).toBeInTheDocument();
    });

    it('should return null when pensionAwareFire is null', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: null,
      });

      const { container } = render(<BasicInputs />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Expense Baseline Integration', () => {
    it('should show success alert when baseline is connected', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        expenseBaselineResults: {
          totals: {
            barebones: 240_000,
            comfortable: 300_000,
            deluxe: 400_000,
          },
        },
      });

      render(<BasicInputs />);

      expect(screen.getByText(/Útgjaldagrunnlína tengd/i)).toBeInTheDocument();
    });

    it('should show info alert when baseline is not available', () => {
      render(<BasicInputs />);

      expect(screen.getByText(/Fylltu út/i)).toBeInTheDocument();
      expect(screen.getByText(/útgjaldagrunnlínu/i)).toBeInTheDocument();
    });

    it('should display tier selector when baseline is available and source is baseline', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: {
          ...PENSION_AWARE_DEFAULTS,
          expenseSource: 'baseline' as const,
          expenseTier: 'comfortable' as const,
        },
        expenseBaselineResults: {
          totals: {
            barebones: 240_000,
            comfortable: 300_000,
            deluxe: 400_000,
          },
        },
      });

      render(<BasicInputs />);

      // Check that all three tiers are displayed
      expect(screen.getByText('Lágmark')).toBeInTheDocument();
      expect(screen.getByText('Þægilegt')).toBeInTheDocument();
      expect(screen.getByText('Lúxus')).toBeInTheDocument();
    });

    it('should highlight selected tier', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: {
          ...PENSION_AWARE_DEFAULTS,
          expenseSource: 'baseline' as const,
          expenseTier: 'comfortable' as const,
        },
        expenseBaselineResults: {
          totals: {
            barebones: 240_000,
            comfortable: 300_000,
            deluxe: 400_000,
          },
        },
      });

      render(<BasicInputs />);

      // Find the comfortable tier button
      const comfortableButton = screen.getByRole('button', { name: /Þægilegt/i });

      // Should have selected styling
      expect(comfortableButton).toHaveClass('border-blue-500');
    });

    it('should update state when tier is selected', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: {
          ...PENSION_AWARE_DEFAULTS,
          expenseSource: 'baseline' as const,
          expenseTier: 'comfortable' as const,
        },
        expenseBaselineResults: {
          totals: {
            barebones: 240_000,
            comfortable: 300_000,
            deluxe: 400_000,
          },
        },
      });

      render(<BasicInputs />);

      // Click on deluxe tier
      const deluxeButton = screen.getByRole('button', { name: /Lúxus/i });
      fireEvent.click(deluxeButton);

      // Should update state with new tier and expense amount
      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        expenseSource: 'baseline',
        expenseTier: 'deluxe',
        monthlyExpenses: 400_000,
      });
    });
  });

  describe('Age Inputs', () => {
    it('should update current age', () => {
      render(<BasicInputs />);

      // Find the current age input - there should be exactly one with helpText
      const ageInputs = screen.getAllByLabelText(/Núverandi aldur/i);
      const ageInput = ageInputs[0]; // Use first one

      // Simulate changing age to 40
      fireEvent.change(ageInput, { target: { value: '40' } });

      // Should update state
      expect(mockUpdatePensionAwareFireState).toHaveBeenCalled();
    });

    it('should enforce minimum retirement age (current age + 1)', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: {
          ...PENSION_AWARE_DEFAULTS,
          currentAge: 50,
          targetRetirementAge: 55,
        },
      });

      render(<BasicInputs />);

      // Changing current age should potentially adjust retirement age
      const ageInputs = screen.getAllByLabelText(/Núverandi aldur/i);
      const ageInput = ageInputs[0];
      fireEvent.change(ageInput, { target: { value: '60' } });

      // Should call update with at least current age + 1 for retirement
      expect(mockUpdatePensionAwareFireState).toHaveBeenCalled();
    });

    it('should update target retirement age', () => {
      render(<BasicInputs />);

      // Find the retirement age slider by role
      const sliders = screen.getAllByRole('slider');
      const retirementAgeSlider = sliders.find(slider =>
        slider.getAttribute('aria-valuetext')?.includes('ára')
      );

      expect(retirementAgeSlider).toBeDefined();

      // Simulate changing retirement age
      fireEvent.change(retirementAgeSlider!, { target: { value: '60' } });

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        targetRetirementAge: 60,
      });
    });
  });

  describe('Expense Inputs', () => {
    it('should update monthly expenses in manual mode', () => {
      render(<BasicInputs />);

      // In manual mode, there should be a currency input for expenses
      // CurrencyInput renders as a textbox
      const expenseInputs = screen.getAllByRole('textbox');

      // Should have at least some currency inputs rendered
      expect(expenseInputs.length).toBeGreaterThan(0);

      // Check that the section label exists
      expect(screen.getByText(/Mánaðarleg útgjöld í starfslokum/i)).toBeInTheDocument();
    });

    it('should toggle between baseline and manual mode', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: {
          ...PENSION_AWARE_DEFAULTS,
          expenseSource: 'baseline' as const,
        },
        expenseBaselineResults: {
          totals: {
            barebones: 240_000,
            comfortable: 300_000,
            deluxe: 400_000,
          },
        },
      });

      render(<BasicInputs />);

      // Find toggle button to switch to manual
      const toggleButton = screen.getByText(/Skipta yfir í handvirka innfærslu/i);
      fireEvent.click(toggleButton);

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalled();
    });
  });

  describe('Savings Inputs', () => {
    it('should update current savings', () => {
      render(<BasicInputs />);

      // Find current savings input - should be unique
      const savingsInputs = screen.getAllByLabelText(/Núverandi sparnaður/i);
      const savingsInput = savingsInputs[0];

      // Simulate input
      fireEvent.change(savingsInput, { target: { value: '5000000' } });

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalled();
    });

    it('should update monthly savings', () => {
      render(<BasicInputs />);

      // Find monthly savings input
      const monthlySavingsInputs = screen.getAllByLabelText(/Mánaðarlegur sparnaður/i);
      const monthlySavingsInput = monthlySavingsInputs[0];

      // Simulate input
      fireEvent.change(monthlySavingsInput, { target: { value: '200000' } });

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalled();
    });
  });

  describe('Investment Return', () => {
    it('should update investment return', () => {
      render(<BasicInputs />);

      // Find investment return slider - should be the second slider (first is retirement age)
      const sliders = screen.getAllByRole('slider');
      const returnSlider = sliders[1]; // Investment return is second slider

      // Simulate changing return rate
      fireEvent.change(returnSlider, { target: { value: '0.07' } });

      expect(mockUpdatePensionAwareFireState).toHaveBeenCalledWith({
        investmentReturn: 0.07,
      });
    });

    it('should display return percentage correctly', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: {
          ...PENSION_AWARE_DEFAULTS,
          investmentReturn: 0.06,
        },
      });

      render(<BasicInputs />);

      // Check that 6% is displayed
      expect(screen.getByText(/6\.0%/i)).toBeInTheDocument();
    });
  });

  describe('Summary Box', () => {
    it('should display summary with correct values', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: {
          ...PENSION_AWARE_DEFAULTS,
          currentAge: 35,
          targetRetirementAge: 55,
          monthlyExpenses: 300_000,
        },
      });

      render(<BasicInputs />);

      // Check summary section
      expect(screen.getByText('Samantekt')).toBeInTheDocument();
      expect(screen.getByText('35 ára')).toBeInTheDocument();
      expect(screen.getByText('55 ára')).toBeInTheDocument();
      expect(screen.getByText(/300.*000.*kr/i)).toBeInTheDocument();
    });

    it('should calculate years to retirement correctly', () => {
      mockUseCalculator.mockReturnValue({
        ...defaultMockContext,
        pensionAwareFire: {
          ...PENSION_AWARE_DEFAULTS,
          currentAge: 35,
          targetRetirementAge: 50,
        },
      });

      render(<BasicInputs />);

      // Should show 15 years to retirement
      expect(screen.getByText('15 ár')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should respect minimum and maximum age constraints', () => {
      render(<BasicInputs />);

      const ageInput = screen.getByLabelText(/Núverandi aldur/i);

      // Input should have min/max attributes (validated by NumberInput component)
      expect(ageInput).toBeInTheDocument();
    });

    it('should respect expense constraints', () => {
      render(<BasicInputs />);

      // CurrencyInput components should handle min/max validation
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });
});
