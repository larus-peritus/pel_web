import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsSummarySection } from '@/components/expenseBaseline/ResultsSummarySection';
import type { ExpenseBaseline, ExpenseBaselineResults } from '@/types/expenseBaseline';

const mockBaseline: ExpenseBaseline = {
  categories: [
    {
      id: 'husnaedi',
      name: 'Húsnæði',
      icon: '🏠',
      values: { barebones: 120000, comfortable: 200000, deluxe: 350000 },
      isCustom: false,
      isHidden: false,
      order: 0,
    },
    {
      id: 'matur',
      name: 'Matur',
      icon: '🍽️',
      values: { barebones: 40000, comfortable: 70000, deluxe: 120000 },
      isCustom: false,
      isHidden: false,
      order: 1,
    },
  ],
  lastUpdated: new Date(),
  wizardCompleted: true,
  version: 1,
};

const mockResults: ExpenseBaselineResults = {
  totals: { barebones: 160000, comfortable: 270000, deluxe: 470000 },
  annualTotals: { barebones: 1920000, comfortable: 3240000, deluxe: 5640000 },
  percentageBreakdown: {
    husnaedi: { barebones: 75, comfortable: 74.1, deluxe: 74.5 },
    matur: { barebones: 25, comfortable: 25.9, deluxe: 25.5 },
  },
  lifeEnergy: {
    monthly: { barebones: 64, comfortable: 108, deluxe: 188 },
    annual: { barebones: 768, comfortable: 1296, deluxe: 2256 },
    perCategory: {
      husnaedi: { barebones: 48, comfortable: 80, deluxe: 140 },
      matur: { barebones: 16, comfortable: 28, deluxe: 48 },
    },
  },
  tierDifferences: {
    bareToComfortable: { isk: 110000, hours: 44 },
    comfortableToDeluxe: { isk: 200000, hours: 80 },
    bareToDeluxe: { isk: 310000, hours: 124 },
  },
  categoryCount: 2,
  activeCategories: 2,
};

describe('ResultsSummarySection', () => {
  it('should render section header with title', () => {
    render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={mockResults}
        actualHourlyWage={2500}
      />
    );

    expect(screen.getByText('Yfirlit útgjaldagrunns')).toBeTruthy();
  });

  it('should display all three tier totals', () => {
    render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={mockResults}
        actualHourlyWage={2500}
      />
    );

    expect(screen.getAllByText('Lágmarks').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Þægilegt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Lúxus').length).toBeGreaterThan(0);

    expect(screen.getAllByText('160.000 kr').length).toBeGreaterThan(0);
    expect(screen.getAllByText('270.000 kr').length).toBeGreaterThan(0);
    expect(screen.getAllByText('470.000 kr').length).toBeGreaterThan(0);
  });

  it('should show category count', () => {
    render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={mockResults}
        actualHourlyWage={2500}
      />
    );

    expect(screen.getByText(/2 flokkar virkir/)).toBeTruthy();
  });

  it('should show hidden category count when applicable', () => {
    const baselineWithHidden: ExpenseBaseline = {
      ...mockBaseline,
      categories: [
        ...mockBaseline.categories,
        {
          id: 'hidden',
          name: 'Hidden',
          icon: '❌',
          values: { barebones: 0, comfortable: 0, deluxe: 0 },
          isCustom: false,
          isHidden: true,
          order: 2,
        },
      ],
    };

    const resultsWithHidden: ExpenseBaselineResults = {
      ...mockResults,
      categoryCount: 3,
      activeCategories: 2,
    };

    render(
      <ResultsSummarySection
        baseline={baselineWithHidden}
        results={resultsWithHidden}
        actualHourlyWage={2500}
      />
    );

    expect(screen.getByText(/1 falinn/)).toBeTruthy();
  });

  it('should render all sub-components', () => {
    const { container } = render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={mockResults}
        actualHourlyWage={2500}
      />
    );

    // Check for grid layout with sub-components
    const grid = container.querySelector('.grid.lg\\:grid-cols-2');
    expect(grid).toBeTruthy();
  });

  it('should show info alert when AWH is not available', () => {
    render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={mockResults}
        actualHourlyWage={null}
      />
    );

    expect(screen.getAllByText('Lífsorka ekki reiknuð').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Reiknaðu raunverulegt tímakaup/).length).toBeGreaterThan(0);
  });

  it('should not show info alert when AWH is available', () => {
    render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={mockResults}
        actualHourlyWage={2500}
      />
    );

    expect(screen.queryByText('Lífsorka ekki reiknuð')).toBeFalsy();
  });

  it('should return null if no results', () => {
    const { container } = render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={null as any}
        actualHourlyWage={2500}
      />
    );

    expect(container.firstChild).toBeFalsy();
  });

  it('should use gradient background in header', () => {
    const { container } = render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={mockResults}
        actualHourlyWage={2500}
      />
    );

    const header = container.querySelector('.bg-gradient-to-r.from-primary-50.to-success-50');
    expect(header).toBeTruthy();
  });

  it('should use color-coded borders for tier cards', () => {
    const { container } = render(
      <ResultsSummarySection
        baseline={mockBaseline}
        results={mockResults}
        actualHourlyWage={2500}
      />
    );

    expect(container.querySelector('.border-amber-300')).toBeTruthy(); // Barebones
    expect(container.querySelector('.border-green-300')).toBeTruthy(); // Comfortable
    expect(container.querySelector('.border-purple-300')).toBeTruthy(); // Deluxe
  });
});
