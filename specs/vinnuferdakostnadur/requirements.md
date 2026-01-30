# Kröfur: Vinnuferðakostnaðarreiknivél (Commute Cost Calculator)

## Yfirlit

**Eiginleiki**: Vinnuferðakostnaðarreiknivél
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2 - Áhrif Útgjalda
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Flestir hugsa aðeins um bensínkostnað þegar þeir meta kostnað við vinnuferðir. En raunverulegur kostnaður vinnuferða felur í sér mun meira:
- Eldsneytis- eða rafmagnskostnaður
- Viðhald og afskriftir bifreiðar
- Bílatryggingar og umferðargjöld
- Stæðakostnaður
- **Tími sem fer í vinnuferðir** - kannski dýrasti þátturinn

30 mínútna ferð í hvora áttina = 1 klukkustund á dag = 5 klukkustundir á viku = 260 klukkustundir á ári. Þetta er yfir **6 vinnuvikur** af lífsorku sem fer í akstur í stað þess að vera lifað.

Þegar þú sérð vinnuferðir í samhengi við lífsorku og framtíðarverðmæti getur þú:
- Tekið upplýsta ákvörðun um hvort vinnustaður sé þess virði
- Metið hvort það borgi sig að flytja nær vinnustaðnum
- Borið saman möguleika á fjarvinnu
- Séð hversu mikið þú gætir sparað með hjólreiðum eða almenningssamgöngum

## Notendafrásagnir

### NS-1: Skrá upplýsingar um vinnuferð
**Sem** notandi sem vill skilja kostnað vinnuferða,
**vil ég** geta skráð allar upplýsingar um vinnuferðir mínar,
**svo að** ég geti séð raunverulegan heildarkostnað.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi opnar reiknivélina, **skal kerfið** sýna eyðublað með eftirfarandi reitum:
   - Heiti vinnuferðar (texti, valfrjálst, t.d. "Núverandi vinna", "Nýtt starf í Kópavogi")
   - Fjarlægð í hvora áttina (km, áskilið)
   - Fjöldi daga á viku (val: 1-7, sjálfgefið 5)
   - Ferðamáti (val: Bíll, Almenningssamgöngur, Hjól, Ganga, Fjarvinnu)
   - Tími í hvora áttina (mínútur, áskilið)

2. **Ef** notandi velur "Bíll" sem ferðamáta, **skal kerfið** sýna viðbótarreiti:
   - Eldsneytistegund (val: Bensín, Dísel, Rafmagn)
   - Eldsneytisverð (kr/lítri fyrir bensín/dísel, eða kr/kWh fyrir rafmagn)
   - Eyðsla (lítrar/100km fyrir bensín/dísel, eða kWh/100km fyrir rafmagn)
   - Stæðakostnaður (kr/dag, sjálfgefið 0)
   - Umferðargjöld/vegtollar (kr/dag, sjálfgefið 0)

3. **Ef** notandi velur "Almenningssamgöngur", **skal kerfið** sýna viðbótarreiti:
   - Tegund miða (val: Stakir farmiðar, Mánaðarkort)
   - Kostnaður pr. ferð (kr, ef stakir farmiðar)
   - Mánaðarkostnaður (kr, ef mánaðarkort)

4. **Ef** notandi velur "Hjól" eða "Ganga", **skal kerfið** sýna:
   - Viðhaldskostnaður (kr/mánuði, sjálfgefið 0 fyrir göngu, 2000 fyrir hjól)

5. **Ef** notandi velur "Fjarvinnu", **skal kerfið** sýna:
   - Engar viðbótarkostnaðir (allir kostnaðir verða 0)

6. **Þegar** notandi breytir gildum, **skal kerfið** uppfæra útreikninga samstundis.

7. **Kerfið skal** geyma vinnuferðarupplýsingar í localStorage.

8. **Kerfið skal** leyfa notanda að vista allt að 4 mismunandi vinnuferðasviðsmyndir til samanburðar.

---

### NS-2: Sjá raunverulegan peningalegan kostnað
**Sem** notandi sem vill sjá allan kostnað, ekki bara eldsneytis,
**vil ég** sjá heildar peningalegan kostnað vinnuferða,
**svo að** ég skilji hversu mikið þetta kostar mig í raun.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur fyllt út upplýsingar um vinnuferð, **skal kerfið** sýna:
   - Beinn mánaðarkostnaður (eldsneytis/farmiðar/viðhald)
   - Óbeinn mánaðarkostnaður fyrir bíla (afskriftir, tryggingar, skoðun)
   - Heildar mánaðarkostnaður (beinn + óbeinn)
   - Heildar árskostnaður

