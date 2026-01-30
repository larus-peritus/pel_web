# Kröfur: Bílaeign Kostnaðarreiknivél (Car Ownership Cost Calculator)

## Yfirlit

**Eiginleiki**: Bílaeign Kostnaðarreiknivél
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2.1.7 - Útgjaldatengdar reiknivélar
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Margir vanmeta heildar kostnað af bílaeign. Þeir hugsa aðeins um bensín og tryggingar, en gleyma:
- Afskriftum (verðlækkun bílsins)
- Bifreiðagjaldi og skoðun
- Viðhaldi og gúmmíum
- Parkering og veggjöldum
- Tækifæriskostnaði (ef peningarnir væru fjárfestir í staðinn)

Með því að sjá heildarkostnaðinn í samhengi við lífsorku og framtíðarvirði geta notendur:
- Tekið upplýstari ákvarðanir um bílaeign
- Metið hvort ódýrari bíll væri skynsamlegri
- Borið saman bílaeign við aðra valkosti (almenningssamgöngur, hjólreiðar, bílasamvinna)

## Notendafrásagnir

### NS-1: Skrá upplýsingar um bíl
**Sem** bíleigandi sem vill skilja heildarkostnaðinn,
**vil ég** geta skráð allar helstu upplýsingar um bílinn minn,
**svo að** ég fái raunhæfan útreikning á mánaðarlegum kostnaði.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi smellir á "Reikna bílakostnað", **skal kerfið** sýna eyðublað með eftirfarandi reitum:
   - Heiti/auðkenni bíls (t.d. "Toyota Corolla 2018")
   - Kaupverð bíls (kr)
   - Fjármögnun (já/nei toggle)

2. **Ef** notandi velur fjármögnun, **skal kerfið** sýna:
   - Útborgun (kr)
   - Lánsupphæð (kr)
   - Árleg vextir (%)
   - Lánstími (ár)

3. **Kerfið skal** krefjast eftirfarandi grunnupplýsinga:
   - Mánaðarleg akstur (km)
   - Eldsneytistegund (bensín, dísel, rafmagn, tvinnbíll)
   - Eldsneytiseyðsla (L/100km eða kWh/100km)
   - Eldsneytisverð (kr/L eða kr/kWh)

4. **Kerfið skal** bjóða upp á að skrá:
   - Tryggingar (kr á ári)
   - Bifreiðagjald (kr á ári, default frá tryggingastofnun)
   - Skoðun (kr á 2 ár)
   - Viðhald (kr á ári)
   - Gúmmí (kr á 2-4 ár)
   - Parkering (kr á mánuði)
   - Veggjöld/tollar (kr á mánuði)

5. **Kerfið skal** geyma gögn í localStorage og leyfa útflutning/innflutning.

---

### NS-2: Sjá heildarkostnað á mánuði
**Sem** bíleigandi,
**vil ég** sjá nákvæman heildar mánaðarlegan kostnað bílsins,
**svo að** ég skilji raunverulegan kostnað umfram bensín.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** reikna og sýna:
   - Beinn mánaðarlegur kostnaður:
     - Eldsneytis
     - Parkering
     - Veggjöld
     - Lánagreiðslur (ef við á)
   - Óbeinn mánaðarlegur kostnaður (árlegur kostnaður / 12):
     - Afskriftir (verðlækkun)
     - Tryggingar
     - Bifreiðagjald
     - Skoðun (meðaltal á mánuði)
     - Viðhald
     - Gúmmí (meðaltal á mánuði)
   - Heildar mánaðarlegur kostnaður (beinn + óbeinn)
   - Heildar árlegur kostnaður

2. **Kerfið skal** sýna afskriftir sem:
   - Línuleg afskrift miðað við áætlaðan líftíma (10-15 ár)
   - Eða notandi getur slegið inn áætlaða verðlækkun á ári

3. **Kerfið skal** sýna sundurliðun á kostnaðarþáttum með myndriti (pie chart eða column chart).

---

### NS-3: Sjá lífsorku kostnað
**Sem** notandi með skilgreint raunverulegt tímakaup,
**vil ég** sjá hversu margar klukkustundir af lífsorku bílinn kostar mig,
**svo að** ég skilji raunverulegan kostnað í vinnutíma.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur skráð bílinn og raunverulegt tímakaup er þekkt, **skal kerfið** sýna:
   - Lífsorku klukkustundir á mánuði (kostnaður / raunverulegt tímakaup)
   - Lífsorku klukkustundir á ári
   - Lífsorku dagar á ári (klst / 8)

