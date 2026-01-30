# Verkefni: Áskriftakostnaðarmælir

## Yfirlit

**Eiginleiki**: Áskriftakostnaðarmælir (Subscription Burn Meter)
**Forrit**: peninganaedalifid.is
**Kröfur**: [requirements.md](./requirements.md)

## Forsendur

Áður en byrjað er á þessum verkefnum:
- [x] Verkefni er frumstillt (Next.js + React + TypeScript + Tailwind)
- [x] Grunnur UI íhlutir eru til (Input, Button, Card, Select)
- [x] Gagnavarðveislulag er til staðar (localStorage hooks)
- [x] Raunverulegt Tímakaups reiknivél er útfærð (fyrir actualHourlyWage)

---

## Verkefni 1: Búa til TypeScript týpur ✅ Lokið 2026-01-20

**Staða**: [x] Lokið
**Flækjustig**: Einfalt
**Háðir**: Engin

### Lýsing
Skilgreina allar TypeScript týpur fyrir áskriftareiknivélina.

### Samþykktarviðmið
- [x] Allar týpur úr requirements.md útfærðar í `src/types/calculator.ts`
- [x] Týpur útfluttar og aðgengilegar
- [x] Engar TypeScript villur

### Útfærsluskref

1. ✅ Bæta við `Subscription` interface í `src/types/calculator.ts`
2. ✅ Bæta við `SubscriptionCategory` type
3. ✅ Bæta við `SubscriptionSummary` interface
4. ✅ Uppfæra `StoredState` interface til að innihalda subscriptions

### Skrár búnar til
- `src/types/calculator.ts` - Áskriftartýpur bætt við (185 línur)

### Athugasemdir
- Subscription týpur bætt við núverandi calculator.ts skrá
- Styður sex flokka: streaming, software, fitness, news, gaming, other
- Styður virkt/óvirkt ástand (isActive)
- SubscriptionSummary inniheldur lífsorku útreikninga og framtíðarverðmæti

---

## Verkefni 2: Útfæra útreikningavél fyrir áskriftir ✅ Lokið 2026-01-20

**Staða**: [x] Lokið
**Flækjastig**: Miðlungs
**Háðir**: Verkefni 1

### Lýsing
Útfæra hrein útreikningsföll fyrir áskriftakostnað, lífsorku og framtíðarverðmæti.

### Samþykktarviðmið
- [x] `calculateSubscriptionSummary()` skilar réttum gildum
- [x] `calculateFutureValue()` reiknar vexti rétt
- [x] Lífsorku útreikningar nota actualHourlyWage
- [x] Flokkun virkar rétt
- [x] Aðeins virkar áskriftir taldar með
- [x] Öll föll eru hrein (engar hliðarverkanir)

### Útfærsluskref

1. ✅ Búa til `src/lib/calculations/subscriptions.ts`
2. ✅ Útfæra `calculateFutureValue()` með vaxta formúlu
3. ✅ Útfæra `calculateSubscriptionSummary()` fyrir heildarútreikninga
4. ✅ Bæta við `generateSubscriptionId()` hjálparfalli
5. ✅ Skilgreina `SUBSCRIPTION_CATEGORY_LABELS` fyrir íslensku merki
6. ✅ Búa til `COMMON_SUBSCRIPTIONS` listi með algengum áskriftum

### Skrár búnar til
- `src/lib/calculations/subscriptions.ts` (168 línur)

### Athugasemdir
- Notar dollarsToLifeEnergy frá lifeEnergy.ts
- Framtíðarverðmæti reiknað fyrir 10 og 20 ár við 7% ávöxtun
- Inniheldur 27 forforskrifaðar áskriftir fyrir íslenskan markað
- Flokkar sjálfkrafa raðað eftir kostnaði

---

## Verkefni 3: Uppfæra CalculatorContext fyrir áskriftir ⚠️ Að hluta lokið 2026-01-20

**Staða**: [~] Að hluta lokið
**Flækjastig**: Miðlungs
**Háðir**: Verkefni 1, Verkefni 2

### Lýsing
Uppfæra CalculatorContext til að styðja áskriftastjórnun.

### Samþykktarviðmið
- [x] Context veitir áskriftarlista og setters
- [x] Context veitir subscriptionSummary útreikninga
- [x] Context veitir CRUD aðgerðir fyrir áskriftir
- [x] Niðurstöður uppfærast sjálfkrafa þegar áskriftir breytast
- [ ] exportData inniheldur áskriftir (þarf að uppfæra)
- [ ] importData flytur inn áskriftir (þarf að uppfæra)
- [ ] resetAll núllstillir áskriftir (þarf að uppfæra)