2. **Ef** ferðamáti er "Bíll", **skal kerfið** reikna óbeinan kostnað:
   - Afskriftir: Miðað við meðaltal íslenskra bifreiða
   - Tryggingar: Áætlaður árlegur kostnaður deilt með 12
   - Viðhald: Áætlaður árlegur kostnaður deilt með 12
   - Skoðun: Kostnaður deilt með fjölda mánuða á milli skoðana

3. **Kerfið skal** sýna sundurliðun á öllum kostnaðarliðum með skýrum merkingum.

4. **Kerfið skal** sýna samanburð á "það sem fólk hugsar um" (eldsneytis) vs. "raunverulegur kostnaður".

5. **Þegar** notandi skoðar bílakostnað, **skal kerfið** sýna ábendingu:
   "Athugið: Raunverulegur bílakostnaður felur í sér afskriftir, tryggingar og viðhald. Flestir vanmeta þennan kostnað um 50-70%."

---

### NS-3: Sjá lífsorku kostnað
**Sem** notandi með skilgreint raunverulegt tímakaup,
**vil ég** sjá hversu margar klukkustundir af lífsorku vinnuferðir kosta,
**svo að** ég skilji raunverulegan kostnað í tíma og peninga.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur skráð vinnuferð og raunverulegt tímakaup er þekkt, **skal kerfið** sýna:
   - Tími í vinnuferð á mánuði (klukkustundir)
   - Peningakostnaður umreiknaður í klukkustundir (kostnaður / raunverulegt tímakaup)
   - Heildar lífsorku kostnaður (tími + peningar í klukkustundum)
   - Heildar lífsorku kostnaður á ári (í dögum og klukkustundum)

2. **Kerfið skal** sýna lífsorku kostnað á skýran og áhrifamikinn hátt með texta eins og:
   "Vinnuferðir þínar kosta þig **45 klukkustundir** af lífsorku á mánuði - það er **yfir vinnuvika** á mánuði sem fer bara í að ferðast."

3. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna skilaboð:
   "Til að sjá lífsorku kostnað þarftu fyrst að fylla út Raunverulegt Tímakaup í aðalreiknivélinni."

4. **Kerfið skal** nota raunverulegt tímakaup (actualHourlyWage) úr aðalreiknivélinni, ekki nafnverð tímakaup.

5. **Kerfið skal** sýna sundurliðun á:
   - Lífsorku tap vegna tíma: X klukkustundir
   - Lífsorku tap vegna peninga: Y klukkustundir
   - Samtals: X + Y klukkustundir

---

### NS-4: Sjá áhrif á fjárhagslegt frelsi (FI)
**Sem** notandi sem stefnir að fjárhagslegu frelsi,
**vil ég** sjá hversu mikið vinnuferðir seinka FI markmiðum mínum,
**svo að** ég geti metið hvort vinnustaðurinn sé þess virði.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna framtíðarverðmæti ef mánaðarlegur vinnuferðakostnaður væri fjárfestur í staðinn:
   - Eftir 5 ár (við 7% ávöxtun)
   - Eftir 10 ár (við 7% ávöxtun)
   - Eftir 20 ár (við 7% ávöxtun)
   - Við starfslok (miðað við 67 ára aldur, ef aldur notanda er þekktur)

2. **Kerfið skal** sýna hversu mörgum mánuðum vinnuferðir seinka FI markmiði með texta eins og:
   "Ef þú myndir fjárfesta vinnuferðakostnað í staðinn, gætir þú náð fjárhagslegu frelsi **18 mánuðum fyrr**."

3. **Kerfið skal** sýna þessar upplýsingar á skýran og áhrifamikinn hátt með myndrænum framsetningu.

4. **Ef** notandi hefur skráð FI markmiðsupphæð í aðalreiknivélinni, **skal kerfið** sýna hversu stór hluti af markmiðinu þessi kostnaður er.

---

