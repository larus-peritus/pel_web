import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MealCostBreakdown } from '@/components/mealCost/MealCostBreakdown';
import type { MealCostSummary } from '@/types/calculator';

describe('MealCostBreakdown', () => {
  const mockEatingOutSummary: MealCostSummary = {
    weeklyCost: 15000,
    monthlyCost: 65000,
    yearlyCost: 780000,
    weeklyLifeEnergy: 5,
    monthlyLifeEnergy: 21.67,
    yearlyLifeEnergy: 260,
    breakdown: [
      {
        category: 'lunch',
        label: 'Hádegisverður',
        weeklyCost: 7000,
        monthlyCost: 30310,
        yearlyCost: 364000,
        lifeEnergyHours: 10.1,
        percentage: 46.6,
      },
      {
        category: 'dinner',
        label: 'Kvöldverður',
        weeklyCost: 5000,
        monthlyCost: 21650,
        yearlyCost: 260000,
        lifeEnergyHours: 7.22,
        percentage: 33.3,
      },
      {
        category: 'coffee',
        label: 'Kaffi/drykkir',
        weeklyCost: 3000,
        monthlyCost: 12990,
        yearlyCost: 156000,
        lifeEnergyHours: 4.33,
        percentage: 20.0,
      },
    ],
  };

  const mockHomeCookingSummary: MealCostSummary = {
    weeklyCost: 8000,
    monthlyCost: 34640,
    yearlyCost: 416000,
    weeklyLifeEnergy: 2.67,
    monthlyLifeEnergy: 11.55,
    yearlyLifeEnergy: 138.67,
    breakdown: [
      {
        category: 'groceries',
        label: 'Matvörukaup',
        weeklyCost: 5000,
        monthlyCost: 21650,
        yearlyCost: 260000,
        lifeEnergyHours: 7.22,
        percentage: 62.5,
      },
      {
        category: 'cookingTime',
        label: 'Tími í eldhúsi',
        weeklyCost: 2000,
        monthlyCost: 8660,
        yearlyCost: 104000,
        lifeEnergyHours: 2.89,
        percentage: 25.0,
      },
      {
        category: 'shoppingTime',
        label: 'Tími í innkaupum',
        weeklyCost: 1000,
        monthlyCost: 4330,
        yearlyCost: 52000,
        lifeEnergyHours: 1.44,
        percentage: 12.5,
      },
    ],
  };

  it('renders eating out breakdown with correct title', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Mat úti - Sundurliðun')).toBeInTheDocument();
  });

  it('renders home cooking breakdown with correct title', () => {
    render(
      <MealCostBreakdown
        summary={mockHomeCookingSummary}
        type="homeCooking"
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Heimaeldun - Sundurliðun')).toBeInTheDocument();
  });

  it('displays all breakdown categories', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Hádegisverður')).toBeInTheDocument();
    expect(screen.getByText('Kvöldverður')).toBeInTheDocument();
    expect(screen.getByText('Kaffi/drykkir')).toBeInTheDocument();
  });

  it('displays amounts in ISK format', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('30.310 kr')).toBeInTheDocument();
    expect(screen.getByText('21.650 kr')).toBeInTheDocument();
    expect(screen.getByText('12.990 kr')).toBeInTheDocument();
  });

  it('displays life energy when wage is provided', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    // Should display life energy hours for each category
    const lifeEnergyElements = screen.getAllByText(/klst/);
    expect(lifeEnergyElements.length).toBeGreaterThan(0);
  });

  it('displays dash for life energy when wage is zero', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={0}
      />
    );

    const dashElements = screen.getAllByText('—');
    expect(dashElements.length).toBeGreaterThan(0);
  });

  it('displays percentages correctly', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('47%')).toBeInTheDocument();
    expect(screen.getByText('33%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('displays total row correctly', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Samtals')).toBeInTheDocument();
    expect(screen.getByText('65.000 kr')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('shows special note for home cooking about time costs', () => {
    render(
      <MealCostBreakdown
        summary={mockHomeCookingSummary}
        type="homeCooking"
        actualHourlyWage={3000}
      />
    );

    expect(
      screen.getByText(/Heimaeldunar kostnaður inniheldur bæði/)
    ).toBeInTheDocument();
  });

  it('does not show special note for eating out', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    expect(
      screen.queryByText(/Heimaeldunar kostnaður inniheldur bæði/)
    ).not.toBeInTheDocument();
  });

  it('renders null when no breakdown items', () => {
    const emptySummary: MealCostSummary = {
      ...mockEatingOutSummary,
      breakdown: [],
    };

    const { container } = render(
      <MealCostBreakdown
        summary={emptySummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('filters out zero-cost items', () => {
    const summaryWithZero: MealCostSummary = {
      ...mockEatingOutSummary,
      breakdown: [
        ...mockEatingOutSummary.breakdown,
        {
          category: 'breakfast',
          label: 'Morgunverður',
          weeklyCost: 0,
          monthlyCost: 0,
          yearlyCost: 0,
          lifeEnergyHours: 0,
          percentage: 0,
        },
      ],
    };

    render(
      <MealCostBreakdown
        summary={summaryWithZero}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    expect(screen.queryByText('Morgunverður')).not.toBeInTheDocument();
  });

  it('toggles visibility on mobile when collapse button clicked', () => {
    render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /Fela sundurliðun/i,
    });

    // Initially expanded
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Click to collapse
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Sýna sundurliðun/i }));

    // Click to expand again
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
        className="custom-class"
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('displays color indicators for categories', () => {
    const { container } = render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    const colorDots = container.querySelectorAll('.w-3.h-3.rounded-full');
    expect(colorDots.length).toBe(mockEatingOutSummary.breakdown.length);
  });

  it('displays mobile and desktop layouts appropriately', () => {
    const { container } = render(
      <MealCostBreakdown
        summary={mockEatingOutSummary}
        type="eatingOut"
        actualHourlyWage={3000}
      />
    );

    // Check for mobile labels (text-sm md:hidden)
    const mobileLabels = container.querySelectorAll('.md\\:hidden');
    expect(mobileLabels.length).toBeGreaterThan(0);

    // Check for desktop table headers (hidden md:grid)
    const desktopHeaders = container.querySelectorAll('.hidden.md\\:grid');
    expect(desktopHeaders.length).toBeGreaterThan(0);
  });
});
