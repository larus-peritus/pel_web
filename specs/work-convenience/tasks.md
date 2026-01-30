# Verkefni: Vinnuthreytukostnadur (Work Convenience Tracker)

## Yfirlit

**Eiginleiki**: Vinnuthreytukostnadur (Work Convenience Tracker)
**Forrit**: peninganaedalifid.is
**Krofur**: [requirements.md](./requirements.md)
**Honnun**: [design.md](./design.md)

## Forsendur

Adur en byrjad er a thessum verkefnum:
- [x] Verkefni er frumstillt (Next.js + React + TypeScript + Tailwind)
- [x] Grunnur UI ihlutir eru til (Input, Button, Card, Select)
- [x] Gagnavardveislulag er til stadar (localStorage hooks)
- [x] Raunverulegt Timakaups reiknivel er utfaerd (fyrir actualHourlyWage)
- [x] date-fns uppsett fyrir dagsetningar medhondlun

---

## Verkefnalisti

### EPIC 1: Grunnur Gogn og Utreikningar

Bua til TypeScript tegund ir, utreikningsföll og helpers fyrir threytukostnadar tracking.

#### Verkefni 1.1: Bua til TypeScript tegund ir

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Engin
**Timaaetlun**: 1 klst

##### Lysing
Skilgreina allar TypeScript tegund ir fyrir threytukostnadar tracking.

##### Samthykktarvidmid
- [ ] Allar tegund ir ur requirements.md utfaerdar i `src/types/calculator.ts`
- [ ] Tegund ir utfluttar og adgengilegar
- [ ] Engar TypeScript villur

##### Utfaersluskref

1. Opna `src/types/calculator.ts`
2. Baeta vid `ConvenienceExpense` interface
3. Baeta vid `ConvenienceCategory` type
4. Baeta vid `ConvenienceExpenseSummary` interface
5. Baeta vid `ConvenienceGoal` interface
6. Uppfaera `StoredState` interface til ad innihalda:
   - `convenienceExpenses: ConvenienceExpense[]`
   - `convenienceGoal?: ConvenienceGoal`

##### Skrar til ad breyta
- `src/types/calculator.ts` (uppfaera)

##### Tenging vid krofur
- NS-1: ConvenienceExpense interface
- NS-2: ConvenienceExpenseSummary interface
- NS-4: ConvenienceCategory type
- NS-5: ConvenienceGoal interface

---

#### Verkefni 1.2: Utfaera date utilities

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 1.1
**Timaaetlun**: 1 klst

##### Lysing
Bua til helper föll fyrir dagsetningar medhondlun og vinnudagur greining.

##### Samthykktarvidmid
- [ ] `isWeekday()` greini r Ma-Fo rett
- [ ] `getExpensesInDateRange()` filterar rett eftir dagsetningum
- [ ] `groupExpensesByDate()` flokkur rett
- [ ] Öll föll eru hrein (engar hlidarverkanir)

##### Utfaersluskref

1. Bua til `src/lib/utils/dateUtils.ts`
2. Utfaera `isWeekday(date: Date): boolean`
   - Skila `true` fyrir Ma-Fo (1-5)
   - Skila `false` fyrir La-Su (0, 6)
3. Utfaera `getExpensesInDateRange(expenses, startDate, endDate)`
4. Utfaera `groupExpensesByDate(expenses)`
5. Utfaera `getLast7Days()`, `getLast30Days()` helpers
6. Skrifa JSDoc comments

##### Skrar til ad bua til
- `src/lib/utils/dateUtils.ts` (bua til)

##### Profunartilfelli
```typescript
test('isWeekday greini r vinnudaga rett', () => {
  expect(isWeekday(new Date('2025-01-20'))).toBe(true); // Manudagur
  expect(isWeekday(new Date('2025-01-25'))).toBe(false); // Laugardagur
});

test('getExpensesInDateRange filterar rett', () => {
  // Test implementation
});
```

##### Tenging vid krofur
- NS-3: Vinnudagur greining
- NS-2: Dagsetningar filtrun

---

#### Verkefni 1.3: Utfaera utreikningavel fyrir threytukostnad

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 1.1, Verkefni 1.2
**Timaaetlun**: 3 klst

##### Lysing
Utfaera hrein utreikningsföll fyrir threytukostnag, liffsorgu og samanburdi.

