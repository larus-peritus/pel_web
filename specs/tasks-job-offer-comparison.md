# Tasks: Job Offer Comparison Tool

**Feature ID**: 2.3.4
**Feature Name**: Job Offer Comparison Tool
**App**: peninganaedalifid (Peningana eða lífið)
**Created**: 2026-01-22
**Status**: Draft
**Requirements Document**: `requirements-job-offer-comparison.md`
**Design Document**: `design-job-offer-comparison.md`

---

## 1. Implementation Overview

### 1.1 Implementation Strategy

**Chosen Strategy**: Foundation-First (Bottom-Up)

**Rationale**:
- Build core calculation logic first (most critical, easiest to test)
- Establish data models and validation early
- Build UI components on top of solid foundation
- Enables incremental testing and validation
- Lower risk of rework

**Estimated Total Effort**: 32-40 hours (4-5 days for one developer)

### 1.2 Task Hierarchy

```
Epic 1: Data Layer & Business Logic (10-12 hours)
├── Task 1.1: Data Models & Validation
├── Task 1.2: Actual Hourly Wage Calculator
├── Task 1.3: Comparison Analyzer
└── Task 1.4: Data Persistence Module

Epic 2: State Management & Storage (6-8 hours)
├── Task 2.1: React Context Provider
├── Task 2.2: localStorage Integration
└── Task 2.3: Export/Import Functionality

Epic 3: Input Components (8-10 hours)
├── Task 3.1: Offer Card Component
├── Task 3.2: Form Fields Components
└── Task 3.3: Input Validation & Error Handling

Epic 4: Comparison Display (6-8 hours)
├── Task 4.1: Comparison Table (Desktop)
├── Task 4.2: Comparison Cards (Mobile)
└── Task 4.3: Life Energy Visualizer

Epic 5: Page Integration & Polish (8-10 hours)
├── Task 5.1: Page Component & Layout
├── Task 5.2: Assumptions Panel
├── Task 5.3: Responsive Design & Mobile Optimization
├── Task 5.4: i18n Implementation
└── Task 5.5: Accessibility Enhancements

Epic 6: Testing & Quality Assurance (6-8 hours)
├── Task 6.1: Unit Tests
├── Task 6.2: Integration Tests
└── Task 6.3: E2E Tests
```

### 1.3 Dependencies

**External Dependencies**:
- Actual Hourly Wage methodology (if exists elsewhere in app, reuse it)
- App-wide i18n setup (if exists, integrate; otherwise set up)
- App-wide styling system (Tailwind CSS or CSS Modules)

**Internal Task Dependencies**:
- Tasks 3.x depend on Tasks 1.x (UI needs data models)
- Tasks 4.x depend on Tasks 1.x and 2.x (display needs calculations and state)
- Task 5.1 depends on all other tasks (final integration)
- Epic 6 can run in parallel with Epics 3-5 (TDD approach)

---

## 2. Epic 1: Data Layer & Business Logic

**Goal**: Establish core data models, validation, and calculation logic.
**Estimated Effort**: 10-12 hours
**Priority**: Critical (Foundation)

---

### Task 1.1: Data Models & Validation

**Objective**: Create TypeScript interfaces and Zod schemas for all data structures.

**Files to Create**:
- `lib/types/jobOffer.ts` (TypeScript interfaces)
- `lib/validation/schemas.ts` (Zod validation schemas)

**Functionality**:

1. **Define TypeScript Interfaces**:
   ```typescript
   // lib/types/jobOffer.ts
   export interface JobOffer {
     id: string;
     name: string;
     salary: number;
     weeklyHours: number;
     vacationDays: number;
     commuteMinutes: number;
     pensionPercent: number;
     monetaryBenefits: MonetaryBenefit[];
     flexibility: number | null;
     stressLevel: number | null;
     growthOpportunities: number | null;
     notes: string;
     createdAt: Date;
     updatedAt: Date;
   }

   export interface MonetaryBenefit {
     type: BenefitType;
     label: string;
     annualValue: number;
   }

   export type BenefitType =
     | 'lunch' | 'car' | 'phone' | 'health'
     | 'extra-pension' | 'custom';

   export interface CalculatedMetrics {
     offerId: string;
     actualHourlyWage: number;
     totalCompensation: number;
     annualWorkHours: number;
     annualCommuteHours: number;
     annualTotalHours: number;
     lifeEnergyCost: LifeEnergyCost;
   }

   export interface LifeEnergyCost {
     hours: number;
     days: number;
     weeks: number;
     monthlyHours: number;
   }

   export interface ComparisonResult {
     offers: JobOffer[];
     metrics: CalculatedMetrics[];
     rankings: OfferRanking[];
     bestOffer: JobOffer;
   }

   export interface OfferRanking {
     offerId: string;
     rank: number;
     scoreType: 'monetary';
     differenceFromBest: {
       hourlyWageDiff: number;
       annualHoursDiff: number;
       plainLanguage: string;
     };
   }

   export interface ComparisonExport {
     version: string;
     exportedAt: Date;
     appName: 'peninganaedalifid';
     comparison: ComparisonResult;
   }

   export interface ComparisonState {
     offers: JobOffer[];
     selectedView: 'side-by-side' | 'stacked';
     showAssumptions: boolean;
     isLoading: boolean;
     lastSaved: Date | null;
   }
   ```

2. **Create Zod Validation Schemas**:
   ```typescript
   // lib/validation/schemas.ts
   import { z } from 'zod';

   export const MonetaryBenefitSchema = z.object({
     type: z.enum(['lunch', 'car', 'phone', 'health', 'extra-pension', 'custom']),
     label: z.string().min(1).max(100),
     annualValue: z.number().min(0).max(10_000_000),
   });

   export const JobOfferSchema = z.object({
     id: z.string().uuid(),
     name: z.string().min(1, 'Offer name is required').max(100),
     salary: z.number()
       .min(1, 'Salary must be positive')
       .max(999_999_999, 'Salary seems unrealistically high'),
     weeklyHours: z.number()
       .min(1, 'Hours must be at least 1')
       .max(168, 'Only 168 hours in a week!'),
     vacationDays: z.number()
       .min(0, 'Cannot have negative vacation')
       .max(365, 'Cannot exceed 365 days'),
     commuteMinutes: z.number()
       .min(0, 'Commute cannot be negative')
       .max(480, 'Commute seems unrealistically long'),
     pensionPercent: z.number()
       .min(0, 'Pension cannot be negative')
       .max(100, 'Pension cannot exceed 100%'),
     monetaryBenefits: z.array(MonetaryBenefitSchema).default([]),
     flexibility: z.number().min(1).max(5).nullable(),
     stressLevel: z.number().min(1).max(5).nullable(),
     growthOpportunities: z.number().min(1).max(5).nullable(),
     notes: z.string().max(1000).default(''),
     createdAt: z.date(),
     updatedAt: z.date(),
   });

   export const ComparisonExportSchema = z.object({
     version: z.string(),
     exportedAt: z.date(),
     appName: z.literal('peninganaedalifid'),
     comparison: z.object({
       offers: z.array(JobOfferSchema).min(2).max(5),
       metrics: z.array(z.any()), // Calculated, not validated on import
       rankings: z.array(z.any()),
       bestOffer: JobOfferSchema,
     }),
   });
   ```

3. **Create Helper Functions**:
   ```typescript
   // lib/types/jobOffer.ts
   export function createDefaultOffer(): Partial<JobOffer> {
     return {
       name: '',
       salary: 0,
       weeklyHours: 40,
       vacationDays: 24,
       commuteMinutes: 0,
       pensionPercent: 11.5,
       monetaryBenefits: [],
       flexibility: null,
       stressLevel: null,
       growthOpportunities: null,
       notes: '',
     };
   }

   export function createEmptyOffer(): JobOffer {
     return {
       id: crypto.randomUUID(),
       ...createDefaultOffer() as any,
       createdAt: new Date(),
       updatedAt: new Date(),
     };
   }
   ```

**Tests**:
- Validate correct data with schema: Should pass
- Validate invalid data: Should fail with specific error messages
- Test boundary values (0 hours, 168 hours, etc.)
- Test default value creation

**Requirements Traced**: AC-2, AC-11, AC-17, NFR-10

**Estimated Effort**: 2-3 hours

---

### Task 1.2: Actual Hourly Wage Calculator

**Objective**: Implement the core calculation logic for actual hourly wage.