### NS-5: Bera saman valkosti í vinnuferð
**Sem** notandi sem vill taka upplýsta ákvörðun,
**vil ég** geta borið saman mismunandi vinnuferðavalkosti hlið við hlið,
**svo að** ég sjái skýran mun á kostnaði.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** leyfa notanda að búa til allt að 4 mismunandi vinnuferðasviðsmyndir.

2. **Þegar** fleiri en ein sviðsmynd er skráð, **skal kerfið** sýna samanburðartöflu með:
   - Heiti hverrar sviðsmyndar
   - Mánaðarkostnaður (beinn + óbeinn)
   - Tími í vinnuferð á mánuði
   - Heildar lífsorku kostnaður
   - Framtíðarverðmæti (10 ár)
   - Munur frá ódýrasta valkosti (í krónum og klukkustundum)

3. **Kerfið skal** auðkenna ódýrasta og dýrasta valkostinn með litamerkingum:
   - Grænt fyrir ódýrasta
   - Rautt fyrir dýrasta
   - Gult fyrir miðlungs

4. **Kerfið skal** sýna sparnað ef skipt er úr dýrasta í ódýrasta valkost með texta eins og:
   "Með því að skipta úr bíl í almenningssamgöngur gætir þú sparað **67.000 kr á mánuði** og **15 klukkustundir** af lífsorku."

5. **Notandi skal** geta eytt, breytt eða afritað sviðsmyndir.

6. **Kerfið skal** leyfa notanda að merkja eina sviðsmynd sem "núverandi" til að auðvelda samanburð.

---

### NS-6: Flýtival fyrir algengar íslenskar vinnuferðir
**Sem** notandi sem vill spara tíma,
**vil ég** geta valið úr forstilltum sviðsmyndum fyrir algengar íslenskar vinnuferðir,
**svo að** ég þurfi ekki að slá inn allar upplýsingar handvirkt.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á "Flýtival" takka sem sýnir lista af algengum íslenskum vinnuferðum:

   **Bílasviðsmyndir:**
   - "Kópavogur ↔ Reykjavík (10 km)" - Bensínbíll, 5 dagar/viku
   - "Hafnarfjörður ↔ Reykjavík (12 km)" - Bensínbíll, 5 dagar/viku
   - "Garðabær ↔ Reykjavík (8 km)" - Rafbíll, 5 dagar/viku
   - "Mosfellsbær ↔ Reykjavík (15 km)" - Bensínbíll, 5 dagar/viku
   - "Akranes ↔ Reykjavík (50 km)" - Bensínbíll, 5 dagar/viku
   - "Selfoss ↔ Reykjavík (60 km)" - Dísilbíll, 5 dagar/viku

   **Almenningssamgöngur:**
   - "Strætó - Mánaðarkort" - Staðlað Strætó verð
   - "Strætó - Stakir farmiðar" - Staðlað Strætó verð

   **Önnur:**
   - "Hjólreiðar - stutt vegalengd (<5 km)"
   - "Hjólreiðar - miðlungs vegalengd (5-10 km)"
   - "Fjarvinnu - 100%"

2. **Þegar** notandi velur forstillta sviðsmynd, **skal kerfið** fylla út öll viðeigandi svæði með raunhæfum gildum:
   - Fjarlægð
   - Ferðamáti
   - Áætlaður tími
   - Eldsneytisverð (núverandi meðaltal á Íslandi)
   - Eyðsla (algeng gildi fyrir íslenska bíla)
   - Stæðakostnaður (ef við á)

3. **Kerfið skal** leyfa notanda að breyta öllum forstilltum gildum eftir að sviðsmynd er valin.

4. **Kerfið skal** uppfæra forstillt eldsneytisverð reglulega (viðhaldið í kóða):
   - Bensín: ~300 kr/lítri
   - Dísel: ~290 kr/lítri
   - Rafmagn: ~30 kr/kWh

5. **Þegar** notandi velur Strætó sviðsmynd, **skal kerfið** nota núverandi staðlað Strætó verð:
   - Mánaðarkort: 10.500 kr (fullorðnir)
   - Stakur farmiði: 550 kr

---

## Inntaksforskriftir

