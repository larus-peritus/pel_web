# Kröfur: Ferða- og Frístundakostnaðarreiknivél (Travel/Vacation Cost Calculator)

## Yfirlit

**Eiginleiki**: Ferða- og Frístundakostnaðarreiknivél
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2.1.5 - Kostnaðargreiningar
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Flugferð til Spánar fyrir 150.000 kr virðist oft eðlileg sem "bara frí". En þegar þú sérð ferðina í samhengi við lífsorku (klukkustundir af lífi þínu) og tækifæriskostnað (hvað peningarnir hefðu vaxið í ef þú hefðir fjárfest þá í staðinn), getur það breytt ákvörðuninni.

Ferðir og frí eru mikilvægur hluti af góðu lífi, en margir vanmeta raunverulegan kostnað:
- Flugmiðar sem virðast ódýrir en eru margir mánuðir af vinnu
- Gisting, matur og afþreying sem safnast upp hratt
- "Bara 10.000 kr á dag" sem verður 140.000 kr fyrir tveggja vikna ferð
- Tækifæriskostnaður - hvað hefðu peningarnir orðið að eftir 20-30 ár?

Verkfærið hjálpar notendum að:
- Sjá raunverulegan heildarkostnað ferða í lífsorku klukkustundum
- Bera saman ferðavalkosti (Evrópuferð vs Íslandsferð vs staycation)
- Skilja hversu miklum vinnudögum ferðin kostar
- Meta hvort ferð sé virði lífsorkunnar
- Sjá áhrif á FI tímalínu

## Notendafrásagnir

### NS-1: Reikna heildarkostnað ferðar í lífsorku

**Sem** notandi sem íhugar ferðalög,
**vil ég** sjá heildarkostnað ferðar í klukkustundum af lífsorku,
**svo að** ég geti metið hvort ferðin sé virði vinnutímans.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi opnar reiknivélina, **skal kerfið** sýna eyðublað með eftirfarandi reitum:
   - Heiti ferðar (texti, valfrjálst, t.d. "Spánarferð 2026", "Sumarhús í júní")
   - Lengd ferðar (dagar, áskilið, 1-90)
   - Áfangastaður (texti, valfrjálst)

2. **Kerfið skal** bjóða upp á kostnaðarflokka:
   - **Flug/samgöngur**: Kostnaður fyrir farmiða (kr)
   - **Gisting**: Heildarkostnaður gistingar (kr) eða nóttaverð × fjöldi nætur
   - **Matur**: Daglegur matarkostnaður (kr/dag) eða heildarkostnaður
   - **Afþreying/athafnir**: Heildarkostnaður (kr)
   - **Staðbundnar samgöngur**: Bílaleiga, leigubílar, almenningssamgöngur (kr)
   - **Annað**: Önnur útgjöld (kr)

3. **Þegar** notandi slær inn kostnaðarupphæðir, **skal kerfið** reikna og sýna:
   - Heildarkostnaður ferðar í íslenskum krónum
   - Fjöldi vinnuklukkustunda sem þarf til að vinna sér inn þessa upphæð (miðað við raunverulegt tímakaup)
   - Umreikning í vinnudaga og vinnuvikur
   - Kostnaður á dag í lífsorku klukkustundum

4. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna viðvörun og hlekk til að fylla út tímakaups reiknivélina.

5. **Kerfið skal** uppfæra útreikninga samstundis við innslátt (real-time calculation).

---

### NS-2: Sjá tækifæriskostnað ferðar

**Sem** notandi sem stefnir að fjárhagslegu frelsi,
**vil ég** sjá hvað ferðakostnaðurinn hefði vaxið í ef ég hefði fjárfest hann í staðinn,
**svo að** ég skilji langtíma áhrif ferðarinnar.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** reikna og sýna framtíðarverðmæti ferðakostnaðar ef fjárfest með 7% ávöxtun (sjálfgefið):
   - Eftir 10 ár
   - Eftir 20 ár
   - Eftir 30 ár

2. **Kerfið skal** leyfa notanda að breyta ávöxtunarkröfu (frá 0% til 15%).

3. **Þegar** notandi breytir ávöxtunarkröfu, **skal kerfið** uppfæra útreikninga samstundis.