### Útfærsluskref

1. ✅ Uppfæra `CalculatorContextType` með áskriftareiginleikum
2. ✅ Bæta við `subscriptions` state í CalculatorProvider
3. ✅ Bæta við `subscriptionSummary` með useMemo
4. ✅ Útfæra `addSubscription()`
5. ✅ Útfæra `updateSubscription()`
6. ✅ Útfæra `deleteSubscription()`
7. ✅ Útfæra `toggleSubscription()`
8. ✅ Uppfæra localStorage hleðslu/vistun til að innihalda áskriftir
9. ⚠️ Uppfæra `exportData` til að innihalda áskriftir í JSON útflutningi
10. ⚠️ Uppfæra `importData` til að flytja inn áskriftir úr JSON
11. ⚠️ Uppfæra `resetAll` til að hreinsa áskriftir

### Skrár til að breyta
- `src/context/CalculatorContext.tsx` (uppfæra)

### Athugasemdir
- Grunnvirkni fyrir áskriftir er til staðar
- Þarf að uppfæra export/import/reset föll til að meðhöndla áskriftir
- subscriptionSummary notar actualHourlyWage frá aðal reiknivélinni

---

## Verkefni 4: Búa til SubscriptionForm íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjastig**: Miðlungs
**Háðir**: Verkefni 3, grunnur UI íhlutir

### Lýsing
Búa til form til að bæta við eða breyta áskrift.

### Samþykktarviðmið
- [ ] Sýnir öll nauðsynleg reitir (nafn, kostnaður, flokkur)
- [ ] Styður bæði "bæta við" og "breyta" ham
- [ ] Sýnir villur fyrir ógild gildi
- [ ] Býður upp á flýtival fyrir algengar áskriftir
- [ ] Uppfærir context við vistun
- [ ] Aðgengilegt (labels, ARIA)

### Útfærsluskref

1. Búa til `src/components/subscriptions/SubscriptionForm.tsx`
2. Bæta við nafn reit (text input)
3. Bæta við mánaðarkostnaður reit (currency input)
4. Bæta við flokkur val (select með 6 flokkum)
5. Bæta við flýtivali fyrir algengar áskriftir (dropdown eða modal)
6. Útfæra staðfestingu (áskilið nafn, kostnaður > 0)
7. Tengja við calculator context
8. Bæta við "Vista" og "Hætta við" hnöppum
9. Stíla með Tailwind

### Skrár til að búa til
- `src/components/subscriptions/SubscriptionForm.tsx` (búa til)
- `src/components/subscriptions/index.ts` (uppfæra barrel export)

### Prófunartilfelli
```typescript
// Dæmi um prófanir
test('sýnir öll nauðsynleg reitir', () => { });
test('fyllir sjálfkrafa út gildi þegar flýtival er valið', () => { });
test('sýnir villu fyrir tómt nafn', () => { });
test('sýnir villu fyrir neikvæðan kostnað', () => { });
test('kallar á addSubscription þegar vistuð', () => { });
```

---

## Verkefni 5: Búa til SubscriptionList íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjastig**: Miðlungs
**Háðir**: Verkefni 3, Verkefni 4

### Lýsing
Búa til lista yfir allar áskriftir með rofa og eyða virkni.

### Samþykktarviðmið
- [ ] Sýnir allar áskriftir úr context
- [ ] Hver áskrift sýnir nafn, kostnað, flokk
- [ ] Rofi til að kveikja/slökkva á áskrift
- [ ] Eyða hnappur fyrir hverja áskrift
- [ ] Breyta hnappur sem opnar SubscriptionForm
- [ ] Sýnir tóma stöðu þegar engar áskriftir
- [ ] Svörun fyrir farsíma

### Útfærsluskref

1. Búa til `src/components/subscriptions/SubscriptionList.tsx`
2. Sækja áskriftir úr context með `useCalculator()`
3. Útfæra lista með Card layout
4. Bæta við rofa fyrir isActive (Toggle component)
5. Bæta við eyða hnapp með staðfestingarskilaboðum
6. Bæta við breyta hnapp
7. Bæta við tóma stöðu skilaboð
8. Stíla með Tailwind (litakóðun fyrir flokka)

### Skrár til að búa til
- `src/components/subscriptions/SubscriptionList.tsx` (búa til)

### Útlit hugmynd
```
┌─────────────────────────────────────────┐
│ [ON] Netflix                    2.290 kr │
│      Streymi                    [✏️] [🗑️] │
├─────────────────────────────────────────┤
│ [OFF] Spotify (óvirk)          1.399 kr │
│       Streymi                   [✏️] [🗑️] │
└─────────────────────────────────────────┘
```