**Files to Create**:
- `lib/calculations/actualHourlyWage.ts`
- `lib/calculations/actualHourlyWage.test.ts`

**Functionality**:

1. **Implement Calculation Function**:
   ```typescript
   // lib/calculations/actualHourlyWage.ts
   import { JobOffer, CalculatedMetrics, LifeEnergyCost } from '@/lib/types/jobOffer';

   export function calculateActualHourlyWage(offer: JobOffer): CalculatedMetrics {
     // 1. Calculate total compensation
     const totalBenefitsValue = offer.monetaryBenefits.reduce(
       (sum, benefit) => sum + benefit.annualValue,
       0
     );
     const totalCompensation = offer.salary + totalBenefitsValue;

     // 2. Calculate annual work hours
     // Work weeks = 52 weeks - (vacation days / 5 days per week)
     const workWeeksPerYear = Math.max(0, 52 - (offer.vacationDays / 5));
     const annualWorkHours = workWeeksPerYear * offer.weeklyHours;

     // 3. Calculate annual commute hours
     const commuteHoursPerDay = offer.commuteMinutes / 60;
     const annualCommuteHours = commuteHoursPerDay * 5 * workWeeksPerYear; // 5 workdays/week

     // 4. Calculate total hours required
     const annualTotalHours = annualWorkHours + annualCommuteHours;

     // 5. Calculate actual hourly wage
     if (annualTotalHours === 0) {
       throw new Error('Cannot calculate hourly wage with zero total hours');
     }
     const actualHourlyWage = totalCompensation / annualTotalHours;

     // 6. Calculate life energy cost
     const lifeEnergyCost: LifeEnergyCost = {
       hours: annualTotalHours,
       days: annualTotalHours / 8, // 8-hour workday
       weeks: annualTotalHours / 40, // 40-hour workweek
       monthlyHours: annualTotalHours / 12,
     };

     return {
       offerId: offer.id,
       actualHourlyWage: Math.round(actualHourlyWage), // Round to whole ISK
       totalCompensation,
       annualWorkHours: Math.round(annualWorkHours),
       annualCommuteHours: Math.round(annualCommuteHours),
       annualTotalHours: Math.round(annualTotalHours),
       lifeEnergyCost: {
         hours: Math.round(lifeEnergyCost.hours),
         days: Math.round(lifeEnergyCost.days * 10) / 10, // 1 decimal
         weeks: Math.round(lifeEnergyCost.weeks * 10) / 10,
         monthlyHours: Math.round(lifeEnergyCost.monthlyHours),
       },
     };
   }

   export function validateCalculation(metrics: CalculatedMetrics): string[] {
     const warnings: string[] = [];

     if (metrics.actualHourlyWage > 50_000) {
       warnings.push('Hourly wage seems unusually high. Please verify inputs.');
     }

     if (metrics.annualTotalHours > 3000) {
       warnings.push('Total annual hours seem very high. Check work hours and commute.');
     }

     if (metrics.annualTotalHours < 500) {
       warnings.push('Total annual hours seem very low. Is this part-time?');
     }

     return warnings;
   }
   ```

2. **Write Comprehensive Tests**:
   ```typescript
   // lib/calculations/actualHourlyWage.test.ts
   import { calculateActualHourlyWage } from './actualHourlyWage';
   import { createEmptyOffer } from '@/lib/types/jobOffer';

   describe('calculateActualHourlyWage', () => {
     it('calculates correctly for standard Icelandic offer', () => {
       const offer = {
         ...createEmptyOffer(),
         name: 'Test Offer',
         salary: 6_000_000,
         weeklyHours: 40,
         vacationDays: 24,
         commuteMinutes: 0,
         monetaryBenefits: [],
       };

       const result = calculateActualHourlyWage(offer);

       // Work weeks: 52 - (24/5) = 47.2 weeks
       // Work hours: 47.2 * 40 = 1,888 hours
       // Hourly wage: 6,000,000 / 1,888 = ~3,178 ISK
       expect(result.annualWorkHours).toBe(1888);
       expect(result.annualTotalHours).toBe(1888);
       expect(result.actualHourlyWage).toBeCloseTo(3178, -1); // Within 10 ISK
     });

     it('factors in commute time correctly', () => {
       const offer = {
         ...createEmptyOffer(),
         salary: 6_000_000,
         weeklyHours: 40,
         vacationDays: 24,
         commuteMinutes: 60, // 1 hour per day (total, both ways)
       };

       const result = calculateActualHourlyWage(offer);

       // Commute: 1 hour/day * 5 days/week * 47.2 weeks = 236 hours
       // Total: 1,888 + 236 = 2,124 hours
       expect(result.annualCommuteHours).toBe(236);
       expect(result.annualTotalHours).toBe(2124);
       expect(result.actualHourlyWage).toBeCloseTo(2825, -1);
     });

     it('includes monetary benefits in compensation', () => {
       const offer = {
         ...createEmptyOffer(),
         salary: 6_000_000,
         weeklyHours: 40,
         vacationDays: 24,
         commuteMinutes: 0,
         monetaryBenefits: [
           { type: 'lunch' as const, label: 'Lunch', annualValue: 200_000 },
           { type: 'phone' as const, label: 'Phone', annualValue: 60_000 },
         ],
       };

       const result = calculateActualHourlyWage(offer);

       expect(result.totalCompensation).toBe(6_260_000);
       expect(result.actualHourlyWage).toBeCloseTo(3316, -1);
     });

     it('calculates life energy cost correctly', () => {
       const offer = {
         ...createEmptyOffer(),
         salary: 6_000_000,
         weeklyHours: 40,
         vacationDays: 24,
         commuteMinutes: 0,
       };

       const result = calculateActualHourlyWage(offer);

       expect(result.lifeEnergyCost.hours).toBe(1888);
       expect(result.lifeEnergyCost.days).toBeCloseTo(236, 0); // 1888/8
       expect(result.lifeEnergyCost.weeks).toBeCloseTo(47.2, 1);
       expect(result.lifeEnergyCost.monthlyHours).toBeCloseTo(157, 0); // 1888/12
     });

     it('throws error for zero total hours', () => {
       const offer = {
         ...createEmptyOffer(),
         salary: 6_000_000,
         weeklyHours: 0,
         vacationDays: 0,
       };

       expect(() => calculateActualHourlyWage(offer)).toThrow(
         'Cannot calculate hourly wage with zero total hours'
       );
     });
   });
   ```

**Tests**:
- Standard calculation with no commute
- Calculation with commute
- Calculation with benefits
- Life energy cost accuracy
- Edge case: Zero hours (should throw error)
- Edge case: Maximum vacation days

**Requirements Traced**: AC-3, NFR-1, NFR-10

**Estimated Effort**: 3-4 hours

---

### Task 1.3: Comparison Analyzer

**Objective**: Implement logic to analyze and rank multiple offers.

**Files to Create**:
- `lib/calculations/comparisonAnalyzer.ts`
- `lib/calculations/comparisonAnalyzer.test.ts`

**Functionality**:

