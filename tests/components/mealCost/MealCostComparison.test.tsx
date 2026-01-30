import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MealCostComparison } from '@/components/mealCost/MealCostComparison';
import type { MealCostComparisonResults } from '@/types/calculator';

describe('MealCostComparison', () => {
  const mockComparisonHomeCheaper: MealCostComparisonResults = {
    eatingOutSummary: {
      weeklyCost: 15000,
      monthlyCost: 65000,
      yearlyCost: 780000,
      weeklyLifeEnergy: 5,
      monthlyLifeEnergy: 21.67,
      yearlyLifeEnergy: 260,
      breakdown: [],
    },
    homeCookingSummary: {
      weeklyCost: 8000,
      monthlyCost: 34640,
      yearlyCost: 416000,
      weeklyLifeEnergy: 2.67,
      monthlyLifeEnergy: 11.55,
      yearlyLifeEnergy: 138.67,
      breakdown: [],
    },
    monthlyDifference: 30360,
    yearlyDifference: 364320,
    lifeEnergyDifference: 10.12,
    percentageDifference: 46.7,
    futureValue10Years: 5300000,
    futureValue20Years: 15800000,
    futureValue30Years: 37200000,
    cheaperOption: 'homeCooking',
    recommendation: 'Heimaeldun sparar 30.360 kr á mánuði',
  };

  const mockComparisonEatingOutCheaper: MealCostComparisonResults = {
    ...mockComparisonHomeCheaper,
    monthlyDifference: -15000,
    yearlyDifference: -180000,
    lifeEnergyDifference: -5,
    percentageDifference: -23.1,
    cheaperOption: 'eatingOut',
    recommendation: 'Með þínu tímakaupi er ódýrara að borða úti',
  };

  const mockComparisonSimilar: MealCostComparisonResults = {
    ...mockComparisonHomeCheaper,
    monthlyDifference: 1200,
    yearlyDifference: 14400,
    lifeEnergyDifference: 0.4,
    percentageDifference: 3.5,
    cheaperOption: 'similar',
    recommendation: 'Kostnaður er svipaður, veldu eftir þægindaþáttum',
  };

  it('renders the comparison card with title', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Samanburður')).toBeInTheDocument();
    expect(screen.getByText('Mat úti vs heimaeldun')).toBeInTheDocument();
  });

  it('displays eating out costs correctly', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Mat úti')).toBeInTheDocument();
    expect(screen.getByText('65.000 kr')).toBeInTheDocument();
    expect(screen.getByText('780.000 kr')).toBeInTheDocument();
  });

  it('displays home cooking costs correctly', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Heimaeldun')).toBeInTheDocument();
    expect(screen.getByText('34.640 kr')).toBeInTheDocument();
    expect(screen.getByText('416.000 kr')).toBeInTheDocument();
  });

  it('highlights home cooking as cheaper option', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    const cheaperBadges = screen.getAllByText('ÓDÝRARA');
    expect(cheaperBadges).toHaveLength(1);
  });

  it('highlights eating out as cheaper option', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonEatingOutCheaper}
        actualHourlyWage={3000}
      />
    );

    const cheaperBadges = screen.getAllByText('ÓDÝRARA');
    expect(cheaperBadges).toHaveLength(1);
  });

  it('displays difference calculations', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Mismunur')).toBeInTheDocument();
    expect(screen.getByText('30.360 kr')).toBeInTheDocument();
    expect(screen.getByText('364.320 kr')).toBeInTheDocument();
    expect(screen.getByText('47%')).toBeInTheDocument();
  });

  it('displays life energy when wage is provided', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    expect(screen.getAllByText(/Lífsorka/)).toHaveLength(3); // Per option + difference
  });

  it('displays future value projections when not similar', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Framtíðarverðmæti sparnaðar')).toBeInTheDocument();
    expect(screen.getByText('Eftir 10 ár')).toBeInTheDocument();
    expect(screen.getByText('Eftir 20 ár')).toBeInTheDocument();
    expect(screen.getByText('Eftir 30 ár')).toBeInTheDocument();
    expect(screen.getByText('5.300.000 kr')).toBeInTheDocument();
    expect(screen.getByText('15.800.000 kr')).toBeInTheDocument();
    expect(screen.getByText('37.200.000 kr')).toBeInTheDocument();
  });

  it('hides future value projections when similar', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonSimilar}
        actualHourlyWage={3000}
      />
    );

    expect(
      screen.queryByText('Framtíðarverðmæti sparnaðar')
    ).not.toBeInTheDocument();
  });

  it('displays recommendation text', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    expect(
      screen.getByText('Heimaeldun sparar 30.360 kr á mánuði')
    ).toBeInTheDocument();
  });

  it('uses success alert variant for home cooking cheaper', () => {
    const { container } = render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-success-50');
  });

  it('uses warning alert variant for eating out cheaper', () => {
    const { container } = render(
      <MealCostComparison
        comparison={mockComparisonEatingOutCheaper}
        actualHourlyWage={3000}
      />
    );

    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-warning-50');
  });

  it('uses info alert variant for similar costs', () => {
    const { container } = render(
      <MealCostComparison
        comparison={mockComparisonSimilar}
        actualHourlyWage={3000}
      />
    );

    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-primary-50'); // info variant uses primary colors
  });

  it('hides life energy when wage is zero', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={0}
      />
    );

    expect(screen.queryByText(/Lífsorka/)).not.toBeInTheDocument();
  });

  it('handles negative differences correctly', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonEatingOutCheaper}
        actualHourlyWage={3000}
      />
    );

    // Should display absolute values
    expect(screen.getByText('15.000 kr')).toBeInTheDocument();
    expect(screen.getByText('180.000 kr')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
        className="custom-class"
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('displays monthly investment message in future value section', () => {
    render(
      <MealCostComparison
        comparison={mockComparisonHomeCheaper}
        actualHourlyWage={3000}
      />
    );

    expect(
      screen.getByText(/Ef þú fjárfestir 30.360 kr á mánuði/)
    ).toBeInTheDocument();
  });
});