##### Samthykktarvidmid
- [ ] `calculateExpenseSummary()` skilar rettum gildum
- [ ] `calculateWorkdayComparison()` reiknar medaltal rett
- [ ] `calculateGoalProgress()` reiknar framvindu rett
- [ ] Liffsorgu utreikningar nota actualHourlyWage
- [ ] Flokkun virkar rett
- [ ] Öll föll eru hrein (engar hlidarverkanir)

##### Utfaersluskref

1. Bua til `src/lib/calculations/convenienceExpenses.ts`
2. Utfaera `calculateExpenseSummary(expenses, actualHourlyWage)`
   - Reikna totalWeekly (last 7 days)
   - Reikna totalMonthly (last 30 days)
   - Reikna totalAnnualized (monthly × 12)
   - Reikna lifeEnergy fyrir hvern tima bil
   - Flokkasundurlidun (byCategory)
3. Utfaera `calculateWorkdayComparison(expenses)`
   - Filter vinnudagar vs fridagar
   - Reikna medaltal fyrir hvorn
   - Reikna workdayPremium (mismunur)
   - Reikna annualWorkdayPremium (52 vikur × 5 dagar)
4. Utfaera `calculateGoalProgress(goal, currentMonthly)`
   - Reikna progress % = (current / target) × 100
   - Reikna savings ef nad
   - Reikna annualSavings
5. Utfaera `generateExpenseId()` hjalparf all
6. Skilgreina `CONVENIENCE_CATEGORY_LABELS` fyrir islensku merki
7. Bua til `COMMON_CONVENIENCE_EXPENSES` listi med algengum thjonustum

##### Skrar til ad bua til
- `src/lib/calculations/convenienceExpenses.ts` (bua til)

##### Profunartilfelli
```typescript
describe('calculateExpenseSummary', () => {
  it('aetti ad reikna weekly/monthly/annual rett', () => {
    const expenses = [
      { id: '1', amount: 1000, date: '2025-01-20', category: 'delivery', isWorkday: true },
      { id: '2', amount: 2000, date: '2025-01-19', category: 'taxi', isWorkday: true },
    ];
    const summary = calculateExpenseSummary(expenses, 2000);
    // Assertions
  });
});

describe('calculateWorkdayComparison', () => {
  it('aetti ad reikna medaltal vinnudaga vs fridaga rett', () => {
    // Test implementation
  });
});
```

##### Tenging vid krofur
- NS-2: Arleg ahrif utreikningar
- NS-3: Vinnudagar vs fridagar samanburđur
- NS-5: Markmids framvinda

---

### EPIC 2: Context og Stada Stjornun

Uppfaera CalculatorContext til ad styдja threytukostnadar tracking.

#### Verkefni 2.1: Uppfaera CalculatorContext fyrir threytukostnad

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 1.1, Verkefni 1.3
**Timaaetlun**: 2 klst

##### Lysing
Uppfaera CalculatorContext til ad styдja threytukostnadar stjornun.

##### Samthykktarvidmid
- [ ] Context veitir convenienceExpenses lista og setters
- [ ] Context veitir expenseSummary utreikninga
- [ ] Context veitir CRUD adgerd ir fyrir expenses
- [ ] Context veitir goal stjornun
- [ ] Nidurstoður uppfaerast sjalfkrafa thegar expenses breytast
- [ ] exportData inniheldur expenses og goal
- [ ] importData flytur inn expenses og goal
- [ ] resetAll nullstillir expenses og goal

##### Utfaersluskref

1. Uppfaera `CalculatorContextType` med:
   - `convenienceExpenses: ConvenienceExpense[]`
   - `expenseSummary?: ConvenienceExpenseSummary`
   - `convenienceGoal?: ConvenienceGoal`
   - `addConvenienceExpense(expense: Omit<ConvenienceExpense, 'id'>): void`
   - `updateConvenienceExpense(id: string, updates: Partial<ConvenienceExpense>): void`
   - `deleteConvenienceExpense(id: string): void`
   - `setConvenienceGoal(goal: ConvenienceGoal): void`
   - `deleteConvenienceGoal(): void`

2. Baeta vid `convenienceExpenses` og `convenienceGoal` state i CalculatorProvider

3. Baeta vid `expenseSummary` med useMemo:
   ```typescript
   const expenseSummary = useMemo(() => {
     if (!results?.actualHourlyWage) return undefined;
     return calculateExpenseSummary(convenienceExpenses, results.actualHourlyWage);
   }, [convenienceExpenses, results?.actualHourlyWage]);
   ```

