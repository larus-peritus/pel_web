/**
 * Tests for RecommendationCard Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecommendationCard } from '@/components/fireTypes/RecommendationCard';
import type { FIRERecommendation, FIRECalculation } from '@/types/fireTypes';

// Mock calculation data
const mockCalculation: FIRECalculation = {
  fireTypeId: 'regularfire',
  fiNumber: 75_000_000,
  monthlyExpenses: 500_000,
  amountRemaining: 60_000_000,
  currentProgress: 20,
  yearsToFI: 12,
  effortLevel: 'moderate',
  feasibility: 75,
  coastData: null,
  baristaData: null,
};

// Mock recommendation data
const mockRecommendation: FIRERecommendation = {
  fireTypeId: 'regularfire',
  rank: 1,
  score: 85,
  confidence: 'high',
  reasons: [
    'Mjög raunhæft markmið',
    'Raunhæfur tími til marks',
    'Hófleg fórn í lífsstíl',
  ],
  warnings: ['Krefst aga í sparnaði'],
  yearsToFI: 12,
  monthlySavingsRequired: 400_000,
};

describe('RecommendationCard', () => {
  describe('Rendering', () => {
    it('renders FIRE type name and icon', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Venjulegt FIRE')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Venjulegt FIRE' })).toBeInTheDocument();
    });

    it('renders tagline', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText(/Klassískt FIRE með þægilegum lífsstíl/i)).toBeInTheDocument();
    });

    it('renders score display', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('/100')).toBeInTheDocument();
      expect(screen.getByText('Samsvörunarskor')).toBeInTheDocument();
    });

    it('renders confidence badge', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Mikil vissa')).toBeInTheDocument();
    });

    it('renders select button', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByRole('button', { name: /Velja þessa leið/i })).toBeInTheDocument();
    });
  });

  describe('Ranking Badges', () => {
    it('shows gold badge for rank 1', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, rank: 1 }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('🥇')).toBeInTheDocument();
      expect(screen.getByText('Besta valkosturinn')).toBeInTheDocument();
    });

    it('shows silver badge for rank 2', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, rank: 2 }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('🥈')).toBeInTheDocument();
      expect(screen.getByText('Góður valkostur')).toBeInTheDocument();
    });

    it('shows bronze badge for rank 3', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, rank: 3 }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('🥉')).toBeInTheDocument();
      expect(screen.getByText('Sæmilegur valkostur')).toBeInTheDocument();
    });

    it('shows no badge for rank 4+', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, rank: 4 }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.queryByText('🥇')).not.toBeInTheDocument();
      expect(screen.queryByText('🥈')).not.toBeInTheDocument();
      expect(screen.queryByText('🥉')).not.toBeInTheDocument();
    });
  });

  describe('Confidence Levels', () => {
    it('shows high confidence badge', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, confidence: 'high' }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Mikil vissa')).toBeInTheDocument();
    });

    it('shows medium confidence badge', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, confidence: 'medium' }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Miðlungs vissa')).toBeInTheDocument();
    });

    it('shows low confidence badge', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, confidence: 'low' }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Lítil vissa')).toBeInTheDocument();
    });
  });

  describe('Content Sections', () => {
    it('renders reasoning list', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Hvers vegna þetta hentar þér')).toBeInTheDocument();
      expect(screen.getByText('Mjög raunhæft markmið')).toBeInTheDocument();
      expect(screen.getByText('Raunhæfur tími til marks')).toBeInTheDocument();
    });

    it('renders action steps with numbered list', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Næstu skref')).toBeInTheDocument();
      // Action steps are generated by generateActionSteps function
    });

    it('renders warnings/obstacles', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Áskoranir og atriði til að hafa í huga')).toBeInTheDocument();
      expect(screen.getByText('Krefst aga í sparnaði')).toBeInTheDocument();
    });

    it('hides warnings section when no warnings', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, warnings: [] }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.queryByText('Áskoranir og atriði til að hafa í huga')).not.toBeInTheDocument();
    });
  });

  describe('Top Recommendation Styling', () => {
    it('applies prominent styling when isTopRecommendation is true', () => {
      const onSelect = vi.fn();
      const { container } = render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
          isTopRecommendation={true}
        />
      );

      const card = container.querySelector('.ring-2');
      expect(card).toBeInTheDocument();
    });

    it('does not apply prominent styling when isTopRecommendation is false', () => {
      const onSelect = vi.fn();
      const { container } = render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
          isTopRecommendation={false}
        />
      );

      const card = container.querySelector('.ring-2');
      expect(card).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onSelect with correct fireTypeId when button clicked', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      const button = screen.getByRole('button', { name: /Velja þessa leið/i });
      await user.click(button);

      expect(onSelect).toHaveBeenCalledWith('regularfire');
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Different FIRE Types', () => {
    it('renders LeanFIRE with correct colors', () => {
      const onSelect = vi.fn();
      const leanRecommendation: FIRERecommendation = {
        ...mockRecommendation,
        fireTypeId: 'leanfire',
      };
      const leanCalculation: FIRECalculation = {
        ...mockCalculation,
        fireTypeId: 'leanfire',
      };

      render(
        <RecommendationCard
          recommendation={leanRecommendation}
          calculation={leanCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument();
    });

    it('renders CoastFIRE with correct colors', () => {
      const onSelect = vi.fn();
      const coastRecommendation: FIRERecommendation = {
        ...mockRecommendation,
        fireTypeId: 'coastfire',
      };
      const coastCalculation: FIRECalculation = {
        ...mockCalculation,
        fireTypeId: 'coastfire',
      };

      render(
        <RecommendationCard
          recommendation={coastRecommendation}
          calculation={coastCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Sjálfvirkt FIRE')).toBeInTheDocument();
    });

    it('renders BaristaFIRE with correct colors', () => {
      const onSelect = vi.fn();
      const baristaRecommendation: FIRERecommendation = {
        ...mockRecommendation,
        fireTypeId: 'baristafire',
      };
      const baristaCalculation: FIRECalculation = {
        ...mockCalculation,
        fireTypeId: 'baristafire',
      };

      render(
        <RecommendationCard
          recommendation={baristaRecommendation}
          calculation={baristaCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Kaffibarþjóna FIRE')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles recommendation with no reasons', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, reasons: [] }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.queryByText('Hvers vegna þetta hentar þér')).not.toBeInTheDocument();
    });

    it('handles zero score', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, score: 0 }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles perfect score', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={{ ...mockRecommendation, score: 100 }}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      const button = screen.getByRole('button', { name: /Velja þessa leið/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('has accessible emoji labels', () => {
      const onSelect = vi.fn();
      render(
        <RecommendationCard
          recommendation={mockRecommendation}
          calculation={mockCalculation}
          onSelect={onSelect}
        />
      );

      expect(screen.getByRole('img', { name: 'Venjulegt FIRE' })).toBeInTheDocument();
    });
  });
});
