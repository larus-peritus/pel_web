# Kröfur: Áskriftakostnaðarmælir (Subscription Burn Meter)

## Yfirlit

**Eiginleiki**: Áskriftakostnaðarmælir
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2 - Kjarnareiknivélar
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Flestir gleyma hversu mikið áskriftir kosta þá yfir tíma. Litlar mánaðarlegar greiðslur (Netflix, Spotify, líkamsrækt) virðast ódýrar hver fyrir sig, en samanlagt geta þær:
- Kostað margar klukkustundir af lífsorku á mánuði/ári
- Seinkað fjárhagslegu frelsi (FI) um mánuði eða ár
- Vaxið í stórfé ef fjárfest væri í staðinn

Með því að sjá áskriftir í samhengi við lífsorku og framtíðarverðmæti geta notendur tekið upplýstar ákvarðanir um hvaða áskriftir eru þess virði.

## Notendafrásagnir

### NS-1: Skrá áskriftir
**Sem** notandi sem vill sjá heildarkostnað áskrifta,
**vil ég** geta skráð allar mínar áskriftir,
**svo að** ég geti séð heildarmyndina.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi smellir á "Bæta við áskrift", **skal kerfið** sýna eyðublað með:
   - Nafn áskriftar (texti)
   - Mánaðarlegur kostnaður (krónutala)
   - Flokkur (val úr lista)

2. **Þegar** notandi fyllir út og vistar, **skal kerfið** bæta áskriftinni við lista.

3. **Kerfið skal** geyma áskriftir í localStorage og flytja þær með útflutningi/innflutningi.

4. **Þegar** notandi smellir á "Eyða", **skal kerfið** fjarlægja áskriftina úr listanum.

5. **Þegar** notandi breytir gildum, **skal kerfið** uppfæra útreikninga samstundis.

---

### NS-2: Sjá lífsorku kostnað
**Sem** notandi með skilgreint raunverulegt tímakaup,
**vil ég** sjá hversu margar klukkustundir af lífsorku áskriftir mínar kosta,
**svo að** ég skilji raunverulegan kostnað í tíma.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur skráð áskriftir og raunverulegt tímakaup er þekkt, **skal kerfið** sýna:
   - Heildar mánaðarlegan kostnað í krónum
   - Heildar árlegan kostnað í krónum
   - Lífsorku klukkustundir á mánuði
   - Lífsorku klukkustundir á ári

2. **Kerfið skal** nota raunverulegt tímakaup úr Tímakaups reiknivélinni (ekki nafnverð tímakaup).

3. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna skilaboð um að fylla fyrst út tímakaups reiknivélina.

---

### NS-3: Sjá áhrif á fjárhagslegt frelsi (FI)
**Sem** notandi sem stefnir að fjárhagslegu frelsi,
**vil ég** sjá hversu mikið áskriftir hafa áhrif á FI tímalínuna mína,
**svo að** ég geti metið hvort þær séu þess virði.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna framtíðarverðmæti ef mánaðarlegur kostnaður væri fjárfestur í staðinn:
   - Eftir 10 ár (við 7% ávöxtun)
   - Eftir 20 ár (við 7% ávöxtun)

2. **Kerfið skal** sýna þessar upplýsingar á skýran og auðskiljanlegan hátt.

---

### NS-4: Flokka áskriftir
**Sem** notandi sem vill skilja hvaða flokkar kosta mest,
**vil ég** sjá áskriftir flokkaðar eftir tegund,
**svo að** ég geti greint hvar ég eyði mestu.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á eftirfarandi flokka:
   - Streymi (Netflix, Spotify, o.s.frv.)
   - Hugbúnaður (forrit, skýjaþjónustur)
   - Líkamsrækt (líkamsræktarstöðvar, íþróttaforrit)
   - Fréttir og tímarit
   - Tölvuleikir
   - Annað

2. **Kerfið skal** sýna samtölu fyrir hvern flokk.

3. **Kerfið skal** raða flokkum eftir kostnaði (hæstur fyrst).

---

### NS-5: Kveikja/slökkva á áskriftum
**Sem** notandi sem vill bera saman útgáfur,
**vil ég** geta slökkt á áskriftum án þess að eyða þeim,
**svo að** ég geti séð hversu mikið ég sparaði ef ég segði þeim upp.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** hafa rofa við hverja áskrift til að kveikja/slökkva á henni.

