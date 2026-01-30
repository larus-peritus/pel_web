# Tasks: Bílaeign Kostnaðarreiknivél (Car Ownership Cost Calculator)

## Yfirlit

**Eiginleiki**: Bílaeign Kostnaðarreiknivél
**App**: peninganaedalifid.is
**Requirements**: [requirements.md](./requirements.md)
**Design**: [design.md](./design.md)

## Innleiðingarstefna

**Valin stefna**: Foundation-first með nokkrum feature-slice elements

**Rökstuðningur**:
- TypeScript types og calculation logic eru foundation fyrir allan eiginleikann
- Validation logic þarf að vera til staðar áður en UI er byggt
- Context integration er nauðsynleg fyrir allt annað
- Components byggja á foundation (types, calculations, validation)
- Testing fylgir TDD pattern þar sem við á

**Ávinningur**:
- Auðvelt að prófa calculations án UI
- Types veita type safety fyrir alla components
- Context integration kemur snemma í veg fyrir síðari refactoring
- Components geta notað stable foundation

---

## Epic 1: Foundation og gagnalíkön

**Markmið**: Búa til TypeScript types, gagnalíkön, og validation fyrir bílaeign reiknivélina

**Háðir**: Engar (foundation epic)

**Áætlaður tími**: 4-6 klukkustundir

---

### Task 1.1: Búa til TypeScript types og interfaces

**Markmið**: Skilgreina öll TypeScript types fyrir car ownership calculator

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/types/calculator.ts` (bæta við)

**Virkni sem á að innleiða**:
1. Bæta við eftirfarandi types í `calculator.ts`:
   ```typescript
   // Car ownership types
   interface CarOwnershipScenario {
     id: string;
     name: string;
     inputs: CarOwnershipInputs;
     results: CarOwnershipResults;
     createdAt: string;
     updatedAt: string;
     isCurrent?: boolean;
   }

   interface CarOwnershipInputs {
     purchasePrice: number;
     currentMarketValue?: number;
     estimatedLifetimeYears: number;
     hasFinancing: boolean;
     financing?: FinancingDetails;
     monthlyKm: number;
     fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
     fuelConsumption: number;
     fuelPrice: number;
     annualInsurance: number;
     annualRegistrationTax: number;
     biannualInspection: number;
     annualMaintenance: number;
     tiresEveryNYears: number;
     tiresCost: number;
     monthlyParking: number;
     monthlyTolls: number;
   }

   interface FinancingDetails {
     downPayment: number;
     loanAmount: number;
     annualInterestRate: number;
     loanTermYears: number;
   }

   interface CarOwnershipResults {
     directMonthlyCost: number;
     indirectMonthlyCost: number;
     totalMonthlyCost: number;
     totalYearlyCost: number;
     costBreakdown: CarCostBreakdownItem[];
     fuelCostMonthly: number;
     parkingCostMonthly: number;
     tollsCostMonthly: number;
     loanPaymentMonthly: number;
     depreciationMonthly: number;
     insuranceMonthly: number;
     registrationTaxMonthly: number;
     inspectionMonthly: number;
     maintenanceMonthly: number;
     tiresMonthly: number;
     lifeEnergyHoursPerMonth: number;
     lifeEnergyHoursPerYear: number;
     futureValue5Years: number;
     futureValue10Years: number;
     futureValue20Years: number;
     totalInterestPaid?: number;
     totalLoanCost?: number;
   }

   interface CarCostBreakdownItem {
     category: string;
     label: string;
     monthlyCost: number;
     percentage: number;
     isDirect: boolean;
   }

   interface CarPreset {
     id: string;
     category: 'small' | 'medium' | 'suv' | 'electric' | 'old';
     label: string;
     description: string;
     inputs: Omit<CarOwnershipInputs, 'name'>;
   }
   ```

2. Bæta við `carOwnershipScenarios: CarOwnershipScenario[]` í `StoredState` interface

**Prófanir sem þarf að skrifa**:
- Type checking passar (TypeScript compiler)
- Engin runtime tests fyrir types

**Viðmiðanir um árangur**:
- [x] Allar types eru skilgreindar
- [x] TypeScript compiler kastar engum villum
- [x] Types eru vel documented með comments
- [x] StoredState interface er uppfært

**Kröfutengsl**: NS-1, NS-2, NS-3, NS-4, NS-5

**Áætlaður tími**: 1 klst

---

### Task 1.2: Búa til validation functions ✅ Completed 2026-01-20

**Markmið**: Innleiða validation logic fyrir car ownership inputs

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/validation/car.ts` (nýtt) ✅
- `/apps/peninganaedalifid/src/lib/validation/__tests__/car.test.ts` (nýtt) ✅

**Virkni sem á að innleiða**:
1. Búa til `validateCarOwnershipInputs()` function:
   ```typescript
   export function validateCarOwnershipInputs(
     inputs: Partial<CarOwnershipInputs>
   ): {
     isValid: boolean;
     errors: Record<string, string>;
     warnings?: Record<string, string>;
   }
   ```

2. Validation reglur:
   - `purchasePrice`: > 0
   - `estimatedLifetimeYears`: > 0, <= 30
   - `monthlyKm`: > 0, <= 10000
   - If `hasFinancing === true`:
     - `financing.loanAmount`: > 0
     - `financing.annualInterestRate`: > 0, <= 30
     - `financing.loanTermYears`: > 0, <= 15
     - Warning ef `downPayment + loanAmount` ekki ≈ `purchasePrice` (±5%)
   - `fuelConsumption`: > 0, <= 50
   - `fuelPrice`: > 0, <= 1000
   - Allar annual/monthly costs: >= 0

3. Icelandic error messages fyrir allar validation errors

**Prófanir sem þarf að skrifa**:
- Unit tests í `/lib/validation/__tests__/car.test.ts`:
  - Test fyrir hvert validation rule
  - Test fyrir edge cases (0, negative, very high values)
  - Test fyrir financing conditional validation
  - Test fyrir warning messages

**Viðmiðanir um árangur**:
- [x] `validateCarOwnershipInputs()` virkar rétt
- [x] Allar validation reglur útfærðar
- [x] Icelandic error messages
- [x] Unit tests passa (100% coverage)

