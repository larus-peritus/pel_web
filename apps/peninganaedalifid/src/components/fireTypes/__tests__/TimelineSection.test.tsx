import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineSection } from '../TimelineSection';
import type { FIRETimeline, UserFinancialInputs } from '@/types/fireTypes';

// Mock child components
jest.mock('../TimelineVisualization', () => ({
  TimelineVisualization: ({ timelines, currentAge }: any) => (
    <div data-testid="timeline-visualization">
      Timeline for age {currentAge}
    </div>
  ),
}));

describe('TimelineSection', () => {
  const mockUserInputs: UserFinancialInputs = {
    currentAge: 32,
    targetRetirementAge: 55,
    currentNetWorth: 10_000_000,
    annualIncome: 8_000_000,
    annualSavings: 2_400_000,
    savingsRate: 30,
    monthlyExpenses: {
      barebones: 250_000,
      comfortable: 450_000,
      deluxe: 800_000,
    },
  };

  const mockTimeline: FIRETimeline = {
    fireTypeId: 'regularfire',
    fiNumber: 135_000_000,
    currentNetWorth: 10_000_000,
    milestones: [
      {
        percentage: 0,
        amount: 0,
        date: new Date(),
        yearsFromNow: 0,
        label: 'Byrjun',
        isReached: true,
      },
      {
        percentage: 100,
        amount: 135_000_000,
        date: new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000),
        yearsFromNow: 20,
        label: 'FIRE náð!',
        isReached: false,
      },
    ],
    projectedPath: [],
  };

  const mockTimelines = {
    regularfire: mockTimeline,
    leanfire: {
      ...mockTimeline,
      fireTypeId: 'leanfire' as const,
      fiNumber: 75_000_000,
      milestones: [
        ...mockTimeline.milestones.slice(0, -1),
        {
          ...mockTimeline.milestones[1],
          yearsFromNow: 15,
          amount: 75_000_000,
        },
      ],
    },
    fatfire: {
      ...mockTimeline,
      fireTypeId: 'fatfire' as const,
      fiNumber: 300_000_000,
      milestones: [
        ...mockTimeline.milestones.slice(0, -1),
        {
          ...mockTimeline.milestones[1],
          yearsFromNow: 30,
          amount: 300_000_000,
        },
      ],
    },
  };

  describe('Empty State', () => {
    it('renders empty state when no timelines provided', () => {
      render(
        <TimelineSection
          timelines={null}
          userInputs={null}
        />
      );

      expect(screen.getByText('Engin tímalína til að sýna')).toBeInTheDocument();
      expect(
        screen.getByText(/Sláðu inn fjárhagsupplýsingar/i)
      ).toBeInTheDocument();
    });

    it('shows "Slá inn upplýsingar" button in empty state', () => {
      const onAdjustInputs = jest.fn();

      render(
        <TimelineSection
          timelines={null}
          userInputs={null}
          onAdjustInputs={onAdjustInputs}
        />
      );

      const button = screen.getByRole('button', { name: /Slá inn upplýsingar/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(onAdjustInputs).toHaveBeenCalledTimes(1);
    });
  });

  describe('Header', () => {
    it('renders section title', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      expect(screen.getByText('Tímalína til FIRE')).toBeInTheDocument();
    });

    it('renders section description', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      expect(
        screen.getByText('Sjá þína leið til fjármálafrelsis á sjónrænan hátt')
      ).toBeInTheDocument();
    });

    it('shows adjust button when onAdjustInputs is provided', () => {
      const onAdjustInputs = jest.fn();

      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
          onAdjustInputs={onAdjustInputs}
        />
      );

      const button = screen.getByRole('button', { name: /Breyta/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(onAdjustInputs).toHaveBeenCalledTimes(1);
    });
  });

  describe('Completion Estimates', () => {
    it('renders scenario buttons (Bjartsýn, Raunhæf, Varfærn)', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      expect(screen.getByText('Bjartsýn')).toBeInTheDocument();
      expect(screen.getByText('Raunhæf')).toBeInTheDocument();
      expect(screen.getByText('Varfærn')).toBeInTheDocument();
    });

    it('shows optimistic estimate (earliest FIRE type)', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      // LeanFIRE has 15 years - should be optimistic
      const optimisticButton = screen.getByText('Bjartsýn').parentElement;
      expect(optimisticButton?.textContent).toContain('15 ár');
    });

    it('shows realistic estimate (median FIRE type)', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      // RegularFIRE has 20 years - should be realistic (median)
      const realisticButton = screen.getByText('Raunhæf').parentElement;
      expect(realisticButton?.textContent).toContain('20 ár');
    });

    it('shows pessimistic estimate (latest FIRE type)', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      // FatFIRE has 30 years - should be pessimistic
      const pessimisticButton = screen.getByText('Varfærn').parentElement;
      expect(pessimisticButton?.textContent).toContain('30 ár');
    });

    it('allows switching between scenarios', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      const optimisticButton = screen.getByText('Bjartsýn').closest('button')!;
      const pessimisticButton = screen.getByText('Varfærn').closest('button')!;

      // Click pessimistic
      fireEvent.click(pessimisticButton);
      expect(pessimisticButton).toHaveClass('border-blue-500');

      // Click optimistic
      fireEvent.click(optimisticButton);
      expect(optimisticButton).toHaveClass('border-blue-500');
    });
  });

  describe('Timeline Visualization', () => {
    it('renders TimelineVisualization component', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      expect(screen.getByTestId('timeline-visualization')).toBeInTheDocument();
      expect(screen.getByText(/Timeline for age 32/i)).toBeInTheDocument();
    });

    it('passes selected types to visualization', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
          selectedTypes={['regularfire', 'leanfire']}
        />
      );

      expect(screen.getByTestId('timeline-visualization')).toBeInTheDocument();
    });
  });

  describe('Help Text', () => {
    it('renders help section with instructions', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      expect(screen.getByText('Hvernig á að lesa tímalínuna')).toBeInTheDocument();
    });

    it('includes explanation about milestone markers', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      expect(
        screen.getByText(/Hver tákn táknar FIRE markmið/i)
      ).toBeInTheDocument();
    });

    it('includes explanation about current position', () => {
      render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
        />
      );

      expect(
        screen.getByText(/Blái punkturinn sýnir þína núverandi stöðu/i)
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles timeline with achieved milestones', () => {
      const achievedTimeline = {
        regularfire: {
          ...mockTimeline,
          milestones: [
            ...mockTimeline.milestones.slice(0, -1),
            {
              ...mockTimeline.milestones[1],
              isReached: true,
              yearsFromNow: null,
            },
          ],
        },
      };

      render(
        <TimelineSection
          timelines={achievedTimeline}
          userInputs={mockUserInputs}
        />
      );

      // Should still render without errors
      expect(screen.getByText('Tímalína til FIRE')).toBeInTheDocument();
    });

    it('handles timeline with no achievable milestones', () => {
      const impossibleTimeline = {
        regularfire: {
          ...mockTimeline,
          milestones: [
            ...mockTimeline.milestones.slice(0, -1),
            {
              ...mockTimeline.milestones[1],
              yearsFromNow: null,
              date: null,
            },
          ],
        },
      };

      render(
        <TimelineSection
          timelines={impossibleTimeline}
          userInputs={mockUserInputs}
        />
      );

      // Should still render
      expect(screen.getByText('Tímalína til FIRE')).toBeInTheDocument();
    });

    it('handles single FIRE type timeline', () => {
      render(
        <TimelineSection
          timelines={{ regularfire: mockTimeline }}
          userInputs={mockUserInputs}
        />
      );

      expect(screen.getByTestId('timeline-visualization')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <TimelineSection
          timelines={mockTimelines}
          userInputs={mockUserInputs}
          className="custom-class"
        />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });
  });
});
