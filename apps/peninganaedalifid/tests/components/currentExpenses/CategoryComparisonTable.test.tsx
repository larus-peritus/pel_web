import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryComparisonTable } from '@/components/currentExpenses/CategoryComparisonTable';
import type { BaselineComparisonData, CategoryComparison } from '@/types/currentExpenses';

describe('CategoryComparisonTable', () => {
  const mockCategoryComparisons: CategoryComparison[] = [
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
    {
      categoryId: 'askriftir',
      categoryName: 'Áskriftir',
      currentAmount: 25000,
      baselineAmount: 15000,
      difference: 10000,
      status: 'over',
    },
  ];

  const mockBaselineComparison: BaselineComparisonData = {
    closestTier: 'comfortable',
    currentTotal: 305000,
    tierTotal: 293000,
    difference: 12000,
    differencePercentage: 4.1,
    categoryComparisons: mockCategoryComparisons,
  };

  it('renders table headers correctly', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    expect(screen.getByText('Flokkur')).toBeInTheDocument();
    expect(screen.getByText('Núverandi')).toBeInTheDocument();
    expect(screen.getByText('Áætlun')).toBeInTheDocument();
    expect(screen.getByText('Mismunur')).toBeInTheDocument();
    expect(screen.getByText('Staða')).toBeInTheDocument();
  });

  it('renders all category rows', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    expect(screen.getByText('Húsnæði')).toBeInTheDocument();
    expect(screen.getByText('Matur')).toBeInTheDocument();
    expect(screen.getByText('Samgöngur')).toBeInTheDocument();
    expect(screen.getByText('Áskriftir')).toBeInTheDocument();
  });

  it('displays current amounts correctly', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    expect(screen.getByText('150.000 kr')).toBeInTheDocument(); // Húsnæði current
    expect(screen.getByText('80.000 kr')).toBeInTheDocument(); // Matur current
    expect(screen.getByText('50.000 kr')).toBeInTheDocument(); // Samgöngur current
    expect(screen.getByText('25.000 kr')).toBeInTheDocument(); // Áskriftir current
  });

  it('displays baseline amounts correctly', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    expect(screen.getByText('140.000 kr')).toBeInTheDocument(); // Húsnæði baseline
    expect(screen.getByText('90.000 kr')).toBeInTheDocument(); // Matur baseline
    expect(screen.getByText('48.000 kr')).toBeInTheDocument(); // Samgöngur baseline
    expect(screen.getByText('15.000 kr')).toBeInTheDocument(); // Áskriftir baseline
  });

  it('displays differences with correct signs', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    // Positive differences should have + sign
    expect(screen.getAllByText(/\+10\.000 kr/i)).toHaveLength(2); // Húsnæði and Áskriftir

    // Negative differences should show without + sign
    expect(screen.getByText(/-10\.000 kr/i)).toBeInTheDocument(); // Matur
  });

  it('shows correct status badges', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    const overBadges = screen.getAllByText('Yfir');
    expect(overBadges).toHaveLength(2); // Húsnæði and Áskriftir

    expect(screen.getByText('Undir')).toBeInTheDocument(); // Matur
    expect(screen.getByText('Passar')).toBeInTheDocument(); // Samgöngur
  });

  it('sorts categories by absolute difference (largest first)', () => {
    const { container } = render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    // Get tbody rows only
    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');

    expect(rows).toBeDefined();
    expect(rows!.length).toBe(4); // Should have 4 data rows

    // Last row should be Samgöngur (smallest absolute difference of 2000)
    const lastRow = rows![rows!.length - 1];
    expect(lastRow.textContent).toContain('Samgöngur');
  });

  it('applies correct background colors for status', () => {
    const { container } = render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    // Should have danger background for 'over' categories
    const dangerRows = container.querySelectorAll('.bg-danger-50');
    expect(dangerRows.length).toBeGreaterThan(0);

    // Should have success background for 'under' categories
    const successRows = container.querySelectorAll('.bg-success-50');
    expect(successRows.length).toBeGreaterThan(0);

    // Should have neutral background for 'match' categories
    const neutralRows = container.querySelectorAll('.bg-neutral-50');
    expect(neutralRows.length).toBeGreaterThan(0);
  });

  it('displays summary footer with counts', () => {
    const { container } = render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    // Summary footer should exist
    const footer = container.querySelector('.bg-neutral-50.px-4.py-3.border-t');
    expect(footer).toBeTruthy();

    // Check the content (text is split across elements)
    const footerText = footer?.textContent || '';
    expect(footerText).toContain('2');
    expect(footerText).toContain('flokkar yfir áætlun');
    expect(footerText).toContain('1');
    expect(footerText).toContain('flokkar undir áætlun');
    expect(footerText).toContain('flokkar passa');
  });

  it('shows percentage differences', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    // Húsnæði: 10000/140000 = 7.14%
    expect(screen.getByText(/\+7%/i)).toBeInTheDocument();

    // Matur: -10000/90000 = -11.11%
    expect(screen.getByText(/-11%/i)).toBeInTheDocument();
  });

  it('shows status icons in badges', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    expect(screen.getAllByText('⬆️')).toHaveLength(2); // Over badges
    expect(screen.getByText('⬇️')).toBeInTheDocument(); // Under badge
    expect(screen.getByText('✓')).toBeInTheDocument(); // Match badge
  });

  it('renders table as accessible table structure', () => {
    render(<CategoryComparisonTable baselineComparison={mockBaselineComparison} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(5); // 5 columns
  });
});