**Kröfutengsl**: NS-1, Ekki-virknikröfur (Áreiðanleiki)

**Áætlaður tími**: 1.5 klst

---

### Task 1.3: Búa til default gildi og constants ✅ Completed 2026-01-20

**Markmið**: Skilgreina default gildi fyrir íslenskt samhengi

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/defaults/car.ts` (nýtt) ✅
- `/apps/peninganaedalifid/src/lib/defaults/__tests__/car.test.ts` (nýtt) ✅

**Virkni sem á að innleiða**:
1. Default gildi:
   ```typescript
   export const DEFAULT_CAR_INPUTS: CarOwnershipInputs = {
     purchasePrice: 0,
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
   };
   ```

2. Icelandic constants:
   ```typescript
   export const FUEL_TYPE_LABELS: Record<string, string> = {
     gasoline: 'Bensín',
     diesel: 'Dísel',
     electric: 'Rafmagn',
     hybrid: 'Tvinnbíll',
   };

   export const CAR_CATEGORY_LABELS: Record<string, string> = {
     small: 'Lítill bíll',
     medium: 'Meðalstór bíll',
     suv: 'Jeppi',
     electric: 'Rafbíll',
     old: 'Gamall bíll',
   };
   ```

**Prófanir sem þarf að skrifa**:
- Unit tests fyrir default gildi:
  - Validate að default inputs passa validation
  - Test að allir labels séu til staðar

**Viðmiðanir um árangur**:
- [x] Default gildi skilgreind
- [x] Icelandic labels fyrir allar enum values
- [x] Default gildi passa validation
- [x] Unit tests passa

**Kröfutengsl**: NS-6

**Áætlaður tími**: 0.5 klst

---

## Epic 2: Útreikningar (Calculations) ✅ Completed 2026-01-20

**Markmið**: Innleiða alla calculation logic fyrir car ownership costs

**Háðir**: Epic 1 (types og validation)

**Áætlaður tími**: 6-8 klukkustundir

---

### Task 2.1-2.6: All Calculation Functions ✅ Completed 2026-01-20

**Markmið**: Reikna beinn mánaðarlegan kostnað (eldsneytis, parkering, veggjöld)

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/calculations/car.ts` (nýtt)

**Virkni sem á að innleiða**:
1. Fuel cost calculation:
   ```typescript
   function calculateFuelCost(
     monthlyKm: number,
     fuelConsumption: number,
     fuelPrice: number
   ): number {
     return (monthlyKm * fuelConsumption / 100) * fuelPrice;
   }
   ```

2. Direct costs aggregation:
   ```typescript
   function calculateDirectMonthlyCost(inputs: CarOwnershipInputs): {
     fuelCostMonthly: number;
     parkingCostMonthly: number;
     tollsCostMonthly: number;
     directMonthlyCost: number;
   }
   ```

**Prófanir sem þarf að skrifa**:
- Unit tests í `/lib/calculations/__tests__/car.test.ts`:
  - Test fuel cost fyrir gasoline (1500 km, 7.5 L/100km, 300 kr/L → 3375 kr)
  - Test fuel cost fyrir electric (1500 km, 18 kWh/100km, 30 kr/kWh → 810 kr)
  - Test parking og tolls aggregation
  - Test edge cases (0 km, very high consumption)

**Viðmiðanir um árangur**:
- [x] Fuel cost reiknast rétt fyrir allar eldsneytstegundir
- [x] Direct costs aggregation virkar
- [x] Unit tests passa (100% coverage)
- [x] Performance < 10ms

**Kröfutengsl**: NS-2

**Áætlaður tími**: 1.5 klst

---

### Task 2.2: Innleiða lánsútreikninga

**Markmið**: Reikna mánaðarlega lánsgreiðslu og heildarvexti

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/calculations/car.ts` (bæta við)

**Virkni sem á að innleiða**:
1. Monthly loan payment calculation:
   ```typescript
   function calculateLoanPayment(
     loanAmount: number,
     annualInterestRate: number,
     loanTermYears: number
   ): number {
     const r = annualInterestRate / 12 / 100;
     const n = loanTermYears * 12;
     return loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
   }
   ```

2. Total interest calculation:
   ```typescript
   function calculateTotalInterest(
     loanPaymentMonthly: number,
     loanAmount: number,
     loanTermYears: number
   ): number {
     const totalPayments = loanPaymentMonthly * (loanTermYears * 12);
     return totalPayments - loanAmount;
   }
   ```

**Prófanir sem þarf að skrifa**:
- Unit tests:
  - Test loan payment með þekktum gildum (3M kr, 5 ár, 7% → ~59,406 kr/mán)
  - Test total interest calculation
  - Test edge cases (0% interest, very short/long terms)
  - Test að payment = 0 ef hasFinancing === false

**Viðmiðanir um árangur**:
- [x] Loan payment formula rétt
- [x] Total interest reiknast rétt
- [x] Returns 0 ef engir lán
- [x] Unit tests passa (100% coverage)

**Kröfutengsl**: NS-1, NS-2

**Áætlaður tími**: 1 klst

---

### Task 2.3: Innleiða óbeina kostnaðarútreikninga

**Markmið**: Reikna óbeinan mánaðarlegan kostnað (afskriftir, tryggingar, etc.)

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/calculations/car.ts` (bæta við)

**Virkni sem á að innleiða**:
1. Depreciation calculation (linear):
   ```typescript
   function calculateDepreciation(
     purchasePrice: number,
     estimatedLifetimeYears: number,
     currentMarketValue?: number
   ): number {
     if (currentMarketValue) {
       // More accurate if market value is known
       return (purchasePrice - currentMarketValue) / 12;
     }
     // Linear depreciation
     return (purchasePrice / estimatedLifetimeYears) / 12;
   }
   ```

2. Indirect costs aggregation:
   ```typescript
   function calculateIndirectMonthlyCost(inputs: CarOwnershipInputs): {
     depreciationMonthly: number;
     insuranceMonthly: number;
     registrationTaxMonthly: number;
     inspectionMonthly: number;
     maintenanceMonthly: number;
     tiresMonthly: number;
     indirectMonthlyCost: number;
   }
   ```