---

## Verkefni 6: Búa til SubscriptionSummary íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjastig**: Miðlungs
**Háðir**: Verkefni 3

### Lýsing
Búa til samantektarspjald sem sýnir heildarkostnað og lífsorku.

### Samþykktarviðmið
- [ ] Sýnir heildar mánaðarkostnað
- [ ] Sýnir heildar árskostnað
- [ ] Sýnir lífsorku klukkustundir á mánuði
- [ ] Sýnir lífsorku klukkustundir/daga á ári
- [ ] Sýnir framtíðarverðmæti fyrir 10 og 20 ár
- [ ] Sýnir skilaboð ef actualHourlyWage vantar
- [ ] Skýr myndræn framsetning

### Útfærsluskref

1. Búa til `src/components/subscriptions/SubscriptionSummary.tsx`
2. Sækja subscriptionSummary úr context
3. Sýna heildarkostnað (mánaðarlega og árlega)
4. Sýna lífsorku klukkustundir með formatLifeEnergy()
5. Sýna framtíðarverðmæti með áherslu á upphæðir
6. Bæta við skilaboðum ef raunverulegt tímakaup vantar
7. Stíla með Card layout og gradient bakgrunni

### Skrár til að búa til
- `src/components/subscriptions/SubscriptionSummary.tsx` (búa til)

### Útlit hugmynd
```
┌────────────────────────────────────────┐
│ Heildaráskriftir                       │
│                                        │
│ 📅 Mánaðarlega: 15.678 kr              │
│ 📅 Árlega: 188.136 kr                  │
│                                        │
│ ⏰ Lífsorka á mánuði: 24,3 klst        │
│ ⏰ Lífsorka á ári: 11,8 dagar          │
│                                        │
│ 💰 Ef fjárfest í 10 ár: 2.753.421 kr  │
│ 💰 Ef fjárfest í 20 ár: 8.102.456 kr  │
└────────────────────────────────────────┘
```

---

## Verkefni 7: Búa til SubscriptionCategoryBreakdown íhlut ✅ Lokið 2026-01-20

**Staða**: [x] Lokið
**Flækjastig**: Einfalt
**Háðir**: Verkefni 3

### Lýsing
Búa til sundurliðun eftir flokkum með samtölum.

### Samþykktarviðmið
- [x] Sýnir alla flokka með áskriftum
- [x] Raðað eftir kostnaði (hæstur fyrst)
- [x] Sýnir fjölda áskrifta í hverjum flokki
- [x] Sýnir samtölu fyrir hvern flokk
- [x] Litakóðun fyrir hvern flokk
- [x] Svörun fyrir farsíma

### Útfærsluskref

1. ✅ Búa til `src/components/subscriptions/SubscriptionCategoryBreakdown.tsx`
2. ✅ Sækja subscriptionSummary.byCategory úr context
3. ✅ Búa til lista með flokkasamantekt
4. ✅ Sýna flokkamerki, fjölda, og samtölu
5. ✅ Bæta við framvindustiku sem sýnir hlutfall af heildar
6. ✅ Litakóða hvern flokk
7. ✅ Stíla með Tailwind

### Skrár búnar til
- `src/components/subscriptions/SubscriptionCategoryBreakdown.tsx` (149 lines)
- `src/components/subscriptions/index.ts` (updated barrel export)
- `tests/components/subscriptions/SubscriptionCategoryBreakdown.test.tsx` (17 tests, all passing)
- `context/modules/SubscriptionCategoryBreakdown.md` (documentation)

### Útlit hugmynd
```
┌──────────────────────────────────────┐
│ Kostnaður eftir flokkum              │
│                                      │
│ 🎬 Streymi (4)        8.969 kr       │
│ ████████████████░░░░░ 57%            │
│                                      │
│ 💪 Líkamsrækt (1)     6.990 kr       │
│ ███████████░░░░░░░░░░ 45%            │
│                                      │
│ 💻 Hugbúnaður (2)     1.448 kr       │
│ ███░░░░░░░░░░░░░░░░░░ 9%             │
└──────────────────────────────────────┘
```

---

## Verkefni 8: Búa til aðal SubscriptionBurnMeter íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjastig**: Einfalt
**Háðir**: Verkefni 4, 5, 6, 7

### Lýsing
Sameina alla undiríhluti í aðal reiknivélar íhlut.