1. **Implement Comparison Analysis**:
   ```typescript
   // lib/calculations/comparisonAnalyzer.ts
   import { JobOffer, ComparisonResult, OfferRanking, CalculatedMetrics } from '@/lib/types/jobOffer';
   import { calculateActualHourlyWage } from './actualHourlyWage';

   export function analyzeComparison(offers: JobOffer[]): ComparisonResult {
     if (offers.length < 2) {
       throw new Error('Need at least 2 offers to compare');
     }

     if (offers.length > 5) {
       throw new Error('Maximum 5 offers allowed');
     }

     // 1. Calculate metrics for each offer
     const metrics = offers.map(calculateActualHourlyWage);

     // 2. Sort by actual hourly wage (descending)
     const sorted = [...metrics].sort(
       (a, b) => b.actualHourlyWage - a.actualHourlyWage
     );

     // 3. Identify best offer
     const bestOffer = offers.find(o => o.id === sorted[0].offerId)!;

     // 4. Calculate rankings and differences
     const rankings: OfferRanking[] = metrics.map((metric) => {
       const rank = sorted.findIndex(m => m.offerId === metric.offerId) + 1;
       const bestMetric = sorted[0];
       const hourlyWageDiff = bestMetric.actualHourlyWage - metric.actualHourlyWage;
       const annualHoursDiff = metric.annualTotalHours - bestMetric.annualTotalHours;

       return {
         offerId: metric.offerId,
         rank,
         scoreType: 'monetary',
         differenceFromBest: {
           hourlyWageDiff,
           annualHoursDiff,
           plainLanguage: generatePlainLanguageComparison(
             hourlyWageDiff,
             annualHoursDiff,
             rank === 1
           ),
         },
       };
     });

     return {
       offers,
       metrics,
       rankings,
       bestOffer,
     };
   }

   function generatePlainLanguageComparison(
     hourlyDiff: number,
     hoursDiff: number,
     isBest: boolean
   ): string {
     if (isBest) {
       return 'This is the best value offer!';
     }

     const absHoursDiff = Math.abs(hoursDiff);
     const daysDiff = Math.round(absHoursDiff / 8);
     const weeksDiff = Math.round(absHoursDiff / 40 * 10) / 10; // 1 decimal

     if (hoursDiff > 0) {
       return `Costs you ${absHoursDiff} extra hours per year (${daysDiff} days or ${weeksDiff} weeks) compared to the best offer.`;
     } else if (hoursDiff < 0) {
       return `Saves you ${absHoursDiff} hours per year (${daysDiff} days or ${weeksDiff} weeks) compared to the best offer.`;
     } else {
       return 'Equivalent time commitment to the best offer.';
     }
   }

   export function getOfferRank(offerId: string, result: ComparisonResult): number {
     const ranking = result.rankings.find(r => r.offerId === offerId);
     return ranking?.rank ?? 0;
   }

   export function getBestOffer(result: ComparisonResult): JobOffer {
     return result.bestOffer;
   }
   ```

2. **Write Tests**:
   ```typescript
   // lib/calculations/comparisonAnalyzer.test.ts
   import { analyzeComparison } from './comparisonAnalyzer';
   import { createEmptyOffer } from '@/lib/types/jobOffer';

   describe('analyzeComparison', () => {
     it('ranks offers correctly by actual hourly wage', () => {
       const offer1 = {
         ...createEmptyOffer(),
         name: 'High Salary, Long Hours',
         salary: 8_000_000,
         weeklyHours: 50,
         vacationDays: 20,
         commuteMinutes: 60,
       };

       const offer2 = {
         ...createEmptyOffer(),
         name: 'Lower Salary, Better Hours',
         salary: 6_000_000,
         weeklyHours: 40,
         vacationDays: 24,
         commuteMinutes: 0,
       };

       const result = analyzeComparison([offer1, offer2]);

       expect(result.rankings).toHaveLength(2);
       // Verify ranking logic (need to calculate which is actually better)
       expect(result.bestOffer).toBeDefined();
     });

     it('generates correct plain language comparisons', () => {
       const offers = [
         {
           ...createEmptyOffer(),
           name: 'Offer A',
           salary: 6_000_000,
           weeklyHours: 40,
           vacationDays: 24,
         },
         {
           ...createEmptyOffer(),
           name: 'Offer B',
           salary: 5_800_000,
           weeklyHours: 40,
           vacationDays: 24,
         },
       ];

       const result = analyzeComparison(offers);

       const bestRanking = result.rankings.find(r => r.rank === 1);
       const worstRanking = result.rankings.find(r => r.rank === 2);

       expect(bestRanking?.differenceFromBest.plainLanguage).toBe(
         'This is the best value offer!'
       );
       expect(worstRanking?.differenceFromBest.plainLanguage).toContain('extra hours');
     });

     it('throws error for less than 2 offers', () => {
       const offer = createEmptyOffer();
       expect(() => analyzeComparison([offer])).toThrow(
         'Need at least 2 offers to compare'
       );
     });

     it('throws error for more than 5 offers', () => {
       const offers = Array(6).fill(null).map(() => createEmptyOffer());
       expect(() => analyzeComparison(offers)).toThrow(
         'Maximum 5 offers allowed'
       );
     });
   });
   ```

**Requirements Traced**: AC-4, AC-5, AC-14, AC-15

**Estimated Effort**: 3-4 hours

---

### Task 1.4: Data Persistence Module

**Objective**: Implement localStorage saving and loading.

**Files to Create**:
- `lib/storage/comparisonStorage.ts`
- `lib/storage/comparisonStorage.test.ts`

**Functionality**:

1. **Implement Storage Functions**:
   ```typescript
   // lib/storage/comparisonStorage.ts
   import { ComparisonState } from '@/lib/types/jobOffer';

   const STORAGE_KEY = 'peningana-job-comparison-v1';

   export function saveComparison(state: ComparisonState): void {
     try {
       const serialized = JSON.stringify({
         ...state,
         lastSaved: new Date().toISOString(),
         offers: state.offers.map(o => ({
           ...o,
           createdAt: o.createdAt.toISOString(),
           updatedAt: o.updatedAt.toISOString(),
         })),
       });
       localStorage.setItem(STORAGE_KEY, serialized);
     } catch (error) {
       console.error('Failed to save comparison:', error);
       throw new Error('Could not save comparison. Storage may be full.');
     }
   }

   export function loadComparison(): ComparisonState | null {
     try {
       const stored = localStorage.getItem(STORAGE_KEY);
       if (!stored) return null;

       const parsed = JSON.parse(stored);

       // Convert ISO strings back to Date objects
       return {
         ...parsed,
         offers: parsed.offers.map((o: any) => ({
           ...o,
           createdAt: new Date(o.createdAt),
           updatedAt: new Date(o.updatedAt),
         })),
         lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : null,
       };
     } catch (error) {
       console.error('Failed to load comparison:', error);
       return null;
     }
   }

   export function clearComparison(): void {
     localStorage.removeItem(STORAGE_KEY);
   }

   export function hasStoredComparison(): boolean {
     return localStorage.getItem(STORAGE_KEY) !== null;
   }
   ```

2. **Write Tests** (with localStorage mock):
   ```typescript
   // lib/storage/comparisonStorage.test.ts
   import { saveComparison, loadComparison, clearComparison } from './comparisonStorage';
   import { createEmptyOffer } from '@/lib/types/jobOffer';

   // Mock localStorage
   const localStorageMock = (() => {
     let store: Record<string, string> = {};
     return {
       getItem: (key: string) => store[key] || null,
       setItem: (key: string, value: string) => { store[key] = value; },
       removeItem: (key: string) => { delete store[key]; },
       clear: () => { store = {}; },
     };
   })();

   Object.defineProperty(window, 'localStorage', {
     value: localStorageMock,
   });

   describe('comparisonStorage', () => {
     beforeEach(() => {
       localStorageMock.clear();
     });

     it('saves and loads comparison correctly', () => {
       const state = {
         offers: [createEmptyOffer(), createEmptyOffer()],
         selectedView: 'side-by-side' as const,
         showAssumptions: false,
         isLoading: false,
         lastSaved: null,
       };

       saveComparison(state);
       const loaded = loadComparison();

       expect(loaded).not.toBeNull();
       expect(loaded!.offers).toHaveLength(2);
       expect(loaded!.selectedView).toBe('side-by-side');
     });

     it('preserves Date objects after save/load', () => {
       const state = {
         offers: [createEmptyOffer()],
         selectedView: 'side-by-side' as const,
         showAssumptions: false,
         isLoading: false,
         lastSaved: null,
       };

       saveComparison(state);
       const loaded = loadComparison();

       expect(loaded!.offers[0].createdAt).toBeInstanceOf(Date);
       expect(loaded!.offers[0].updatedAt).toBeInstanceOf(Date);
     });

     it('returns null when no data stored', () => {
       const loaded = loadComparison();
       expect(loaded).toBeNull();
     });

     it('clears comparison successfully', () => {
       const state = {
         offers: [createEmptyOffer()],
         selectedView: 'side-by-side' as const,
         showAssumptions: false,
         isLoading: false,
         lastSaved: null,
       };

       saveComparison(state);
       expect(loadComparison()).not.toBeNull();

       clearComparison();
       expect(loadComparison()).toBeNull();
     });
   });
   ```

**Requirements Traced**: AC-7, AC-8, NFR-2, NFR-6

**Estimated Effort**: 2-3 hours

---

## 3. Epic 2: State Management & Storage

**Goal**: Implement React Context for state management and integrate export/import.
**Estimated Effort**: 6-8 hours
**Priority**: High

---

### Task 2.1: React Context Provider

**Objective**: Create centralized state management for the comparison feature.