### Grunnupplýsingar vinnuferðar
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Heiti | Texti | "Vinnuferð 1" | Valfrjálst, max 50 stafir | T.d. "Núverandi vinna", "Nýtt starf í Kópavogi" |
| Fjarlægð (km) | Tala | - | Áskilið, > 0, max 200 | Fjarlægð í hvora áttina |
| Dagar á viku | Heiltala | 5 | Áskilið, 1-7 | Fjöldi vinnuferðadaga |
| Ferðamáti | Val | 'car' | Áskilið | car, transit, bike, walk, remote |
| Tími (mínútur) | Heiltala | - | Áskilið, > 0, max 300 | Ferðatími í hvora áttina |

### Bílaupplýsingar (ef ferðamáti = 'car')
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Eldsneytistegund | Val | 'gasoline' | Áskilið | gasoline, diesel, electric |
| Eldsneytisverð | Tala | 300 (bensín), 290 (dísel), 30 (raf) | Áskilið, > 0 | kr/lítri eða kr/kWh |
| Eyðsla | Tala | 8 (bensín), 7 (dísel), 20 (raf) | Áskilið, > 0 | l/100km eða kWh/100km |
| Stæðakostnaður | Tala | 0 | Valfrjálst, ≥ 0 | kr á dag |
| Umferðargjöld | Tala | 0 | Valfrjálst, ≥ 0 | Tollar/vegtollar kr á dag |
| Afskriftir | Tala | 35000 | Valfrjálst, ≥ 0 | Mánaðarlegar afskriftir kr |
| Tryggingar | Tala | 15000 | Valfrjálst, ≥ 0 | Mánaðarlegur kostnaður kr |
| Viðhald | Tala | 10000 | Valfrjálst, ≥ 0 | Áætlaður mánaðarkostnaður kr |
| Skoðun | Tala | 12000 | Valfrjálst, ≥ 0 | Kostnaður á 2ja ára fresti |

### Almenningssamgöngur (ef ferðamáti = 'transit')
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Tegund miða | Val | 'monthly' | Áskilið | monthly, per_ride |
| Kostnaður pr. ferð | Tala | 550 | Áskilið ef per_ride | kr á ferð |
| Mánaðarkostnaður | Tala | 10500 | Áskilið ef monthly | kr á mánuði |

### Hjólreiðar/Ganga (ef ferðamáti = 'bike' eða 'walk')
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Viðhald | Tala | 2000 (hjól), 0 (ganga) | Valfrjálst, ≥ 0 | Mánaðarkostnaður kr |

### Ferðamátar
| Ferðamáti | Lykill | Lýsing |
|-----------|--------|--------|
| Bíll | car | Bensín, dísel eða rafmagn |
| Almenningssamgöngur | transit | Strætó eða annar almenningsakstur |
| Hjólreiðar | bike | Reiðhjól |
| Ganga | walk | Göngutúr |
| Fjarvinnu | remote | 100% fjarvinnu, engir ferðakostnaðir |

### Eldsneytis tegund
| Tegund | Lykill | Mælieining |
|--------|--------|------------|
| Bensín | gasoline | kr/lítri, lítrar/100km |
| Dísel | diesel | kr/lítri, lítrar/100km |
| Rafmagn | electric | kr/kWh, kWh/100km |

## Útreikningsformúlur

### Grunnútreikningar

#### Fjöldi ferða á mánuði
```
Ferðir á mánuði = Dagar á viku × 4.33 (meðaltal vikna á mánuði)
Fjöldi ferða (báðar leiðir) = Ferðir á mánuði × 2
```

#### Heildar vegalengd
```
Vegalengd á mánuði = Fjarlægð × Fjöldi ferða (báðar leiðir)
Vegalengd á ári = Vegalengd á mánuði × 12
```

#### Heildartími í vinnuferð
```
Tími á mánuði (mínútur) = Tími í hvora áttina × Fjöldi ferða (báðar leiðir)
Tími á mánuði (klukkustundir) = Tími á mánuði (mínútur) / 60
Tími á ári (klukkustundir) = Tími á mánuði (klukkustundir) × 12
```

### Bílakostnaður

#### Eldsneytiskostnaður (Bensín/Dísel)
```
Eldsneytis notkun (lítrar) = (Vegalengd á mánuði × Eyðsla) / 100
Eldsneytiskostnaður á mánuði = Eldsneytis notkun × Eldsneytisverð á lítra
```

#### Rafmagnskostnaður (Rafbíll)
```
Rafmagns notkun (kWh) = (Vegalengd á mánuði × Eyðsla) / 100
Rafmagnskostnaður á mánuði = Rafmagns notkun × Rafmagnsverð á kWh
```

