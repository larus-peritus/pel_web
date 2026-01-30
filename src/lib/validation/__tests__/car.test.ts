/**
 * Unit tests for Car Ownership validation functions
 */

import { describe, it, expect } from 'vitest';
import { validateCarOwnershipInputs } from '../car';
import type { CarOwnershipInputs } from '@/types/car-ownership';

describe('validateCarOwnershipInputs', () => {
  // Helper to create valid base inputs
  const createValidInputs = (): CarOwnershipInputs => ({
    purchasePrice: 3000000,
    estimatedLifetimeYears: 10,
    hasFinancing: false,
    monthlyKm: 1500,
    fuelType: 'gasoline',
    fuelConsumption: 7.5,
    fuelPrice: 300,
    annualInsurance: 150000,
    annualRegistrationTax: 50000,
    biannualInspection: 12000,
    annualMaintenance: 150000,
    tiresEveryNYears: 4,
    tiresCost: 60000,
    monthlyParking: 0,
    monthlyTolls: 0,
  });

  describe('Valid inputs', () => {
    it('returns valid for complete valid inputs', () => {
      const inputs = createValidInputs();
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('Purchase price validation', () => {
    it('requires purchase price', () => {
      const inputs = { ...createValidInputs() };
      delete (inputs as Partial<CarOwnershipInputs>).purchasePrice;

      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.purchasePrice).toBe('Kaupverð er nauðsynlegt');
    });

    it('rejects purchase price <= 0', () => {
      const inputs = { ...createValidInputs(), purchasePrice: 0 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.purchasePrice).toBe(
        'Kaupverð verður að vera hærra en 0 kr'
      );
    });

    it('rejects negative purchase price', () => {
      const inputs = { ...createValidInputs(), purchasePrice: -100000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.purchasePrice).toBe(
        'Kaupverð verður að vera hærra en 0 kr'
      );
    });
  });

  describe('Estimated lifetime validation', () => {
    it('requires estimated lifetime', () => {
      const inputs = { ...createValidInputs() };
      delete (inputs as Partial<CarOwnershipInputs>).estimatedLifetimeYears;

      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.estimatedLifetimeYears).toBe(
        'Áætlaður líftími er nauðsynlegur'
      );
    });

    it('rejects lifetime <= 0', () => {
      const inputs = { ...createValidInputs(), estimatedLifetimeYears: 0 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.estimatedLifetimeYears).toBe(
        'Líftími verður að vera hærri en 0 ár'
      );
    });

    it('rejects lifetime > 30', () => {
      const inputs = { ...createValidInputs(), estimatedLifetimeYears: 31 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.estimatedLifetimeYears).toBe(
        'Líftími verður að vera 30 ár eða minna'
      );
    });

    it('accepts lifetime between 1 and 30', () => {
      const inputs = { ...createValidInputs(), estimatedLifetimeYears: 15 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
    });
  });

  describe('Monthly km validation', () => {
    it('requires monthly km', () => {
      const inputs = { ...createValidInputs() };
      delete (inputs as Partial<CarOwnershipInputs>).monthlyKm;

      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.monthlyKm).toBe(
        'Mánaðarlegur akstur er nauðsynlegur'
      );
    });

    it('rejects monthly km <= 0', () => {
      const inputs = { ...createValidInputs(), monthlyKm: 0 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.monthlyKm).toBe(
        'Mánaðarlegur akstur verður að vera hærri en 0 km'
      );
    });

    it('rejects monthly km > 10000', () => {
      const inputs = { ...createValidInputs(), monthlyKm: 10001 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.monthlyKm).toBe(
        'Mánaðarlegur akstur virðist of hár (yfir 10.000 km)'
      );
    });

    it('warns for monthly km > 5000', () => {
      const inputs = { ...createValidInputs(), monthlyKm: 6000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
      expect(result.warnings?.monthlyKm).toBe(
        'Mánaðarlegur akstur er mjög hár - ertu viss um að þetta sé rétt?'
      );
    });
  });

  describe('Financing validation', () => {
    it('requires hasFinancing to be defined', () => {
      const inputs = { ...createValidInputs() };
      delete (inputs as Partial<CarOwnershipInputs>).hasFinancing;

      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.hasFinancing).toBe(
        'Fjármögnun (já/nei) er nauðsynleg'
      );
    });

    it('passes when hasFinancing is false', () => {
      const inputs = { ...createValidInputs(), hasFinancing: false };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
    });

    it('requires financing details when hasFinancing is true', () => {
      const inputs = { ...createValidInputs(), hasFinancing: true };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.financing).toBe('Fjármögnunarupplýsingar vantar');
    });

    it('validates financing.downPayment is not negative', () => {
      const inputs = {
        ...createValidInputs(),
        hasFinancing: true,
        financing: {
          downPayment: -100000,
          loanAmount: 2500000,
          annualInterestRate: 7,
          loanTermYears: 5,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors['financing.downPayment']).toBe(
        'Útborgun má ekki vera neikvæð'
      );
    });

    it('validates financing.loanAmount > 0', () => {
      const inputs = {
        ...createValidInputs(),
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 0,
          annualInterestRate: 7,
          loanTermYears: 5,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors['financing.loanAmount']).toBe(
        'Lánsupphæð verður að vera hærri en 0 kr'
      );
    });

    it('validates financing.annualInterestRate > 0', () => {
      const inputs = {
        ...createValidInputs(),
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2500000,
          annualInterestRate: 0,
          loanTermYears: 5,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors['financing.annualInterestRate']).toBe(
        'Vextir verða að vera hærri en 0%'
      );
    });

    it('validates financing.annualInterestRate <= 30', () => {
      const inputs = {
        ...createValidInputs(),
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2500000,
          annualInterestRate: 31,
          loanTermYears: 5,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors['financing.annualInterestRate']).toBe(
        'Vextir verða að vera 30% eða lægri'
      );
    });

    it('warns for high interest rates > 15%', () => {
      const inputs = {
        ...createValidInputs(),
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2500000,
          annualInterestRate: 20,
          loanTermYears: 5,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
      expect(result.warnings?.['financing.annualInterestRate']).toBe(
        'Vextir eru mjög háir - ertu viss um að þetta sé rétt?'
      );
    });

    it('validates financing.loanTermYears > 0', () => {
      const inputs = {
        ...createValidInputs(),
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2500000,
          annualInterestRate: 7,
          loanTermYears: 0,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors['financing.loanTermYears']).toBe(
        'Lánstími verður að vera hærri en 0 ár'
      );
    });

    it('validates financing.loanTermYears <= 15', () => {
      const inputs = {
        ...createValidInputs(),
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2500000,
          annualInterestRate: 7,
          loanTermYears: 16,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors['financing.loanTermYears']).toBe(
        'Lánstími verður að vera 15 ár eða styttri'
      );
    });

    it('warns when down payment + loan does not match purchase price', () => {
      const inputs = {
        ...createValidInputs(),
        purchasePrice: 3000000,
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2000000, // Total 2.5M, off by 500k (16.7%)
          annualInterestRate: 7,
          loanTermYears: 5,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
      expect(result.warnings?.['financing.total']).toBe(
        'Athugið: Útborgun + lán passa ekki við kaupverð'
      );
    });

    it('does not warn when financing matches purchase price within 5%', () => {
      const inputs = {
        ...createValidInputs(),
        purchasePrice: 3000000,
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2500000, // Exact match
          annualInterestRate: 7,
          loanTermYears: 5,
        },
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
      expect(result.warnings?.['financing.total']).toBeUndefined();
    });
  });

  describe('Fuel consumption validation', () => {
    it('requires fuel consumption', () => {
      const inputs = { ...createValidInputs() };
      delete (inputs as Partial<CarOwnershipInputs>).fuelConsumption;

      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.fuelConsumption).toBe('Eyðsla er nauðsynleg');
    });

    it('rejects fuel consumption <= 0', () => {
      const inputs = { ...createValidInputs(), fuelConsumption: 0 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.fuelConsumption).toBe(
        'Eyðsla verður að vera hærri en 0'
      );
    });

    it('rejects fuel consumption > 50', () => {
      const inputs = { ...createValidInputs(), fuelConsumption: 51 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.fuelConsumption).toBe(
        'Eyðsla verður að vera 50 eða lægri'
      );
    });

    it('warns for high fuel consumption > 20', () => {
      const inputs = { ...createValidInputs(), fuelConsumption: 25 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
      expect(result.warnings?.fuelConsumption).toBe(
        'Eyðsla er mjög há - ertu viss um að þetta sé rétt?'
      );
    });
  });

  describe('Fuel price validation', () => {
    it('requires fuel price', () => {
      const inputs = { ...createValidInputs() };
      delete (inputs as Partial<CarOwnershipInputs>).fuelPrice;

      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.fuelPrice).toBe('Eldsneytisverð er nauðsynlegt');
    });

    it('rejects fuel price <= 0', () => {
      const inputs = { ...createValidInputs(), fuelPrice: 0 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.fuelPrice).toBe(
        'Eldsneytisverð verður að vera hærra en 0 kr'
      );
    });

    it('rejects fuel price > 1000', () => {
      const inputs = { ...createValidInputs(), fuelPrice: 1001 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.fuelPrice).toBe(
        'Eldsneytisverð virðist of hátt (yfir 1.000 kr)'
      );
    });
  });

  describe('Annual/monthly costs validation', () => {
    it('rejects negative annual insurance', () => {
      const inputs = { ...createValidInputs(), annualInsurance: -1000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.annualInsurance).toBe(
        'Tryggingar mega ekki vera neikvæðar'
      );
    });

    it('rejects negative annual registration tax', () => {
      const inputs = { ...createValidInputs(), annualRegistrationTax: -1000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.annualRegistrationTax).toBe(
        'Bifreiðagjald má ekki vera neikvætt'
      );
    });

    it('rejects negative biannual inspection', () => {
      const inputs = { ...createValidInputs(), biannualInspection: -1000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.biannualInspection).toBe(
        'Skoðun má ekki vera neikvæð'
      );
    });

    it('rejects negative annual maintenance', () => {
      const inputs = { ...createValidInputs(), annualMaintenance: -1000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.annualMaintenance).toBe(
        'Viðhald má ekki vera neikvætt'
      );
    });

    it('rejects negative tires cost', () => {
      const inputs = { ...createValidInputs(), tiresCost: -1000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.tiresCost).toBe(
        'Dekkkostnaður má ekki vera neikvæður'
      );
    });

    it('rejects negative monthly parking', () => {
      const inputs = { ...createValidInputs(), monthlyParking: -1000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.monthlyParking).toBe(
        'Bílastæðagjöld mega ekki vera neikvæð'
      );
    });

    it('rejects negative monthly tolls', () => {
      const inputs = { ...createValidInputs(), monthlyTolls: -1000 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.monthlyTolls).toBe(
        'Veggjöld mega ekki vera neikvæð'
      );
    });
  });

  describe('Tires validation', () => {
    it('rejects tiresEveryNYears <= 0', () => {
      const inputs = { ...createValidInputs(), tiresEveryNYears: 0 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.tiresEveryNYears).toBe(
        'Dekktíðni verður að vera hærri en 0 ár'
      );
    });

    it('warns for very long tire intervals > 10', () => {
      const inputs = { ...createValidInputs(), tiresEveryNYears: 11 };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
      expect(result.warnings?.tiresEveryNYears).toBe(
        'Dekktíðni virðist mjög löng - venjulega 2-5 ár'
      );
    });
  });

  describe('Fuel type validation', () => {
    it('requires fuel type', () => {
      const inputs = { ...createValidInputs() };
      delete (inputs as Partial<CarOwnershipInputs>).fuelType;

      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.fuelType).toBe('Eldsneytistegund er nauðsynleg');
    });
  });

  describe('Edge cases', () => {
    it('handles empty inputs', () => {
      const result = validateCarOwnershipInputs({});

      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });

    it('accepts zero values for optional costs', () => {
      const inputs = {
        ...createValidInputs(),
        monthlyParking: 0,
        monthlyTolls: 0,
        annualInsurance: 0,
        annualMaintenance: 0,
      };
      const result = validateCarOwnershipInputs(inputs);

      expect(result.isValid).toBe(true);
    });
  });
});