### Samþykktarviðmið
- [ ] Inniheldur "Bæta við áskrift" hnapp
- [ ] Sýnir SubscriptionList
- [ ] Sýnir SubscriptionSummary
- [ ] Sýnir SubscriptionCategoryBreakdown
- [ ] Modal fyrir SubscriptionForm
- [ ] Svörun layout (2 dálkar á desktop, staflaður á mobile)
- [ ] Aðgengilegt

### Útfærsluskref

1. Búa til `src/components/subscriptions/SubscriptionBurnMeter.tsx`
2. Útfæra layout með grid (2 dálkar á desktop)
3. Vinstri dálkur: "Bæta við" hnappur + SubscriptionList
4. Hægri dálkur: SubscriptionSummary + SubscriptionCategoryBreakdown
5. Útfæra modal state fyrir form
6. Tengja alla undiríhluti
7. Bæta við hero hluta með skýringartexta
8. Stíla með Tailwind

### Skrár til að búa til
- `src/components/subscriptions/SubscriptionBurnMeter.tsx` (búa til)
- `src/components/subscriptions/index.ts` (uppfæra barrel export)

---

## Verkefni 9: Bæta við reiknivélar flipa fyrir áskriftir

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjastig**: Einfalt
**Háðir**: Verkefni 8

### Lýsing
Bæta við nýjum flipa í aðal app til að sýna áskriftareiknivél.

### Samþykktarviðmið
- [ ] Nýr flipi "Áskriftir" bætt við navigation
- [ ] Flipi birtir SubscriptionBurnMeter íhlut
- [ ] Gögn deilast með aðalreiknivél (í gegnum context)
- [ ] Virkar með back/forward vafra
- [ ] Metadata uppfærð fyrir SEO

### Útfærsluskref

1. Búa til `src/app/subscriptions/page.tsx` eða bæta við flipi í `src/app/page.tsx`
2. Flytja inn SubscriptionBurnMeter
3. Pakka inn í CalculatorProvider (ef ekki þegar til)
4. Bæta við navigation valmynd (tabs eða links)
5. Bæta við metadata (title, description)
6. Prófa navigation milli flipa

### Skrár til að búa til/breyta
- `src/app/subscriptions/page.tsx` (búa til) EÐA
- `src/app/page.tsx` (uppfæra með tabs)
- `src/components/Navigation.tsx` (búa til eða uppfæra)

### Athugasemdir
- Gæti verið flipi í sömu síðu eða aðskilin route
- Veltur á heildarhönnun app

---

## Verkefni 10: Skrifa prófanir fyrir útreikningar

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjastig**: Miðlungs
**Háðir**: Verkefni 2

### Lýsing
Skrifa ítarlegar eininga prófanir fyrir áskriftarútreikninga.

### Samþykktarviðmið
- [ ] 100% þekja á subscriptions.ts
- [ ] Jaðartilvik prófuð (0 áskriftir, óvirkar, neikvæð gildi)
- [ ] Allar prófanir standast

### Útfærsluskref

1. Búa til `tests/lib/calculations/subscriptions.test.ts`
2. Skrifa prófanir fyrir `calculateFutureValue()`
   - Venjuleg gildi
   - 0% vextir
   - Mismunandi tímabil
3. Skrifa prófanir fyrir `calculateSubscriptionSummary()`
   - Engar áskriftir
   - Ein áskrift
   - Margar áskriftir
   - Blandað virkar/óvirkar
   - 0 actualHourlyWage
4. Skrifa prófanir fyrir `generateSubscriptionId()`
   - Einkvæmni
5. Keyra þekjuskýrslu

### Skrár til að búa til
- `tests/lib/calculations/subscriptions.test.ts` (búa til)

### Prófunar dæmi
```typescript
test('calculateFutureValue með 1000kr/mán í 10 ár við 7%', () => {
  const result = calculateFutureValue(1000, 0.07, 10);
  expect(result).toBeCloseTo(173084, 0); // FV formúla niðurstaða
});

test('calculateSubscriptionSummary með einni áskrift', () => {
  const subs = [{ id: '1', name: 'Netflix', monthlyCost: 2290, category: 'streaming', isActive: true }];
  const summary = calculateSubscriptionSummary(subs, 5000);
  expect(summary.totalMonthly).toBe(2290);
  expect(summary.totalYearly).toBe(27480);
});
```

---

## Verkefni 11: Skrifa prófanir fyrir íhluti

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjastig**: Miðlungs
**Háðir**: Verkefni 4-8

### Lýsing
Skrifa prófanir fyrir React íhluti.

### Samþykktarviðmið
- [ ] Lykilíhlutir með render prófanir
- [ ] Gagnvirkni prófuð (bæta við, eyða, rofa)
- [ ] Context samþætting prófuð

