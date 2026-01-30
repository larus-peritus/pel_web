import { describe, it, expect } from 'vitest';
import {
  calculateOfferMetrics,
  compareOffers,
  createEmptyOffer,
  createBenefit,
} from './jobOfferComparison';

describe('jobOfferComparison', () => {
  describe('calculateOfferMetrics', () => {
    it('calculates correctly for standard Icelandic offer', () => {
      const offer = createEmptyOffer('test-1', 'Test Offer', false);
      offer.monthlySalary = 500_000; // 6M annual
      offer.weeklyHours = 40;
      offer.vacationDays = 24;
      offer.commuteMinutesPerDay = 0;

      const result = calculateOfferMetrics(offer);

      // Work weeks: 52 - (24/5) = 47.2 weeks
      // Work hours: 47.2 * 40 = 1,888 hours
      // Annual salary: 500,000 * 12 = 6,000,000
      // Hourly wage: 6,000,000 / 1,888 ≈ 3,178 ISK
      expect(result.annualSalary).toBe(6_000_000);
      expect(result.annualWorkHours).toBe(1888);
      expect(result.totalAnnualHours).toBe(1888);
      expect(result.actualHourlyWage).toBeCloseTo(3178, -1);
    });

    it('factors in commute time correctly', () => {
      const offer = createEmptyOffer('test-2', 'With Commute', false);
      offer.monthlySalary = 500_000;
      offer.weeklyHours = 40;
      offer.vacationDays = 24;
      offer.commuteMinutesPerDay = 60; // 1 hour per day (round trip)

      const result = calculateOfferMetrics(offer);

      // Work weeks: 47.2
      // Commute: 1 hour/day * 5 days/week * 47.2 weeks = 236 hours
      // Total: 1,888 + 236 = 2,124 hours
      expect(result.annualCommuteHours).toBe(236);
      expect(result.totalAnnualHours).toBe(2124);
      expect(result.actualHourlyWage).toBeCloseTo(2825, -1);
    });

    it('includes monetary benefits in compensation', () => {
      const offer = createEmptyOffer('test-3', 'With Benefits', false);
      offer.monthlySalary = 500_000;
      offer.weeklyHours = 40;
      offer.vacationDays = 24;
      offer.commuteMinutesPerDay = 0;
      offer.benefits = [
        createBenefit('lunch', 'Hádegismatur', 16667), // ~200,000/year
        createBenefit('phone', 'Sími', 5000), // ~60,000/year
      ];

      const result = calculateOfferMetrics(offer);

      // Benefits: (16667 + 5000) * 12 = 260,004 ≈ 260,000
      // Total: 6,000,000 + 260,004 = 6,260,004
      expect(result.totalCompensation).toBeGreaterThan(6_200_000);
      expect(result.actualHourlyWage).toBeGreaterThan(3178);
    });

    it('deducts job expenses from compensation', () => {
      const offer = createEmptyOffer('test-4', 'With Expenses', false);
      offer.monthlySalary = 500_000;
      offer.weeklyHours = 40;
      offer.vacationDays = 24;
      offer.commuteMinutesPerDay = 0;
      offer.commuteCostMonthly = 30_000; // 360,000/year
      offer.expenses = {
        clothing: 10_000, // 120,000/year
        meals: 20_000, // 240,000/year
        other: 0,
      };

      const result = calculateOfferMetrics(offer);

      // Annual expenses: (10,000 + 20,000) * 12 = 360,000
      // Annual commute cost: 30,000 * 12 = 360,000
      // Net: 6,000,000 - 360,000 - 360,000 = 5,280,000
      expect(result.annualExpenses).toBe(360_000);
      expect(result.annualCommuteCost).toBe(360_000);
      expect(result.netAnnualCompensation).toBe(5_280_000);
      expect(result.actualHourlyWage).toBeLessThan(3178); // Lower due to expenses
    });

    it('uses 38 hour week as default', () => {
      const offer = createEmptyOffer('test-5', 'Default Hours', false);

      expect(offer.weeklyHours).toBe(38);
    });
  });

  describe('compareOffers', () => {
    it('identifies the best offer by actual hourly wage', () => {
      const offerA = createEmptyOffer('a', 'High Salary, Long Hours', false);
      offerA.monthlySalary = 667_000; // ~8M annual
      offerA.weeklyHours = 50;
      offerA.vacationDays = 20;
      offerA.commuteMinutesPerDay = 60;

      const offerB = createEmptyOffer('b', 'Lower Salary, Better Hours', false);
      offerB.monthlySalary = 500_000; // 6M annual
      offerB.weeklyHours = 40;
      offerB.vacationDays = 24;
      offerB.commuteMinutesPerDay = 0;

      const result = compareOffers([offerA, offerB]);

      expect(result.offers).toHaveLength(2);
      expect(result.metrics).toHaveLength(2);
      expect(result.bestOfferId).toBeDefined();
      expect(result.plainLanguageSummary).toContain('kr/klst');
    });

    it('throws error for less than 2 offers', () => {
      const offer = createEmptyOffer('a', 'Only Offer', false);
      expect(() => compareOffers([offer])).toThrow('Þarf að minnsta kosti 2 tilboð');
    });

    it('generates meaningful comparison summary', () => {
      const currentJob = createEmptyOffer('current', 'Núverandi starf', true);
      currentJob.monthlySalary = 500_000;
      currentJob.weeklyHours = 40;
      currentJob.vacationDays = 24;

      const newOffer = createEmptyOffer('new', 'Nýtt tilboð', false);
      newOffer.monthlySalary = 550_000;
      newOffer.weeklyHours = 40;
      newOffer.vacationDays = 24;

      const result = compareOffers([currentJob, newOffer]);

      expect(result.plainLanguageSummary).toBeTruthy();
      expect(result.hourlyWageDifference).toBeGreaterThan(0);
      expect(result.monthlyNetDifference).toBeDefined();
    });

    it('correctly identifies when new offer is better', () => {
      const currentJob = createEmptyOffer('current', 'Núverandi starf', true);
      currentJob.monthlySalary = 500_000;
      currentJob.weeklyHours = 45;

      const newOffer = createEmptyOffer('new', 'Nýtt tilboð', false);
      newOffer.monthlySalary = 500_000;
      newOffer.weeklyHours = 38; // Same salary, fewer hours = better

      const result = compareOffers([currentJob, newOffer]);

      // New offer should win because it has higher hourly rate
      expect(result.bestOfferId).toBe('new');
    });
  });
});