4. Utfaera `addConvenienceExpense()`
5. Utfaera `updateConvenienceExpense()`
6. Utfaera `deleteConvenienceExpense()`
7. Utfaera `setConvenienceGoal()`
8. Utfaera `deleteConvenienceGoal()`

9. Uppfaera localStorage hlođslu til ad innihalda expenses og goal
10. Uppfaera localStorage vistun (debounced)

11. Uppfaera `exportData` til ad innihalda expenses og goal
12. Uppfaera `importData` til ad flytja inn expenses og goal
13. Uppfaera `resetAll` til ad hreinsa expenses og goal

##### Skrar til ad breyta
- `src/context/CalculatorContext.tsx` (uppfaera)

##### Profunartilfelli
```typescript
describe('CalculatorContext - ConvenienceExpenses', () => {
  it('aetti ad baeta vid expense', () => {
    // Test implementation
  });

  it('aetti ad uppfaera expense', () => {
    // Test implementation
  });

  it('aetti ad eyda expense', () => {
    // Test implementation
  });

  it('aetti ad uppfaera expenseSummary thegar expenses breytast', () => {
    // Test implementation
  });
});
```

##### Tenging vid krofur
- NS-1: CRUD adgerd ir fyrir expenses
- NS-5: Goal stjornun
- Allar NS: Context samthetting

---

### EPIC 3: UI Ihlutir - Grunnur

Bua til grunnur UI ihluti fyrir threytukostnadar tracking.

#### Verkefni 3.1: Bua til QuickAddExpense ihlut

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 2.1
**Timaaetlun**: 3 klst

##### Lysing
Bua til flytival og form fyrir fljota skr ningu threytukostnadar.

##### Samthykktarvidmid
- [ ] Dropdown med COMMON_CONVENIENCE_EXPENSES
- [ ] Custom amount input fyrir manual entry
- [ ] Dagsetning sjalgefid = i dag
- [ ] Sjalfvirk vinnudagur greining
- [ ] Allow override fyrir vinnudagur/fridagur
- [ ] Valfrjals athugasemd reitur
- [ ] Vista vid context vid einum smelli
- [ ] Nullstilla form eftir vistun
- [ ] Adgengilegt (labels, ARIA)

##### Utfaersluskref

1. Bua til `src/components/convenience/QuickAddExpense.tsx`
2. Bua til dropdown med COMMON_CONVENIENCE_EXPENSES
   - Flokkaður eftir category
   - Synja amount og note fyrir hvern
3. Baeta vid custom amount input
4. Baeta vid date picker (sjalgefid i dag)
5. Baeta vid vinnudagur/fridagur toggle (sjalfvirkt greint)
6. Baeta vid valfrjals note reitur
7. Baeta vid "Skra" hnapp
8. Tengja vid calculator context `addConvenienceExpense()`
9. Nullstilla form eftir vistun
10. Stila med Tailwind (mobile-first)

##### Skrar til ad bua til
- `src/components/convenience/QuickAddExpense.tsx` (bua til)

##### Profunartilfelli
```typescript
test('syrnir dropdown med algengum thjonustum', () => {
  // Test implementation
});

test('fylli r ut amount thegar preset er valid', () => {
  // Test implementation
});

test('greini r vinnudag sjalfkrafa', () => {
  // Test implementation
});

test('kallar a addConvenienceExpense thegar vistud', () => {
  // Test implementation
});
```

##### Tenging vid krofur
- NS-1: Fljot skr ning
- NS-6: Flytival fyrir algengar athafnir
- NS-3: Vinnudagur greining

---

#### Verkefni 3.2: Bua til ExpenseList ihlut

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 2.1
**Timaaetlun**: 3 klst

##### Lysing
Bua til lista yfir allan threytukostnad med edit/delete virkni.

##### Samthykktarvidmid
- [ ] Syrnir alla expenses ur context
- [ ] Rađđađ eftir dagsetningu (nylegt fyrst)
- [ ] Flokkađur eftir dags (i dag, i gier, sidasta vika, o.s.frv.)
- [ ] Hver expense syrnir: amount, category, date, note
- [ ] Syrnir vinnudagur/fridagur badge
- [ ] Edit hnappur fyrir hverja expense
- [ ] Eyda hnappur med stadfestingu
- [ ] Filter: allir, adens vinnudagar, adens fridagar
- [ ] Limit: synja 7 nylegustu, "Synja meira" hnappur
- [ ] Toma stoda skilaboð thegar engar expenses
- [ ] Svörun fyrir farsima