**Prófanir sem þarf að skrifa**:
- Unit tests:
  - Test linear depreciation (4M kr, 10 ár → 33,333 kr/mán)
  - Test depreciation með currentMarketValue
  - Test insurance monthly (150,000 kr/ár → 12,500 kr/mán)
  - Test inspection biannual averaging (12,000 kr/2 ár → 500 kr/mán)
  - Test tires averaging (60,000 kr/4 ár → 1,250 kr/mán)
  - Test aggregation

**Viðmiðanir um árangur**:
- [x] Afskriftir reiknaðar rétt
- [x] Allar indirect costs reiknaðar rétt
- [x] Aggregation virkar
- [x] Unit tests passa (100% coverage)

**Kröfutengsl**: NS-2

**Áætlaður tími**: 1.5 klst

---

### Task 2.4: Innleiða lífsorku útreikninga

**Markmið**: Reikna lífsorku kostnað miðað við raunverulegt tímakaup

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/calculations/car.ts` (bæta við)

**Virkni sem á að innleiða**:
1. Life energy calculation:
   ```typescript
   function calculateLifeEnergy(
     totalMonthlyCost: number,
     actualHourlyWage: number
   ): {
     lifeEnergyHoursPerMonth: number;
     lifeEnergyHoursPerYear: number;
   } {
     if (actualHourlyWage <= 0) {
       return { lifeEnergyHoursPerMonth: 0, lifeEnergyHoursPerYear: 0 };
     }
     const hoursPerMonth = totalMonthlyCost / actualHourlyWage;
     return {
       lifeEnergyHoursPerMonth: hoursPerMonth,
       lifeEnergyHoursPerYear: hoursPerMonth * 12,
     };
   }
   ```

**Prófanir sem þarf að skrifa**:
- Unit tests:
  - Test life energy með þekktum gildum (80,000 kr/mán, 5000 kr/klst → 16 klst/mán)
  - Test division by zero (actualHourlyWage = 0 → returns 0)
  - Test yearly calculation

**Viðmiðanir um árangur**:
- [x] Life energy reiknast rétt
- [x] Division by zero handled gracefully
- [x] Unit tests passa (100% coverage)

**Kröfutengsl**: NS-3

**Áætlaður tími**: 0.5 klst

---

### Task 2.5: Innleiða framtíðarvirði útreikninga

**Markmið**: Reikna framtíðarvirði ef kostnaður væri fjárfestur í staðinn

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/calculations/car.ts` (bæta við)

**Virkni sem á að innleiða**:
1. Future value calculation (reuse from existing calculateFutureValue if possible):
   ```typescript
   function calculateCarFutureValue(
     totalMonthlyCost: number
   ): {
     futureValue5Years: number;
     futureValue10Years: number;
     futureValue20Years: number;
   } {
     return {
       futureValue5Years: calculateFutureValue(totalMonthlyCost, 5),
       futureValue10Years: calculateFutureValue(totalMonthlyCost, 10),
       futureValue20Years: calculateFutureValue(totalMonthlyCost, 20),
     };
   }
   ```

**Prófanir sem þarf að skrifa**:
- Unit tests:
  - Test FV með þekktum gildum (80,000 kr/mán, 10 ár → ~13,800,000 kr)
  - Test 0 monthly cost → 0 FV
  - Test all three timeframes

**Viðmiðanir um árangur**:
- [x] Future value reiknast rétt
- [x] Reuses existing calculateFutureValue function
- [x] Unit tests passa (100% coverage)

**Kröfutengsl**: NS-4

**Áætlaður tími**: 0.5 klst

---

### Task 2.6: Innleiða aðal calculation function

**Markmið**: Samþætta alla útreikninga í eina `calculateCarOwnershipResults()` function

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/calculations/car.ts` (bæta við)

**Virkni sem á að innleiða**:
1. Main calculation function:
   ```typescript
   export function calculateCarOwnershipResults(
     inputs: CarOwnershipInputs,
     actualHourlyWage: number
   ): CarOwnershipResults {
     // Calculate direct costs
     const { fuelCostMonthly, parkingCostMonthly, tollsCostMonthly, directMonthlyCost }
       = calculateDirectMonthlyCost(inputs);

     // Calculate loan payment
     const loanPaymentMonthly = inputs.hasFinancing
       ? calculateLoanPayment(inputs.financing!.loanAmount, ...)
       : 0;

     // Calculate indirect costs
     const { depreciationMonthly, insuranceMonthly, ... indirectMonthlyCost }
       = calculateIndirectMonthlyCost(inputs);

     // Total costs
     const totalMonthlyCost = directMonthlyCost + loanPaymentMonthly + indirectMonthlyCost;
     const totalYearlyCost = totalMonthlyCost * 12;

     // Life energy
     const { lifeEnergyHoursPerMonth, lifeEnergyHoursPerYear }
       = calculateLifeEnergy(totalMonthlyCost, actualHourlyWage);

     // Future value
     const { futureValue5Years, futureValue10Years, futureValue20Years }
       = calculateCarFutureValue(totalMonthlyCost);

     // Cost breakdown
     const costBreakdown = generateCostBreakdown(...);

     // Return complete results
     return { ... };
   }
   ```

2. Cost breakdown generation:
   ```typescript
   function generateCostBreakdown(
     fuelCostMonthly: number,
     depreciationMonthly: number,
     // ... other costs
     totalMonthlyCost: number
   ): CarCostBreakdownItem[] {
     const items: CarCostBreakdownItem[] = [
       {
         category: 'fuel',
         label: 'Eldsneytis',
         monthlyCost: fuelCostMonthly,
         percentage: (fuelCostMonthly / totalMonthlyCost) * 100,
         isDirect: true,
       },
       // ... other items
     ];
     return items.sort((a, b) => b.monthlyCost - a.monthlyCost);
   }
   ```

**Prófanir sem þarf að skrifa**:
- Unit tests:
  - Integration test með heildstæðum inputs
  - Test að allir sub-calculations eru kallaðir
  - Test cost breakdown generation
  - Test sorting af breakdown items
  - Test með og án financing
  - Performance test (< 100ms)

**Viðmiðanir um árangur**:
- [x] `calculateCarOwnershipResults()` virkar rétt
- [x] Allar sub-calculations samþættar
- [x] Cost breakdown generast rétt
- [x] Unit tests passa (100% coverage)
- [x] Performance < 100ms

**Kröfutengsl**: NS-1, NS-2, NS-3, NS-4

**Áætlaður tími**: 2 klst

---

## Epic 3: Presets og sjálfgildi

**Markmið**: Búa til preset configurations fyrir algengar íslenskar bílasviðsmyndir

**Háðir**: Epic 1 (types), Epic 2 (calculations fyrir testing)

**Áætlaður tími**: 2-3 klukkustundir

---

### Task 3.1: Búa til car presets ✅ Completed 2026-01-20

**Markmið**: Skilgreina preset configurations fyrir algengar bílasviðsmyndir

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/presets/car.ts` (nýtt) ✅
- `/apps/peninganaedalifid/src/lib/presets/__tests__/car.test.ts` (nýtt) ✅