**Files to Create**:
- `app/(tools)/job-offer-comparison/components/ComparisonProvider.tsx`
- `app/(tools)/job-offer-comparison/hooks/useComparison.ts`

**Functionality**:

1. **Implement ComparisonProvider**:
   ```typescript
   // app/(tools)/job-offer-comparison/components/ComparisonProvider.tsx
   'use client';

   import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
   import { ComparisonState, JobOffer } from '@/lib/types/jobOffer';
   import { saveComparison, loadComparison } from '@/lib/storage/comparisonStorage';
   import { createEmptyOffer } from '@/lib/types/jobOffer';

   type ComparisonAction =
     | { type: 'ADD_OFFER'; payload: JobOffer }
     | { type: 'UPDATE_OFFER'; payload: { id: string; updates: Partial<JobOffer> } }
     | { type: 'REMOVE_OFFER'; payload: string }
     | { type: 'DUPLICATE_OFFER'; payload: string }
     | { type: 'SET_VIEW'; payload: 'side-by-side' | 'stacked' }
     | { type: 'TOGGLE_ASSUMPTIONS' }
     | { type: 'RESET_COMPARISON' }
     | { type: 'LOAD_COMPARISON'; payload: ComparisonState }
     | { type: 'SET_LOADING'; payload: boolean };

   const initialState: ComparisonState = {
     offers: [],
     selectedView: 'side-by-side',
     showAssumptions: false,
     isLoading: false,
     lastSaved: null,
   };

   function comparisonReducer(state: ComparisonState, action: ComparisonAction): ComparisonState {
     switch (action.type) {
       case 'ADD_OFFER':
         if (state.offers.length >= 5) return state;
         return { ...state, offers: [...state.offers, action.payload] };

       case 'UPDATE_OFFER':
         return {
           ...state,
           offers: state.offers.map(offer =>
             offer.id === action.payload.id
               ? { ...offer, ...action.payload.updates, updatedAt: new Date() }
               : offer
           ),
         };

       case 'REMOVE_OFFER':
         if (state.offers.length <= 1) return state; // Keep at least 1 offer
         return {
           ...state,
           offers: state.offers.filter(o => o.id !== action.payload),
         };

       case 'DUPLICATE_OFFER':
         const offerToDuplicate = state.offers.find(o => o.id === action.payload);
         if (!offerToDuplicate || state.offers.length >= 5) return state;
         const duplicated = {
           ...offerToDuplicate,
           id: crypto.randomUUID(),
           name: `${offerToDuplicate.name} (Copy)`,
           createdAt: new Date(),
           updatedAt: new Date(),
         };
         return { ...state, offers: [...state.offers, duplicated] };

       case 'SET_VIEW':
         return { ...state, selectedView: action.payload };

       case 'TOGGLE_ASSUMPTIONS':
         return { ...state, showAssumptions: !state.showAssumptions };

       case 'RESET_COMPARISON':
         return initialState;

       case 'LOAD_COMPARISON':
         return action.payload;

       case 'SET_LOADING':
         return { ...state, isLoading: action.payload };

       default:
         return state;
     }
   }

   const ComparisonContext = createContext<{
     state: ComparisonState;
     dispatch: React.Dispatch<ComparisonAction>;
   } | null>(null);

   export function ComparisonProvider({ children }: { children: ReactNode }) {
     const [state, dispatch] = useReducer(comparisonReducer, initialState);

     // Load from localStorage on mount
     useEffect(() => {
       const loaded = loadComparison();
       if (loaded) {
         dispatch({ type: 'LOAD_COMPARISON', payload: loaded });
       }
     }, []);

     // Auto-save to localStorage on state change (debounced)
     useEffect(() => {
       const timeoutId = setTimeout(() => {
         if (state.offers.length > 0) {
           saveComparison(state);
         }
       }, 500); // 500ms debounce

       return () => clearTimeout(timeoutId);
     }, [state]);

     return (
       <ComparisonContext.Provider value={{ state, dispatch }}>
         {children}
       </ComparisonContext.Provider>
     );
   }

   export function useComparisonContext() {
     const context = useContext(ComparisonContext);
     if (!context) {
       throw new Error('useComparisonContext must be used within ComparisonProvider');
     }
     return context;
   }
   ```

2. **Create Custom Hook**:
   ```typescript
   // app/(tools)/job-offer-comparison/hooks/useComparison.ts
   import { useComparisonContext } from '../components/ComparisonProvider';
   import { JobOffer } from '@/lib/types/jobOffer';
   import { createEmptyOffer } from '@/lib/types/jobOffer';

   export function useComparison() {
     const { state, dispatch } = useComparisonContext();

     const addOffer = (offer?: Partial<JobOffer>) => {
       const newOffer = offer ? { ...createEmptyOffer(), ...offer } : createEmptyOffer();
       dispatch({ type: 'ADD_OFFER', payload: newOffer });
     };

     const updateOffer = (id: string, updates: Partial<JobOffer>) => {
       dispatch({ type: 'UPDATE_OFFER', payload: { id, updates } });
     };

     const removeOffer = (id: string) => {
       dispatch({ type: 'REMOVE_OFFER', payload: id });
     };

     const duplicateOffer = (id: string) => {
       dispatch({ type: 'DUPLICATE_OFFER', payload: id });
     };

     const setView = (view: 'side-by-side' | 'stacked') => {
       dispatch({ type: 'SET_VIEW', payload: view });
     };

     const toggleAssumptions = () => {
       dispatch({ type: 'TOGGLE_ASSUMPTIONS' });
     };

     const resetComparison = () => {
       dispatch({ type: 'RESET_COMPARISON' });
     };

     return {
       offers: state.offers,
       selectedView: state.selectedView,
       showAssumptions: state.showAssumptions,
       isLoading: state.isLoading,
       canAddMore: state.offers.length < 5,
       canRemove: state.offers.length > 1,
       canCompare: state.offers.length >= 2,
       addOffer,
       updateOffer,
       removeOffer,
       duplicateOffer,
       setView,
       toggleAssumptions,
       resetComparison,
     };
   }
   ```

**Requirements Traced**: AC-7, AC-8, AC-18, AC-19, NFR-1

**Estimated Effort**: 3-4 hours

---

### Task 2.2: localStorage Integration

**Objective**: Integrate localStorage with React Context for auto-save/load.

**Files to Modify**:
- `app/(tools)/job-offer-comparison/components/ComparisonProvider.tsx` (already done in Task 2.1)

**Functionality**:
- Auto-load on component mount (implemented in Task 2.1)
- Auto-save on state change with 500ms debounce (implemented in Task 2.1)
- Handle localStorage errors gracefully

**Requirements Traced**: AC-7, AC-8, NFR-2, NFR-6

**Estimated Effort**: 1 hour (mostly covered in Task 2.1)

---

### Task 2.3: Export/Import Functionality

**Objective**: Implement export and import of comparison data.

**Files to Create**:
- `lib/io/exportImport.ts`
- `lib/io/exportImport.test.ts`

**Functionality**:

1. **Implement Export/Import**:
   ```typescript
   // lib/io/exportImport.ts
   import { ComparisonResult, ComparisonExport, ComparisonState } from '@/lib/types/jobOffer';
   import { ComparisonExportSchema } from '@/lib/validation/schemas';
   import { format } from 'date-fns';

   export function exportComparison(comparison: ComparisonResult): void {
     const exportData: ComparisonExport = {
       version: '1.0',
       exportedAt: new Date(),
       appName: 'peninganaedalifid',
       comparison,
     };

     const json = JSON.stringify(exportData, null, 2);
     const blob = new Blob([json], { type: 'application/json' });
     const url = URL.createObjectURL(blob);

     const link = document.createElement('a');
     link.href = url;
     link.download = `job-comparison-${format(new Date(), 'yyyy-MM-dd')}.json`;
     link.click();

     URL.revokeObjectURL(url);
   }

   export async function importComparison(file: File): Promise<ComparisonState> {
     try {
       const text = await file.text();
       const parsed = JSON.parse(text);

       // Validate with Zod schema
       const validated = ComparisonExportSchema.parse(parsed);

       // Check version compatibility
       if (validated.version !== '1.0') {
         throw new Error(`Unsupported export version: ${validated.version}`);
       }

       // Convert to ComparisonState
       return {
         offers: validated.comparison.offers,
         selectedView: 'side-by-side',
         showAssumptions: false,
         isLoading: false,
         lastSaved: null,
       };
     } catch (error) {
       if (error instanceof Error) {
         throw new Error(`Import failed: ${error.message}`);
       }
       throw new Error('Import failed: Unknown error');
     }
   }
   ```