#### Stæða- og umferðargjöld
```
Dagar á mánuði = Dagar á viku × 4.33
Stæðakostnaður á mánuði = Stæðakostnaður á dag × Dagar á mánuði
Umferðargjöld á mánuði = Umferðargjöld á dag × Dagar á mánuði
```

#### Beinn bílakostnaður
```
Beinn kostnaður = Eldsneytiskostnaður + Stæðakostnaður + Umferðargjöld
```

#### Óbeinn bílakostnaður
```
Skoðun á mánuði = Skoðunarkostnaður / 24  (á 2ja ára fresti)
Óbeinn kostnaður = Afskriftir + Tryggingar + Viðhald + Skoðun á mánuði
```

#### Heildar bílakostnaður
```
Heildar mánaðarkostnaður = Beinn kostnaður + Óbeinn kostnaður
Heildar árskostnaður = Mánaðarkostnaður × 12
```

### Almenningssamgöngukostnaður

#### Mánaðarkort
```
Mánaðarkostnaður = Mánaðarkort verð
Árskostnaður = Mánaðarkostnaður × 12
```

#### Stakir farmiðar
```
Fjöldi ferða (báðar leiðir) = Dagar á viku × 4.33 × 2
Mánaðarkostnaður = Kostnaður á ferð × Fjöldi ferða
Árskostnaður = Mánaðarkostnaður × 12
```

### Hjólreiða-/göngukostnaður
```
Mánaðarkostnaður = Viðhaldskostnaður
Árskostnaður = Mánaðarkostnaður × 12
```

### Fjarvinnu
```
Mánaðarkostnaður = 0
Árskostnaður = 0
Tími = 0
```

### Lífsorku útreikningar

#### Tími sem lífsorka
```
Tími í lífsorku (klst á mánuði) = Tími í vinnuferð (klst á mánuði)
Tími í lífsorku (klst á ári) = Tími í lífsorku (klst á mánuði) × 12
```

#### Peningar sem lífsorka
```
Peningar í lífsorku (klst á mánuði) = Mánaðarkostnaður / Raunverulegt tímakaup
Peningar í lífsorku (klst á ári) = Peningar í lífsorku (klst á mánuði) × 12
```

#### Heildar lífsorka
```
Heildar lífsorka (klst á mánuði) = Tími í lífsorku + Peningar í lífsorku
Heildar lífsorka (klst á ári) = Heildar lífsorka (klst á mánuði) × 12
Heildar lífsorka (dagar á ári) = Heildar lífsorka (klst á ári) / 24
```

### Framtíðarverðmæti (FI áhrif)

#### Framtíðarverðmæti með mánaðarlegum innborgunum
```
FV = PMT × ((1 + r)^n - 1) / r

Þar sem:
- PMT = Mánaðarlegur kostnaður
- r = Mánaðarleg ávöxtun (0.07 / 12 = 0.005833)
- n = Fjöldi mánaða

5 ár:   n = 60
10 ár:  n = 120
20 ár:  n = 240
30 ár:  n = 360
```

#### Dæmi útreikningur
```
Ef mánaðarkostnaður = 50.000 kr
Og ávöxtun = 7% á ári

Eftir 10 ár:
FV = 50.000 × ((1 + 0.005833)^120 - 1) / 0.005833
FV = 50.000 × 173.08
FV ≈ 8.654.000 kr
```

### Samanburðarútreikningar

#### Sparnaður milli valkosta
```
Peningasparnaður á mánuði = Kostnaður A - Kostnaður B
Peningasparnaður á ári = Peningasparnaður á mánuði × 12
Tímasparnaður á mánuði = Tími A - Tími B
Lífsorku sparnaður = Lífsorka A - Lífsorka B
```

#### Hlutfallslegur munur
```
Hlutfallsmunur = ((Kostnaður A - Kostnaður B) / Kostnaður A) × 100%
```

## Úttaksforskriftir

### Aðalúttak - Einstakar sviðsmyndir

#### Peningalegur kostnaður
- **Beinn mánaðarkostnaður**: Sýnt sem krónutala með þúsunda skiptum
- **Óbeinn mánaðarkostnaður**: Sýnt sem krónutala (aðeins fyrir bíla)
- **Heildar mánaðarkostnaður**: Sýnt sem krónutala með áherslu
- **Heildar árskostnaður**: Sýnt sem krónutala með áherslu