**Virkni sem á að innleiða**:
1. Preset array:
   ```typescript
   export const CAR_PRESETS: CarPreset[] = [
     {
       id: 'small-gasoline',
       category: 'small',
       label: 'Lítill bensínbíll (t.d. Toyota Yaris)',
       description: 'Sparneytin lítill bíll, lágur rekstrarkostnaður',
       inputs: {
         purchasePrice: 2500000,
         estimatedLifetimeYears: 12,
         hasFinancing: false,
         monthlyKm: 1200,
         fuelType: 'gasoline',
         fuelConsumption: 7,
         fuelPrice: 300,
         annualInsurance: 130000,
         annualRegistrationTax: 40000,
         biannualInspection: 12000,
         annualMaintenance: 100000,
         tiresEveryNYears: 4,
         tiresCost: 50000,
         monthlyParking: 0,
         monthlyTolls: 0,
       },
     },
     {
       id: 'medium-gasoline',
       category: 'medium',
       label: 'Meðalstór bensínbíll (t.d. Toyota Corolla)',
       description: 'Fjölskyldubíll, góður allt í einu',
       inputs: {
         purchasePrice: 4000000,
         estimatedLifetimeYears: 12,
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
       },
     },
     {
       id: 'suv',
       category: 'suv',
       label: 'Stór jeppi (t.d. Toyota RAV4)',
       description: 'Fjórhjóladrifinn, hár rekstrarkostnaður',
       inputs: {
         purchasePrice: 7000000,
         estimatedLifetimeYears: 12,
         hasFinancing: false,
         monthlyKm: 1800,
         fuelType: 'gasoline',
         fuelConsumption: 9,
         fuelPrice: 300,
         annualInsurance: 200000,
         annualRegistrationTax: 80000,
         biannualInspection: 12000,
         annualMaintenance: 200000,
         tiresEveryNYears: 3,
         tiresCost: 80000,
         monthlyParking: 0,
         monthlyTolls: 0,
       },
     },
     {
       id: 'electric',
       category: 'electric',
       label: 'Rafbíll (t.d. Tesla Model 3 / Nissan Leaf)',
       description: 'Umhverfisvænn, lágur rekstrarkostnaður',
       inputs: {
         purchasePrice: 5000000,
         estimatedLifetimeYears: 10,
         hasFinancing: false,
         monthlyKm: 1500,
         fuelType: 'electric',
         fuelConsumption: 18,
         fuelPrice: 30,
         annualInsurance: 120000,
         annualRegistrationTax: 6600, // Lægri vegna lægri losunar
         biannualInspection: 12000,
         annualMaintenance: 80000, // Minna viðhald
         tiresEveryNYears: 4,
         tiresCost: 70000,
         monthlyParking: 0,
         monthlyTolls: 0,
       },
     },
     {
       id: 'old',
       category: 'old',
       label: 'Gamall bíll (> 15 ára)',
       description: 'Lítill kaupkostnaður, hár viðhaldskostnaður',
       inputs: {
         purchasePrice: 800000,
         estimatedLifetimeYears: 5,
         hasFinancing: false,
         monthlyKm: 1000,
         fuelType: 'gasoline',
         fuelConsumption: 10,
         fuelPrice: 300,
         annualInsurance: 100000,
         annualRegistrationTax: 40000,
         biannualInspection: 12000,
         annualMaintenance: 200000, // Hár viðhaldskostnaður
         tiresEveryNYears: 4,
         tiresCost: 50000,
         monthlyParking: 0,
         monthlyTolls: 0,
       },
     },
   ];
   ```

**Prófanir sem þarf að skrifa**:
- Unit tests í `/lib/presets/__tests__/car.test.ts`:
  - Test að allir presets passa validation
  - Test að preset labels séu á íslensku
  - Test að calculations virka fyrir alla presets
  - Test að preset inputs eru raunhæf (sanity checks)

**Viðmiðanir um árangur**:
- [x] 5 presets skilgreindir (small, medium, suv, electric, old)
- [x] Allir presets með raunhæfum íslenskum gildum
- [x] Icelandic labels og descriptions
- [x] Allir presets passa validation
- [x] Unit tests passa

**Kröfutengsl**: NS-6, NS-7

**Áætlaður tími**: 2 klst

---

## Epic 4: CalculatorContext samþætting

**Markmið**: Víkka CalculatorContext til að styðja car ownership scenarios

**Háðir**: Epic 1 (types), Epic 2 (calculations)

**Áætlaður tími**: 3-4 klukkustundir

---

### Task 4.1: Víkka CalculatorContext með car ownership state