##### Utfaersluskref

1. Bua til `src/components/convenience/ExpenseList.tsx`
2. Sækja convenienceExpenses ur context
3. Rada eftir dagsetningu (desc)
4. Flokka eftir dags med groupExpensesByDate()
5. Render-a ExpenseItem fyrir hverja expense
6. Baeta vid filter dropdown (allir, vinnudagar, fridagar)
7. Baeta vid "Synja meira" virkni (limit = 7 sjalgefid)
8. Baeta vid toma stoda skilaboð
9. Stila med Card layout

##### Skrar til ad bua til
- `src/components/convenience/ExpenseList.tsx` (bua til)

##### Profunartilfelli
```typescript
test('syrnir allar expenses rađđađar eftir dagsetningu', () => {
  // Test implementation
});

test('flokkur rett eftir dagsetningum', () => {
  // Test implementation
});

test('filterar vinnudaga rett', () => {
  // Test implementation
});
```

##### Tenging vid krofur
- NS-1: Skra og sja threytukostnad

---

#### Verkefni 3.3: Bua til ExpenseItem ihlut

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 3.2
**Timaaetlun**: 2 klst

##### Lysing
Bua til einstaka expense item med edit/delete virkni.

##### Samthykktarvidmid
- [ ] Syrnir amount, category, date, note
- [ ] Syrnir vinnudagur/fridagur badge
- [ ] Edit hnappur opnar edit modal
- [ ] Eyda hnappur med stadfestingu
- [ ] Litakođun fyrir category
- [ ] Mobile-friendly layout

##### Utfaersluskref

1. Bua til `src/components/convenience/ExpenseItem.tsx`
2. Synja amount med ISK formottun
3. Synja category label (islenskt)
4. Synja dagsetning (relative: "I dag", "I gier", o.s.frv.)
5. Synja note ef til
6. Synja vinnudagur/fridagur badge
7. Baeta vid edit hnapp
8. Baeta vid eyda hnapp med stadfestingu
9. Stila med Tailwind

##### Skrar til ad bua til
- `src/components/convenience/ExpenseItem.tsx` (bua til)

##### Tenging vid krofur
- NS-1: Edit og eyda virkni

---

### EPIC 4: UI Ihlutir - Analytics og Insights

Bua til ihluti sem synja samanburđ, sundurlidun og markmids framvindu.

#### Verkefni 4.1: Bua til WorkdayComparison ihlut

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 2.1
**Timaaetlun**: 3 klst

##### Lysing
Synja samanburđ a vinnudogum vs fridogum med visual representation.

##### Samthykktarvidmid
- [ ] Syrnir medaltal vinnudags vs fridags
- [ ] Syrnir mismun (kr og %)
- [ ] Syrnir arsahrif munsins
- [ ] Visual bar chart samanburđur
- [ ] Litakođun (vinnudagar = red-ish, fridagar = green-ish)
- [ ] Tooltip med utskyringu
- [ ] Syrnir skilaboð ef ongud expenses enn

##### Utfaersluskref

1. Bua til `src/components/convenience/WorkdayComparison.tsx`
2. Sækja expenseSummary ur context
3. Nota calculateWorkdayComparison() fyrir utreikninga
4. Synja medaltal vinnudags og fridags
5. Synja mismun med highlight
6. Synja arsahrif munsins
7. Bua til horizontal bar chart (CSS-based)
8. Baeta vid tooltip med utskyringu
9. Stila med Card layout

##### Skrar til ad bua til
- `src/components/convenience/WorkdayComparison.tsx` (bua til)

##### Profunartilfelli
```typescript
test('syrnir medaltal vinnudaga rett', () => {
  // Test implementation
});

test('syrnir arsahrif munsins rett', () => {
  // Test implementation
});
```

##### Tenging vid krofur
- NS-3: Bera saman vinnudaga og fridaga

---

#### Verkefni 4.2: Bua til CategoryBreakdown ihlut

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 2.1
**Timaaetlun**: 2 klst

##### Lysing
Synja sundurlidun eftir flokkum med samtolum.