#### Sundurliðun kostnaðar (fyrir bíla)
- **Eldsneytis/rafmagn**: kr á mánuði
- **Stæðakostnaður**: kr á mánuði
- **Umferðargjöld**: kr á mánuði
- **Afskriftir**: kr á mánuði
- **Tryggingar**: kr á mánuði
- **Viðhald**: kr á mánuði
- **Skoðun**: kr á mánuði

#### Tímaúttak
- **Tími á mánuði**: Klukkustundir og mínútur (t.d. "21 klst 40 mín")
- **Tími á ári**: Klukkustundir (t.d. "260 klst")
- **Tími á ári (dagar)**: Heildagar (t.d. "11 dagar")

#### Lífsorku úttak
- **Tími sem lífsorka**: Klukkustundir á mánuði
- **Peningar sem lífsorka**: Klukkustundir á mánuði
- **Heildar lífsorka (mánuður)**: Klukkustundir með áherslu
- **Heildar lífsorka (ár)**: Dagar og klukkustundir með áhrifamikilli framsetningu

Dæmi texti:
```
"Vinnuferðir þínar kosta þig 45 klukkustundir af lífsorku á mánuði.
Það er yfir vinnuvika á mánuði sem fer bara í að ferðast!"
```

#### Framtíðarverðmæti (FI áhrif)
- **5 ár**: Krónutala ef fjárfest við 7%
- **10 ár**: Krónutala ef fjárfest við 7% (með áherslu)
- **20 ár**: Krónutala ef fjárfest við 7%
- **Við starfslok**: Krónutala (ef aldur þekktur)

Dæmi texti:
```
"Ef þú myndir fjárfesta þennan kostnað í staðinn myndi hann vaxa
í 8.654.000 kr á 10 árum."
```

### Samanburðartafla - Margar sviðsmyndir

Þegar 2-4 sviðsmyndir eru til samanburðar:

| Dálkur | Snið | Lýsing |
|--------|------|--------|
| Heiti | Texti | Nafn sviðsmyndar |
| Ferðamáti | Íkon + texti | Bíll/Strætó/Hjól/Ganga/Fjarvinnu |
| Mánaðarkostnaður | Krónutala + litamerking | Grænt=ódýrast, rautt=dýrast |
| Tími (mán.) | Klukkustundir | Tími í ferð á mánuði |
| Lífsorka (mán.) | Klukkustundir + litamerking | Heildar lífsorka á mánuði |
| FV (10 ár) | Krónutala | Framtíðarverðmæti |
| Munur | Krónutala + % | Munur frá ódýrasta |

#### Sparnað við val á ódýrasta
```
"Með því að velja [ódýrasti valkostur] í stað [dýrasti valkostur]:
- Sparar þú: 67.000 kr á mánuði
- Sparar þú: 15 klukkustundir af lífsorku
- Eftir 10 ár: 11.550.000 kr meira á reikningnum"
```

### Myndrænir þættir

#### Kransarit (Pie chart) - Kostnaðarskipting fyrir bíla
Sýnir hlutfall:
- Eldsneytis (X%)
- Afskriftir (Y%)
- Tryggingar (Z%)
- Viðhald (W%)
- Annað (V%)

#### Súlurit (Bar chart) - Samanburður sviðsmynda
Fyrir hverja sviðsmynd:
- Peningakostnaður (kr)
- Tímakostnaður (klst)
- Heildar lífsorka (klst)

#### Framvindurit - FI áhrif yfir tíma
Sýnir uppsafnað verðmæti ef fjárfest:
- 0, 5, 10, 15, 20, 25, 30 ár

### Viðvaranir og ábendingar

#### Þegar notandi vanmetur kostnað
```
"💡 Athugið: Þú ert aðeins að telja bensínkostnað.
Raunverulegur bílakostnaður er u.þ.b. 3x hærri þegar
afskriftir, tryggingar og viðhald eru talin með."
```

#### Þegar lífsorka er há
```
"⚠️ Vinnuferðir þínar kosta þig yfir 50 klukkustundir
af lífsorku á mánuði. Íhugaðu að flytja nær vinnunni
eða semja um fjarvinnu."
```

#### Þegar FI áhrif eru mikil
```
"🎯 Með því að minnka vinnuferðakostnað um 50% gætir þú
náð fjárhagslegu frelsi 18 mánuðum fyrr."
```