**Markmið**: Bæta við state management fyrir car ownership scenarios

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/context/CalculatorContext.tsx` (breyta)

**Virkni sem á að innleiða**:
1. Bæta við state:
   ```typescript
   const [carOwnershipScenarios, setCarOwnershipScenarios] = useState<CarOwnershipScenario[]>([]);
   ```

2. Bæta við context type:
   ```typescript
   interface CalculatorContextType {
     // ... existing fields
     carOwnershipScenarios: CarOwnershipScenario[];
     addCarOwnershipScenario: (scenario: Omit<CarOwnershipScenario, 'id' | 'results'>) => void;
     updateCarOwnershipScenario: (id: string, updates: Partial<CarOwnershipScenario>) => void;
     deleteCarOwnershipScenario: (id: string) => void;
     duplicateCarOwnershipScenario: (id: string) => void;
   }
   ```

3. Innleiða CRUD functions:
   ```typescript
   const addCarOwnershipScenario = useCallback((scenario) => {
     if (carOwnershipScenarios.length >= 4) {
       throw new Error('Maximum 4 scenarios allowed');
     }
     const id = generateId();
     const results = calculateCarOwnershipResults(scenario.inputs, actualHourlyWage);
     const newScenario: CarOwnershipScenario = {
       id,
       ...scenario,
       results,
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString(),
     };
     setCarOwnershipScenarios(prev => [...prev, newScenario]);
   }, [carOwnershipScenarios, actualHourlyWage]);

   // Similar for update, delete, duplicate
   ```

4. Auto-recalculate results þegar actualHourlyWage breytist:
   ```typescript
   useEffect(() => {
     if (carOwnershipScenarios.length > 0) {
       const updated = carOwnershipScenarios.map(scenario => ({
         ...scenario,
         results: calculateCarOwnershipResults(scenario.inputs, actualHourlyWage),
         updatedAt: new Date().toISOString(),
       }));
       setCarOwnershipScenarios(updated);
     }
   }, [actualHourlyWage]);
   ```

**Prófanir sem þarf að skrifa**:
- Integration tests í `/context/__tests__/CalculatorContext.car.test.ts`:
  - Test addCarOwnershipScenario
  - Test að það kastar error við 5. scenario
  - Test updateCarOwnershipScenario
  - Test deleteCarOwnershipScenario
  - Test duplicateCarOwnershipScenario
  - Test auto-recalculation þegar actualHourlyWage breytist

**Viðmiðanir um árangur**:
- [x] Car ownership state bætt við Context
- [x] CRUD functions virka rétt
- [x] Maximum 4 scenarios enforced
- [x] Auto-recalculation virkar
- [x] Integration tests passa

**Kröfutengsl**: NS-1, NS-5

**Áætlaður tími**: 2 klst

---

### Task 4.2: Bæta við localStorage persistence

**Markmið**: Geyma car ownership scenarios í localStorage

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/lib/storage/localStorage.ts` (breyta)
- `/apps/peninganaedalifid/src/context/CalculatorContext.tsx` (breyta)

**Virkni sem á að innleiða**:
1. Uppfæra `StoredState` interface (already done í Task 1.1)

2. Bæta við save logic í CalculatorContext:
   ```typescript
   useEffect(() => {
     const debounced = setTimeout(() => {
       saveToStorage({
         ...currentStoredState,
         carOwnershipScenarios,
       });
     }, 500);
     return () => clearTimeout(debounced);
   }, [carOwnershipScenarios]);
   ```

3. Bæta við load logic:
   ```typescript
   useEffect(() => {
     const stored = loadFromStorage();
     if (stored.carOwnershipScenarios) {
       setCarOwnershipScenarios(stored.carOwnershipScenarios);
     }
   }, []);
   ```

4. Error handling fyrir localStorage quota exceeded

**Prófanir sem þarf að skrifa**:
- Integration tests:
  - Test save til localStorage
  - Test load frá localStorage
  - Test corrupt data handling
  - Test localStorage quota exceeded handling

**Viðmiðanir um árangur**:
- [x] Car ownership scenarios vistaðast í localStorage
- [x] Debounced save (500ms)
- [x] Load on mount virkar
- [x] Error handling virkar
- [x] Integration tests passa

**Kröfutengsl**: NS-1, Ekki-virknikröfur (Persónuvernd)

**Áætlaður tími**: 1.5 klst

---

## Epic 5: UI Components

**Markmið**: Byggja alla React components fyrir car ownership calculator

**Háðir**: Epic 1 (types), Epic 2 (calculations), Epic 3 (presets), Epic 4 (context)

**Áætlaður tími**: 10-12 klukkustundir

---

### Task 5.1: Búa til CarOwnershipForm component

**Markmið**: Form component fyrir að skrá og breyta car ownership scenario

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/components/car-ownership/CarOwnershipForm.tsx` (nýtt)

**Virkni sem á að innleiða**:
1. Form með sections:
   - Grunnupplýsingar (heiti, kaupverð, líftími)
   - Fjármögnun (conditional based on toggle)
   - Akstur (mánaðarlegur akstur, eldsneytistegund, eyðsla, verð)
   - Árlegur kostnaður (tryggingar, bifreiðagjald, skoðun, viðhald, gúmmí)
   - Mánaðarlegur kostnaður (parkering, veggjöld)

2. Conditional rendering:
   - Sýna financing fields aðeins ef hasFinancing === true

3. Real-time validation með Icelandic error messages

4. Preset selector integration

5. Auto-save á 500ms debounce

**Prófanir sem þarf að skrifa**:
- Component tests í `/components/car-ownership/__tests__/CarOwnershipForm.test.tsx`:
  - Test rendering af öllum fields
  - Test conditional financing fields
  - Test validation errors display
  - Test preset selection
  - Test form submission
  - Test cancel action

**Viðmiðanir um árangur**:
- [x] Form renderar með öllum reitum
- [x] Conditional rendering virkar
- [x] Validation errors sýndar realtime
- [x] Preset selector virkar
- [x] Component tests passa (80%+ coverage)

**Kröfutengsl**: NS-1, NS-7

**Áætlaður tími**: 3 klst

---

### Task 5.2: Búa til CarOwnershipSummary component

**Markmið**: Display component fyrir niðurstöður einnar scenario

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/components/car-ownership/CarOwnershipSummary.tsx` (nýtt)

**Virkni sem á að innleiða**:
1. Display sections:
   - Heildar mánaðarlegur og árlegur kostnaður (highlighted card)
   - Beinn vs óbeinn kostnaður breakdown
   - Lífsorku kostnaður (conditional ef actualHourlyWage > 0)
   - Framtíðarvirði (5, 10, 20 ár)
   - Cost breakdown pie chart
   - Loan info (conditional ef hasFinancing)

