/**
 * Tests for FIRETypeDefinitionsSection Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FIRETypeDefinitionsSection } from '@/components/fireTypes/FIRETypeDefinitionsSection';
import type { FIRECalculation, FIRERecommendation, FIRETypeId } from '@/types/fireTypes';

describe('FIRETypeDefinitionsSection', () => {
  const mockCalculations: Record<FIRETypeId, FIRECalculation> = {
    leanfire: {
      fireTypeId: 'leanfire',
      monthlyExpenses: 250_000,
      annualExpenses: 3_000_000,
      multiplier: 25,
      fiNumber: 75_000_000,
      yearsToFI: 10,
      monthsToFI: 120,
      targetDate: new Date('2036-01-01'),
      targetAge: 45,
      currentProgress: 30,
      amountRemaining: 52_500_000,
      effortLevel: 'moderate',
      feasibility: 80,
    },
    regularfire: {
      fireTypeId: 'regularfire',
      monthlyExpenses: 520_000,
      annualExpenses: 6_240_000,
      multiplier: 30,
      fiNumber: 187_200_000,
      yearsToFI: 15,
      monthsToFI: 180,
      targetDate: new Date('2041-01-01'),
      targetAge: 50,
      currentProgress: 20,
      amountRemaining: 149_760_000,
      effortLevel: 'high',
      feasibility: 60,
    },
    coastfire: {
      fireTypeId: 'coastfire',
      monthlyExpenses: 400_000,
      annualExpenses: 4_800_000,
      multiplier: 25,
      fiNumber: 120_000_000,
      yearsToFI: 8,
      monthsToFI: 96,
      targetDate: new Date('2034-01-01'),
      targetAge: 43,
      currentProgress: 40,
      amountRemaining: 72_000_000,
      effortLevel: 'low',
      feasibility: 85,
    },
    baristafire: {
      fireTypeId: 'baristafire',
      monthlyExpenses: 450_000,
      annualExpenses: 5_400_000,
      multiplier: 25,
      fiNumber: 135_000_000,
      yearsToFI: 12,
      monthsToFI: 144,
      targetDate: new Date('2038-01-01'),
      targetAge: 47,
      currentProgress: 25,
      amountRemaining: 101_250_000,
      effortLevel: 'moderate',
      feasibility: 70,
    },
    fatfire: {
      fireTypeId: 'fatfire',
      monthlyExpenses: 800_000,
      annualExpenses: 9_600_000,
      multiplier: 30,
      fiNumber: 288_000_000,
      yearsToFI: 20,
      monthsToFI: 240,
      targetDate: new Date('2046-01-01'),
      targetAge: 55,
      currentProgress: 15,
      amountRemaining: 244_800_000,
      effortLevel: 'extreme',
      feasibility: 40,
    },
  };

  const mockRecommendations: FIRERecommendation[] = [
    {
      fireTypeId: 'coastfire',
      rank: 1,
      score: 85,
      confidence: 'high',
      reasons: ['Raunhæft markmið', 'Góður jafnvægur'],
      warnings: [],
      yearsToFI: 8,
      monthlySavingsRequired: 100_000,
    },
    {
      fireTypeId: 'leanfire',
      rank: 2,
      score: 80,
      confidence: 'high',
      reasons: ['Stysta leiðin'],
      warnings: ['Krefst mikilla fórna'],
      yearsToFI: 10,
      monthlySavingsRequired: 80_000,
    },
    {
      fireTypeId: 'baristafire',
      rank: 3,
      score: 70,
      confidence: 'medium',
      reasons: ['Sveigjanleiki'],
      warnings: [],
      yearsToFI: 12,
      monthlySavingsRequired: 90_000,
    },
    {
      fireTypeId: 'regularfire',
      rank: 4,
      score: 60,
      confidence: 'medium',
      reasons: [],
      warnings: ['Langt að bíða'],
      yearsToFI: 15,
      monthlySavingsRequired: 120_000,
    },
    {
      fireTypeId: 'fatfire',
      rank: 5,
      score: 40,
      confidence: 'low',
      reasons: [],
      warnings: ['Mjög hátt markmið'],
      yearsToFI: 20,
      monthlySavingsRequired: 150_000,
    },
  ];

  describe('Basic Rendering', () => {
    it('renders section title', () => {
      render(<FIRETypeDefinitionsSection />);

      expect(screen.getByText('FIRE Tegundir')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<FIRETypeDefinitionsSection />);

      expect(
        screen.getByText(/Fimm mismunandi leiðir til fjármálafrelsis/)
      ).toBeInTheDocument();
    });

    it('renders all 5 FIRE type cards', () => {
      render(<FIRETypeDefinitionsSection />);

      // Check for all type names (Icelandic)
      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument(); // LeanFIRE
      expect(screen.getByText('Venjulegt FIRE')).toBeInTheDocument(); // RegularFIRE
      expect(screen.getByText('Sjálfvirkt FIRE')).toBeInTheDocument(); // CoastFIRE
      expect(screen.getByText('Kaffibarþjóna FIRE')).toBeInTheDocument(); // BaristaFIRE
      expect(screen.getByText('Lúxus FIRE')).toBeInTheDocument(); // FatFIRE
    });

    it('renders educational note', () => {
      render(<FIRETypeDefinitionsSection />);

      expect(screen.getByText('Hvað ætti ég að velja?')).toBeInTheDocument();
    });
  });

  describe('With Calculations', () => {
    it('shows info alert when calculations provided', () => {
      render(
        <FIRETypeDefinitionsSection
          calculations={mockCalculations}
          recommendations={mockRecommendations}
        />
      );

      expect(screen.getByText(/Tölurnar hér að neðan eru reiknaðar/)).toBeInTheDocument();
    });

    it('passes calculations to each card', () => {
      render(<FIRETypeDefinitionsSection calculations={mockCalculations} />);

      // Check that personalized numbers appear
      expect(screen.getAllByText('Þínar tölur')).toHaveLength(5);
    });
  });

  describe('With Recommendations', () => {
    it('marks recommended cards (rank 1-3)', () => {
      render(
        <FIRETypeDefinitionsSection
          calculations={mockCalculations}
          recommendations={mockRecommendations}
        />
      );

      expect(screen.getByText('Mælt með')).toBeInTheDocument(); // Rank 1
      expect(screen.getByText('#2 valkostur')).toBeInTheDocument();
      expect(screen.getByText('#3 valkostur')).toBeInTheDocument();
    });

    it('sorts cards by recommendation rank', () => {
      const { container } = render(
        <FIRETypeDefinitionsSection
          calculations={mockCalculations}
          recommendations={mockRecommendations}
        />
      );

      // Get all card headers (h3 elements within cards)
      const cardHeaders = container.querySelectorAll('.text-xl.font-bold');

      // First card should be CoastFIRE (rank 1) - "Sjálfvirkt FIRE" in Icelandic
      expect(cardHeaders[0]).toHaveTextContent('Sjálfvirkt FIRE');
    });
  });

  describe('Selection State', () => {
    it('marks selected card', () => {
      render(<FIRETypeDefinitionsSection selectedType="leanfire" />);

      expect(screen.getByText('Valið')).toBeInTheDocument();
    });

    it('shows "Velja þetta" on non-selected cards', () => {
      render(<FIRETypeDefinitionsSection selectedType="leanfire" />);

      // 4 cards should have "Velja þetta" (all except selected)
      expect(screen.getAllByText('Velja þetta')).toHaveLength(4);
    });
  });

  describe('Callbacks', () => {
    it('calls onSelectType when card selected', () => {
      const onSelectType = vi.fn();
      render(<FIRETypeDefinitionsSection onSelectType={onSelectType} />);

      const selectButton = screen.getAllByText('Velja þetta')[0];
      fireEvent.click(selectButton);

      expect(onSelectType).toHaveBeenCalled();
    });

    it('calls onLearnMore when learn more clicked', () => {
      const onLearnMore = vi.fn();
      render(<FIRETypeDefinitionsSection onLearnMore={onLearnMore} />);

      const learnMoreButton = screen.getAllByText('Lesa meira')[0];
      fireEvent.click(learnMoreButton);

      expect(onLearnMore).toHaveBeenCalled();
    });

    it('calls onViewComparison when comparison button clicked', () => {
      const onViewComparison = vi.fn();
      render(
        <FIRETypeDefinitionsSection
          showComparisonLink={true}
          onViewComparison={onViewComparison}
        />
      );

      const comparisonButton = screen.getByText('Bera saman allar tegundir');
      fireEvent.click(comparisonButton);

      expect(onViewComparison).toHaveBeenCalled();
    });
  });

  describe('Comparison Link', () => {
    it('shows comparison link when showComparisonLink=true', () => {
      render(
        <FIRETypeDefinitionsSection
          showComparisonLink={true}
          onViewComparison={vi.fn()}
        />
      );

      expect(screen.getByText('Bera saman allar tegundir')).toBeInTheDocument();
    });

    it('hides comparison link when showComparisonLink=false', () => {
      render(<FIRETypeDefinitionsSection showComparisonLink={false} />);

      expect(screen.queryByText('Bera saman allar tegundir')).not.toBeInTheDocument();
    });

    it('hides comparison link when onViewComparison not provided', () => {
      render(<FIRETypeDefinitionsSection showComparisonLink={true} />);

      expect(screen.queryByText('Bera saman allar tegundir')).not.toBeInTheDocument();
    });
  });

  describe('Without Recommendations', () => {
    it('renders cards in default order when no recommendations', () => {
      render(<FIRETypeDefinitionsSection calculations={mockCalculations} />);

      // Should still render all cards
      expect(screen.getAllByText('Þínar tölur')).toHaveLength(5);
    });

    it('does not show recommendation badges without recommendations', () => {
      render(<FIRETypeDefinitionsSection calculations={mockCalculations} />);

      expect(screen.queryByText('Mælt með')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty calculations object', () => {
      render(<FIRETypeDefinitionsSection calculations={{} as any} />);

      // Should still render all cards without personalized numbers
      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument();
      expect(screen.queryByText('Þínar tölur')).not.toBeInTheDocument();
    });

    it('handles empty recommendations array', () => {
      render(<FIRETypeDefinitionsSection recommendations={[]} />);

      expect(screen.queryByText('Mælt með')).not.toBeInTheDocument();
    });

    it('handles partial recommendations', () => {
      const partialRecs = [mockRecommendations[0]]; // Only one recommendation
      render(<FIRETypeDefinitionsSection recommendations={partialRecs} />);

      expect(screen.getByText('Mælt með')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders as a section element', () => {
      const { container } = render(<FIRETypeDefinitionsSection />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<FIRETypeDefinitionsSection />);

      const mainHeading = screen.getByText('FIRE Tegundir');
      expect(mainHeading.tagName).toBe('H2');
    });
  });

  describe('Responsive Grid', () => {
    it('renders grid layout', () => {
      const { container } = render(<FIRETypeDefinitionsSection />);

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });
  });
});