##### Samthykktarvidmid
- [ ] Syrnir alla flokka med expenses
- [ ] Rađđađ eftir kostnaJi (haestur fyrst)
- [ ] Syrnir fjolda expenses i hverjum flokki
- [ ] Syrnir samtolu fyrir hvern flokk
- [ ] Syrnir prosenta af heildar
- [ ] Litakođun fyrir hvern flokk
- [ ] Progress bar fyrir hvern flokk

##### Utfaersluskref

1. Bua til `src/components/convenience/CategoryBreakdown.tsx`
2. Sækja expenseSummary.byCategory ur context
3. Bua til lista med flokkasamantekt
4. Synja flokkamerki (islenskt), fjolda, og samtolu
5. Baeta vid framvindustiku sem syrnir hlutfall af heildar
6. Litakođa hvern flokk
7. Stila med Tailwind

##### Skrar til ad bua til
- `src/components/convenience/CategoryBreakdown.tsx` (bua til)

##### Tenging vid krofur
- NS-4: Flokka threytukostnad

---

#### Verkefni 4.3: Bua til GoalProgress ihlut

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 2.1
**Timaaetlun**: 3 klst

##### Lysing
Synja markmids framvindu og sparnađ.

##### Samthykktarvidmid
- [ ] Syrnir managarlegt markmi d
- [ ] Progress bar med % framvindu
- [ ] Syrnir sparnađ (ef nad)
- [ ] Syrnir arsahrif sparnađar
- [ ] Leyfa ad setja nytt markmi d
- [ ] Leyfa ad breyta markmi di
- [ ] Leyfa ad eyda markmidi
- [ ] Visual feedback thegar markmi di er nad (green, celebration)
- [ ] Synja skilaboð ef engin markmi d sett

##### Utfaersluskref

1. Bua til `src/components/convenience/GoalProgress.tsx`
2. Sækja convenienceGoal og expenseSummary ur context
3. Nota calculateGoalProgress() fyrir utreikninga
4. Synja markmid med progress bar
5. Synja sparnađ ef nad
6. Syjna arsahrif sparnađar
7. Baeta vid "Setja markmi d" modal/form
8. Baeta vid edit og eyda virkni
9. Celebration animation thegar nad
10. Stila med Card layout

##### Skrar til ad bua til
- `src/components/convenience/GoalProgress.tsx` (bua til)

##### Profunartilfelli
```typescript
test('syrnir progress bar rett', () => {
  // Test implementation
});

test('syrnir sparnađ thegar markmidi er nad', () => {
  // Test implementation
});

test('celebration thegar markmidi er nad', () => {
  // Test implementation
});
```

##### Tenging vid krofur
- NS-5: Setja markmid og fylgjast med framvindu

---

### EPIC 5: Samthetting og Polish

Sameina alla ihluti i adal tracker og polisha upplifun.

#### Verkefni 5.1: Bua til ConvenienceExpenseTracker adal ihlut

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 3.1-3.3, Verkefni 4.1-4.3
**Timaaetlun**: 2 klst

##### Lysing
Sameina alla undiríhluti i adal tracker ihlut.

##### Samthykktarvidmid
- [ ] Inniheldur QuickAddExpense
- [ ] Syrnir yfirlit (vika, manudur, ar)
- [ ] Syrnir WorkdayComparison
- [ ] Syrnir GoalProgress
- [ ] Syrnir CategoryBreakdown
- [ ] Syrnir ExpenseList
- [ ] Svörun layout (2 dalkar a desktop, stafladur a mobile)
- [ ] Syrnir viðvörun ef actualHourlyWage vantar
- [ ] Adgengilegt

##### Utfaersluskref

1. Bua til `src/components/convenience/ConvenienceExpenseTracker.tsx`
2. Utfaera layout med grid (2 dalkar a desktop)
3. Vinstri dalkur:
   - QuickAddExpense
   - ExpenseList
4. Haegri dalkur:
   - Yfirlit cards (vika, manudur, ar)
   - WorkdayComparison
   - GoalProgress
   - CategoryBreakdown
5. Baeta vid hero hluta med skyringar texta
6. Synja vidvorun ef actualHourlyWage = 0
7. Tengja alla undiríhluti
8. Stila med Tailwind

##### Skrar til ad bua til
- `src/components/convenience/ConvenienceExpenseTracker.tsx` (bua til)
- `src/components/convenience/index.ts` (uppfaera barrel export)

##### Tenging vid krofur
- Allar NS: Heildar samthetting

---

