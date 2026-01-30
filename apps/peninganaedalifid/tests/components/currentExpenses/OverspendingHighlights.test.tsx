import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverspendingHighlights } from '@/components/currentExpenses/OverspendingHighlights';
import type { BaselineComparisonData, CategoryComparison } from '@/types/currentExpenses';

describe('OverspendingHighlights', () => {
  const createMockComparison = (categories: CategoryComparison[]): BaselineComparisonData => ({
    closestTier: 'comfortable',
    currentTotal: 550000,
    tierTotal: 520000,
    difference: 30000,
    differencePercentage: 5.77,
    categoryComparisons: categories,
  });

  it('shows success message when no categories are overspending', () => {
    const mockData = createMockComparison([
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
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/frábært! öll útgjöld innan áætlunar/i)).toBeInTheDocument();
    expect(screen.getByText(/haltu áfram með góða fjármálastjórnun/i)).toBeInTheDocument();
  });

  it('shows warning alert when categories are overspending', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 150000,
        baselineAmount: 140000,
        difference: 10000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/1 flokkar yfir áætlun/i)).toBeInTheDocument();
  });

  it('displays correct count of overspending categories', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 150000,
        baselineAmount: 140000,
        difference: 10000,
        status: 'over',
      },
      {
        categoryId: 'askriftir',
        categoryName: 'Áskriftir',
        currentAmount: 25000,
        baselineAmount: 15000,
        difference: 10000,
        status: 'over',
      },
      {
        categoryId: 'matur',
        categoryName: 'Matur',
        currentAmount: 100000,
        baselineAmount: 80000,
        difference: 20000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/3 flokkar yfir áætlun/i)).toBeInTheDocument();
  });

  it('displays total overspending amount', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 150000,
        baselineAmount: 140000,
        difference: 10000,
        status: 'over',
      },
      {
        categoryId: 'askriftir',
        categoryName: 'Áskriftir',
        currentAmount: 25000,
        baselineAmount: 15000,
        difference: 10000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    // Total: 10000 + 10000 = 20000
    expect(screen.getByText(/20\.000 kr/i)).toBeInTheDocument();
  });

  it('shows top 3 overspending categories', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 150000,
        baselineAmount: 140000,
        difference: 10000,
        status: 'over',
      },
      {
        categoryId: 'askriftir',
        categoryName: 'Áskriftir',
        currentAmount: 30000,
        baselineAmount: 15000,
        difference: 15000,
        status: 'over',
      },
      {
        categoryId: 'matur',
        categoryName: 'Matur',
        currentAmount: 105000,
        baselineAmount: 80000,
        difference: 25000,
        status: 'over',
      },
      {
        categoryId: 'samgongur',
        categoryName: 'Samgöngur',
        currentAmount: 53000,
        baselineAmount: 48000,
        difference: 5000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    // Should show top 3
    expect(screen.getByText('Matur')).toBeInTheDocument(); // 25000
    expect(screen.getByText('Áskriftir')).toBeInTheDocument(); // 15000
    expect(screen.getByText('Húsnæði')).toBeInTheDocument(); // 10000

    // Should not show the 4th (Samgöngur)
    expect(screen.queryByText('Samgöngur')).not.toBeInTheDocument();
  });

  it('shows indicator when more than 3 categories are overspending', () => {
    const mockData = createMockComparison([
      { categoryId: '1', categoryName: 'Cat1', currentAmount: 100, baselineAmount: 80, difference: 20, status: 'over' as const },
      { categoryId: '2', categoryName: 'Cat2', currentAmount: 100, baselineAmount: 80, difference: 20, status: 'over' as const },
      { categoryId: '3', categoryName: 'Cat3', currentAmount: 100, baselineAmount: 80, difference: 20, status: 'over' as const },
      { categoryId: '4', categoryName: 'Cat4', currentAmount: 100, baselineAmount: 80, difference: 20, status: 'over' as const },
      { categoryId: '5', categoryName: 'Cat5', currentAmount: 100, baselineAmount: 80, difference: 20, status: 'over' as const },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/\.\.\. og 2 flokkar til viðbótar/i)).toBeInTheDocument();
  });

  it('displays baseline and current amounts for each category', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 150000,
        baselineAmount: 140000,
        difference: 10000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/áætlun: 140\.000 kr/i)).toBeInTheDocument();
    expect(screen.getByText(/raunverulegt: 150\.000 kr/i)).toBeInTheDocument();
  });

  it('displays percentage over baseline', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 154000,
        baselineAmount: 140000,
        difference: 14000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    // 14000/140000 = 10%
    expect(screen.getByText(/\+10%/i)).toBeInTheDocument();
  });

  it('shows subscription-specific suggestion when subscriptions are overspending', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'askriftir',
        categoryName: 'Áskriftir',
        currentAmount: 25000,
        baselineAmount: 15000,
        difference: 10000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/áskriftarmæli/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /áskriftarmæli/i })).toHaveAttribute(
      'href',
      '/subscription-burn-meter'
    );
  });

  it('shows commute-specific suggestion when transport is overspending', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'samgongur',
        categoryName: 'Samgöngur',
        currentAmount: 60000,
        baselineAmount: 48000,
        difference: 12000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/ferðakostnað/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ferðakostnað/i })).toHaveAttribute(
      'href',
      '/commute-calculator'
    );
  });

  it('shows housing-specific suggestion when housing is overspending', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 160000,
        baselineAmount: 140000,
        difference: 20000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/húsnæðisreiknivél/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /húsnæðisreiknivél/i })).toHaveAttribute(
      'href',
      '/housing-calculator'
    );
  });

  it('shows general suggestions section', () => {
    const mockData = createMockComparison([
      {
        categoryId: 'husnaedi',
        categoryName: 'Húsnæði',
        currentAmount: 150000,
        baselineAmount: 140000,
        difference: 10000,
        status: 'over',
      },
    ]);

    render(<OverspendingHighlights baselineComparison={mockData} />);

    expect(screen.getByText(/tillögur:/i)).toBeInTheDocument();
    expect(screen.getByText(/skoðaðu línuatriði/i)).toBeInTheDocument();

    // Text is split across elements, check for link instead
    const link = screen.getByRole('link', { name: /útgjaldaáætlun/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/utgjaldareiknivel');
  });

  it('sorts overspending categories by highest difference first', () => {
    const mockData = createMockComparison([
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
        currentAmount: 105000,
        baselineAmount: 80000,
        difference: 25000,
        status: 'over',
      },
      {
        categoryId: 'askriftir',
        categoryName: 'Áskriftir',
        currentAmount: 30000,
        baselineAmount: 15000,
        difference: 15000,
        status: 'over',
      },
    ]);

    const { container } = render(<OverspendingHighlights baselineComparison={mockData} />);
    const listItems = container.querySelectorAll('li');

    // First visible category should be Matur (highest difference)
    expect(listItems[0].textContent).toContain('Matur');
    // Second should be Áskriftir
    expect(listItems[1].textContent).toContain('Áskriftir');
    // Third should be Húsnæði (lowest difference)
    expect(listItems[2].textContent).toContain('Húsnæði');
  });
});