4. **Kerfið skal** sýna niðurstöður með skýrum texta (t.d. "Ef þú fjárfestir þessa upphæð í staðinn myndir þú eiga [upphæð] eftir 20 ár").

5. **Kerfið skal** reikna "Tækifæriskostnaður á dag" - framtíðarvirði deilt með lengd ferðar.

---

### NS-3: Bera saman ferðavalkosti

**Sem** notandi sem íhugar mismunandi ferðavalkosti,
**vil ég** geta borið saman 2-3 valkosti hlið við hlið,
**svo að** ég geti valið skynsamlegri kostinn.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** leyfa notanda að bæta við allt að 3 ferðavalkostum samtímis.

2. **Fyrir hvern valkost skal** notandi geta slegið inn:
   - Heiti (t.d. "Evrópuferð", "Íslandsferð", "Staycation heima")
   - Öll kostnaðarliðir (flug, gisting, matur, o.s.frv.)
   - Lengd ferðar

3. **Kerfið skal** sýna samanburð hlið við hlið:
   - Heildarkostnaður fyrir hvern valkost (kr)
   - Lífsorgu klukkustundir fyrir hvern valkost
   - Kostnaður á dag (kr og lífsorgu klst)
   - Tækifæriskostnaður fyrir hvern valkost (20 ára framtíðarvirði)
   - Mismun á milli valkosta

4. **Kerfið skal** auðkenna ódýrasta kostinn með sjónrænu merki.

5. **Kerfið skal** sýna "sparnaður" ef notandi velur ódýrari kost í stað dýrari (bæði í krónum og lífsorgu klukkustundum).

---

### NS-4: Reikna "staycation" samanburð

**Sem** notandi sem vill meta hvort ferðalög séu virði kostnaðarins,
**vil ég** sjá samanburð við að vera heima (staycation),
**svo að** ég geti metið aukakostnaðinn við að ferðast.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á "Bæta við Staycation samanburði" valkost.

2. **Þegar** virkjað, **skal kerfið** sýna viðbótarreit:
   - "Daglegur kostnaður ef heima" (kr/dag)
   - Sjálfgefið: Að vera heima kostar ekki neitt aukalega (0 kr)
   - Notandi getur slegið inn áætlaðan matarkostnað ef þeir myndu borða heima

3. **Kerfið skal** reikna og sýna:
   - Heildarkostnaður að vera heima í sama tíma
   - Aukakostnaður ferðar (ferðakostnaður - heima kostnaður)
   - "Þú borgir [X kr] / [Y klukkustundir] aukalega til að ferðast"

4. **Kerfið skal** sýna þetta á jákvæðan hátt (ekki fordæmandi) - markmiðið er upplýsingar, ekki að koma í veg fyrir ferðir.

---

### NS-5: Sjá áhrif á FI tímalínu (valfrjálst)

**Sem** notandi með skilgreind FI markmið,
**vil ég** sjá hversu mikið ferðin tefur FI dagsetninguna mína,
**svo að** ég geti vegið það á móti gagnsemi ferðarinnar.

**Samþykktarviðmið (EARS snið)**:

1. **Ef** notandi hefur skilgreint sparnaðarhlutfall og FI markmið, **skal kerfið** reikna og sýna:
   - Hversu margar aukavinnu klukkustundir ferðin bætir við FI tímalínuna
   - Hversu mörgum dögum/mánuðum ferðin tefur FI dagsetningu

2. **Ef** notandi hefur ekki skilgreint FI markmið, **skal kerfið** sleppa þessum hluta (ekki sýna villur).

3. **Kerfið skal** sýna upplýsingar á jákvæðan og hvetjandi hátt:
   - "Ef þú hættir við þessa ferð, nærðu FI [X] fyrr"
   - EKKI: "Þessi ferð tefur þig um [X]" (of neikvætt)

4. **Kerfið skal** einnig sýna "Fjöldi ferða á ári sem tefur FI um 1 mánuð" - gefur samhengi fyrir reglulegar ferðir.

---

### NS-6: Vista og endurskoða fyrri ferðaútreikninga