### Úttak fyrir aðra ferðamáta

#### Almenningssamgöngur
- Mánaðarkostnaður (farmiðakostnaður)
- Tími í ferð
- Lífsorka
- FV ef fjárfest
- **Ekki** sýna óbeinan kostnað (engar afskriftir/tryggingar)

#### Hjólreiðar/Ganga
- Viðhaldskostnaður (lágur eða 0)
- Tími í ferð
- **Bónus**: "🌿 Þú sparar X kg af CO2 á ári" (framtíð)
- **Bónus**: "💪 Þú færð Y mínútur af hreyfingu á dag" (framtíð)

#### Fjarvinnu
- Allur kostnaður = 0 kr
- Allur tími = 0 klst
- **Skilaboð**: "🏡 Fjarvinnu er ódýrasti valkosturinn - enginn ferðakostnaður!"

## Kröfur sem ekki tengjast virkni

### Afköst

1. **Þegar** notandi breytir inntaksgildi, **skal kerfið** uppfæra alla útreikninga innan 50ms.

2. **Kerfið skal** gera alla útreikninga á viðskiptavindarhlið (client-side) án netbeiðna.

3. **Þegar** notandi skiptir á milli sviðsmynda, **skal kerfið** sýna nýjar niðurstöður innan 100ms.

4. **Kerfið skal** keyra án töf á tækjum frá síðustu 5 árum (desktop og mobile).

### Aðgengi (WCAG 2.1 AA)

1. **Öll** innsláttar svæði **skulu** hafa skýr merki (labels) tengd með aria-labels.

2. **Allar** aðgerðir **skulu** vera aðgengilegar með lyklaborði:
   - Tab/Shift+Tab fyrir flakk
   - Enter/Space fyrir aðgerðir
   - Escape til að loka glugga

3. **Kerfið skal** hafa nægilegt litaskil (contrast ratio ≥ 4.5:1) fyrir allan texta.

4. **Þegar** villa kemur upp í innsláttarsvæði, **skal kerfið** sýna villutexta sem skjálesari getur lesið.

5. **Allar** myndir og íkon **skulu** hafa lýsandi alt-texta.

6. **Kerfið skal** virka með algengum skjálesurum:
   - VoiceOver (macOS/iOS)
   - NVDA (Windows)
   - TalkBack (Android)

7. **Þegar** notandi notar skjálesara, **skal kerfið** tilkynna:
   - Breytingar á útreikningum
   - Villuskilaboð
   - Árangur við aðgerðir (vista, eyða, o.s.frv.)

### Notendaupplifun

1. **Allur** texti í viðmótinu **skal** vera á íslensku.

2. **Allar** krónutölur **skulu** vera sýndar með íslenskri sniðmát:
   - Þúsund skil: 50.000 kr (ekki 50,000 kr)
   - Decimals: 50.500,50 kr (ef nauðsynlegt)

3. **Þegar** notandi fer yfir upplýsingarmerki (ℹ️), **skal kerfið** sýna skýringartexta.

4. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna vingjarnlega ábendingu með hlekk að tímakaupsreiknivélinni.

5. **Þegar** notandi vistar sviðsmynd, **skal kerfið** sýna staðfestingu (t.d. "✓ Vistað").

6. **Ef** notandi reynir að búa til 5. sviðsmynd, **skal kerfið** sýna:
   "Þú getur aðeins haft 4 sviðsmyndir í einu. Eyddu einni til að búa til nýja."

7. **Allar** aðgerðir sem eyða gögnum **skulu** biðja um staðfestingu.

### Persónuvernd og gagnageymsla

1. **Öll** gögn **skulu** vera geymd í localStorage á tæki notanda.

2. **Engin** gögn **skulu** vera send á netþjón nema notandi velji útflutning.

3. **Kerfið skal** vista vinnuferðagögn í localStorage lykli: `commuteCost_scenarios`

4. **Þegar** notandi flytur út gögn, **skulu** vinnuferðagögn vera innifalin í JSON skránni.

5. **Þegar** notandi flytur inn gögn, **skal kerfið** samþætta vinnuferðagögn með öðrum göðnum.

6. **Kerfið skal** geyma allt að 4 sviðsmyndir á notanda.

