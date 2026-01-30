import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScenarioSummary } from '@/components/snowball/ScenarioSummary';
import type { SnowballResults } from '@/types/snowball';

const mockResults: SnowballResults = {
  monthlySchedule: [],
  baseCase: {
    monthsToPayoff: 60,
    totalInterestPaid: 500_000,
    totalPayments: 2_500_000,
    finalInvestmentBalance: 0,
    totalWealthCreated: 2_000_000,
    lifeEnergyHours: {
      totalInterest: 100,
      totalPayments: 500,
      investmentGains: 0,
      netBenefit: 400,
    },
  },
  snowballToLoan: {
    monthsToPayoff: 55,
    totalInterestPaid: 450_000,
    totalPayments: 2_450_000,
    finalInvestmentBalance: 0,
    totalWealthCreated: 2_000_000,
    lifeEnergyHours: {
      totalInterest: 90,
      totalPayments: 490,
      investmentGains: 0,
      netBenefit: 410,
    },
  },
  snowballToInvestment: {
    monthsToPayoff: 60,
    totalInterestPaid: 500_000,
    totalPayments: 2_500_000,
    finalInvestmentBalance: 150_000,
    totalWealthCreated: 2_150_000,
    lifeEnergyHours: {
      totalInterest: 100,
      totalPayments: 500,
      investmentGains: 30,
      netBenefit: 430,
    },
  },
  recommendation: {
    bestScenario: 'snowballInvest',
    isCloseCall: false,
    reasoning: 'Test reasoning',
    lifeEnergyDifference: 30,
  },
};

describe('ScenarioSummary', () => {
  it('renders all three scenario cards', () => {
    render(<ScenarioSummary results={mockResults} />);

    expect(screen.getByText('Grunnur')).toBeInTheDocument();
    expect(screen.getByText('Snjóbolti → Lán')).toBeInTheDocument();
    expect(screen.getByText('Snjóbolti → Fjárfesting')).toBeInTheDocument();
  });

  it('displays correct months to payoff for each scenario', () => {
    render(<ScenarioSummary results={mockResults} />);

    // Base case: 60 months
    const baseCaseMonths = screen.getAllByText(/60 mán/);
    expect(baseCaseMonths.length).toBeGreaterThan(0);

    // Snowball to loan: 55 months
    expect(screen.getByText(/55 mán/)).toBeInTheDocument();
  });

  it('displays total interest paid with Icelandic formatting', () => {
    render(<ScenarioSummary results={mockResults} />);

    // Check for Icelandic number formatting (period separator)
    // Use exact match to avoid matching larger numbers
    const fiveHundredThousand = screen.getAllByText('500.000 kr');
    expect(fiveHundredThousand.length).toBeGreaterThan(0);

    // 450.000 kr appears in the snowball to loan card
    const fourFiftyThousand = screen.getAllByText('450.000 kr');
    expect(fourFiftyThousand.length).toBeGreaterThan(0);
  });

  it('displays investment balance only for snowball-to-investment scenario', () => {
    render(<ScenarioSummary results={mockResults} />);

    // Should appear once (only in snowball-to-investment card)
    expect(screen.getByText('Fjárfestingarvirði')).toBeInTheDocument();
  });

  it('displays total wealth created for all scenarios', () => {
    render(<ScenarioSummary results={mockResults} />);

    // All three cards should show "Heildarauður skapaður"
    const wealthLabels = screen.getAllByText('Heildarauður skapaður');
    expect(wealthLabels).toHaveLength(3);
  });

  it('displays life energy savings in hours with klst suffix', () => {
    render(<ScenarioSummary results={mockResults} />);

    // Should show life energy for all scenarios that have it
    const lifeEnergyLabels = screen.getAllByText('Lífsorka (sparnaður)');
    expect(lifeEnergyLabels.length).toBeGreaterThan(0);

    // Check for "klst" suffix
    expect(screen.getByText(/400 klst/)).toBeInTheDocument();
  });

  it('applies correct border colors to scenario cards', () => {
    const { container } = render(<ScenarioSummary results={mockResults} />);

    const cards = container.querySelectorAll('[class*="border-"]');
    expect(cards.length).toBeGreaterThan(0);

    // Check that cards have border classes
    const cardElements = container.querySelectorAll('.border-2');
    expect(cardElements).toHaveLength(3);
  });

  it('displays scenario subtitles', () => {
    render(<ScenarioSummary results={mockResults} />);

    expect(screen.getByText('Aukagreiðsla eingöngu')).toBeInTheDocument();
    expect(screen.getByText('Vaxtasparnaður á lán')).toBeInTheDocument();
    expect(screen.getByText('Vaxtasparnaður fjárfestur')).toBeInTheDocument();
  });

  it('handles zero life energy gracefully', () => {
    const resultsWithoutWage: SnowballResults = {
      ...mockResults,
      baseCase: {
        ...mockResults.baseCase,
        lifeEnergyHours: {
          totalInterest: 0,
          totalPayments: 0,
          investmentGains: 0,
          netBenefit: 0,
        },
      },
      snowballToLoan: {
        ...mockResults.snowballToLoan,
        lifeEnergyHours: {
          totalInterest: 0,
          totalPayments: 0,
          investmentGains: 0,
          netBenefit: 0,
        },
      },
      snowballToInvestment: {
        ...mockResults.snowballToInvestment,
        lifeEnergyHours: {
          totalInterest: 0,
          totalPayments: 0,
          investmentGains: 0,
          netBenefit: 0,
        },
      },
    };

    render(<ScenarioSummary results={resultsWithoutWage} />);

    // Should not display life energy if it's zero
    expect(screen.queryByText('Lífsorka (sparnaður)')).not.toBeInTheDocument();
  });

  it('uses responsive grid layout', () => {
    const { container } = render(<ScenarioSummary results={mockResults} />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-3');
  });
});