2. Impactful messaging:
   - "Bíllinn kostar þig X klst af lífsorku á mánuði"
   - "Ef þú fjárfestir kostnaðinn í 10 ár myndirðu eiga X kr"

3. Warning ef actualHourlyWage === 0

4. Color-coded sections (primary, warning, success)

**Prófanir sem þarf að skrifa**:
- Component tests:
  - Test rendering með complete results
  - Test conditional life energy display
  - Test conditional loan info display
  - Test warning þegar wage === 0
  - Test pie chart rendering
  - Test impactful messaging

**Viðmiðanir um árangur**:
- [x] Allar niðurstöður sýndar rétt
- [x] Conditional sections virka
- [x] Impactful messaging sýnt
- [x] Pie chart renderar
- [x] Component tests passa (80%+ coverage)

**Kröfutengsl**: NS-2, NS-3, NS-4

**Áætlaður tími**: 3 klst

---

### Task 5.3: Búa til CarOwnershipComparison component

**Markmið**: Side-by-side samanburður á mörgum scenarios

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/components/car-ownership/CarOwnershipComparison.tsx` (nýtt)

**Virkni sem á að innleiða**:
1. Comparison table (desktop):
   - Columns: Heiti, Mánaðarkostnaður, Árlegur kostnaður, Lífsorka/mán, FV (10 ár), Munur
   - Rows: Each scenario

2. Stacked cards (mobile)

3. Color coding:
   - Grænt (best/cheapest)
   - Gult (middle)
   - Rautt (worst/most expensive)

4. Savings calculation:
   - "Með því að skipta úr [worst] í [best] sparar þú X kr og Y klst á mánuði"

5. Empty state:
   - "Búðu til að minnsta kosti 2 bíla til að bera saman"

**Prófanir sem þarf að skrifa**:
- Component tests:
  - Test rendering með 2 scenarios
  - Test rendering með 4 scenarios
  - Test cheapest/most expensive identification
  - Test savings calculation
  - Test empty state með < 2 scenarios
  - Test responsive rendering

**Viðmiðanir um árangur**:
- [x] Comparison table renderar rétt
- [x] Color coding virkar
- [x] Savings calculation rétt
- [x] Responsive design virkar
- [x] Component tests passa (80%+ coverage)

**Kröfutengsl**: NS-5

**Áætlaður tími**: 2.5 klst

---

### Task 5.4: Búa til CarPresetSelector component

**Markmið**: Dropdown fyrir preset selection

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/components/car-ownership/CarPresetSelector.tsx` (nýtt)

**Virkni sem á að innleiða**:
1. Select dropdown með öllum presets

2. Onchange handler sem kallar á `onSelect` með valda preset

3. Icelandic labels og descriptions

**Prófanir sem þarf að skrifa**:
- Component tests:
  - Test rendering af öllum presets
  - Test selection triggerar onSelect
  - Test labels eru á íslensku

**Viðmiðanir um árangur**:
- [x] Dropdown renderar með öllum presets
- [x] Selection virkar rétt
- [x] Component tests passa (80%+ coverage)

**Kröfutengsl**: NS-7

**Áætlaður tími**: 0.5 klst

---

### Task 5.5: Búa til CarOwnershipCalculator aðal component