**Sem** notandi sem vill rifja upp fyrri ferðaáætlanir,
**vil ég** geta vistað útreikninga,
**svo að** ég geti borið saman ferðir yfir tíma.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** vista síðasta útreikning í localStorage.

2. **Þegar** notandi kemur aftur á síðuna, **skal kerfið** hlaða síðasta útreikningi sjálfkrafa.

3. **Kerfið skal** bjóða upp á "Hreinsa" hnapp til að byrja á nýju.

4. **Gögn skulu** flytjast með aðal útflutningi/innflutningi kerfisins (JSON export/import).

5. **Kerfið skal** ekki vista persónulegar upplýsingar á netþjón - allt í localStorage notanda.

---

### NS-7: Forstillingar fyrir algeng ferðalög frá Íslandi

**Sem** íslenskur notandi,
**vil ég** sjá dæmigerðan kostnaðarramma fyrir algengar ferðir,
**svo að** ég geti fljótt áætlað án þess að rannsaka allt.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á "Nota forstillingu" valmöguleika með algengum ferðum:
   - **Helgarferð til Evrópu** (3-4 dagar)
     - Flug: 40.000-80.000 kr
     - Gisting: 20.000-40.000 kr/nótt
     - Matur: 8.000-15.000 kr/dag
     - Annað: 10.000-30.000 kr
   - **Viku sumarhús á Íslandi**
     - Gisting: 150.000-300.000 kr/viku
     - Matur: 8.000-12.000 kr/dag
     - Bensín: 15.000-30.000 kr
     - Annað: 20.000-50.000 kr
   - **Tveggja vikna sólarhringshryðjuferð til USA/Asíu**
     - Flug: 150.000-300.000 kr
     - Gisting: 15.000-40.000 kr/nótt
     - Matur: 10.000-20.000 kr/dag
     - Annað: 50.000-150.000 kr

2. **Þegar** notandi velur forstillingu, **skal kerfið** fylla út eyðublaðið með meðalgildum.

3. **Notandi skal** geta breytt öllum gildum eftir að forstilling er valin.

4. **Kerfið skal** sýna svið (t.d. "40.000-80.000 kr") og láta notanda velja gildi innan þess.

5. **Kerfið skal** innihalda disclaimer: "Þetta eru áætlanir - raunverulegur kostnaður getur verið mismunandi."

---

## Inntaksforskriftir

### Aðalinntök

| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Heiti ferðar | Texti | - | Valfrjálst, max 100 stafir | T.d. "Spánarferð júlí 2026" |
| Lengd ferðar | Heiltala | - | Áskilið, 1-90 dagar | Fjöldi daga |
| Áfangastaður | Texti | - | Valfrjálst, max 100 stafir | T.d. "Barcelona" |

### Kostnaðarliðir

| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Flug/samgöngur | Krónutala | 0 | ≥ 0 | Heildarkostnaður farmiða |
| Gisting | Krónutala | 0 | ≥ 0 | Heildar eða × fjöldi nætur |
| Matur á dag | Krónutala | 0 | ≥ 0 | Daglegur matarkostnaður |
| Afþreying/athafnir | Krónutala | 0 | ≥ 0 | Heildarkostnaður |
| Staðbundnar samgöngur | Krónutala | 0 | ≥ 0 | Bílaleiga, leigubílar, strætó |
| Annað | Krónutala | 0 | ≥ 0 | Önnur útgjöld |

### Stillingar

| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Ávöxtunarkrafa | Prósenta | 7% | 0-15% | Vænt árleg ávöxtun fjárfestinga |
| Staycation daglegur kostnaður | Krónutala | 0 | ≥ 0 | Kostnaður að vera heima (valfrjálst) |

---

## Útreikningsformúlur

### Heildarkostnaður ferðar

```
Heildarkostnaður = Flug + Gisting + (Matur × Lengd) + Afþreying + Staðbundnar samgöngur + Annað

Dæmi:
Flug: 60.000 kr
Gisting: 120.000 kr (30.000 kr/nótt × 4 nætur)
Matur: 10.000 kr/dag × 5 dagar = 50.000 kr
Afþreying: 30.000 kr
Staðbundnar samgöngur: 15.000 kr
Annað: 10.000 kr

Heildarkostnaður = 285.000 kr
```