2. **Kerfið skal** nota raunverulegt tímakaup úr Tímakaups reiknivélinni (ekki nafnverð tímakaup).

3. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna skilaboð með hlekk að tímakaups reiknivélinni.

4. **Kerfið skal** sýna áberandi skilaboð eins og:
   - "Bíllinn kostar þig 42 klukkustundir af lífsorku á mánuði - meira en vinnuvika!"

---

### NS-4: Sjá áhrif á fjárhagslegt frelsi (FI)
**Sem** notandi sem stefnir að fjárhagslegu frelsi,
**vil ég** sjá hversu miklu bílinn hægir á FI tímalínunni minni,
**svo að** ég geti metið hvort ódýrari valkostur væri skynsamlegri.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna framtíðarvirði ef mánaðarlegur kostnaður væri fjárfestur í staðinn (við 7% ávöxtun):
   - Eftir 5 ár
   - Eftir 10 ár
   - Eftir 20 ár

2. **Kerfið skal** sýna áberandi skilaboð eins og:
   - "Ef þú fjárfestir 80.000 kr á mánuði í 10 ár í staðinn myndirðu eiga 13.800.000 kr"

3. **Kerfið skal** sýna upplýsingarnar á skýran og áhrifamikinn hátt.

---

### NS-5: Bera saman valkosti
**Sem** notandi sem veltir fyrir sér bílaskiptum eða öðrum valkostum,
**vil ég** geta borið saman marga bíla eða valkosti hlið við hlið,
**svo að** ég geti tekið upplýsta ákvörðun.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** leyfa notanda að búa til allt að 4 "bílasviðsmyndir".

2. **Kerfið skal** sýna samanburðartöflu með:
   - Heiti/auðkenni hvers bíls
   - Mánaðarlegur kostnaður
   - Árlegur kostnaður
   - Lífsorku klst á mánuði
   - Framtíðarvirði eftir 10 ár
   - Munur á ódýrasta og dýrasta valkosti

3. **Kerfið skal** auðkenna ódýrasta og dýrasta valkostinn með litamerkingum (grænt = best, rautt = verst).

4. **Kerfið skal** leyfa notanda að eyða, breyta, og afrita sviðsmyndir.

---

### NS-6: Íslenskt samhengi
**Sem** íslenskur notandi,
**vil ég** sjá útreikninga sem endurspegla íslenskt umhverfi,
**svo að** niðurstöðurnar séu raunhæfar.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** innihalda sjálfgildi fyrir:
   - Dæmigerðar tryggingar (100.000-200.000 kr á ári eftir bíl)
   - Bifreiðagjald miðað við losun/þyngd (sækja úr töflu tryggingastofnunar)
   - Skoðun (ca. 12.000 kr á 2 ár)
   - Eldsneytisverð (núverandi verð: bensín ~300 kr/L, dísel ~290 kr/L, rafmagn ~30 kr/kWh)
   - Gúmmí (4 gúmmí x 4 = 16 gúmmí á líftíma, ~40.000-80.000 kr á sett)

2. **Kerfið skal** nota íslenskt númerasnið:
   - Púnktur fyrir þúsundir: 50.000 kr
   - Komma fyrir aukastafi: 8,5 L/100km

3. **Kerfið skal** sýna allar niðurstöður í krónum (ISK).

4. **Kerfið skal** hafa öll viðmót og leiðbeiningar á íslensku.

---

### NS-7: Flýtival fyrir algengar sviðsmyndir
**Sem** notandi sem vill spara tíma,
**vil ég** geta valið úr forstilltum dæmum,
**svo að** ég þurfi ekki að slá inn öll gildi handvirkt.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á flýtival með dæmigerðum íslenskum bílum:
   - Lítill bensínbíll (t.d. Toyota Yaris)
   - Meðalstór bensínbíll (t.d. Toyota Corolla)
   - Stór jeppi (t.d. Toyota RAV4)
   - Rafbíll (t.d. Tesla Model 3, Nissan Leaf)
   - Gamall bíll (yfir 15 ára)

2. **Þegar** notandi velur flýtival, **skal kerfið** fylla út reitina með dæmigerðum gildum.

3. **Kerfið skal** leyfa notanda að breyta gildunum eftir val.

---

## Ekki-virknikröfur

### Afköst
- **Kerfið skal** reikna út niðurstöður á innan við 100ms
- **Kerfið skal** keyra alla útreikninga client-side (engar netbeiðnir)
- **Kerfið skal** virka á tækjum frá síðustu 5 árum