7. **Ef** localStorage rýmur ekki fleiri gögnunum (ólíklegt), **skal kerfið** sýna skýr villuskilaboð.

### Samhæfni

1. **Kerfið skal** virka í öllum nútíma vöfrum:
   - Chrome/Edge (síðustu 2 útgáfur)
   - Firefox (síðustu 2 útgáfur)
   - Safari (síðustu 2 útgáfur)

2. **Kerfið skal** vera fullkomlega virkt (responsive) á:
   - Desktop (≥1024px)
   - Tablet (768px - 1023px)
   - Mobile (≤767px)

3. **Þegar** notandi notar mobile, **skal kerfið** stafl sviðsmyndir lóðrétt fyrir betri lesanleika.

4. **Kerfið skal** nota touch-friendly stærðir á hnöppum og inntakssvæðum (min 44x44px).

### Áreiðanleiki

1. **Ef** villa kemur upp í útreikningi, **skal kerfið** sýna "Óþekkt villa" í stað þess að hrynja.

2. **Kerfið skal** sannprófa öll inntak áður en útreikningu er framkvæmt.

3. **Ef** inntak er ógilt, **skal kerfið** sýna rauða ramma og skýr villuskilaboð.

4. **Kerfið skal** meðhöndla jaðartilvik:
   - Division by zero (ef raunverulegt tímakaup = 0)
   - Mjög háar fjarlægðir (>200 km)
   - Mjög hátt eldsneytisverð (>1000 kr/lítri)

5. **Þegar** localStorage gögn eru skemmd, **skal kerfið** nota sjálfgefin gildi og tilkynna notanda.

## Takmarkanir og forsendur

### Takmarkanir
- Öll útreikning verður að gerast á viðskiptavindarhlið (client-side)
- Engin tenging við ytri API fyrir eldsneytisverð (notandi slær inn)
- Engin GPS eða kortatenging fyrir fjarlægðir
- Byggir á meðaltölum, ekki rauntímagögnum
- Allur texti á íslensku

### Forsendur
- Notandi hefur fyllt út raunverulegt tímakaup í aðalreiknivélinni
- Notandi þekkir vegalengd í vinnuferð (í km)
- Notandi þekkir fjölda vinnuferðadaga á viku/mánuði
- Eldsneytis- og rafmagnsverð nokkuð stöðugt til skamms tíma
- 7% árleg ávöxtun á fjárfestingum (staðlað í FIRE samfélaginu)
- Íslensk meðaltöl fyrir bílakostnað eru raunhæf viðmið

## Árangursviðmið

Reiknivélin telst vel heppnuð þegar:
- ✅ Notandi getur skráð allar upplýsingar um vinnuferð á innan við 2 mínútur
- ✅ Notandi sér skýran mun á "augljósum kostnaði" (eldsneytis) og "heildar kostnaði"
- ✅ Notandi skilur hversu margar klukkustundir af lífsorku vinnuferðir kosta
- ✅ Notandi getur borið saman allt að 4 mismunandi valkosti hlið við hlið
- ✅ Allar útreikningar eru nákvæmir og samræmast raunveruleikanum
- ✅ Niðurstöður eru sýndar á skýran og auðskiljanlegan hátt
- ✅ Gögn eru vistuð með localStorage og flytjast með export/import

## Tengsl

- **Krefst**: Raunverulegt Tímakaups reiknivélar (fyrir actualHourlyWage)
- **Notar**: Sömu UI íhluti og aðalreiknivélin
- **Geymt með**: Aðalgögnum í localStorage
- **Hluti af**: "Áhrif Útgjalda" (Expense Impact) flipanum í Phase 2

## Framtíðarútvíkkun (Utan gildissviðs MVP)

- Samþætting við Já.is/Google Maps fyrir sjálfvirka fjarlægðaútreikninga
- Rauntíma eldsneytisverð frá Gasvaktin API
- Samþætting við Strætó API fyrir almenningssamgönguverð
- Graf sem sýnir uppsafnaðan kostnað yfir tíma (1 ár, 5 ár, 10 ár)
- CO2 útblástur og umhverfisáhrif
- Heilsuáhrif (hreyfing fyrir hjólreiðar/göngu vs. streita í umferð)
- Samanburður við meðaltal annarra notenda
- Útreikning á ákjósanlegri fjarlægð frá vinnu miðað við leigu-/fasteignaverð