### Útfærsluskref

1. Setja upp React Testing Library (ef ekki til)
2. Skrifa prófanir fyrir SubscriptionForm
3. Skrifa prófanir fyrir SubscriptionList
4. Skrifa prófanir fyrir SubscriptionSummary
5. Skrifa prófanir fyrir SubscriptionCategoryBreakdown
6. Skrifa prófanir fyrir SubscriptionBurnMeter

### Skrár til að búa til
- `tests/components/subscriptions/SubscriptionForm.test.tsx` (búa til)
- `tests/components/subscriptions/SubscriptionList.test.tsx` (búa til)
- `tests/components/subscriptions/SubscriptionSummary.test.tsx` (búa til)
- `tests/components/subscriptions/SubscriptionCategoryBreakdown.test.tsx` (búa til)
- `tests/components/subscriptions/SubscriptionBurnMeter.test.tsx` (búa til)

---

## Verkefni 12: Uppfæra barrel exports

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjastig**: Einfalt
**Háðir**: Verkefni 4-8

### Lýsing
Uppfæra allar barrel export skrár fyrir hreinan innflutning.

### Samþykktarviðmið
- [ ] Öll subscription íhlutir útflutt frá index.ts
- [ ] Allar týpur útfluttar
- [ ] Öll útreikningsföll útflutt
- [ ] Engar TypeScript villur

### Útfærsluskref

1. Uppfæra `src/components/subscriptions/index.ts`
   - Flytja út SubscriptionForm
   - Flytja út SubscriptionList
   - Flytja út SubscriptionSummary
   - Flytja út SubscriptionCategoryBreakdown
   - Flytja út SubscriptionBurnMeter
2. Uppfæra `src/lib/calculations/index.ts`
   - Flytja út subscriptions föll
3. Staðfesta að allt compiles

### Skrár til að búa til/breyta
- `src/components/subscriptions/index.ts` (búa til)
- `src/lib/calculations/index.ts` (uppfæra)

---

## Samantekt

| Verkefni | Lýsing | Flækjustig | Háðir |
|----------|--------|------------|-------|
| 1 | TypeScript týpur | Einfalt | Engin |
| 2 | Útreikningavél fyrir áskriftir | Miðlungs | 1 |
| 3 | Uppfæra CalculatorContext | Miðlungs | 1, 2 |
| 4 | SubscriptionForm íhlut | Miðlungs | 3 |
| 5 | SubscriptionList íhlut | Miðlungs | 3, 4 |
| 6 | SubscriptionSummary íhlut | Miðlungs | 3 |
| 7 | SubscriptionCategoryBreakdown íhlut | Einfalt | 3 |
| 8 | Aðal SubscriptionBurnMeter íhlut | Einfalt | 4, 5, 6, 7 |
| 9 | Bæta við reiknivélar flipa | Einfalt | 8 |
| 10 | Prófanir fyrir útreikninga | Miðlungs | 2 |
| 11 | Prófanir fyrir íhluti | Miðlungs | 4-8 |
| 12 | Uppfæra barrel exports | Einfalt | 4-8 |

**Heildarverkefni**: 12
**Lokið**: 3 (Verkefni 1, 2, 7)
**Að hluta**: 1 (Verkefni 3)
**Eftirstöðvar**: 8 (Verkefni 4, 5, 6, 8-12)

**Krítísk leið**: 1 → 2 → 3 → 4/5/6/7 → 8 → 9 → 10/11/12

---

## Athugasemdir

### Áætluð tímalengd
- Verkefni 3 (klára): 1-2 klst
- Verkefni 4: 3-4 klst
- Verkefni 5: 3-4 klst
- Verkefni 6: 2-3 klst
- Verkefni 7: 1-2 klst
- Verkefni 8: 1-2 klst
- Verkefni 9: 1 klst
- Verkefni 10: 2-3 klst
- Verkefni 11: 3-4 klst
- Verkefni 12: 0,5 klst

**Heildar áætlun**: 18-26 klst

### Samþætting við núverandi kóða
- Notar núverandi CalculatorContext
- Deilir actualHourlyWage með aðalreiknivél
- Notar sömu UI íhluti (Card, Input, Button, Select)
- Notar sama localStorage kerfi
- Vistar með export/import virkni

### Næstu skref
1. Klára Verkefni 3 (uppfæra export/import/reset í context)
2. Byrja á Verkefni 4 (SubscriptionForm)
3. Halda áfram í röð í gegnum Verkefni 5-9
4. Skrifa prófanir samhliða (Verkefni 10-11)
5. Klára með barrel exports (Verkefni 12)