2. **Add Export/Import to useComparison Hook**:
   ```typescript
   // app/(tools)/job-offer-comparison/hooks/useComparison.ts
   import { exportComparison as exportComparisonData, importComparison as importComparisonData } from '@/lib/io/exportImport';
   import { analyzeComparison } from '@/lib/calculations/comparisonAnalyzer';

   // Add to useComparison hook:
   const exportComparison = () => {
     if (state.offers.length < 2) {
       throw new Error('Need at least 2 offers to export comparison');
     }
     const comparisonResult = analyzeComparison(state.offers);
     exportComparisonData(comparisonResult);
   };

   const importComparison = async (file: File) => {
     try {
       dispatch({ type: 'SET_LOADING', payload: true });
       const importedState = await importComparisonData(file);
       dispatch({ type: 'LOAD_COMPARISON', payload: importedState });
     } catch (error) {
       throw error;
     } finally {
       dispatch({ type: 'SET_LOADING', payload: false });
     }
   };

   return {
     // ... existing returns
     exportComparison,
     importComparison,
   };
   ```

**Requirements Traced**: AC-9, AC-10, NFR-7

**Estimated Effort**: 2-3 hours

---

## 4. Epic 3: Input Components

**Goal**: Build UI components for entering job offer details.
**Estimated Effort**: 8-10 hours
**Priority**: High

---

### Task 3.1: Offer Card Component

**Objective**: Create the main offer input card component.

**Files to Create**:
- `app/(tools)/job-offer-comparison/components/OfferCard.tsx`
- `app/(tools)/job-offer-comparison/components/OfferCard.test.tsx`

**Functionality**:

1. **Implement OfferCard Component**:
   ```typescript
   // app/(tools)/job-offer-comparison/components/OfferCard.tsx
   'use client';

   import { useState } from 'react';
   import { JobOffer } from '@/lib/types/jobOffer';
   import { useComparison } from '../hooks/useComparison';
   import OfferFormFields from './OfferFormFields';
   import { calculateActualHourlyWage } from '@/lib/calculations/actualHourlyWage';

   interface OfferCardProps {
     offer: JobOffer;
     isExpanded?: boolean;
   }

   export default function OfferCard({ offer, isExpanded = false }: OfferCardProps) {
     const [expanded, setExpanded] = useState(isExpanded);
     const [isEditing, setIsEditing] = useState(false);
     const { updateOffer, removeOffer, duplicateOffer, canRemove } = useComparison();

     // Live calculation preview
     const metrics = calculateActualHourlyWage(offer);

     const handleSave = () => {
       setIsEditing(false);
       // Updates are already saved via updateOffer in form fields
     };

     return (
       <div className="border rounded-lg p-4 bg-white shadow-sm">
         {/* Header */}
         <div className="flex justify-between items-center mb-2">
           <h3 className="text-lg font-semibold">{offer.name || 'Untitled Offer'}</h3>
           <div className="flex gap-2">
             <button
               onClick={() => setExpanded(!expanded)}
               className="text-sm text-blue-600 hover:underline"
               aria-label={expanded ? 'Collapse' : 'Expand'}
             >
               {expanded ? 'Collapse' : 'Expand'}
             </button>
             <button
               onClick={() => duplicateOffer(offer.id)}
               className="text-sm text-blue-600 hover:underline"
               aria-label="Duplicate offer"
             >
               Duplicate
             </button>
             {canRemove && (
               <button
                 onClick={() => removeOffer(offer.id)}
                 className="text-sm text-red-600 hover:underline"
                 aria-label="Remove offer"
               >
                 Remove
               </button>
             )}
           </div>
         </div>

         {/* Preview (always visible) */}
         <div className="mb-4 p-3 bg-gray-50 rounded">
           <div className="text-sm text-gray-600">Actual Hourly Wage</div>
           <div className="text-2xl font-bold text-green-600">
             {metrics.actualHourlyWage.toLocaleString('is-IS')} kr/klst
           </div>
           <div className="text-xs text-gray-500 mt-1">
             {metrics.annualTotalHours.toLocaleString('is-IS')} hours/year total
           </div>
         </div>

         {/* Form Fields (expandable) */}
         {expanded && (
           <OfferFormFields
             offer={offer}
             onChange={(updates) => updateOffer(offer.id, updates)}
           />
         )}
       </div>
     );
   }
   ```

**Requirements Traced**: AC-2, AC-18, AC-19

**Estimated Effort**: 3-4 hours

---

### Task 3.2: Form Fields Components

**Objective**: Create form input fields for offer details.

**Files to Create**:
- `app/(tools)/job-offer-comparison/components/OfferFormFields.tsx`
- `app/(tools)/job-offer-comparison/components/BenefitsField.tsx`
- `app/(tools)/job-offer-comparison/components/RatingField.tsx`

**Functionality**:

1. **Implement OfferFormFields**:
   ```typescript
   // app/(tools)/job-offer-comparison/components/OfferFormFields.tsx
   'use client';

   import { JobOffer, MonetaryBenefit } from '@/lib/types/jobOffer';
   import { JobOfferSchema } from '@/lib/validation/schemas';
   import { useState } from 'react';

   interface OfferFormFieldsProps {
     offer: JobOffer;
     onChange: (updates: Partial<JobOffer>) => void;
   }

   export default function OfferFormFields({ offer, onChange }: OfferFormFieldsProps) {
     const [errors, setErrors] = useState<Record<string, string>>({});

     const handleChange = (field: keyof JobOffer, value: any) => {
       // Validate single field
       try {
         const partialSchema = JobOfferSchema.pick({ [field]: true });
         partialSchema.parse({ [field]: value });
         setErrors(prev => ({ ...prev, [field]: '' }));
         onChange({ [field]: value });
       } catch (error: any) {
         setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message || 'Invalid' }));
       }
     };

     return (
       <div className="space-y-4">
         {/* Basic Info */}
         <div>
           <label htmlFor={`name-${offer.id}`} className="block text-sm font-medium mb-1">
             Offer Name *
           </label>
           <input
             id={`name-${offer.id}`}
             type="text"
             value={offer.name}
             onChange={(e) => handleChange('name', e.target.value)}
             className="w-full border rounded px-3 py-2"
             placeholder="e.g., Tech Lead at Company X"
           />
           {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
         </div>

         <div>
           <label htmlFor={`salary-${offer.id}`} className="block text-sm font-medium mb-1">
             Annual Salary (ISK) *
           </label>
           <input
             id={`salary-${offer.id}`}
             type="number"
             value={offer.salary}
             onChange={(e) => handleChange('salary', Number(e.target.value))}
             className="w-full border rounded px-3 py-2"
             placeholder="6000000"
           />
           {errors.salary && <p className="text-red-600 text-sm mt-1">{errors.salary}</p>}
         </div>

         {/* Work Details */}
         <div className="grid grid-cols-2 gap-4">
           <div>
             <label htmlFor={`weeklyHours-${offer.id}`} className="block text-sm font-medium mb-1">
               Weekly Hours
             </label>
             <input
               id={`weeklyHours-${offer.id}`}
               type="number"
               value={offer.weeklyHours}
               onChange={(e) => handleChange('weeklyHours', Number(e.target.value))}
               className="w-full border rounded px-3 py-2"
             />
             {errors.weeklyHours && <p className="text-red-600 text-sm mt-1">{errors.weeklyHours}</p>}
           </div>

           <div>
             <label htmlFor={`vacationDays-${offer.id}`} className="block text-sm font-medium mb-1">
               Vacation Days
             </label>
             <input
               id={`vacationDays-${offer.id}`}
               type="number"
               value={offer.vacationDays}
               onChange={(e) => handleChange('vacationDays', Number(e.target.value))}
               className="w-full border rounded px-3 py-2"
             />
           </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
           <div>
             <label htmlFor={`commuteMinutes-${offer.id}`} className="block text-sm font-medium mb-1">
               Daily Commute (minutes)
             </label>
             <input
               id={`commuteMinutes-${offer.id}`}
               type="number"
               value={offer.commuteMinutes}
               onChange={(e) => handleChange('commuteMinutes', Number(e.target.value))}
               className="w-full border rounded px-3 py-2"
             />
           </div>

           <div>
             <label htmlFor={`pensionPercent-${offer.id}`} className="block text-sm font-medium mb-1">
               Pension (%)
             </label>
             <input
               id={`pensionPercent-${offer.id}`}
               type="number"
               step="0.1"
               value={offer.pensionPercent}
               onChange={(e) => handleChange('pensionPercent', Number(e.target.value))}
               className="w-full border rounded px-3 py-2"
             />
           </div>
         </div>

         {/* Benefits (placeholder - implement BenefitsField component) */}
         {/* Non-monetary factors (placeholder - implement RatingField components) */}

         <div>
           <label htmlFor={`notes-${offer.id}`} className="block text-sm font-medium mb-1">
             Additional Notes
           </label>
           <textarea
             id={`notes-${offer.id}`}
             value={offer.notes}
             onChange={(e) => handleChange('notes', e.target.value)}
             className="w-full border rounded px-3 py-2"
             rows={3}
             placeholder="Any other important details..."
           />
         </div>
       </div>
     );
   }
   ```