#### Verkefni 5.2: Baeta vid tracker i app

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 5.1
**Timaaetlun**: 1 klst

##### Lysing
Baeta vid threytukostnadar tracker i adal app sidu.

##### Samthykktarvidmid
- [ ] Tracker birtir eftir adar reiknivelar
- [ ] Gogn deilast med adalreiknivel (i gegnum context)
- [ ] Metadata uppfaerd fyrir SEO
- [ ] Svörun layout

##### Utfaersluskref

1. Opna `src/app/page.tsx`
2. Flytja inn ConvenienceExpenseTracker
3. Baeta vid eftir adar reiknivelar
4. Baeta vid section heading og lysingu
5. Baeta vid metadata (title, description)
6. Prófa navigation og layout

##### Skrar til ad breyta
- `src/app/page.tsx` (uppfaera)

##### Tenging vid krofur
- Allar NS: App samthetting

---

### EPIC 6: Profanir og Gagnaoryggi

Skrifa profanir og tryggja gagnaoryggi.

#### Verkefni 6.1: Skrifa profanir fyrir utreikninga

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 1.3
**Timaaetlun**: 3 klst

##### Lysing
Skrifa itarlegar eininga profanir fyrir threytukostnadar utreikninga.

##### Samthykktarvidmid
- [ ] 100% thekja a convenienceExpenses.ts
- [ ] Jadartilvik profud (0 expenses, edge cases)
- [ ] Allar profanir standast

##### Utfaersluskref

1. Bua til `tests/lib/calculations/convenienceExpenses.test.ts`
2. Skrifa profanir fyrir `calculateExpenseSummary()`
3. Skrifa profanir fyrir `calculateWorkdayComparison()`
4. Skrifa profanir fyrir `calculateGoalProgress()`
5. Skrifa profanir fyrir `generateExpenseId()`
6. Keyra thekjuskýrslu

##### Skrar til ad bua til
- `tests/lib/calculations/convenienceExpenses.test.ts` (bua til)

##### Tenging vid krofur
- Allar NS: Utreikningar profud

---

#### Verkefni 6.2: Skrifa profanir fyrir date utilities

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 1.2
**Timaaetlun**: 2 klst

##### Lysing
Skrifa profanir fyrir dagsetningar helpers.

##### Samthykktarvidmid
- [ ] isWeekday() profud fyrir alla daga
- [ ] Date range filtrun profud
- [ ] Edge cases profud (timezone, o.s.frv.)

##### Utfaersluskref

1. Bua til `tests/lib/utils/dateUtils.test.ts`
2. Skrifa profanir fyrir `isWeekday()`
3. Skrifa profanir fyrir `getExpensesInDateRange()`
4. Skrifa profanir fyrir `groupExpensesByDate()`

##### Skrar til ad bua til
- `tests/lib/utils/dateUtils.test.ts` (bua til)

---

#### Verkefni 6.3: Skrifa profanir fyrir ihluti

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 3.1-3.3, Verkefni 4.1-4.3
**Timaaetlun**: 4 klst

##### Lysing
Skrifa profanir fyrir React ihluti.

##### Samthykktarvidmid
- [ ] Lykilihlutir med render profanir
- [ ] Gagnvirkni profud (baeta vid, eyda)
- [ ] Context samthetting profud

##### Utfaersluskref

1. Setja upp React Testing Library (ef ekki til)
2. Skrifa profanir fyrir QuickAddExpense
3. Skrifa profanir fyrir ExpenseList
4. Skrifa profanir fyrir WorkdayComparison
5. Skrifa profanir fyrir GoalProgress
6. Skrifa profanir fyrir ConvenienceExpenseTracker

##### Skrar til ad bua til
- `tests/components/convenience/QuickAddExpense.test.tsx` (bua til)
- `tests/components/convenience/ExpenseList.test.tsx` (bua til)
- `tests/components/convenience/WorkdayComparison.test.tsx` (bua til)
- `tests/components/convenience/GoalProgress.test.tsx` (bua til)
- `tests/components/convenience/ConvenienceExpenseTracker.test.tsx` (bua til)

---

#### Verkefni 6.4: E2E profanir

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 5.2
**Timaaetlun**: 3 klst

##### Lysing
Skrifa end-to-end profanir fyrir heildarflaedi.