### Lífsorgu kostnaður

```
Lífsorgu klukkustundir = Heildarkostnaður / Raunverulegt tímakaup

Vinnudagar = Lífsorgu klukkustundir / 8
Vinnuvikur = Lífsorgu klukkustundir / 40

Kostnaður á dag (lífsorga) = Lífsorgu klukkustundir / Lengd ferðar

Dæmi:
Heildarkostnaður: 285.000 kr
Raunverulegt tímakaup: 4.500 kr/klst
Lengd: 5 dagar

Lífsorgu klst = 285.000 / 4.500 = 63,3 klukkustundir
Vinnudagar = 63,3 / 8 = 7,9 dagar ≈ 1,6 vinnuvikur
Kostnaður á dag = 63,3 / 5 = 12,7 klst/dag
```

### Framtíðarverðmæti (tækifæriskostnaður)

```
FV = PV × (1 + r)^n

Þar sem:
- PV = Heildarkostnaður ferðar (upphafleg fjárfesting)
- r = Árleg ávöxtun (sjálfgefið 7% = 0,07)
- n = Fjöldi ára

Dæmi:
PV: 285.000 kr
r: 7% (0,07)

FV(10 ár) = 285.000 × (1,07)^10 = 560.688 kr
FV(20 ár) = 285.000 × (1,07)^20 = 1.102.649 kr
FV(30 ár) = 285.000 × (1,07)^30 = 2.169.203 kr
```

### Staycation samanburður

```
Heima kostnaður = Staycation daglegur kostnaður × Lengd ferðar
Aukakostnaður ferðar = Heildarkostnaður ferðar - Heima kostnaður

Dæmi:
Heildarkostnaður ferðar: 285.000 kr
Staycation daglegur kostnaður: 3.000 kr/dag (matur heima)
Lengd: 5 dagar

Heima kostnaður = 3.000 × 5 = 15.000 kr
Aukakostnaður = 285.000 - 15.000 = 270.000 kr
```

### FI töf (ef FI gögn til staðar)

```
FI töf í dögum = (Heildarkostnaður / Árlegur sparnaður) × 365
FI töf í mánuðum = FI töf í dögum / 30

Fjöldi sambærilegra ferða til að tefja FI um 1 mánuð =
    (Árlegur sparnaður / 12) / Heildarkostnaður ferðar

Dæmi:
Heildarkostnaður: 285.000 kr
Árlegur sparnaður: 1.500.000 kr

FI töf = (285.000 / 1.500.000) × 365 = 69 dagar ≈ 2,3 mánuðir

Fjöldi ferða fyrir 1 mánuð FI töf = (1.500.000 / 12) / 285.000 ≈ 0,44 ferðir
    → "Tæplega 2 slíkar ferðir á ári tefja FI um 1 mánuð"
```

---

## Úttaksforskriftir

### Aðalúttak

**Fyrir hverja ferð sýnt:**

1. **Heildarkostnaður**
   - Krónutala með sundurliðun eftir flokkum
   - Kostnaður á dag (kr/dag)

2. **Lífsorgu kostnaður**
   - Klukkustundir (t.d. "63 klukkustundir")
   - Umreiknað í vinnudaga og vinnuvikur (t.d. "8 vinnudagar eða 1,6 vinnuvikur")
   - Kostnaður á ferðadag í lífsorgu (t.d. "12,7 klst á dag")

3. **Tækifæriskostnaður**
   - Framtíðarverðmæti eftir 10 ár
   - Framtúðarverðmæti eftir 20 ár
   - Framtíðarverðmæti eftir 30 ár
   - Hver tala með skýrum texta

4. **Staycation samanburður** (ef virkjað)
   - Heima kostnaður
   - Aukakostnaður ferðar
   - "Þú borgir [X kr] aukalega til að ferðast"

5. **FI áhrif** (ef FI gögn til staðar)
   - FI töf í mánuðum/dögum
   - Fjöldi sambærilegra ferða sem tefur FI um 1 mánuð
   - Jákvæð framsetning

### Samanburðarúttak (ef margir valkostir)