**Requirements Traced**: AC-2, AC-11, AC-17, NFR-3

**Estimated Effort**: 4-5 hours

---

### Task 3.3: Input Validation & Error Handling

**Objective**: Add comprehensive validation and user-friendly error messages.

**Files to Modify**:
- `app/(tools)/job-offer-comparison/components/OfferFormFields.tsx` (validation already added in Task 3.2)

**Functionality**:
- Real-time validation on blur (implemented in Task 3.2)
- Error messages below fields (implemented in Task 3.2)
- Visual indicators for invalid fields (red border)
- Prevent saving invalid data

**Requirements Traced**: AC-17

**Estimated Effort**: 1 hour (mostly covered in Task 3.2)

---

## 5. Epic 4: Comparison Display

**Goal**: Build UI components to display the comparison results.
**Estimated Effort**: 6-8 hours
**Priority**: High

---

### Task 4.1: Comparison Table (Desktop)

**Objective**: Create side-by-side comparison table for desktop.

**Files to Create**:
- `app/(tools)/job-offer-comparison/components/ComparisonTable.tsx`

**Functionality**:

```typescript
// app/(tools)/job-offer-comparison/components/ComparisonTable.tsx
'use client';

import { ComparisonResult } from '@/lib/types/jobOffer';
import { analyzeComparison } from '@/lib/calculations/comparisonAnalyzer';
import { useComparison } from '../hooks/useComparison';

export default function ComparisonTable() {
  const { offers, canCompare } = useComparison();

  if (!canCompare) {
    return (
      <div className="text-center py-8 text-gray-500">
        Add at least 2 offers to see comparison
      </div>
    );
  }

  const comparison = analyzeComparison(offers);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Metric</th>
            {comparison.offers.map((offer) => {
              const ranking = comparison.rankings.find(r => r.offerId === offer.id);
              const isBest = ranking?.rank === 1;
              return (
                <th key={offer.id} className={`border p-3 text-left ${isBest ? 'bg-green-50' : ''}`}>
                  {offer.name} {isBest && '🏆'}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-3 font-medium">Annual Salary</td>
            {comparison.offers.map(offer => (
              <td key={offer.id} className="border p-3">
                {offer.salary.toLocaleString('is-IS')} kr
              </td>
            ))}
          </tr>

          <tr className="bg-blue-50">
            <td className="border p-3 font-bold">Actual Hourly Wage</td>
            {comparison.offers.map(offer => {
              const metric = comparison.metrics.find(m => m.offerId === offer.id);
              const ranking = comparison.rankings.find(r => r.offerId === offer.id);
              const isBest = ranking?.rank === 1;
              return (
                <td key={offer.id} className={`border p-3 font-bold ${isBest ? 'text-green-600' : ''}`}>
                  {metric?.actualHourlyWage.toLocaleString('is-IS')} kr/klst
                </td>
              );
            })}
          </tr>

          <tr>
            <td className="border p-3 font-medium">Annual Work Hours</td>
            {comparison.offers.map(offer => {
              const metric = comparison.metrics.find(m => m.offerId === offer.id);
              return (
                <td key={offer.id} className="border p-3">
                  {metric?.annualWorkHours.toLocaleString('is-IS')} klst
                </td>
              );
            })}
          </tr>

          <tr>
            <td className="border p-3 font-medium">Commute Hours/Year</td>
            {comparison.offers.map(offer => {
              const metric = comparison.metrics.find(m => m.offerId === offer.id);
              return (
                <td key={offer.id} className="border p-3">
                  {metric?.annualCommuteHours.toLocaleString('is-IS')} klst
                </td>
              );
            })}
          </tr>

          <tr className="bg-yellow-50">
            <td className="border p-3 font-bold">Total Life Energy (hrs/year)</td>
            {comparison.offers.map(offer => {
              const metric = comparison.metrics.find(m => m.offerId === offer.id);
              return (
                <td key={offer.id} className="border p-3 font-bold">
                  {metric?.annualTotalHours.toLocaleString('is-IS')} klst
                  <div className="text-sm text-gray-600">
                    ({metric?.lifeEnergyCost.days.toFixed(1)} days)
                  </div>
                </td>
              );
            })}
          </tr>

          <tr>
            <td className="border p-3 font-medium">Difference from Best</td>
            {comparison.offers.map(offer => {
              const ranking = comparison.rankings.find(r => r.offerId === offer.id);
              return (
                <td key={offer.id} className="border p-3 text-sm">
                  {ranking?.differenceFromBest.plainLanguage}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

**Requirements Traced**: AC-4, AC-5, AC-15, AC-16

**Estimated Effort**: 3-4 hours

---

### Task 4.2: Comparison Cards (Mobile)

**Objective**: Create mobile-friendly swipeable comparison view.

**Files to Create**:
- `app/(tools)/job-offer-comparison/components/ComparisonCards.tsx`

**Functionality**:
- Swipeable cards (one offer per view)
- "X of Y" indicator
- Quick comparison summary
- Responsive design for mobile screens

**Requirements Traced**: AC-16, NFR-5

**Estimated Effort**: 2-3 hours

---

### Task 4.3: Life Energy Visualizer

**Objective**: Create visual representation of life energy differences.

**Files to Create**:
- `app/(tools)/job-offer-comparison/components/LifeEnergyVisualizer.tsx`

**Functionality**:

```typescript
// app/(tools)/job-offer-comparison/components/LifeEnergyVisualizer.tsx
'use client';

import { analyzeComparison } from '@/lib/calculations/comparisonAnalyzer';
import { useComparison } from '../hooks/useComparison';

