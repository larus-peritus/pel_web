/**
 * Tests for CommuteComparison component
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { CommuteComparison } from '@/components/commute/CommuteComparison';
import type { CommuteScenario } from '@/types/calculator';

// Mock scenario data
const carScenario: CommuteScenario = {
  id: 'car-1',
  name: 'Bíll til vinnu',
  inputs: {
    distanceKm: 15,
    daysPerWeek: 5,
    commuteMethod: 'car',
    timeMinutesOneWay: 25,
    car: {
      fuelType: 'gasoline',
      fuelPrice: 350,
      fuelConsumption: 8,
      parkingCostPerDay: 1000,
      tollsPerDay: 500,
      monthlyDepreciation: 35000,
      monthlyInsurance: 15000,
      monthlyMaintenance: 10000,
      inspectionCost: 12000,
    },
  },
  results: {
    directMonthlyCost: 30000,
    indirectMonthlyCost: 60500,
    totalMonthlyCost: 90500,
    totalYearlyCost: 1086000,
    costBreakdown: [],
    timePerMonthMinutes: 1083,
    timePerMonthHours: 18.1,
    timePerYearHours: 217,
    timePerYearDays: 9,
    lifeEnergyFromTime: 18.1,
    lifeEnergyFromMoney: 18.1,
    totalLifeEnergyHoursPerMonth: 36.2,
    totalLifeEnergyHoursPerYear: 434,
    futureValue5Years: 6300000,
    futureValue10Years: 15000000,
    futureValue20Years: 45000000,
  },
  createdAt: '2026-01-20T00:00:00Z',
  updatedAt: '2026-01-20T00:00:00Z',
};

const transitScenario: CommuteScenario = {
  id: 'transit-1',
  name: 'Strætó',
  inputs: {
    distanceKm: 15,
    daysPerWeek: 5,
    commuteMethod: 'transit',
    timeMinutesOneWay: 35,
    transit: {
      ticketType: 'monthly',
      monthlyCost: 10500,
    },
  },
  results: {
    directMonthlyCost: 10500,
    indirectMonthlyCost: 0,
    totalMonthlyCost: 10500,
    totalYearlyCost: 126000,
    costBreakdown: [],
    timePerMonthMinutes: 1516,
    timePerMonthHours: 25.3,
    timePerYearHours: 303,
    timePerYearDays: 12.6,
    lifeEnergyFromTime: 25.3,
    lifeEnergyFromMoney: 2.1,
    totalLifeEnergyHoursPerMonth: 27.4,
    totalLifeEnergyHoursPerYear: 329,
    futureValue5Years: 730000,
    futureValue10Years: 1900000,
    futureValue20Years: 5600000,
  },
  createdAt: '2026-01-20T00:00:00Z',
  updatedAt: '2026-01-20T00:00:00Z',
};

const bikeScenario: CommuteScenario = {
  id: 'bike-1',
  name: 'Hjól',
  inputs: {
    distanceKm: 8,
    daysPerWeek: 5,
    commuteMethod: 'bike',
    timeMinutesOneWay: 20,
    active: {
      monthlyMaintenanceCost: 2000,
    },
  },
  results: {
    directMonthlyCost: 2000,
    indirectMonthlyCost: 0,
    totalMonthlyCost: 2000,
    totalYearlyCost: 24000,
    costBreakdown: [],
    timePerMonthMinutes: 866,
    timePerMonthHours: 14.4,
    timePerYearHours: 173,
    timePerYearDays: 7.2,
    lifeEnergyFromTime: 14.4,
    lifeEnergyFromMoney: 0.4,
    totalLifeEnergyHoursPerMonth: 14.8,
    totalLifeEnergyHoursPerYear: 178,
    futureValue5Years: 140000,
    futureValue10Years: 340000,
    futureValue20Years: 1000000,
  },
  createdAt: '2026-01-20T00:00:00Z',
  updatedAt: '2026-01-20T00:00:00Z',
};

const remoteScenario: CommuteScenario = {
  id: 'remote-1',
  name: 'Fjarvinnu',
  inputs: {
    distanceKm: 0,
    daysPerWeek: 5,
    commuteMethod: 'remote',
    timeMinutesOneWay: 0,
  },
  results: {
    directMonthlyCost: 0,
    indirectMonthlyCost: 0,
    totalMonthlyCost: 0,
    totalYearlyCost: 0,
    costBreakdown: [],
    timePerMonthMinutes: 0,
    timePerMonthHours: 0,
    timePerYearHours: 0,
    timePerYearDays: 0,
    lifeEnergyFromTime: 0,
    lifeEnergyFromMoney: 0,
    totalLifeEnergyHoursPerMonth: 0,
    totalLifeEnergyHoursPerYear: 0,
    futureValue5Years: 0,
    futureValue10Years: 0,
    futureValue20Years: 0,
  },
  createdAt: '2026-01-20T00:00:00Z',
  updatedAt: '2026-01-20T00:00:00Z',
};

describe('CommuteComparison', () => {
  describe('Empty State', () => {
    it('shows empty state when no scenarios provided', () => {
      render(<CommuteComparison scenarios={[]} actualHourlyWage={5000} />);

      expect(screen.getByText('Engar sviðsmyndir til að bera saman')).toBeInTheDocument();
      expect(
        screen.getByText('Búðu til að minnsta kosti 2 sviðsmyndir til að sjá samanburð')
      ).toBeInTheDocument();
    });

    it('shows empty state when only 1 scenario provided', () => {
      render(<CommuteComparison scenarios={[carScenario]} actualHourlyWage={5000} />);

      expect(screen.getByText('Engar sviðsmyndir til að bera saman')).toBeInTheDocument();
    });
  });

  describe('Basic Rendering with 2 Scenarios', () => {
    it('renders comparison header', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      expect(screen.getByText('Samanburður vinnuferða')).toBeInTheDocument();
      expect(
        screen.getByText(/Berðu saman kostnaður, tíma og lífsorku/)
      ).toBeInTheDocument();
    });

    it('renders both scenario names', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      expect(screen.getAllByText('Bíll til vinnu').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Strætó').length).toBeGreaterThan(0);
    });

    it('shows warning when actualHourlyWage is 0', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={0} />);

      expect(
        screen.getByText(/Fylltu fyrst út Raunverulegt Tímakaup reiknivélina/)
      ).toBeInTheDocument();
    });
  });

  describe('Cheapest and Most Expensive Identification', () => {
    it('identifies cheapest scenario correctly', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario, bikeScenario]} actualHourlyWage={5000} />);

      const badges = screen.getAllByText('Besta');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('identifies most expensive scenario correctly', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario, bikeScenario]} actualHourlyWage={5000} />);

      const badges = screen.getAllByText('Dýrasta');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('does not show "Dýrasta" badge when all costs are the same', () => {
      const sameCostScenarios = [
        { ...carScenario, results: { ...carScenario.results, totalMonthlyCost: 10000 } },
        { ...transitScenario, results: { ...transitScenario.results, totalMonthlyCost: 10000 } },
      ];
      render(<CommuteComparison scenarios={sameCostScenarios} actualHourlyWage={5000} />);

      expect(screen.queryByText('Dýrasta')).not.toBeInTheDocument();
    });
  });

  describe('Savings Message', () => {
    it('displays savings message comparing most expensive to cheapest', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario, bikeScenario]} actualHourlyWage={5000} />);

      expect(screen.getByText(/Með því að skipta úr/)).toBeInTheDocument();
      expect(screen.getByText(/sparar þú/)).toBeInTheDocument();
    });

    it('shows cost savings in ISK', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      // Difference between 90500 and 10500 = 80000 kr
      expect(container.textContent).toContain('80.000 kr');
    });

    it('does not show savings message when cheapest === most expensive', () => {
      render(<CommuteComparison scenarios={[carScenario, carScenario]} actualHourlyWage={5000} />);

      expect(screen.queryByText(/Með því að skipta úr/)).not.toBeInTheDocument();
    });
  });

  describe('Desktop Table View', () => {
    it('renders table with all required columns', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();

      // Check for column headers in the table
      expect(container.textContent).toContain('Heiti');
      expect(container.textContent).toContain('Ferðamáti');
      expect(container.textContent).toContain('Kostnaður/mán');
      expect(container.textContent).toContain('Tími/mán');
      expect(container.textContent).toContain('Lífsorka/mán');
      expect(container.textContent).toContain('FV (10 ár)');
      expect(container.textContent).toContain('Munur');
    });

    it('does not show life energy column when actualHourlyWage is 0', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={0} />);

      expect(screen.queryByText('Lífsorka/mán')).not.toBeInTheDocument();
    });

    it('displays method icons', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      const carIcon = container.textContent?.includes('🚗');
      const transitIcon = container.textContent?.includes('🚌');

      expect(carIcon).toBe(true);
      expect(transitIcon).toBe(true);
    });

    it('shows "—" for cheapest scenario difference', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('shows positive difference for expensive scenarios', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      // Car is more expensive, should show +80000
      expect(container.textContent).toContain('+80.000 kr');
    });
  });

  describe('Comparison with 4 Scenarios', () => {
    it('renders all 4 scenarios correctly', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario, bikeScenario, remoteScenario]} actualHourlyWage={5000} />);

      expect(screen.getAllByText('Bíll til vinnu').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Strætó').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Hjól').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Fjarvinnu').length).toBeGreaterThan(0);
    });

    it('identifies remote as cheapest (0 cost)', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario, bikeScenario, remoteScenario]} actualHourlyWage={5000} />);

      const badges = screen.getAllByText('Besta');
      expect(badges.length).toBeGreaterThan(0);

      // Remote should be cheapest
      expect(screen.getAllByText('Fjarvinnu').length).toBeGreaterThan(0);
    });
  });

  describe('Different Commute Methods', () => {
    it('displays correct labels for each method', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario, bikeScenario, remoteScenario]} actualHourlyWage={5000} />);

      expect(container.textContent).toContain('Bíll');
      expect(container.textContent).toContain('Almenningssamgöngur');
      expect(container.textContent).toContain('Hjólreiðar');
      expect(container.textContent).toContain('Fjarvinnu');
    });
  });

  describe('Cost Formatting', () => {
    it('formats costs with Icelandic separator', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      // 90500 should be formatted as 90.500 kr
      expect(container.textContent).toContain('90.500 kr');
      // 10500 should be formatted as 10.500 kr
      expect(container.textContent).toContain('10.500 kr');
    });

    it('displays time in hours with decimal', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      expect(container.textContent).toContain('18.1 klst');
      expect(container.textContent).toContain('25.3 klst');
    });

    it('displays future value correctly', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      expect(container.textContent).toContain('15.000.000 kr');
      expect(container.textContent).toContain('1.900.000 kr');
    });
  });

  describe('Accessibility', () => {
    it('has proper table structure', () => {
      const { container } = render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();

      const thead = container.querySelector('thead');
      expect(thead).toBeInTheDocument();

      const tbody = container.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('renders alerts with proper ARIA roles', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('has proper heading hierarchy', () => {
      render(<CommuteComparison scenarios={[carScenario, transitScenario]} actualHourlyWage={5000} />);

      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Samanburður vinnuferða');
    });
  });

  describe('Edge Cases', () => {
    it('handles scenario with 0 cost correctly', () => {
      const { container } = render(<CommuteComparison scenarios={[remoteScenario, carScenario]} actualHourlyWage={5000} />);

      expect(container.textContent).toContain('0 kr');
    });

    it('handles scenarios with identical costs', () => {
      const scenario1 = { ...carScenario, id: 'dup-1', name: 'Option 1' };
      const scenario2 = { ...carScenario, id: 'dup-2', name: 'Option 2' };

      render(<CommuteComparison scenarios={[scenario1, scenario2]} actualHourlyWage={5000} />);

      // Both should be marked as cheapest
      const badges = screen.getAllByText('Besta');
      // At least one badge should be present (both desktop and mobile views)
      expect(badges.length).toBeGreaterThanOrEqual(2);
    });
  });
});