2. **Þegar** áskrift er óvirk, **skal kerfið** ekki telja hana með í útreikningunum.

3. **Kerfið skal** sýna mun á heildarkostnaði með og án óvirkra áskrifta.

---

### NS-6: Flýtival fyrir algengar áskriftir
**Sem** notandi sem vill skrá áskriftir hratt,
**vil ég** geta valið úr lista af algengum áskriftum,
**svo að** ég þurfi ekki að slá inn allar upplýsingar handvirkt.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á lista af algengum íslenskum áskriftum með forstilltum verðum:
   - Streymi: Netflix, Spotify, Disney+, HBO Max, Síminn Sport, o.fl.
   - Hugbúnaður: iCloud, Google One, Microsoft 365, o.fl.
   - Líkamsrækt: World Class, Fítness, o.fl.
   - Fréttir: Morgunblaðið, Vísir, DV, o.fl.
   - Tölvuleikir: PlayStation Plus, Xbox Game Pass, o.fl.

2. **Þegar** notandi velur forstillta áskrift, **skal kerfið** fylla út nafn, verð og flokk sjálfkrafa.

3. **Kerfið skal** leyfa notanda að breyta forstilltum gildum.

---

## Inntaksforskriftir

### Áskriftainntök
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Nafn | Texti | - | Áskilið, ekki tómt | Heiti áskriftar |
| Mánaðarkostnaður | Krónutala | - | Áskilið, > 0 | Mánaðarleg greiðsla |
| Flokkur | Val | 'other' | Áskilið | Einn af 6 flokkum |
| Virk | Boolean | true | - | Hvort telja með í útreikningum |

### Flokkar
| Flokkur | Lykill | Lýsing |
|---------|--------|--------|
| Streymi | streaming | Netflix, Spotify, o.s.frv. |
| Hugbúnaður | software | Forrit, skýjaþjónustur |
| Líkamsrækt | fitness | Líkamsræktarstöðvar, íþróttaforrit |
| Fréttir og tímarit | news | Dagblöð, tímarit |
| Tölvuleikir | gaming | Leikjaáskriftir |
| Annað | other | Annað |

## Útreikningsformúlur

### Heildarkostnaður
```
Heildar mánaðarkostnaður = Summa allra virkra áskrifta
Heildar árskostnaður = Mánaðarkostnaður × 12
```

### Lífsorku kostnaður
```
Lífsorku klukkustundir = Kostnaður / Raunverulegt tímakaup
```

### Framtíðarverðmæti (ef fjárfest)
```
FV = PMT × ((1 + r)^n - 1) / r

Þar sem:
- PMT = Mánaðarleg greiðsla
- r = Mánaðarleg ávöxtun (7% / 12)
- n = Fjöldi mánaða (10 ár = 120, 20 ár = 240)
```

## Úttaksforskriftir

### Aðalúttak
- **Heildar mánaðarkostnaður**: Sýnt sem krónutala
- **Heildar árskostnaður**: Sýnt sem krónutala
- **Lífsorku á mánuði**: Sýnt sem klukkustundir og mínútur
- **Lífsorku á ári**: Sýnt sem dagar/klukkustundir

### Aukaúttak
- **Framtíðarverðmæti (10 ár)**: Ef fjárfest við 7% ávöxtun
- **Framtíðarverðmæti (20 ár)**: Ef fjárfest við 7% ávöxtun
- **Sundurliðun eftir flokkum**: Samtölur og fjöldi í hverjum flokki

## Kröfur sem ekki tengjast virkni

### Afköst
- Útreikningar: < 50ms
- Engar netbeiðnir (útreikningar á viðskiptavindarhlið)

### Aðgengi
- WCAG 2.1 AA samræmi
- Lyklaborðs aðgengi
- Skjálesari samhæft

### Persónuvernd
- Engin gögn send á netþjón
- Allt geymt í localStorage
- Flytur með aðalgögnum (export/import)

## Tengsl

- **Krefst**: Raunverulegt Tímakaups reiknivélar (fyrir actualHourlyWage)
- **Notar**: Sömu UI íhluti og aðalreiknivélin
- **Geymt með**: Aðalgögnum í localStorage

## Framtíðarútvíkkun (Utan gildissviðs MVP)

- Graf sem sýnir áskriftir yfir tíma
- Tilkynningar þegar áskrift rennur út
- Bein tenging við banka til að finna áskriftir sjálfkrafa
- Samanburður við meðaltal annarra notenda (nafnlaust)