export default function LifeEnergyVisualizer() {
  const { offers, canCompare } = useComparison();

  if (!canCompare) return null;

  const comparison = analyzeComparison(offers);
  const maxHours = Math.max(...comparison.metrics.map(m => m.annualTotalHours));

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Life Energy Comparison</h3>

      {/* Bar Chart */}
      <div className="space-y-3 mb-6">
        {comparison.offers.map(offer => {
          const metric = comparison.metrics.find(m => m.offerId === offer.id)!;
          const percentage = (metric.annualTotalHours / maxHours) * 100;
          const ranking = comparison.rankings.find(r => r.offerId === offer.id);
          const isBest = ranking?.rank === 1;

          return (
            <div key={offer.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{offer.name}</span>
                <span>{metric.annualTotalHours.toLocaleString('is-IS')} klst</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className={`h-6 rounded-full flex items-center px-2 text-white text-xs ${
                    isBest ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                >
                  {metric.lifeEnergyCost.days.toFixed(0)} days
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plain Language Explanations */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">What does this mean?</h4>
        {comparison.rankings
          .filter(r => r.rank !== 1)
          .map(ranking => {
            const offer = comparison.offers.find(o => o.id === ranking.offerId)!;
            return (
              <div key={ranking.offerId} className="text-sm text-gray-700 bg-yellow-50 p-3 rounded">
                <strong>{offer.name}:</strong> {ranking.differenceFromBest.plainLanguage}
              </div>
            );
          })}
      </div>
    </div>
  );
}
```

**Requirements Traced**: AC-5, AC-14

**Estimated Effort**: 2-3 hours

---

## 6. Epic 5: Page Integration & Polish

**Goal**: Integrate all components into the page and add final polish.
**Estimated Effort**: 8-10 hours
**Priority**: High

---

### Task 5.1: Page Component & Layout

**Objective**: Create the main page component and integrate all sections.

**Files to Create**:
- `app/(tools)/job-offer-comparison/page.tsx`
- `app/(tools)/job-offer-comparison/layout.tsx` (optional)

**Functionality**:

```typescript
// app/(tools)/job-offer-comparison/page.tsx
import { ComparisonProvider } from './components/ComparisonProvider';
import OfferInputSection from './components/OfferInputSection';
import ComparisonViewSection from './components/ComparisonViewSection';
import ComparisonActions from './components/ComparisonActions';

export const metadata = {
  title: 'Job Offer Comparison Tool | Peningana eða lífið',
  description: 'Compare multiple job offers based on actual hourly wage and life energy cost.',
};

export default function JobOfferComparisonPage() {
  return (
    <ComparisonProvider>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Offer Comparison Tool</h1>
          <p className="text-gray-600">
            Compare job offers beyond salary - understand the true life energy cost of each opportunity.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Input Section */}
          <div className="lg:col-span-1">
            <OfferInputSection />
          </div>

          {/* Right: Comparison Section */}
          <div className="lg:col-span-2">
            <ComparisonViewSection />
            <ComparisonActions />
          </div>
        </div>
      </div>
    </ComparisonProvider>
  );
}
```

**Requirements Traced**: All (page integration)

**Estimated Effort**: 3-4 hours

---

### Task 5.2: Assumptions Panel

**Objective**: Create collapsible panel showing all calculation assumptions.

**Files to Create**:
- `app/(tools)/job-offer-comparison/components/AssumptionsPanel.tsx`

**Functionality**:

```typescript
// app/(tools)/job-offer-comparison/components/AssumptionsPanel.tsx
'use client';

import { useState } from 'react';
import { useComparison } from '../hooks/useComparison';
import { analyzeComparison } from '@/lib/calculations/comparisonAnalyzer';

export default function AssumptionsPanel() {
  const { offers, showAssumptions, toggleAssumptions } = useComparison();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(
    offers[0]?.id || null
  );

  if (offers.length < 2) return null;

  const comparison = analyzeComparison(offers);
  const offer = offers.find(o => o.id === selectedOffer);
  const metric = comparison.metrics.find(m => m.offerId === selectedOffer);

  if (!offer || !metric) return null;

  return (
    <div className="border rounded-lg mt-6">
      <button
        onClick={toggleAssumptions}
        className="w-full p-4 text-left font-semibold flex justify-between items-center hover:bg-gray-50"
      >
        <span>View Calculation Details & Assumptions</span>
        <span>{showAssumptions ? '▲' : '▼'}</span>
      </button>

      {showAssumptions && (
        <div className="p-4 border-t">
          {/* Offer Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Offer:</label>
            <select
              value={selectedOffer || ''}
              onChange={(e) => setSelectedOffer(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {offers.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* Assumptions Display */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Inputs Used:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Annual salary: {offer.salary.toLocaleString('is-IS')} ISK</li>
                <li>✓ Weekly hours: {offer.weeklyHours} hours</li>
                <li>✓ Vacation days: {offer.vacationDays} days</li>
                <li>✓ Daily commute: {offer.commuteMinutes} minutes</li>
                <li>✓ Pension: {offer.pensionPercent}%</li>
                {offer.monetaryBenefits.length > 0 && (
                  <li>
                    ✓ Benefits: {offer.monetaryBenefits.map(b => b.label).join(', ')} (
                    {offer.monetaryBenefits.reduce((sum, b) => sum + b.annualValue, 0).toLocaleString('is-IS')} ISK/year)
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Calculation Breakdown:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Total compensation: {metric.totalCompensation.toLocaleString('is-IS')} ISK</li>
                <li>Work weeks per year: {((52 - offer.vacationDays / 5)).toFixed(1)} weeks</li>
                <li>Work hours per year: {metric.annualWorkHours.toLocaleString('is-IS')} hours</li>
                <li>Commute hours per year: {metric.annualCommuteHours.toLocaleString('is-IS')} hours</li>
                <li>Total hours required: {metric.annualTotalHours.toLocaleString('is-IS')} hours</li>
                <li>
                  Actual hourly wage: {metric.totalCompensation.toLocaleString('is-IS')} ÷{' '}
                  {metric.annualTotalHours.toLocaleString('is-IS')} ={' '}
                  <strong>{metric.actualHourlyWage.toLocaleString('is-IS')} ISK/hour</strong>
                </li>
              </ol>
            </div>

            <div className="pt-2 border-t">
              <a href="/methodology" className="text-blue-600 text-sm hover:underline">
                Learn more about the Actual Hourly Wage methodology →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Requirements Traced**: AC-6, AC-16

**Estimated Effort**: 2-3 hours

---

### Task 5.3: Responsive Design & Mobile Optimization

**Objective**: Ensure all components work well on mobile devices.

**Files to Modify**:
- All component files (add responsive classes)

**Functionality**:
- Mobile-first CSS classes
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Test on various screen sizes
- Swipe gestures for mobile cards

**Requirements Traced**: AC-16, NFR-5

**Estimated Effort**: 2-3 hours

---

### Task 5.4: i18n Implementation

**Objective**: Add Icelandic and English language support.

**Files to Create**:
- `locales/is/job-comparison.json`
- `locales/en/job-comparison.json`

**Functionality**:

```json
// locales/is/job-comparison.json
{
  "page": {
    "title": "Starfstilboð Samanburður",
    "description": "Berðu saman margfaldar starfstilboð á grundvelli raunverulegs tímakaupsog lífsorku kostnaðar"
  },
  "offerCard": {
    "untitled": "Ónefnt tilboð",
    "expand": "Stækka",
    "collapse": "Minnka",
    "duplicate": "Afrita",
    "remove": "Fjarlægja",
    "actualHourlyWage": "Raunverulegt tímakaup",
    "hoursPerYear": "klst/ár samtals"
  },
  "fields": {
    "name": "Nafn tilboðs",
    "salary": "Árslaun (ISK)",
    "weeklyHours": "Vikustundir",
    "vacationDays": "Orlofsdagar",
    "commuteMinutes": "Daglegur ferðatími (mínútur)",
    "pensionPercent": "Lífeyrir (%)",
    "notes": "Athugasemdir"
  }
}
```

**Requirements Traced**: AC-13

**Estimated Effort**: 2-3 hours

---

### Task 5.5: Accessibility Enhancements

**Objective**: Ensure WCAG AA compliance.

**Files to Modify**:
- All components (add ARIA labels, semantic HTML)

**Functionality**:
- All interactive elements keyboard accessible
- ARIA labels on all form fields
- Screen reader announcements for dynamic updates
- Focus management (modals, form submission)
- Color contrast ratios meet WCAG AA
- Skip links for keyboard navigation

**Tests**:
- axe-core automated testing
- Manual keyboard navigation
- Screen reader testing (NVDA/JAWS)

**Requirements Traced**: NFR-8, NFR-9

**Estimated Effort**: 2-3 hours

---

## 7. Epic 6: Testing & Quality Assurance

**Goal**: Comprehensive testing across all layers.
**Estimated Effort**: 6-8 hours
**Priority**: High

---

### Task 6.1: Unit Tests

**Objective**: Test all business logic modules.

**Files to Test**:
- `lib/calculations/actualHourlyWage.ts` (already tested in Task 1.2)
- `lib/calculations/comparisonAnalyzer.ts` (already tested in Task 1.3)
- `lib/storage/comparisonStorage.ts` (already tested in Task 1.4)
- `lib/io/exportImport.ts` (test in Task 2.3)

**Coverage Target**: 80%+

**Requirements Traced**: All calculation and data logic requirements

**Estimated Effort**: 2 hours (mostly done in earlier tasks)

---

### Task 6.2: Integration Tests

**Objective**: Test component integration and user workflows.

**Files to Test**:
- `OfferCard.tsx` (form submission, live calculation)
- `ComparisonTable.tsx` (comparison rendering, ranking)
- `ComparisonProvider.tsx` (state management)

**Test Cases**:
- Add offer → See in comparison
- Edit offer → Comparison updates
- Remove offer → Comparison recalculates
- Export → Import → Verify data

**Requirements Traced**: Component interaction requirements

**Estimated Effort**: 2-3 hours

---

### Task 6.3: E2E Tests

**Objective**: Test complete user workflows.

**Tool**: Playwright

**Test Scenarios**:

```typescript
// e2e/job-comparison.spec.ts
import { test, expect } from '@playwright/test';

test('complete comparison workflow', async ({ page }) => {
  await page.goto('/tools/job-offer-comparison');

  // Add first offer
  await page.click('text=Add Offer');
  await page.fill('input[name="name"]', 'Tech Lead at X');
  await page.fill('input[name="salary"]', '6000000');
  await page.fill('input[name="weeklyHours"]', '40');

  // Add second offer
  await page.click('text=Add Offer');
  await page.fill('input[name="name"]', 'Senior Dev at Y');
  await page.fill('input[name="salary"]', '5800000');

  // Verify comparison appears
  await expect(page.locator('text=Comparison')).toBeVisible();
  await expect(page.locator('text=🏆')).toBeVisible();

  // Export
  const downloadPromise = page.waitForEvent('download');
  await page.click('text=Export');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/job-comparison-\d{4}-\d{2}-\d{2}\.json/);
});

test('validation errors', async ({ page }) => {
  await page.goto('/tools/job-offer-comparison');
  await page.click('text=Add Offer');

  // Try invalid salary
  await page.fill('input[name="salary"]', '-1000');
  await page.blur('input[name="salary"]');
  await expect(page.locator('text=Salary must be positive')).toBeVisible();

  // Try invalid weekly hours
  await page.fill('input[name="weeklyHours"]', '200');
  await page.blur('input[name="weeklyHours"]');
  await expect(page.locator('text=Only 168 hours in a week')).toBeVisible();
});
```

**Requirements Traced**: End-to-end user workflows

**Estimated Effort**: 3-4 hours

---

## 8. Task Summary & Sequencing

### 8.1 Recommended Implementation Order

**Phase 1: Foundation (Week 1)**
1. Task 1.1: Data Models & Validation (Day 1)
2. Task 1.2: Actual Hourly Wage Calculator (Day 1-2)
3. Task 1.3: Comparison Analyzer (Day 2)
4. Task 1.4: Data Persistence Module (Day 2)
5. Task 6.1: Unit Tests (Day 2, parallel with above)

**Phase 2: State & Storage (Week 1)**
6. Task 2.1: React Context Provider (Day 3)
7. Task 2.2: localStorage Integration (Day 3)
8. Task 2.3: Export/Import Functionality (Day 3)

**Phase 3: UI Components (Week 2)**
9. Task 3.1: Offer Card Component (Day 4)
10. Task 3.2: Form Fields Components (Day 4-5)
11. Task 3.3: Input Validation (Day 5, parallel with 3.2)
12. Task 4.1: Comparison Table (Day 5)
13. Task 4.2: Comparison Cards (Mobile) (Day 6)
14. Task 4.3: Life Energy Visualizer (Day 6)

**Phase 4: Integration & Polish (Week 2-3)**
15. Task 5.1: Page Component & Layout (Day 7)
16. Task 5.2: Assumptions Panel (Day 7)
17. Task 5.3: Responsive Design (Day 8)
18. Task 5.4: i18n Implementation (Day 8)
19. Task 5.5: Accessibility Enhancements (Day 9)

**Phase 5: Testing (Week 3)**
20. Task 6.2: Integration Tests (Day 9)
21. Task 6.3: E2E Tests (Day 10)

### 8.2 Parallel Execution Opportunities

**Can Run in Parallel**:
- Tasks 1.1-1.4 + Task 6.1 (one person on logic, one on tests)
- Tasks 3.1-3.2 + Task 4.1 (one on input, one on display)
- Tasks 5.3-5.5 (polish tasks can overlap)

**Must Be Sequential**:
- Epic 1 → Epic 2 → Epic 3 (foundation before UI)
- Task 3.2 → Task 5.1 (need form fields before page integration)
- All development → Epic 6 (testing after features complete)

### 8.3 Critical Path

```
Task 1.1 → Task 1.2 → Task 2.1 → Task 3.1 → Task 3.2 → Task 5.1 → Task 6.3
(Data Models → Calculator → State → Input UI → Page → E2E Tests)
```

**Estimated Critical Path Duration**: 24-30 hours (3-4 days for one developer)

---

## 9. Acceptance Criteria for Tasks

Each task is considered complete when:

- [ ] All code is written and follows project style guidelines
- [ ] Unit tests are written and passing (if applicable)
- [ ] Component tests are written and passing (for UI tasks)
- [ ] Code is reviewed (self-review or peer review)
- [ ] No linting errors
- [ ] TypeScript types are correct (no `any` types without justification)
- [ ] Requirements traced to this task are satisfied
- [ ] Manual testing completed for user-facing features
- [ ] Accessibility checked (keyboard nav, screen reader)
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Documentation updated (if needed)

---

## 10. Risk Assessment

### 10.1 Technical Risks

**Risk 1: Actual Hourly Wage Methodology Dependency**
- **Likelihood**: Medium
- **Impact**: High
- **Mitigation**: Stub the calculation initially; implement full methodology in parallel

**Risk 2: localStorage Quota Exceeded**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Graceful error handling, offer export as alternative

**Risk 3: Complex Validation Logic**
- **Likelihood**: Medium
- **Impact**: Low
- **Mitigation**: Use Zod for declarative validation; write comprehensive tests

### 10.2 UX Risks

**Risk 1: Mobile Comparison View Too Cramped**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**: Prototype early, test on real devices, iterate on design

**Risk 2: Non-Monetary Factors Confusing**
- **Likelihood**: Medium
- **Impact**: Low
- **Mitigation**: Clear guidance text, separate display from monetary comparison

### 10.3 Schedule Risks

**Risk 1: i18n Integration Takes Longer Than Expected**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: Can launch with Icelandic only, add English post-MVP

**Risk 2: E2E Tests Are Flaky**
- **Likelihood**: Medium
- **Impact**: Low
- **Mitigation**: Use Playwright best practices, retry logic, stable selectors

---

## 11. Definition of Done

The Job Offer Comparison Tool feature is considered **DONE** when:

### Functionality
- [ ] Users can add 2-5 job offers with all required fields
- [ ] Actual hourly wage is calculated correctly for each offer
- [ ] Side-by-side comparison displays all key metrics
- [ ] Life energy visualizer shows plain language explanations
- [ ] Assumptions panel displays all calculation details
- [ ] Export/import functionality works correctly
- [ ] Data persists in localStorage automatically
- [ ] All validation works with helpful error messages

### Quality
- [ ] All unit tests passing (80%+ coverage on business logic)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] No linting errors
- [ ] TypeScript compilation successful with no errors
- [ ] Accessibility audit passes (axe-core, manual testing)
- [ ] Responsive design works on mobile, tablet, desktop

### Documentation
- [ ] Code is commented where necessary
- [ ] Complex calculations have inline documentation
- [ ] README updated with feature description (if needed)
- [ ] User-facing help text is clear and helpful

### Design Compliance
- [ ] All requirements from `requirements-job-offer-comparison.md` are satisfied
- [ ] All design specifications from `design-job-offer-comparison.md` are implemented
- [ ] UX matches wireframes/mockups (if created)

### Performance
- [ ] Calculations complete within 200ms (NFR-1)
- [ ] Page loads within 2 seconds on 3G network
- [ ] No memory leaks (tested with Chrome DevTools)

### Acceptance
- [ ] Product owner / stakeholder approval
- [ ] Manual testing by QA (if applicable)
- [ ] Beta testing with 2-3 real users (recommended)

---

## 12. Post-Launch Tasks (Optional)

**PL-1: Analytics Integration**
- Track feature usage (how many comparisons created)
- Track export usage
- Identify drop-off points

**PL-2: User Feedback Collection**
- Add "Was this helpful?" button
- Collect qualitative feedback on calculation accuracy
- Survey users on missing features

**PL-3: Performance Monitoring**
- Add performance monitoring (Web Vitals)
- Track localStorage usage patterns
- Monitor error rates

**PL-4: Iteration Based on Feedback**
- Address bugs reported by users
- Consider Phase 2 features (from design doc section 12.1)
- Refine UX based on usage patterns

---

## 13. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-22 | Tasks Agent | Initial tasks breakdown created |

---

**Document Status**: Ready for Implementation
**Next Step**: Begin Task 1.1 (Data Models & Validation) and establish development environment.

**Estimated Total Implementation Time**: 32-40 hours (4-5 days for solo developer, 2-3 days for pair/team)