**Hlið við hlið tafla með:**
- Heiti ferðar
- Heildarkostnaður (kr)
- Lífsorgu klukkustundir
- Kostnaður á dag (kr og klst)
- Tækifæriskostnaður (20 ára)
- Merkja ódýrasta kostinn
- Sýna sparnaður ef ódýrari kostur valinn

### Sniðmát texta

```
"Til að vinna sér inn [heildarkostnað], þarft þú að vinna í [klukkustundir] ([vinnudagar])."

"Þessi ferð kostar þig [X] klst á dag í lífsorku."

"Ef þú fjárfestir [heildarkostnað] í staðinn með 7% ávöxtun, myndir þú eiga [framtíðarverðmæti] eftir [ár]."

"Þú borgir [aukakostnaður] aukalega til að ferðast samanborið við að vera heima."

"Ef þú sleppur þessari ferð, nærðu FI [X mánuðum] fyrr."

"Tæplega [X] slíkar ferðir á ári tefja FI um 1 mánuð."
```

---

## Kröfur sem ekki tengjast virkni

### Afköst

- **Útreikningar**: < 50ms fyrir alla útreikninga
- **Engar netbeiðnir**: Allir útreikningar á viðskiptavindarhlið
- **localStorage**: Hratt að vista/hlaða (< 100ms)

### Notendavænleiki

- **Einfaldar inntök**: Skýrir flokkar fyrir kostnaðarliði
- **Samstundis viðbrögð**: Allt uppfærist við innslátt (engir "Reikna" hnappar)
- **Læsilegar niðurstöður**: Íslensku, skýrar tölur, og samhengi
- **Hjálpartexti**: Útskýringar á ávöxtunarkröfu, tækifæriskostnaði
- **Forstillingar**: Fljótlegt að nota með dæmigerðum ferðum
- **Jákvæður tónn**: Ekki fordæmandi - upplýsingar til að taka upplýstar ákvarðanir

### Aðgengi

- **WCAG 2.1 AA samræmi**
- **Lyklaborðs aðgengi**: Tab-röð skynsamleg
- **Skjálesari samhæft**: Öll úttak með viðeigandi aria-labels
- **Litur ekki eini merkingarberi**: Notum bæði lit og tákn

### Persónuvernd

- **Engin gögn send á netþjón**
- **Allt geymt í localStorage**
- **Valfrjáls visting**: Notandi getur hreinsað gögn hvenær sem er
- **JSON export/import**: Notandi á sín gögn

### Viðmót

- **Svörun**: Virkar vel á farsíma og borðtölvu
- **Samræmi**: Fylgir sama stílsniði og aðrir reiknivélar
- **Íslensku**: Öll UI texti á íslensku með íslenskum gjaldmiðli (ISK)
- **Samanburðartafla**: Responsive - stacking á mobile

---

## Tengsl

- **Krefst**: Raunverulegt Tímakaups reiknivélar (fyrir actualHourlyWage)
- **Notar**: Sömu UI íhluti og aðalreiknivélin
- **Valmögulegt**: FI Number Builder (fyrir FI áhrif útreikninga)
- **Geymt með**: Aðalgögnum í localStorage og JSON export

---

## Takmarkanir og forsendur

### Forsendur

1. Notandi hefur þegar skilgreint raunverulegt tímakaup sitt
2. Ávöxtunarkrafa 7% er skynsamleg langtíma forsenda fyrir fjölbreyttan hlutabréfasafn
3. Notendur eru látnir velja eigin ávöxtunarkröfu til að sjá næmni
4. Útreikningar miðast við íslenskar krónur (ISK)
5. Forstillingar eru áætlanir byggðar á meðalverði fyrir íslenska ferðalanga

### Takmarkanir

1. Tekur ekki tillit til verðbólgu (reiknar í nafnverði)
2. Tekur ekki tillit til skatta á fjárfestingarávöxtun
3. Gerir ráð fyrir jafnri ávöxtun árlega (ekki sveiflukennd)
4. FI áhrif útreikningar eru einföld nálgun (ekki fullkomið FI líkan)
5. Forstillingar eru áætlanir - raunverulegur kostnaður getur verið mismunandi