##### Samthykktarvidmid
- [ ] Notandi getur baett vid expense og sed arsahrif
- [ ] Notandi getur sett markmi d og fylgst med framvindu
- [ ] Vinnudagar vs fridagar samanburđur virkar
- [ ] Export/import virkar med expenses

##### Utfaersluskref

1. Setja upp Playwright (ef ekki til)
2. Skrifa E2E flædi: Baeta vid expense
3. Skrifa E2E flædi: Setja markmi d
4. Skrifa E2E flædi: Vinnudagar samanburđur
5. Skrifa E2E flædi: Export/import

##### Skrar til ad bua til
- `e2e/convenience-tracker.spec.ts` (bua til)

---

#### Verkefni 6.5: Stadfesting og villumedh ondlun

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 1.1
**Timaaetlun**: 2 klst

##### Lysing
Bua til stadfestingar og villumedhondlun fyrir expenses.

##### Samthykktarvidmid
- [ ] validateConvenienceExpense() virkar
- [ ] Villuboð a islensku
- [ ] User-friendly error messages

##### Utfaersluskref

1. Bua til `src/lib/utils/validators.ts` (ef ekki til)
2. Utfaera `validateConvenienceExpense()`
3. Baeta vid `ERROR_MESSAGES` fyrir islensk villubod
4. Skrifa profanir

##### Skrar til ad bua til/breyta
- `src/lib/utils/validators.ts` (uppfaera)
- `src/lib/constants/errorMessages.ts` (uppfaera)

---

### EPIC 7: Adgengi og Polish

Tryggja adgengi og polisha notendaupplifun.

#### Verkefni 7.1: Adgengis audit og lagfaeringar

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Midlungs
**Hađir**: Verkefni 5.1
**Timaaetlun**: 3 klst

##### Lysing
Tryggja WCAG 2.1 AA samraemi.

##### Samthykktarvidmid
- [ ] Allir ihlutir nota semantic HTML
- [ ] ARIA labels a ollum form elementum
- [ ] Focus indicators med Tailwind
- [ ] Tab order rokrett
- [ ] Live regions fyrir dynamic uppfaerslur
- [ ] Profad med skjalesara (VoiceOver/NVDA)
- [ ] Keyboard navigation virkar

##### Utfaersluskref

1. Audit allir ihlutir fyrir semantic HTML
2. Baeta vid ARIA labels thar sem vantar
3. Baeta vid focus indicators
4. Testa tab order
5. Baeta vid live regions fyrir summary updates
6. Profa med skjalesara
7. Lagfaera issues

---

#### Verkefni 7.2: Mobile optimization

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 5.1
**Timaaetlun**: 2 klst

##### Lysing
Optimiza fyrir farsima upplifun.

##### Samthykktarvidmid
- [ ] Touch targets >= 44px
- [ ] Readable font sizes
- [ ] Proper spacing
- [ ] Stafladur layout a mobile
- [ ] Quick actions accessible

##### Utfaersluskref

1. Audit touch targets
2. Lagfaera font sizes
3. Bata spacing
4. Testa a raunverulegum tækjum
5. Lagfaera issues

---

#### Verkefni 7.3: Uppfaera barrel exports

**Stada**: [ ] Ekki byrjad | [ ] I vinnslu | [ ] Lokid
**Flaekjustig**: Einfalt
**Hađir**: Verkefni 3.1-3.3, Verkefni 4.1-4.3, Verkefni 5.1
**Timaaetlun**: 0,5 klst

##### Lysing
Uppfaera allar barrel export skrar fyrir hreinan innflutning.

##### Samthykktarvidmid
- [ ] Öll convenience ihlutir utflutt fra index.ts
- [ ] Allar tegund ir utfluttar
- [ ] Öll utreikningsföll utflutt
- [ ] Engar TypeScript villur

##### Utfaersluskref

1. Uppfaera `src/components/convenience/index.ts`
2. Uppfaera `src/lib/calculations/index.ts`
3. Stadfesta ad allt compiles

##### Skrar til ad bua til/breyta
- `src/components/convenience/index.ts` (bua til)
- `src/lib/calculations/index.ts` (uppfaera)

---

## Samantekt

### Verkefnatalning