### Aðgengi (WCAG 2.1 AA)
- **Kerfið skal** vera aðgengilegt fyrir skjálesara
- **Kerfið skal** vera aðgengilegt fyrir lyklaborð (Tab, Shift+Tab, Enter)
- **Kerfið skal** hafa nægilegt contrast ratio (≥ 4.5:1)
- **Kerfið skal** hafa skýra focus-vísa
- **Kerfið skal** hafa alt-texta á öllum íkonum

### Notendaupplifun
- **Kerfið skal** hafa allan texta á íslensku
- **Kerfið skal** nota íslenskt tölusnið
- **Kerfið skal** sýna tooltip skýringar þar sem við á
- **Kerfið skal** staðfesta vistun með skilaboðum
- **Kerfið skal** biðja um staðfestingu áður en eytt er

### Persónuvernd og gagnageymsla
- **Kerfið skal** geyma öll gögn í localStorage (client-side only)
- **Kerfið skal** ekki senda nein gögn á netþjón
- **Kerfið skal** bjóða upp á útflutning/innflutning á gögnum
- **Kerfið skal** takmarka fjölda sviðsmynda við 4

### Samhæfni
- **Kerfið skal** virka í Chrome, Edge, Firefox, Safari (síðustu 2 útgáfur)
- **Kerfið skal** virka á desktop, spjaldtölvum og snjallsímum
- **Kerfið skal** hafa responsive layout fyrir allar skjástærðir
- **Kerfið skal** hafa touch-friendly takka (≥44x44px)

### Áreiðanleiki
- **Kerfið skal** grípa upp villur í innsláttum og sýna skýr villuskilaboð
- **Kerfið skal** validate innslátt áður en reiknað er
- **Kerfið skal** meðhöndla division by zero gracefully
- **Kerfið skal** endurheimta frá localStorage villum

---

## Takmarkanir

1. **Engin ytri API**: Kerfið notar ekki ytri API fyrir eldsneytisverð, bifreiðagjald, eða markaðsverð bíla. Notandi þarf að slá inn handvirkt.

2. **Engin markaðsverðsgögn**: Kerfið sækir ekki markaðsverð bíla af netinu. Notandi þarf að áætla verðlækkun.

3. **Engar GPS/akstur upplýsingar**: Kerfið tengist ekki við GPS eða akstur tracker. Notandi þarf að áætla mánaðarlegan akstur.

4. **Engin bein tenging við tryggingafélög**: Kerfið sækir ekki tryggingaverð sjálfvirkt.

---

## Forsendur

1. **Raunverulegt tímakaup þekkt**: Notandi hefur fyllt út Raunverulegu Tímakaups reiknivélina áður en hann notar þennan eiginleika.

2. **Notandi þekkir grunngögn**: Notandi þekkir eða getur flett upp:
   - Mánaðarlegum akstri
   - Eldsneytiseyðslu bílsins
   - Tryggingarkostnaði
   - Bifreiðagjaldi

3. **7% ávöxtun**: FI útreikningar nota 7% ársávöxtun sem standard (sömu forsendur og aðrar reiknivélar).

4. **Línuleg afskrift**: Sjálfgildi afskrifta gera ráð fyrir línulegri verðlækkun yfir áætlaðan líftíma.

5. **Íslenskt samhengi**: Allur default kostnaður endurspeglar íslenskt markaðsverð (tryggingar, bifreiðagjald, skoðun, eldsneytisverð).

---

## Árangursviðmið

Þessi eiginleiki telst vel heppnaður ef:

1. **Notandi getur skráð bíl innan 3 mínútur** með flýtivali
2. **Skýr munur á "augljósum kostnaði" (eldsneytis) vs "heildar kostnaði"** er sýndur
3. **Notandi skilur lífsorku kostnaðinn** (impactful messaging)
4. **Notandi getur borið saman allt að 4 valkosti** side-by-side
5. **Útreikningar eru nákvæmir** (unit tests passa)
6. **Niðurstöður eru skýrar** og auðveldlega skildar
7. **Gögn vistaðast áreiðanlega** í localStorage

---

## Tengsl við aðra eiginleika

**Krefst**:
- Raunverulegt Tímakaup reiknivél (fyrir lífsorku útreikninga)

**Notar**:
- Sömu UI íhlutir og Áskriftakostnaðarmælir og Vinnuferðakostnaðarreiknivél
- Sömu utility functions (formatCurrency, formatLifeEnergy, calculateFutureValue)

**Geymt með**:
- Öðrum aðalgögnum í localStorage (hluti af StoredState)

**Hluti af**:
- "Útgjaldatengdar reiknivélar" í Phase 2.1