### Utan gildissviðs fyrir MVP

- Langtíma saga yfir allar ferðir
- Graf sem sýnir uppsafnaðan ferðakostnað yfir árin
- Integration með FI planners til nákvæmari FI date útreiknings
- "Var þetta þess virði?" spurningar eftir ferð
- Samanburður við önnur eyðslumynstur (t.d. "ferðakostnaður vs bílakostnaður")
- Automatic currency conversion fyrir erlendar ferðir
- Integration með ferðabókunarsíðum

---

## Gæðaviðmið

### Nákvæmni

- Öll stærðfræðiformúla rétt útfærð
- Námundun á sýnilegar 0 aukastafi fyrir krónutölur, 1 aukastafi fyrir klukkustundir
- Niðurstöður samræmast handreikningum

### Gagnsæi

- Skýrt hvaða forsendur eru notaðar (ávöxtunarkrafa sýnileg)
- Notandi getur breytt forsendum
- Formúlur skjalaðar í hjálpartexta
- Sundurliðun kostnaðar sýnileg

### Notendaupplifun

- Ekki hræðandi eða fordæmandi tónn
- Upplýsandi en hlutlægur
- Jákvæður framing þegar mögulegt
- Virðir ákvörðun notanda (ekki að segja þeim hvað þeir eiga að gera)
- Viðurkennir að ferðir eru mikilvægur hluti af góðu lífi

---

## Árangursviðmið

### Virkni

- Allir útreikningar framleiða réttar niðurstöður
- Samanburður valkosta virkar með 1-3 valkostum
- Forstillingar fylla út form rétt
- Staycation samanburður virkar
- Visting og hleðsla úr localStorage virkar áreiðanlega

### Notendaupplifun

- Notendur skilja hvað tölurnar þýða (confirmed með user testing)
- Notendur geta tekið upplýstar ákvarðanir um ferðalög
- Engin ruglingur um forsendur eða útreikninga
- Jákvæð upplifun - ekki guilt-tripping

### Afköst

- Útreikningar < 50ms
- UI responsive á öllum tækjum
- Engar performance issues með 3 ferðum í samanburði

---

## Framtíðarútvíkkun

### Fasi 2 útvíkkun

- **Ferðasaga**: Vista allar ferðir til að sjá mynstur yfir tíma
- **Árleg ferðaáætlun**: "Ég vil fara á 2 ferðir á ári - hvernig passar það við FI markmið?"
- **"Var þetta þess virði?" endurskoðun**: Spyrja 3-6 mánuðum eftir ferð
- **Ferðasparnunartól**: "Sparaðu [X kr/mánuð] til að hafa efni á þessari ferð"

### Fasi 3 útvíkkun

- **Integration með bókunarsíðum**: Live price lookups (með privacy í huga)
- **Gjaldeyriskostnaður**: Taka tillit til gjaldeyrismunnar
- **Árstíðabundið verðflokkun**: Sýna hvernig verð breytist eftir árstíma
- **CO2 footprint**: Umhverfisáhrif ferðar (valfrjálst)

### Langtíma útvíkkun

- **AI tillögur**: "Þú gætir sparað [X] með því að ferðast í [mánuður] í staðinn"
- **Samanburður við aðra**: Nafnlaus tölfræði um meðalferðakostnað
- **Integration með FI planning tools**: Nákvæmari timeline útreikninga

---

## Samantekt

Þessi reiknivél hjálpar notendum að:

1. **Skilja raunverulegan kostnað** ferða í lífsorgu klukkustundum
2. **Sjá tækifæriskostnað** - hvað peningarnir hefðu vaxið í
3. **Bera saman valkosti** - ódýrari ferð vs dýrari ferð vs staycation
4. **Taka upplýstar ákvarðanir** án þess að vera fordæmdur

**Core Philosophy**: Ferðir eru mikilvægur hluti af góðu lífi, en það er gott að vita hvað þær kosta í raunverulegri lífsorku. Með þessum upplýsingum getur þú valið ferðir sem eru virði þess fyrir þig.

**Tónn**: Upplýsandi, hlutlaus, virðing fyrir vali notanda. Ekki guilt-tripping.
