/**
 * Tests for CommuteSummary component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommuteSummary } from '@/components/commute/CommuteSummary';
import type { CommuteScenario } from '@/types/calculator';

// Mock scenario data
const mockCarScenario: CommuteScenario = {
  id: 'test-1',
  name: 'Vinna í Kópavogi',
  inputs: {
    distanceKm: 10,
    daysPerWeek: 5,
    commuteMethod: 'car',
    timeMinutesOneWay: 20,
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
    directMonthlyCost: 25000,
    indirectMonthlyCost: 60500,
    totalMonthlyCost: 85500,
    totalYearlyCost: 1026000,
    costBreakdown: [
      { category: 'fuel', label: 'Bensín', monthlyCost: 12000, percentage: 14 },
      { category: 'parking', label: 'Stæði', monthlyCost: 21650, percentage: 25.3 },
      { category: 'depreciation', label: 'Afskriftir', monthlyCost: 35000, percentage: 40.9 },
      { category: 'insurance', label: 'Tryggingar', monthlyCost: 15000, percentage: 17.5 },
    ],
    timePerMonthMinutes: 866,
    timePerMonthHours: 14.4,
    timePerYearHours: 173,
    timePerYearDays: 7.2,
    lifeEnergyFromTime: 14.4,
    lifeEnergyFromMoney: 17.1,
    totalLifeEnergyHoursPerMonth: 31.5,
    totalLifeEnergyHoursPerYear: 378,
    futureValue5Years: 6000000,
    futureValue10Years: 14000000,
    futureValue20Years: 42000000,
  },
  createdAt: '2026-01-20T00:00:00Z',
  updatedAt: '2026-01-20T00:00:00Z',
};

const mockTransitScenario: CommuteScenario = {
  id: 'test-2',
  name: 'Strætó',
  inputs: {
    distanceKm: 10,
    daysPerWeek: 5,
    commuteMethod: 'transit',
    timeMinutesOneWay: 30,
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
    timePerMonthMinutes: 1299,
    timePerMonthHours: 21.7,
    timePerYearHours: 260,
    timePerYearDays: 10.8,
    lifeEnergyFromTime: 21.7,
    lifeEnergyFromMoney: 2.1,
    totalLifeEnergyHoursPerMonth: 23.8,
    totalLifeEnergyHoursPerYear: 286,
    futureValue5Years: 700000,
    futureValue10Years: 1800000,
    futureValue20Years: 5400000,
  },
  createdAt: '2026-01-20T00:00:00Z',
  updatedAt: '2026-01-20T00:00:00Z',
};

describe('CommuteSummary', () => {
  describe('Basic Rendering', () => {
    it('renders scenario name and basic info', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Vinna í Kópavogi')).toBeInTheDocument();
      expect(screen.getByText(/10 km • 5 dagar\/viku • 20 mín/)).toBeInTheDocument();
    });

    it('renders all cost section headings', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Kostnaður')).toBeInTheDocument();
      expect(screen.getByText('Tími í vinnuferð')).toBeInTheDocument();
      expect(screen.getByText('Lífsorka kostnaður')).toBeInTheDocument();
      expect(screen.getByText(/Áhrif á fjárhagslegt frelsi/)).toBeInTheDocument();
    });
  });

  describe('Cost Display', () => {
    it('displays direct monthly cost', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Beinn kostnaður')).toBeInTheDocument();
      expect(screen.getByText('25.000 kr')).toBeInTheDocument();
    });

    it('displays indirect cost for cars', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Óbeinn kostnaður')).toBeInTheDocument();
      expect(screen.getByText('60.500 kr')).toBeInTheDocument();
    });

    it('does not display indirect cost for transit', () => {
      render(<CommuteSummary scenario={mockTransitScenario} actualHourlyWage={5000} />);

      expect(screen.queryByText('Óbeinn kostnaður')).not.toBeInTheDocument();
    });

    it('displays total monthly and yearly costs', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('85.500 kr')).toBeInTheDocument();
      expect(screen.getByText('1.026.000 kr')).toBeInTheDocument();
    });

    it('displays cost breakdown for cars', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Sundurliðun kostnaðar:')).toBeInTheDocument();
      expect(screen.getByText('Bensín')).toBeInTheDocument();
      expect(screen.getByText('Stæði')).toBeInTheDocument();
      expect(screen.getByText('Afskriftir')).toBeInTheDocument();
      expect(screen.getByText('Tryggingar')).toBeInTheDocument();
    });

    it('shows car cost warning message', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(
        screen.getByText(/Raunverulegur bílakostnaður inniheldur óbeinan kostnað/)
      ).toBeInTheDocument();
    });
  });

  describe('Time Display', () => {
    it('displays time per month in hours and minutes', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Tími í vinnuferð')).toBeInTheDocument();
      expect(screen.getByText('14.4 klst')).toBeInTheDocument();
      expect(screen.getByText('866 mínútur')).toBeInTheDocument();
    });

    it('displays time per year in hours and days', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('173 klst')).toBeInTheDocument();
      expect(screen.getByText('7.2 dagar')).toBeInTheDocument();
    });
  });

  describe('Life Energy Display', () => {
    it('shows life energy section when actualHourlyWage > 0', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Lífsorka kostnaður')).toBeInTheDocument();
      expect(screen.getByText(/Tími \(lífsorka frá ferðalögum\)/)).toBeInTheDocument();
      expect(screen.getByText(/Peningar \(lífsorka til að greiða kostnað\)/)).toBeInTheDocument();
      expect(screen.getByText('Heildar lífsorka kostnaður')).toBeInTheDocument();
    });

    it('does not show life energy when actualHourlyWage is 0', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={0} />);

      expect(screen.queryByText('Lífsorka kostnaður')).not.toBeInTheDocument();
    });

    it('shows warning when actualHourlyWage is 0', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={0} />);

      expect(
        screen.getByText(/Fylltu fyrst út Raunverulegt Tímakaup reiknivélina/)
      ).toBeInTheDocument();
    });

    it('shows impactful message when life energy > 40 hours', () => {
      // Create scenario with high life energy (> 40 hours)
      const highLifeEnergyScenario = {
        ...mockCarScenario,
        results: {
          ...mockCarScenario.results,
          totalLifeEnergyHoursPerMonth: 50, // Above 40
        },
      };
      render(<CommuteSummary scenario={highLifeEnergyScenario} actualHourlyWage={5000} />);

      expect(
        screen.getByText(/Vinnuferðir þínar kosta þig meira en vinnuviku/)
      ).toBeInTheDocument();
    });

    it('does not show impactful message when life energy < 40 hours', () => {
      render(<CommuteSummary scenario={mockTransitScenario} actualHourlyWage={5000} />);

      expect(screen.queryByText(/Vinnuferðir þínar kosta þig meira en vinnuviku/)).not.toBeInTheDocument();
    });
  });

  describe('FI Impact Display', () => {
    it('displays future value for 5, 10, and 20 years', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Eftir 5 ár')).toBeInTheDocument();
      expect(screen.getByText('6.000.000 kr')).toBeInTheDocument();

      expect(screen.getByText('Eftir 10 ár')).toBeInTheDocument();
      expect(screen.getByText('14.000.000 kr')).toBeInTheDocument();

      expect(screen.getByText('Eftir 20 ár')).toBeInTheDocument();
      expect(screen.getByText('42.000.000 kr')).toBeInTheDocument();
    });

    it('shows FI impact message', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      expect(
        screen.getByText(/Með því að lækka eða eyða vinnuferðakostnaði/)
      ).toBeInTheDocument();
    });
  });

  describe('Different Commute Methods', () => {
    it('handles transit scenario correctly', () => {
      render(<CommuteSummary scenario={mockTransitScenario} actualHourlyWage={5000} />);

      expect(screen.getByText('Strætó')).toBeInTheDocument();
      expect(screen.queryByText('Óbeinn kostnaður')).not.toBeInTheDocument();
      expect(screen.queryByText('Sundurliðun kostnaðar:')).not.toBeInTheDocument();
    });

    it('displays correct method-specific information', () => {
      const { container } = render(<CommuteSummary scenario={mockTransitScenario} actualHourlyWage={5000} />);

      // Check that transit-specific costs are displayed
      expect(container.textContent).toContain('10.500 kr');
      expect(container.textContent).toContain('126.000 kr');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Vinna í Kópavogi');

      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('renders alerts with proper ARIA roles', () => {
      render(<CommuteSummary scenario={mockCarScenario} actualHourlyWage={5000} />);

      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });
  });
});
