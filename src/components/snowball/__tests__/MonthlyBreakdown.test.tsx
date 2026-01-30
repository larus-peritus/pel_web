/**
 * Tests for MonthlyBreakdown Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MonthlyBreakdown } from '../MonthlyBreakdown';
import type { SnowballResults } from '@/types/snowball';

describe('MonthlyBreakdown', () => {
  const mockResults: SnowballResults = {
    monthlySchedule: Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      baseOpeningBalance: 1000000 - (i * 40000),
      basePayment: 50000,
      baseInterest: 7500 - (i * 300),
      basePrincipal: 42500 + (i * 300),
      baseClosingBalance: 960000 - (i * 40000),
      snowballLoanOpeningBalance: 1000000 - (i * 42000),
      snowballLoanPayment: 50000 + (i * 100),
      snowballLoanExtraFromSavings: i * 100,
      snowballLoanInterest: 7500 - (i * 315),
      snowballLoanPrincipal: 42500 + (i * 315),
      snowballLoanClosingBalance: 958000 - (i * 42000),
      snowballInvestOpeningBalance: 1000000 - (i * 40000),
      snowballInvestPayment: 50000,
      snowballInvestInterest: 7500 - (i * 300),
      snowballInvestPrincipal: 42500 + (i * 300),
      snowballInvestClosingBalance: 960000 - (i * 40000),
      snowballInvestmentBalance: i * 350,
      snowballInvestmentContribution: i > 0 ? 300 : 0,
      interestSavingsThisMonth: i > 0 ? 300 : 0,
      cumulativeInterestSavings: i * 300,
    })),
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

  it('renders component header with toggle button', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    expect(screen.getByText(/Mánaðarleg sundurliðun/i)).toBeInTheDocument();
    expect(screen.getByText(/Nákvæmar upplýsingar um hverja greiðslu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sýna/i })).toBeInTheDocument();
  });

  it('expands and collapses when toggle button is clicked', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    const toggleButton = screen.getByRole('button', { name: /Sýna/i });

    // Initially collapsed
    expect(screen.queryByLabelText(/Veldu atburðarás/i)).not.toBeInTheDocument();

    // Expand
    fireEvent.click(toggleButton);
    expect(screen.getByLabelText(/Veldu atburðarás/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fela/i })).toBeInTheDocument();

    // Collapse
    fireEvent.click(screen.getByRole('button', { name: /Fela/i }));
    expect(screen.queryByLabelText(/Veldu atburðarás/i)).not.toBeInTheDocument();
  });

  it('displays scenario selector with all options', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    const select = screen.getByLabelText(/Veldu atburðarás/i);
    expect(select).toBeInTheDocument();

    // Check that all options are present
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent(/Grunnur/i);
    expect(options[1]).toHaveTextContent(/Snjóbolti → Lán/i);
    expect(options[2]).toHaveTextContent(/Snjóbolti → Fjárfesting/i);
  });

  it('displays summary row with totals', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    expect(screen.getByText(/Heildargreiðslur/i)).toBeInTheDocument();
    expect(screen.getByText(/Vextir samtals/i)).toBeInTheDocument();
    expect(screen.getByText(/Vaxtasparnaður/i)).toBeInTheDocument();

    // "Höfuðstóll" appears in both summary and table headers
    const hofudstollElements = screen.getAllByText(/Höfuðstóll/i);
    expect(hofudstollElements.length).toBeGreaterThan(0);
  });

  it('displays first 12 months by default', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    const rows = screen.getAllByRole('row');
    // 1 header row + 12 data rows
    expect(rows).toHaveLength(13);
  });

  it('shows all months when "Show All" is clicked', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    const showAllButton = screen.getByRole('button', { name: /Sýna alla 24 mánuði/i });
    fireEvent.click(showAllButton);

    const rows = screen.getAllByRole('row');
    // 1 header row + 24 data rows
    expect(rows).toHaveLength(25);

    // Button should now say "Show first 12"
    expect(screen.getByRole('button', { name: /Sýna fyrstu 12 mánuði/i })).toBeInTheDocument();
  });

  it('displays base scenario data correctly', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    // Check table headers for base scenario - use getAllByRole to check headers exist
    const tableHeaders = screen.getAllByRole('columnheader');
    const headerTexts = tableHeaders.map(h => h.textContent || '');

    expect(headerTexts).toContain('Mán.');
    expect(headerTexts).toContain('Opnunarstaða');
    expect(headerTexts).toContain('Greiðsla');
    expect(headerTexts).toContain('Vextir');
    expect(headerTexts).toContain('Höfuðstóll');
    expect(headerTexts).toContain('Lokastaða');

    // Base scenario should NOT show savings column in table headers (only in summary)
    const hasSparnaðurHeader = headerTexts.includes('Sparnaður');
    expect(hasSparnaðurHeader).toBe(false);
  });

  it('displays snowball to loan scenario with extra columns', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    // Change to snowball loan scenario
    const select = screen.getByLabelText(/Veldu atburðarás/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'snowballLoan' } });

    // Should show extra from savings column in table header
    expect(screen.getByText(/Auka frá sparnaði/i)).toBeInTheDocument();

    // Check for savings column - should appear in both summary and table
    const savingsElements = screen.getAllByText(/Sparnaður/i);
    expect(savingsElements.length).toBeGreaterThan(0);
  });

  it('displays snowball to investment scenario with investment balance', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    // Change to snowball invest scenario
    const select = screen.getByLabelText(/Veldu atburðarás/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'snowballInvest' } });

    // Should show investment column - checking for multiple occurrences
    const savingsElements = screen.getAllByText(/Sparnaður/i);
    expect(savingsElements.length).toBeGreaterThan(0);

    // Check for investment column in table headers
    const tableHeaders = screen.getAllByRole('columnheader');
    const hasFjárfesting = tableHeaders.some(header => header.textContent?.includes('Fjárfesting'));
    expect(hasFjárfesting).toBe(true);
  });

  it('displays life energy totals when wage is provided', () => {
    const wage = 3000;
    render(<MonthlyBreakdown results={mockResults} actualHourlyWage={wage} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    expect(screen.getByText(/Lífsorka \(vextir\)/i)).toBeInTheDocument();
    expect(screen.getByText(/klst/i)).toBeInTheDocument();
  });

  it('does not display life energy totals when wage is not provided', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    expect(screen.queryByText(/Lífsorka \(vextir\)/i)).not.toBeInTheDocument();
  });

  it('displays legend explaining colors', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    expect(screen.getByText(/Vextir \(greiðslur til banka\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Höfuðstóll \(lækkar skuldina\)/i)).toBeInTheDocument();
  });

  it('returns null when no monthly schedule', () => {
    const emptyResults: SnowballResults = {
      ...mockResults,
      monthlySchedule: [],
    };

    const { container } = render(<MonthlyBreakdown results={emptyResults} />);
    expect(container.firstChild).toBeNull();
  });

  it('formats currency values with Icelandic formatting', () => {
    render(<MonthlyBreakdown results={mockResults} />);

    fireEvent.click(screen.getByRole('button', { name: /Sýna/i }));

    // Check for period separators in large numbers (Icelandic format)
    const cells = screen.getAllByRole('cell');
    const hasIcelandicFormat = cells.some(cell =>
      cell.textContent?.includes('.') && cell.textContent?.includes(' kr')
    );
    expect(hasIcelandicFormat).toBe(true);
  });
});