| Epic | Verkefni | Flaekjustig | Timaaetlun |
|------|----------|-------------|------------|
| **EPIC 1: Grunnur Gogn og Utreikningar** | | | |
| 1.1 | Bua til TypeScript tegund ir | Einfalt | 1 klst |
| 1.2 | Utfaera date utilities | Einfalt | 1 klst |
| 1.3 | Utfaera utreikningavel | Midlungs | 3 klst |
| **EPIC 2: Context og Stada** | | | |
| 2.1 | Uppfaera CalculatorContext | Midlungs | 2 klst |
| **EPIC 3: UI Ihlutir - Grunnur** | | | |
| 3.1 | QuickAddExpense | Midlungs | 3 klst |
| 3.2 | ExpenseList | Midlungs | 3 klst |
| 3.3 | ExpenseItem | Einfalt | 2 klst |
| **EPIC 4: UI Ihlutir - Analytics** | | | |
| 4.1 | WorkdayComparison | Midlungs | 3 klst |
| 4.2 | CategoryBreakdown | Einfalt | 2 klst |
| 4.3 | GoalProgress | Midlungs | 3 klst |
| **EPIC 5: Samthetting** | | | |
| 5.1 | ConvenienceExpenseTracker | Einfalt | 2 klst |
| 5.2 | Baeta vid tracker i app | Einfalt | 1 klst |
| **EPIC 6: Profanir** | | | |
| 6.1 | Profanir fyrir utreikninga | Midlungs | 3 klst |
| 6.2 | Profanir fyrir date utils | Einfalt | 2 klst |
| 6.3 | Profanir fyrir ihluti | Midlungs | 4 klst |
| 6.4 | E2E profanir | Midlungs | 3 klst |
| 6.5 | Stadfesting og villur | Einfalt | 2 klst |
| **EPIC 7: Adgengi og Polish** | | | |
| 7.1 | Adgengis audit | Midlungs | 3 klst |
| 7.2 | Mobile optimization | Einfalt | 2 klst |
| 7.3 | Barrel exports | Einfalt | 0,5 klst |

**Heildarverkefni**: 20
**Heildar timaaetlun**: 46,5 klst

### Kritisk leid

```
1.1 → 1.2 → 1.3 → 2.1 → 3.1, 3.2, 4.1, 4.2, 4.3 → 5.1 → 5.2 → 6.x, 7.x
```

### Utfaerslurod

**Fasi 1: Grunnur** (7 klst)
- Verkefni 1.1-1.3, 2.1

**Fasi 2: Core UI** (11 klst)
- Verkefni 3.1-3.3

**Fasi 3: Analytics** (8 klst)
- Verkefni 4.1-4.3

**Fasi 4: Samthetting** (3 klst)
- Verkefni 5.1-5.2

**Fasi 5: Gagnaoryggi** (14 klst)
- Verkefni 6.1-6.5

**Fasi 6: Polish** (5,5 klst)
- Verkefni 7.1-7.3

### Adaskilnadur forgangsrođar

**Must Have (MVP)**:
- EPIC 1: Grunnur Gogn og Utreikningar
- EPIC 2: Context og Stada
- EPIC 3: UI Ihlutir - Grunnur
- EPIC 4: UI Ihlutir - Analytics
- EPIC 5: Samthetting
- Verkefni 6.5: Stadfesting

**Should Have**:
- Verkefni 6.1-6.4: Profanir
- EPIC 7: Adgengi og Polish

**Could Have**:
- Dodatillegg virkni (animations, tooltips, o.s.frv.)

### Samthetting vid nuverandi kóda

- Notar nuverandi CalculatorContext
- Deilir actualHourlyWage med adalreiknivel
- Notar somu UI ihluti (Card, Input, Button, Select)
- Notar sama localStorage kerfi
- Vistar med export/import virkni

### Nastu skref

1. Byrja a EPIC 1: Bua til tegundir, date utils, og utreikninga
2. Halda afram i EPIC 2: Uppfaera Context
3. Byggja UI ihluti i EPIC 3-4
4. Samthetta i EPIC 5
5. Provanir i EPIC 6
6. Polish i EPIC 7

### Athugasemdir

**Dependencies**:
- date-fns (lightweight dagsetningar library)
- Allar adrar dependencies eru thegar til

**Tæknileg atriJi**:
- Client-only arkitektúr (engar netbeidnir)
- localStorage fyrir persistence
- Rauntima utreikningar med useMemo
- Debounced localStorage vistun (500ms)
- Mobile-first responsive design

**Profanir**:
- Unit tests fyrir utreikninga
- Component tests fyrir UI
- Integration tests fyrir Context
- E2E tests fyrir heildarflaedi
- Markmid: >80% coverage
