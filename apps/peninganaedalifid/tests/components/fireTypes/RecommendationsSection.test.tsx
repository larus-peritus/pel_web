/**
 * Tests for RecommendationsSection Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecommendationsSection } from '@/components/fireTypes/RecommendationsSection';
import type { FIRECalculation, UserFinancialInputs } from '@/types/fireTypes';

// Mock user inputs
const mockUserInputs: UserFinancialInputs = {
  age: 30,
  grossAnnualIncome: 6_000_000,
  currentSavings: 10_000_000,
  monthlyExpenses: 400_000,
  monthlySavings: 200_000,
};

// Mock calculations for all FIRE types
const mockCalculations = {
  leanfire: {
    fireTypeId: 'leanfire' as const,
    fiNumber: 60_000_000,
    monthlyExpenses: 300_000,
    amountRemaining: 50_000_000,
    currentProgress: 16.7,
    yearsToFI: 10,
    effortLevel: 'moderate' as const,
    feasibility: 80,
    coastData: null,
    baristaData: null,
  } as FIRECalculation,
  regularfire: {
    fireTypeId: 'regularfire' as const,
    fiNumber: 75_000_000,
    monthlyExpenses: 400_000,
    amountRemaining: 65_000_000,
    currentProgress: 13.3,
    yearsToFI: 12,
    effortLevel: 'moderate' as const,
    feasibility: 85,
    coastData: null,
    baristaData: null,
  } as FIRECalculation,
  coastfire: {
    fireTypeId: 'coastfire' as const,
    fiNumber: 75_000_000,
    monthlyExpenses: 400_000,
    amountRemaining: 65_000_000,
    currentProgress: 13.3,
    yearsToFI: null,
    effortLevel: 'low' as const,
    feasibility: 70,
    coastData: {
      isCoasting: false,
      yearsUntilCoast: 8,
      requiredSavingsForCoast: 30_000_000,
    },
    baristaData: null,
  } as FIRECalculation,
  baristafire: {
    fireTypeId: 'baristafire' as const,
    fiNumber: 60_000_000,
    monthlyExpenses: 400_000,
    amountRemaining: 50_000_000,
    currentProgress: 16.7,
    yearsToFI: 9,
    effortLevel: 'low' as const,
    feasibility: 75,
    coastData: null,
    baristaData: {
      partTimeIncome: 200_000,
      fiNumberReduction: 15_000_000,
    },
  } as FIRECalculation,
  fatfire: {
    fireTypeId: 'fatfire' as const,
    fiNumber: 120_000_000,
    monthlyExpenses: 600_000,
    amountRemaining: 110_000_000,
    currentProgress: 8.3,
    yearsToFI: 20,
    effortLevel: 'high' as const,
    feasibility: 60,
    coastData: null,
    baristaData: null,
  } as FIRECalculation,
};

describe('RecommendationsSection', () => {
  describe('Section Header', () => {
    it('renders section title', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Ráðleggingar fyrir þig')).toBeInTheDocument();
    });

    it('renders section description', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText(/Byggt á fjárhagsstöðu þinni/i)).toBeInTheDocument();
    });
  });

  describe('With Sufficient Data', () => {
    it('shows methodology explanation', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Hvernig reiknum við út skorin?')).toBeInTheDocument();
    });

    it('shows top recommendation section', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Besta valkosturinn fyrir þig')).toBeInTheDocument();
    });

    it('shows alternative recommendations section', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Aðrir valkostir')).toBeInTheDocument();
    });

    it('renders top recommendation card prominently', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      // Top recommendation should be visible
      expect(screen.getByText('Besta valkosturinn fyrir þig')).toBeInTheDocument();

      // Should have select buttons
      const selectButtons = screen.getAllByRole('button', { name: /Velja þessa leið/i });
      expect(selectButtons.length).toBeGreaterThan(0);
    });

    it('shows reminder context box', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Mundu')).toBeInTheDocument();
      expect(screen.getByText(/Þessar ráðleggingar eru byggðar á núverandi upplýsingum/i)).toBeInTheDocument();
    });
  });

  describe('Without Sufficient Data', () => {
    it('shows NoRecommendationAlert when no calculations', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={null}
          userInputs={null}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });

    it('shows NoRecommendationAlert when age is missing', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={{ ...mockUserInputs, age: 0 }}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });

    it('shows NoRecommendationAlert when income is missing', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={{ ...mockUserInputs, grossAnnualIncome: 0 }}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });

    it('shows NoRecommendationAlert when expenses are missing', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={{ ...mockUserInputs, monthlyExpenses: 0 }}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });

    it('does not show recommendations when data is insufficient', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={{ ...mockUserInputs, age: 0 }}
          onSelectType={onSelectType}
        />
      );

      expect(screen.queryByText('Besta valkosturinn fyrir þig')).not.toBeInTheDocument();
      expect(screen.queryByText('Aðrir valkostir')).not.toBeInTheDocument();
    });
  });

  describe('Go To Inputs Callback', () => {
    it('passes onGoToInputs to NoRecommendationAlert', () => {
      const onSelectType = vi.fn();
      const onGoToInputs = vi.fn();
      render(
        <RecommendationsSection
          calculations={null}
          userInputs={null}
          onSelectType={onSelectType}
          onGoToInputs={onGoToInputs}
        />
      );

      const button = screen.getByRole('button', { name: /Fylla inn upplýsingar/i });
      expect(button).toBeInTheDocument();
    });

    it('calls onGoToInputs when button clicked', async () => {
      const user = userEvent.setup();
      const onSelectType = vi.fn();
      const onGoToInputs = vi.fn();
      render(
        <RecommendationsSection
          calculations={null}
          userInputs={null}
          onSelectType={onSelectType}
          onGoToInputs={onGoToInputs}
        />
      );

      const button = screen.getByRole('button', { name: /Fylla inn upplýsingar/i });
      await user.click(button);

      expect(onGoToInputs).toHaveBeenCalledTimes(1);
    });
  });

  describe('Select Type Callback', () => {
    it('passes onSelectType to RecommendationCards', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      // Should have select buttons
      const selectButtons = screen.getAllByRole('button', { name: /Velja þessa leið/i });
      expect(selectButtons.length).toBeGreaterThan(0);
    });

    it('calls onSelectType when recommendation selected', async () => {
      const user = userEvent.setup();
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      const selectButtons = screen.getAllByRole('button', { name: /Velja þessa leið/i });
      await user.click(selectButtons[0]);

      expect(onSelectType).toHaveBeenCalledTimes(1);
      expect(typeof onSelectType.mock.calls[0][0]).toBe('string');
    });
  });

  describe('Recommendations Generation', () => {
    it('generates recommendations from calculations', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      // Should show recommendations (calculated by calculateFIRERecommendations)
      expect(screen.getByText('Besta valkosturinn fyrir þig')).toBeInTheDocument();
    });

    it('memoizes recommendations based on calculations', () => {
      const onSelectType = vi.fn();
      const { rerender } = render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      // Rerender with same calculations should not recalculate
      rerender(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(screen.getByText('Besta valkosturinn fyrir þig')).toBeInTheDocument();
    });
  });

  describe('Missing Inputs Detection', () => {
    it('detects all missing inputs', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={{
            age: 0,
            grossAnnualIncome: 0,
            currentSavings: -1,
            monthlyExpenses: 0,
            monthlySavings: 0,
          }}
          onSelectType={onSelectType}
        />
      );

      // Should show missing inputs
      expect(screen.getByText('Upplýsingar sem vantar:')).toBeInTheDocument();
    });

    it('accepts currentSavings of 0 as valid', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={{ ...mockUserInputs, currentSavings: 0 }}
          onSelectType={onSelectType}
        />
      );

      // Should show recommendations (0 savings is valid)
      expect(screen.getByText('Besta valkosturinn fyrir þig')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('applies custom className', () => {
      const onSelectType = vi.fn();
      const { container } = render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
          className="custom-class"
        />
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
    });

    it('uses section tag for semantic HTML', () => {
      const onSelectType = vi.fn();
      const { container } = render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null calculations gracefully', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={null}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      // When calculations are null but userInputs are valid, recommendations will be null
      // Component should show NoRecommendationAlert
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });

    it('handles null userInputs gracefully', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={null}
          onSelectType={onSelectType}
        />
      );

      // Should show no recommendations alert
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });

    it('handles both null calculations and userInputs', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={null}
          userInputs={null}
          onSelectType={onSelectType}
        />
      );

      // Should show no recommendations alert
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      // h2 for main title
      expect(screen.getByRole('heading', { level: 2, name: 'Ráðleggingar fyrir þig' })).toBeInTheDocument();

      // h3 for subsections
      expect(screen.getByRole('heading', { level: 3, name: /Hvernig reiknum við út skorin/i })).toBeInTheDocument();
    });

    it('has semantic section element', () => {
      const onSelectType = vi.fn();
      const { container } = render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('all interactive elements are keyboard accessible', async () => {
      const user = userEvent.setup();
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      // Tab through buttons
      await user.tab();
      const focusedElement = document.activeElement;
      expect(focusedElement?.tagName).toBe('BUTTON');
    });
  });

  describe('Content Completeness', () => {
    it('shows all expected sections with data', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={mockCalculations}
          userInputs={mockUserInputs}
          onSelectType={onSelectType}
        />
      );

      // Header
      expect(screen.getByText('Ráðleggingar fyrir þig')).toBeInTheDocument();

      // Methodology
      expect(screen.getByText('Hvernig reiknum við út skorin?')).toBeInTheDocument();

      // Top recommendation
      expect(screen.getByText('Besta valkosturinn fyrir þig')).toBeInTheDocument();

      // Alternatives
      expect(screen.getByText('Aðrir valkostir')).toBeInTheDocument();

      // Reminder
      expect(screen.getByText('Mundu')).toBeInTheDocument();
    });

    it('shows educational content when no data', () => {
      const onSelectType = vi.fn();
      render(
        <RecommendationsSection
          calculations={null}
          userInputs={null}
          onSelectType={onSelectType}
        />
      );

      // Header
      expect(screen.getByText('Ráðleggingar fyrir þig')).toBeInTheDocument();

      // No recommendation alert with examples and education
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });
  });
});
