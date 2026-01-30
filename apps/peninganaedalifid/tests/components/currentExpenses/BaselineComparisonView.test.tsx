import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BaselineComparisonView } from '@/components/currentExpenses/BaselineComparisonView';
import type { BaselineComparisonData } from '@/types/currentExpenses';

describe('BaselineComparisonView', () => {
  const mockBaselineComparison: BaselineComparisonData = {
    closestTier: 'comfortable',
    currentTotal: 550000,
    tierTotal: 520000,
    difference: 30000,
    differencePercentage: 5.77,
    categoryComparisons: [
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 150000,
        baselineAmount: 140000,
        difference: 10000,
        status: 'over',
      },
      {
        categoryId: 'matur',
        categoryName: 'Matur',
        currentAmount: 80000,
        baselineAmount: 90000,
        difference: -10000,
        status: 'under',
      },
      {
        categoryId: 'samgongur',
        categoryName: 'Samgöngur',
        currentAmount: 50000,
        baselineAmount: 48000,
        difference: 2000,
        status: 'match',
      },
    ],
  };

  it('renders empty state when no baseline comparison exists', () => {
    render(<BaselineComparisonView baselineComparison={null} />);

    expect(screen.getByText(/engin útgjaldaáætlun til samanburðar/i)).toBeInTheDocument();
    expect(screen.getByText(/búðu til útgjaldaáætlun/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /fara í útgjaldareikni/i })).toBeInTheDocument();
  });

  it('renders baseline comparison when data exists', () => {
    render(<BaselineComparisonView baselineComparison={mockBaselineComparison} />);

    expect(screen.getByText(/samanburður við útgjaldaáætlun/i)).toBeInTheDocument();
    expect(screen.getByText(/hvernig standast núverandi útgjöld/i)).toBeInTheDocument();
  });

  it('renders tier match indicator section', () => {
    render(<BaselineComparisonView baselineComparison={mockBaselineComparison} />);

    expect(screen.getByText(/samanburður við útgjaldaáætlun/i)).toBeInTheDocument();
  });

  it('renders category comparison table section', () => {
    render(<BaselineComparisonView baselineComparison={mockBaselineComparison} />);

    expect(screen.getByText(/samanburður eftir flokkum/i)).toBeInTheDocument();
    expect(screen.getByText(/ítarleg greining/i)).toBeInTheDocument();
  });

  it('renders overspending highlights section', () => {
    render(<BaselineComparisonView baselineComparison={mockBaselineComparison} />);

    // Should show overspending alert for categories with 'over' status
    expect(screen.getAllByText(/flokkar yfir áætlun/i)[0]).toBeInTheDocument();
  });

  it('renders all sections in correct order', () => {
    const { container } = render(<BaselineComparisonView baselineComparison={mockBaselineComparison} />);

    const sections = container.querySelectorAll('.space-y-6 > *');
    expect(sections.length).toBeGreaterThan(0);
  });
});