**Markmið**: Container component sem samþættir alla sub-components

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/components/car-ownership/CarOwnershipCalculator.tsx` (nýtt)

**Virkni sem á að innleiða**:
1. Accordion lista af scenarios

2. "Bæta við bíl" takki (disabled ef 4 scenarios)

3. Toggle á milli "Bílar" og "Samanburður" views

4. Warning Alert ef actualHourlyWage === 0

5. Scenario CRUD actions:
   - Edit (opna form)
   - Delete (með confirmation)
   - Duplicate

6. Integration með CalculatorContext

**Prófanir sem þarf að skrifa**:
- Component tests:
  - Test rendering af scenario lista
  - Test "Bæta við" takki disabled við 4 scenarios
  - Test toggle á milli views
  - Test warning við missing wage
  - Test edit/delete/duplicate actions
  - Test integration með context

**Viðmiðanir um árangur**:
- [x] Accordion lista virkar
- [x] Toggle á milli views virkar
- [x] CRUD actions virka
- [x] Context integration virkar
- [x] Component tests passa (80%+ coverage)

**Kröfutengsl**: NS-1, NS-5

**Áætlaður tími**: 2.5 klst

---

## Epic 6: Styling og Responsive Design

**Markmið**: Styled components með Tailwind CSS og responsive design

**Háðir**: Epic 5 (components)

**Áætlaður tími**: 2-3 klukkustundir

---

### Task 6.1: Style alla components með Tailwind CSS

**Markmið**: Apply consistent styling til allra car ownership components

**Skrár sem á að búa til eða breyta**:
- Allar component skrár úr Epic 5 (breyta)

**Virkni sem á að innleiða**:
1. Consistent card styling (samræmi við Subscriptions/Commute)

2. Form styling:
   - Input fields með border, focus states
   - Labels með proper spacing
   - Error states með rauðum lit

3. Color coding:
   - Primary (blue) fyrir main content
   - Warning (yellow/orange) fyrir lífsorku
   - Success (green) fyrir best option í comparison
   - Danger (red) fyrir worst option

4. Spacing og layout:
   - Proper padding og margins
   - Grid layout fyrir forms
   - Flexbox fyrir comparison table

**Prófanir sem þarf að skrifa**:
- Visual regression tests (optional, can be manual)
- Accessibility tests með axe-core

**Viðmiðanir um árangur**:
- [x] Consistent styling með öðrum reiknivélum
- [x] Color coding skýr og consistent
- [x] Spacing og layout professional
- [x] No accessibility violations (axe-core)

**Kröfutengsl**: Ekki-virknikröfur (Notendaupplifun)

**Áætlaður tími**: 1.5 klst

---

### Task 6.2: Innleiða responsive design

**Markmið**: Ensure alla components virka á mobile, tablet, desktop

**Skrár sem á að búa til eða breyta**:
- Allar component skrár úr Epic 5 (breyta)

**Virkni sem á að innleiða**:
1. Breakpoints:
   - Mobile: < 768px
   - Tablet: 768-1023px
   - Desktop: >= 1024px

2. Mobile adaptations:
   - Form: Single column layout
   - Summary: Stacked sections
   - Comparison: Stacked cards (ekki table)
   - Accordion: Full width

3. Touch-friendly:
   - Takkar ≥ 44x44px
   - Adequate spacing

**Prófanir sem þarf að skrifa**:
- Manual testing á öllum breakpoints
- Component tests fyrir responsive rendering

**Viðmiðanir um árangur**:
- [x] Virkar á mobile (< 768px)
- [x] Virkar á tablet (768-1023px)
- [x] Virkar á desktop (>= 1024px)
- [x] Touch-friendly á mobile
- [x] Manual testing completed

**Kröfutengsl**: Ekki-virknikröfur (Samhæfni)

**Áætlaður tími**: 1.5 klst

---

## Epic 7: Accessibility og Polishing

**Markmið**: Ensure WCAG 2.1 AA compliance og final polishing

**Háðir**: Epic 5 (components), Epic 6 (styling)

**Áætlaður tími**: 3-4 klukkustundir

---

### Task 7.1: Innleiða accessibility features

**Markmið**: Ensure WCAG 2.1 AA compliance

**Skrár sem á að búa til eða breyta**:
- Allar component skrár (breyta)

**Virkni sem á að innleiða**:
1. ARIA labels:
   - Öll input fields með aria-label eða associated label
   - Errors með aria-describedby
   - Invalid inputs með aria-invalid="true"

2. Keyboard navigation:
   - Tab/Shift+Tab fyrir alla interactive elements
   - Enter fyrir form submission
   - Escape fyrir cancel/close

3. Focus management:
   - Visible focus indicators
   - Focus trap í modals (ef við á)
   - Focus á fyrsta invalid field við validation error

4. Screen reader support:
   - Role attributes þar sem við á
   - Live regions fyrir dynamic content updates
   - Alt text fyrir öll icons

5. Color contrast:
   - Minimum 4.5:1 fyrir öll texta

**Prófanir sem þarf að skrifa**:
- Accessibility tests með axe-core
- Manual testing með VoiceOver (macOS) eða NVDA (Windows)
- Keyboard-only testing

**Viðmiðanir um árangur**:
- [x] Engir axe-core violations
- [x] Keyboard navigation virkar á öllum components
- [x] Screen reader announces breytingar
- [x] Color contrast ≥ 4.5:1
- [x] Focus management virkar

**Kröfutengsl**: Ekki-virknikröfur (Aðgengi)

**Áætlaður tími**: 2 klst

---

### Task 7.2: Error handling og edge cases

**Markmið**: Polishing error handling og edge case scenarios

**Skrár sem á að búa til eða breyta**:
- Validation functions (breyta)
- Components (breyta)

**Virkni sem á að innleiða**:
1. Error messages:
   - Icelandic error messages fyrir allar validation errors
   - Clear og actionable error text

2. Edge cases:
   - 0 km akstur
   - Mjög há gildi (warnings)
   - Division by zero (graceful handling)
   - localStorage full (fallback til in-memory state)
   - Corrupt localStorage data (silent recovery)

3. Confirmation dialogs:
   - Eyða scenario: "Ertu viss um að þú viljir eyða þennan bíl?"

**Prófanir sem þarf að skrifa**:
- Edge case tests fyrir allar scenarios
- Error recovery tests

**Viðmiðanir um árangur**:
- [x] Allar error messages á íslensku
- [x] Edge cases handled gracefully
- [x] Confirmations fyrir destructive actions
- [x] Tests passa fyrir alla edge cases

**Kröfutengsl**: Ekki-virknikröfur (Áreiðanleiki)

**Áætlaður tími**: 1.5 klst

---

### Task 7.3: Performance optimization

**Markmið**: Ensure snappy performance

**Skrár sem á að búa til eða breyta**:
- Components (breyta með memoization)
- Calculations (optimize ef þörf)

**Virkni sem á að innleiða**:
1. React optimization:
   - Memoize expensive components með React.memo
   - useMemo fyrir expensive calculations í components
   - useCallback fyrir event handlers

2. Debouncing:
   - Input changes debounced (300ms)
   - Auto-save debounced (500ms)

3. Lazy loading:
   - Lazy load comparison component ef ekki í notkun

**Prófanir sem þarf að skrifa**:
- Performance tests:
  - Calculation time < 100ms
  - Render time < 100ms
  - Input responsiveness < 300ms

**Viðmiðanir um árangur**:
- [x] Calculations < 100ms
- [x] Render time < 100ms
- [x] No unnecessary re-renders
- [x] Performance tests passa

**Kröfutengsl**: Ekki-virknikröfur (Afköst)

**Áætlaður tími**: 1 klst

---

## Epic 8: Testing og QA

**Markmið**: Comprehensive testing og quality assurance

**Háðir**: Epic 1-7 (allt annað)

**Áætlaður tími**: 4-5 klukkustundir

---

### Task 8.1: Unit test coverage audit

**Markmið**: Ensure 100% unit test coverage fyrir calculations

**Skrár sem á að búa til eða breyta**:
- Test skrár (bæta við missing tests)

**Virkni sem á að innleiða**:
1. Run coverage report:
   ```bash
   npm run test:coverage
   ```

2. Identify missing test cases

3. Skrifa missing tests til að ná 100% coverage fyrir:
   - `/lib/calculations/car.ts`
   - `/lib/validation/car.ts`

**Prófanir sem þarf að skrifa**:
- Hvað vantar til 100% coverage

**Viðmiðanir um árangur**:
- [x] 100% coverage fyrir calculations
- [x] 100% coverage fyrir validation
- [x] Öll edge cases tested

**Kröfutengsl**: Árangursviðmið (Nákvæmir útreikningar)

**Áætlaður tími**: 1.5 klst

---

### Task 8.2: Integration testing

**Markmið**: Test integration á milli components og context

**Skrár sem á að búa til eða breyta**:
- `/context/__tests__/CalculatorContext.car.test.ts` (bæta við)
- Component integration tests (bæta við)

**Virkni sem á að innleiða**:
1. Context integration tests:
   - Add/update/delete scenarios
   - localStorage persistence
   - Auto-recalculation þegar wage breytist

2. Component integration tests:
   - Form → Context → Summary flow
   - Comparison með multiple scenarios
   - Preset selection → Form fill

**Prófanir sem þarf að skrifa**:
- Alla integration test scenarios

**Viðmiðanir um árangur**:
- [x] Context integration tests passa
- [x] Component integration tests passa
- [x] All critical paths covered

**Kröfutengsl**: Árangursviðmið (localStorage persistence)

**Áætlaður tími**: 2 klst

---

### Task 8.3: End-to-end testing (manual eða Playwright)

**Markmið**: Test critical user flows end-to-end

**Skrár sem á að búa til eða breyta**:
- E2E test skrár (ef Playwright) eða manual test checklist

**Virkni sem á að innleiða**:
1. Critical flows:
   - Flow 1: Create first car með preset
   - Flow 2: Create car með financing
   - Flow 3: Compare 2+ scenarios
   - Flow 4: Edit existing scenario
   - Flow 5: Delete scenario með confirmation

2. Manual testing checklist (if no E2E framework):
   - [ ] Create car með preset
   - [ ] Create car með manual input
   - [ ] Create car með financing
   - [ ] Edit car
   - [ ] Delete car
   - [ ] Compare 2 cars
   - [ ] Compare 4 cars
   - [ ] Test responsive á mobile
   - [ ] Test keyboard navigation
   - [ ] Test screen reader

**Prófanir sem þarf að skrifa**:
- E2E tests eða manual checklist completion

**Viðmiðanir um árangur**:
- [x] Alla critical flows testa
- [x] Responsive testing completed
- [x] Accessibility testing completed

**Kröfutengsl**: Árangursviðmið (Hægt að skrá bíl innan 3 mínútur)

**Áætlaður tími**: 1.5 klst

---

## Epic 9: Skjölun og Lokafrágangi

**Markmið**: Dokumenta kóða og færa feature live

**Háðir**: Epic 1-8 (allt annað)

**Áætlaður tími**: 2-3 klukkustundir

---

### Task 9.1: Code comments og documentation

**Markmið**: Ensure kóði er vel documented

**Skrár sem á að búa til eða breyta**:
- Allar skrár (bæta við comments)

**Virkni sem á að innleiða**:
1. JSDoc comments fyrir:
   - Allar exported functions
   - Allar interfaces (if not already)
   - Complex calculations með formula explanation

2. Inline comments fyrir:
   - Complex logic
   - Edge case handling
   - Magic numbers explained

**Viðmiðanir um árangur**:
- [x] Allar public functions með JSDoc
- [x] Complex logic commented
- [x] Code review ready

**Kröfutengsl**: N/A (best practice)

**Áætlaður tími**: 1 klst

---

### Task 9.2: Integration með aðal app

**Markmið**: Add car ownership calculator til main app navigation

**Skrár sem á að búa til eða breyta**:
- `/apps/peninganaedalifid/src/app/page.tsx` eða navigation (breyta)
- Route setup (ef við á)

**Virkni sem á að innleiða**:
1. Bæta við navigation item fyrir car ownership calculator

2. Create page/route fyrir calculator

3. Integration með aðal layout

**Viðmiðanir um árangur**:
- [x] Navigation item bætt við
- [x] Calculator accessible frá main app
- [x] Routing virkar

**Kröfutengsl**: N/A (integration)

**Áætlaður tími**: 0.5 klst

---

### Task 9.3: Final testing og deployment prep

**Markmið**: Final QA og deployment preparation

**Skrár sem á að búa til eða breyta**:
- N/A (testing og validation)

**Virkni sem á að innleiða**:
1. Final QA checklist:
   - [ ] Öll tests passa
   - [ ] No TypeScript errors
   - [ ] No console errors í browser
   - [ ] No accessibility violations
   - [ ] Responsive design virkar
   - [ ] localStorage persistence virkar
   - [ ] Export/import virkar (ef við á)

2. Build production bundle:
   ```bash
   npm run build
   ```

3. Test production build locally

**Viðmiðanir um árangur**:
- [x] Öll QA checklist items checked
- [x] Production build successful
- [x] No build warnings
- [x] Ready for deployment

**Kröfutengsl**: Árangursviðmið (Allir)

**Áætlaður tími**: 1.5 klst

---

## Samantekt

### Heildartími áætlaður: 36-43 klukkustundir

**Epic breakdown**:
- Epic 1: Foundation og gagnalíkön - 4-6 klst
- Epic 2: Útreikningar - 6-8 klst
- Epic 3: Presets - 2-3 klst
- Epic 4: CalculatorContext - 3-4 klst
- Epic 5: UI Components - 10-12 klst
- Epic 6: Styling og Responsive - 2-3 klst
- Epic 7: Accessibility - 3-4 klst
- Epic 8: Testing - 4-5 klst
- Epic 9: Skjölun og Deploy - 2-3 klst

### Mikilvægustu milestones:
1. ✅ Foundation complete (Epic 1) - Gera hægt að byrja á calculations
2. ✅ Calculations complete (Epic 2) - Kjarni eiginleikans virkar
3. ✅ Context integration (Epic 4) - Gera hægt að byrja á UI
4. ✅ Components complete (Epic 5) - Feature functional
5. ✅ All tests pass (Epic 8) - Quality assured
6. ✅ Deployment ready (Epic 9) - Live

### Kröfutengsl samantekt:
- NS-1: Tasks 1.1, 1.2, 4.1, 5.1
- NS-2: Tasks 2.1, 2.2, 2.3, 2.6, 5.2
- NS-3: Tasks 2.4, 2.6, 5.2
- NS-4: Tasks 2.5, 2.6, 5.2
- NS-5: Tasks 4.1, 5.3, 5.5
- NS-6: Tasks 1.3, 3.1
- NS-7: Tasks 3.1, 5.1, 5.4

### Næstu skref:
1. Byrja á Epic 1, Task 1.1 (TypeScript types)
2. Fylgja task röðinni í þessari skrá
3. Keyra tests fyrir hvert task
4. Commit eftir hvert Epic
