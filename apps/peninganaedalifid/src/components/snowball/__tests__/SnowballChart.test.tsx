/**
 * Tests for SnowballChart Component
 */

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SnowballChart } from '../SnowballChart';
import type { SnowballResults } from '@/types/snowball';

// Mock recharts to avoid DOM measurement issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: ({ name }: any) => <div data-testid={`line-${name}`}>{name}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

describe('SnowballChart', () => {
  const mockResults: SnowballResults = {
    monthlySchedule: [
      {
        month: 1,
        baseOpeningBalance: 1000000,
        basePayment: 50000,
        baseInterest: 7500,
        basePrincipal: 42500,
        baseClosingBalance: 957500,
        snowballLoanOpeningBalance: 1000000,
        snowballLoanPayment: 50000,
        snowballLoanExtraFromSavings: 0,
        snowballLoanInterest: 7500,
        snowballLoanPrincipal: 42500,
        snowballLoanClosingBalance: 957500,
        snowballInvestOpeningBalance: 1000000,
        snowballInvestPayment: 50000,
        snowballInvestInterest: 7500,
        snowballInvestPrincipal: 42500,
        snowballInvestClosingBalance: 957500,
        snowballInvestmentBalance: 0,
        snowballInvestmentContribution: 0,
        interestSavingsThisMonth: 0,
        cumulativeInterestSavings: 0,
      },
      {
        month: 2,
        baseOpeningBalance: 957500,
        basePayment: 50000,
        baseInterest: 7181,
        basePrincipal: 42819,
        baseClosingBalance: 914681,
        snowballLoanOpeningBalance: 957500,
        snowballLoanPayment: 50319,
        snowballLoanExtraFromSavings: 319,
        snowballLoanInterest: 7181,
        snowballLoanPrincipal: 43138,
        snowballLoanClosingBalance: 914362,
        snowballInvestOpeningBalance: 957500,
        snowballInvestPayment: 50000,
        snowballInvestInterest: 7181,
        snowballInvestPrincipal: 42819,
        snowballInvestClosingBalance: 914681,
        snowballInvestmentBalance: 321,
        snowballInvestmentContribution: 319,
        interestSavingsThisMonth: 319,
        cumulativeInterestSavings: 319,
      },
    ],
    baseCase: {
      monthsToPayoff: 24,
      totalInterestPaid: 100000,
      totalPayments: 1100000,
      finalInvestmentBalance: 0,
      totalWealthCreated: 1000000,
      lifeEnergyHours: {
        totalInterest: 33.3,
        totalPayments: 366.7,
        investmentGains: 0,
        netBenefit: 333.3,
      },
    },
    snowballToLoan: {
      monthsToPayoff: 22,
      totalInterestPaid: 90000,
      totalPayments: 1090000,
      finalInvestmentBalance: 0,
      totalWealthCreated: 1000000,
      lifeEnergyHours: {
        totalInterest: 30,
        totalPayments: 363.3,
        investmentGains: 0,
        netBenefit: 333.3,
      },
    },
    snowballToInvestment: {
      monthsToPayoff: 24,
      totalInterestPaid: 100000,
      totalPayments: 1100000,
      finalInvestmentBalance: 15000,
      totalWealthCreated: 1015000,
      lifeEnergyHours: {
        totalInterest: 33.3,
        totalPayments: 366.7,
        investmentGains: 5,
        netBenefit: 338.3,
      },
    },
    recommendation: {
      bestScenario: 'snowballInvest',
      isCloseCall: false,
      reasoning: 'Test reasoning',
      lifeEnergyDifference: 5,
    },
  };

  it('renders debt balance comparison chart section', () => {
    render(<SnowballChart results={mockResults} />);

    expect(screen.getByText(/Samanburður á skuldum og fjárfestingum/i)).toBeInTheDocument();
    expect(screen.getByText(/Hvernig skuldirnar lækka og fjárfestingar vaxa/i)).toBeInTheDocument();
  });

  it('renders cumulative interest savings chart section', () => {
    render(<SnowballChart results={mockResults} />);

    expect(screen.getByText(/Uppsafnaður vaxtasparnaður yfir tíma/i)).toBeInTheDocument();
    expect(screen.getByText(/Hvernig snjóboltaáhrifin safnast upp/i)).toBeInTheDocument();
  });

  it('renders both charts with responsive containers', () => {
    render(<SnowballChart results={mockResults} />);

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers).toHaveLength(2); // One for debt chart, one for savings chart
  });

  it('displays final cumulative savings amount', () => {
    render(<SnowballChart results={mockResults} />);

    expect(screen.getByText(/Uppsafnaður sparnaður að lokum:/i)).toBeInTheDocument();
    expect(screen.getByText(/319 kr/i)).toBeInTheDocument(); // From last month
  });

  it('renders all four lines in debt balance chart', () => {
    render(<SnowballChart results={mockResults} />);

    expect(screen.getByTestId('line-Grunnur (aukagreiðsla eingöngu)')).toBeInTheDocument();
    expect(screen.getByTestId('line-Snjóbolti → Lán')).toBeInTheDocument();
    expect(screen.getByTestId('line-Snjóbolti → Fjárfesting (skuld)')).toBeInTheDocument();
    expect(screen.getByTestId('line-Fjárfesting staða')).toBeInTheDocument();
  });

  it('renders savings line in cumulative savings chart', () => {
    render(<SnowballChart results={mockResults} />);

    expect(screen.getByTestId('line-Uppsafnaður vaxtasparnaður')).toBeInTheDocument();
  });

  it('handles empty monthly schedule gracefully', () => {
    const emptyResults: SnowballResults = {
      ...mockResults,
      monthlySchedule: [],
    };

    render(<SnowballChart results={emptyResults} />);

    // Should still render the chart sections, just with no data
    expect(screen.getByText(/Samanburður á skuldum og fjárfestingum/i)).toBeInTheDocument();
  });
});
