# Kröfur: Matkostnaðarmælir (Meal Cost Calculator)

## Yfirlit

**Eiginleiki**: Matkostnaðarmælir
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2 - Áhrif útgjalda
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Matur er oft ein stærsta breytileg útgjöld í fjölskyldufjárhag, en flestir gera sér ekki grein fyrir raunverulegum kostnaði máltíðarvenja sinna. Litlir daglegir kostnaðir (kaffi, hádegismatur úti, matsending) virðast ódýrir hver fyrir sig, en samanlagt geta þeir:
- Kostað margar klukkustundir af lífsorku á viku/mánuði
- Seinkað fjárhagslegu frelsi (FI) um mörg ár
- Vaxið í stórfé ef fjárfest væri í staðinn
- Rýrt heilsufarslegan ávinning heimaeldunar

Með því að bera saman raunverulegan kostnað (bæði peninga og tíma) milli mismunandi mataræðisaðferða geta notendur tekið upplýstar ákvarðanir um hvaða valkostir eru þess virði fyrir þeirra aðstæður.

## Notendafrásagnir

### NS-1: Skrá matarvenjur utan heimilis
**Sem** notandi sem vill skilja útgjöld til matar utan heimilis,
**vil ég** geta skráð hversu oft ég borða úti og hversu mikið það kostar,
**svo að** ég geti séð heildarkostnaðinn í krónum og lífsorku.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi opnar Matkostnaðarmæli, **skal kerfið** sýna eyðublað fyrir mat utan heimilis með:
   - Morgunverður úti á viku (tala, 0-21)
   - Hádegisverður úti á viku (tala, 0-21)
   - Kvöldverður úti á viku (tala, 0-21)
   - Meðalkostnaður morgunverðar (krónutala)
   - Meðalkostnaður hádegisverðar (krónutala)
   - Meðalkostnaður kvöldverðar (krónutala)

2. **Þegar** notandi slær inn fjölda máltíða, **skal kerfið** uppfæra útreikninga samstundis.

3. **Ef** notandi slær inn gild gildi (>= 0), **skal kerfið** vista gögnin í localStorage.

4. **Þegar** notandi slær inn ógild gildi (< 0 eða ekki tala), **skal kerfið** sýna villuskilaboð.

5. **Kerfið skal** bjóða upp á forstillt meðalverð fyrir íslenskar aðstæður:
   - Morgunverður: 1.500 kr
   - Hádegisverður: 2.500 kr
   - Kvöldverður: 4.000 kr

---

### NS-2: Skrá kaffi og drykkjarkaup
**Sem** notandi sem kaupir reglulega kaffi eða drykkjavöru úti,
**vil ég** geta skráð þessi smákaup sérstaklega,
**svo að** ég geti séð hversu mikið þau kosta mig í raun yfir tíma.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á innslátt fyrir:
   - Kaffi/drykkjavörur keyptar á viku (tala)
   - Meðalkostnaður á kaffi/drykkjavöru (krónutala)

2. **Þegar** notandi skráir kaup, **skal kerfið** reikna út:
   - Vikukostnað í krónum
   - Mánaðarkostnað í krónum (× 4,33)
   - Árskostnað í krónum (× 52)

3. **Kerfið skal** bjóða upp á forstillt gildi:
   - Meðalkostnaður kaffihúsakaffis: 650 kr

---

### NS-3: Skrá skyndibitakaup
**Sem** notandi sem kaupir stundum skyndibitamat,
**vil ég** geta skráð þau kaup sérstaklega,
**svo að** ég sjái muninn á skyndibitastöðum og veitingastöðum.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á innslátt fyrir:
   - Skyndibitamáltíðir á viku (tala)
   - Meðalkostnaður á skyndibitamáltíð (krónutala)

2. **Kerfið skal** bjóða upp á forstillt gildi:
   - Meðalkostnaður skyndibitamáltíðar: 2.000 kr

3. **Þegar** notandi skráir skyndibitakaup, **skal kerfið** telja þau sérstaklega frá veitingahúsamáltíðum í sundurliðun.

---

### NS-4: Skrá heimaeldunar kostnað
**Sem** notandi sem eldar heima,
**vil ég** geta skráð hvað ég eyði í matvörukaup og hversu miklum tíma ég eyði í eldamennsku,
**svo að** ég geti borið saman raunverulegan kostnað við að borða úti.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á innslátt fyrir:
   - Mánaðarlegt matvörukaup (krónutala)
   - Fjöldi í heimili (tala, >= 1)
   - Klukkustundir í matvörukaupum á viku (tala)
   - Klukkustundir í eldhúsi á viku (tala)

2. **Þegar** notandi skráir fjölda í heimili, **skal kerfið** reikna kostnað á mann.

3. **Þegar** notandi skráir tíma, **skal kerfið** margfalda með raunverulegu tímakaupi til að fá tímakostnað.

4. **Kerfið skal** reikna út heildarkostnað heimaeldunar sem:
   ```
   Heildarkostnaður = Matvörukostnaður + (Innkaupstími × Tímakaup) + (Eldhústími × Tímakaup)
   ```

5. **Kerfið skal** bjóða upp á forstillt gildi:
   - Mánaðarlegt matvörukaup: 80.000 kr (fjölskylda með 2)
   - Innkaupstími: 2 klst/viku
   - Eldhústími: 7 klst/viku

---

### NS-5: Sjá samanburð á kostnaði
**Sem** notandi með skráðar matarvenjur,
**vil ég** sjá skýran samanburð á kostnaði milli að borða úti og heima,
**svo að** ég geti tekið upplýstar ákvarðanir.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur skráð bæði útgjöld utan heimilis og heimaeldunar, **skal kerfið** sýna:
   - Heildarkostnaður að borða úti (mánuður/ár)
   - Heildarkostnaður heimaeldunar (mánuður/ár)
   - Nettómunur í krónum
   - Lífsorku klukkustundir fyrir hvorn valkost
   - Lífsorku munur

2. **Kerfið skal** sýna sundurliðun fyrir mat úti:
   - Morgunverðir (fjöldi × verð)
   - Hádegisverðir (fjöldi × verð)
   - Kvöldverðir (fjöldi × verð)
   - Kaffi/drykkjavörur (fjöldi × verð)
   - Skyndibitamáltíðir (fjöldi × verð)
   - Samtals

3. **Kerfið skal** sýna sundurliðun fyrir heimaeldun:
   - Matvörukostnaður
   - Tímakostnaður innkaupa (klukkustundir × tímakaup)
   - Tímakostnaður eldunar (klukkustundir × tímakaup)
   - Samtals

4. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna viðvörun: "Vinsamlegast fylltu út raunverulegt tímakaup í aðalreiknivélinni fyrst."

---

### NS-6: Sjá áhrif á fjárhagslegt frelsi
**Sem** notandi sem stefnir að fjárhagslegu frelsi,
**vil ég** sjá hversu mikið mataræðisval mitt hefur áhrif á FI tímalínuna mína,
**svo að** ég geti metið hvort þægindi þess að borða úti séu þess virði.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** reikna út og sýna framtíðarverðmæti ef munur á kostnaði væri fjárfestur:
   - Eftir 10 ár (við 7% ávöxtun)
   - Eftir 20 ár (við 7% ávöxtun)
   - Eftir 30 ár (við 7% ávöxtun)

2. **Þegar** heimaeldun er ódýrari, **skal kerfið** sýna framtíðarverðmæti sparnaðarins.

3. **Þegar** borða úti er ódýrara (vegna hás tímakaups), **skal kerfið** sýna neikvætt framtíðarverðmæti.

4. **Kerfið skal** sýna þessar upplýsingar með skýrum texta og tölulegum gildum.

---

### NS-7: Bera saman mataræðisáætlanir
**Sem** notandi sem vill finna bestu nálgunina fyrir mig,
**vil ég** geta borið saman mismunandi mataræðisáætlanir,
**svo að** ég sjái hvaða valkostur gefur bestu ávöxtunina fyrir mig.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á 4-5 forstilltar atburðarásir til samanburðar:
   - "Borða úti alla daga" (21 máltíð/viku úti)
   - "Venjulegur vinnandi" (hádegisverður úti 5 daga/viku)
   - "Hóflega heimaeldun" (elda heima 5 dagar/viku, úti um helgar)
   - "Mikil heimaeldun" (elda heima 6 dagar/viku, úti 1 dag)
   - "100% heimaeldun" (allar máltíðir heima)

2. **Þegar** notandi velur atburðarás, **skal kerfið** fylla inn dæmigerð gildi sjálfkrafa.

3. **Kerfið skal** leyfa notanda að breyta gildum eftir að hafa valið atburðarás.

4. **Kerfið skal** sýna samanburðartöflu með:
   - Heiti atburðarrásar
   - Mánaðarkostnaður (kr)
   - Lífsorku (klst/mánuði)
   - Sparnaður miðað við núverandi venjur
   - Framtíðarverðmæti sparnaðar (20 ár)

---

### NS-8: Flýtival fyrir algeng íslensk verð
**Sem** notandi sem vill ekki giska á verð,
**vil ég** geta valið úr lista af algengum íslenskum matarkostnaði,
**svo að** útreikningar séu raunhæfir.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á flýtival fyrir morgunverð:
   - Kaffihús morgunverður: 1.500 kr
   - Veitingahús morgunverður: 2.500 kr
   - Hótel morgunhlaðborð: 3.500 kr

2. **Kerfið skal** bjóða upp á flýtival fyrir hádegisverð:
   - Skyndibitastaður: 1.800 kr
   - Góður skyndibitastaður: 2.500 kr
   - Veitingahús: 3.500 kr
   - Góður veitingahús: 4.500 kr

3. **Kerfið skal** bjóða upp á flýtival fyrir kvöldverð:
   - Skyndibitastaður: 2.000 kr
   - Venjulegur veitingahús: 4.000 kr
   - Góður veitingahús: 6.000 kr
   - Fínir veitingahús: 10.000 kr

4. **Kerfið skal** bjóða upp á flýtival fyrir kaffi/drykkjavörur:
   - Bensínstöð kaffi: 400 kr
   - Kaffihús espresso: 650 kr
   - Kaffihús specialty: 1.000 kr

5. **Þegar** notandi velur forstillt verð, **skal kerfið** fylla inn gildið en leyfa handvirkum breytingum.

---

## Inntaksforskriftir

### Mat utan heimilis
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Morgunverðir á viku | Tala | 0 | >= 0, <= 21 | Fjöldi máltíða |
| Hádegisverðir á viku | Tala | 5 | >= 0, <= 21 | Fjöldi máltíða |
| Kvöldverðir á viku | Tala | 2 | >= 0, <= 21 | Fjöldi máltíða |
| Verð morgunverðar | Krónutala | 1.500 | > 0 | Meðalverð í krónum |
| Verð hádegisverðar | Krónutala | 2.500 | > 0 | Meðalverð í krónum |
| Verð kvöldverðar | Krónutala | 4.000 | > 0 | Meðalverð í krónum |
| Kaffi/drykkir á viku | Tala | 5 | >= 0 | Fjöldi innkaupa |
| Verð á kaffi/drykkjum | Krónutala | 650 | > 0 | Meðalverð í krónum |
| Skyndibitamáltíðir á viku | Tala | 1 | >= 0, <= 21 | Fjöldi máltíða |
| Verð skyndibitamáltíðar | Krónutala | 2.000 | > 0 | Meðalverð í krónum |

### Heimaeldun
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Mánaðarlegt matvörukaup | Krónutala | 80.000 | > 0 | Heildarkaup fyrir heimili |
| Fjöldi í heimili | Tala | 2 | >= 1 | Fjöldi fólks |
| Innkaupstími á viku | Tala | 2 | >= 0 | Klukkustundir |
| Eldhústími á viku | Tala | 7 | >= 0 | Klukkustundir |

## Útreikningsformúlur

### Kostnaður matar utan heimilis

#### Vikukostnaður
```
Morgunverðir = (Fjöldi morgunverða × Verð morgunverðar)
Hádegisverðir = (Fjöldi hádegisverða × Verð hádegisverðar)
Kvöldverðir = (Fjöldi kvöldverða × Verð kvöldverðar)
Kaffi = (Fjöldi kaffi × Verð kaffis)
Skyndibitir = (Fjöldi skyndibitamáltíða × Verð skyndibitamáltíðar)

Vika samtals = Morgunverðir + Hádegisverðir + Kvöldverðir + Kaffi + Skyndibitir
```

#### Mánaðar- og árskostnaður
```
Mánaður = Vika samtals × 4,33
Ár = Vika samtals × 52
```

### Kostnaður heimaeldunar

#### Beinn kostnaður
```
Matvörukostnaður (mánuður) = Mánaðarlegt matvörukaup
Matvörukostnaður (ár) = Mánaðarlegt matvörukaup × 12
```

#### Tímakostnaður
```
Innkaupstímakostnaður (vika) = Innkaupstími × Raunverulegt tímakaup
Eldhústímakostnaður (vika) = Eldhústími × Raunverulegt tímakaup

Tímakostnaður (mánuður) = (Innkaupstímakostnaður + Eldhústímakostnaður) × 4,33
Tímakostnaður (ár) = (Innkaupstímakostnaður + Eldhústímakostnaður) × 52
```

#### Heildarkostnaður
```
Heildarkostnaður heimaeldunar (mánuður) = Matvörukostnaður + Tímakostnaður (mánuður)
Heildarkostnaður heimaeldunar (ár) = Matvörukostnaður (ár) + Tímakostnaður (ár)
```

#### Kostnaður á mann
```
Kostnaður á mann = Heildarkostnaður / Fjöldi í heimili
```

### Lífsorku útreikningar

#### Lífsorku fyrir mat úti
```
Lífsorku (klukkustundir/mánuð) = Mánaðarkostnaður / Raunverulegt tímakaup
Lífsorku (klukkustundir/ár) = Árskostnaður / Raunverulegt tímakaup
```

#### Lífsorku fyrir heimaeldun
```
Peningalegt tímakaup = Matvörukostnaður / Raunverulegt tímakaup
Raunverulegur eldhústími = Innkaupstími + Eldhústími

Lífsorku (klukkustundir/mánuð) = Peningalegt tímakaup (mánuður) + (Raunverulegur eldhústími × 4,33)
Lífsorku (klukkustundir/ár) = Peningalegt tímakaup (ár) + (Raunverulegur eldhústími × 52)
```

### Samanburður

```
Munur (krónutala) = Kostnaður úti - Kostnaður heima
Munur (lífsorku) = Lífsorku úti - Lífsorku heima

Ef Munur > 0: Heimaeldun sparar peninga
Ef Munur < 0: Úti að borða sparar peninga (vegna hás tímakaups)
```

### Framtíðarverðmæti (FV)

Ef mánaðarlegur munur væri fjárfestur:

```
FV = PMT × ((1 + r)^n - 1) / r

Þar sem:
- PMT = Mánaðarlegur munur (abs gildi)
- r = Mánaðarleg ávöxtun (7% / 12 = 0,005833)
- n = Fjöldi mánaða

Fyrir 10 ár: n = 120
Fyrir 20 ár: n = 240
Fyrir 30 ár: n = 360
```

## Úttaksforskriftir

### Aðalúttak - Mat utan heimilis

- **Vikukostnaður**: Sýnt sem krónutala með aðgreiningu
  - Morgunverðir: X kr
  - Hádegisverðir: X kr
  - Kvöldverðir: X kr
  - Kaffi/drykkir: X kr
  - Skyndibitir: X kr
- **Mánaðarkostnaður**: Samtals í krónum
- **Árskostnaður**: Samtals í krónum
- **Lífsorku (mánuður)**: Klukkustundir og mínútur
- **Lífsorku (ár)**: Dagar, klukkustundir og mínútur

### Aðalúttak - Heimaeldun

- **Mánaðarkostnaður**: Sundurliðun
  - Matvörukostnaður: X kr
  - Innkaupstími: X klst × Y kr/klst = Z kr
  - Eldhústími: X klst × Y kr/klst = Z kr
  - Samtals: X kr
- **Árskostnaður**: Samtals í krónum
- **Kostnaður á mann**: Ef fleiri en 1 í heimili
- **Lífsorku (mánuður)**: Klukkustundir (bæði beinn tími + peninga sem lífsorka)
- **Lífsorku (ár)**: Dagar, klukkustundir

### Samanburðarúttak

- **Mánaðarmunur**:
  - Í krónum (með + eða - tákni)
  - Í lífsorku klukkustundum
  - Hlutfallslegur munur (%)
- **Ársmunur**:
  - Í krónum
  - Í lífsorku dögum/klukkustundum
- **Niðurstaða**: "Heimaeldun sparar X kr á mánuði" eða "Með þínu tímakaupi er ódýrara að borða úti"

### Framtíðarverðmæti úttak

- **10 ára framtíðarverðmæti**: X.XXX.XXX kr
- **20 ára framtíðarverðmæti**: X.XXX.XXX kr
- **30 ára framtíðarverðmæti**: X.XXX.XXX kr
- **Skýringatexti**: "Ef þú fjárfestir X kr á mánuði í 20 ár við 7% ávöxtun muntu eiga Y kr"

### Atburðarásir samanburður

Tafla með dálkum:
| Atburðarás | Mán.kostnaður | Lífsorka/mán | Sparnaður | FV (20 ár) |
|------------|---------------|--------------|-----------|------------|
| Núverandi | X kr | Y klst | - | - |
| Valkostur 1 | X kr | Y klst | ±Z kr | Q kr |
| Valkostur 2 | X kr | Y klst | ±Z kr | Q kr |

## Kröfur sem ekki tengjast virkni

### Afköst

1. **Þegar** notandi breytir inntaksgildi, **skal kerfið** uppfæra alla útreikninga innan < 50ms.

2. **Kerfið skal** framkvæma alla útreikninga á viðskiptavindarhlið (client-side).

3. **Kerfið skal ekki** senda neinar netbeiðnir fyrir útreikninga.

### Aðgengi

1. **Kerfið skal** uppfylla WCAG 2.1 AA staðla.

2. **Kerfið skal** virka að fullu með lyklaborði:
   - Tab navigation milli reita
   - Enter til að vista/uppfæra
   - Escape til að hætta við

3. **Kerfið skal** vera skjálesarasamhæft með:
   - ARIA merkingum á öllum inntaksreitum
   - Lýsandi labels fyrir alla reiti
   - Skýrum villuskilaboðum

4. **Kerfið skal** hafa nægan lit-contrast:
   - Texti á bakgrunni: að lágmarki 4.5:1
   - Stórir textar/fyrirsagnir: að lágmarki 3:1

### Móttækileg hönnun (Responsive)

1. **Kerfið skal** virka á öllum skjástærðum:
   - Farsími (320px - 767px)
   - Spjaldtölva (768px - 1023px)
   - Borðtölva (1024px+)

2. **Þegar** notandi notar farsíma, **skal kerfið**:
   - Staflа eyðublöðum lóðrétt
   - Nota heilri skjábreidd fyrir inntaksreiti
   - Fela eða minnka ítarlegar sundurliðanir sjálfgefið

3. **Þegar** notandi notar spjaldtölvu eða stærra, **skal kerfið**:
   - Sýna hlið við hlið samanburð
   - Sýna allar sundurliðanir sjálfgefið

### Persónuvernd og gagnavinnsla

1. **Kerfið skal** geyma öll gögn í localStorage eingöngu.

2. **Kerfið skal ekki** senda nein notendagögn til netþjóns.

3. **Kerfið skal** flytja matkostnaðargögn með aðal export/import virkni appsins.

4. **Kerfið skal** geyma gögnin með eftirfarandi lykli í localStorage:
   ```
   peninganaedalifid_matkostnadur
   ```

5. **Þegar** notandi eyðir öllum appgögnum, **skal kerfið** eyða einnig matkostnaðargögnum.

### Tungumál

1. **Kerfið skal** birta allan texta á íslensku.

2. **Kerfið skal** nota íslenskt snið fyrir:
   - Tölur: punktur sem þúsundaskil (1.000.000)
   - Tölustafir: komma sem tugabrot (1.234,56) - þó að við notum punkt í útreikningum
   - Dagatöl: dd.mm.áááá
   - Tími: kk:mm (24 klst snið)

3. **Kerfið skal** nota réttar beygingarreglur:
   - "1 klukkustund" en "2 klukkustundir"
   - "1 dagur" en "2 dagar"

### Áreiðanleiki

1. **Þegar** raunverulegt tímakaup er ekki skilgreint, **skal kerfið**:
   - Sýna skýr viðvörunarskeyti
   - Gera lífsorku útreikninga óvirka
   - Bjóða upp á hlekk til að fylla út tímakaup

2. **Þegar** notandi slær inn ógild gögn, **skal kerfið**:
   - Sýna villuskilaboð við viðkomandi reit
   - Ekki framkvæma útreikninga með ógild gögn
   - Halda gildum reitum óbreyttum

3. **Kerfið skal** vista gögn sjálfvirkt eftir hverja breytingu (debounced 500ms).

4. **Ef** localStorage er fullt eða óvirkt, **skal kerfið**:
   - Sýna villuskilaboð
   - Leyfa áfram útreikninga (án vista)
   - Bjóða upp á export til að vista gögn utan vafra

## Takmarkanir og forsendur

### Takmarkanir
- Útreikningar eingöngu á viðskiptavindarhlið (engin netþjónsbeiðni)
- Gögn geymd í localStorage með öðrum appgögnum
- Allur texti á íslensku
- Hönnun verður að vera móttækileg (responsive)
- WCAG 2.1 AA aðgengisstaðlar

### Forsendur
- Notandi hefur þegar fyllt út raunverulegt tímakaup í aðalreiknivél
- Íslenskt verðlag notað fyrir forstillingar
- Meðalverð eru miðuð við Reykjavíkursvæði 2026
- Greiðslukortagögn ekki tengd (notandi slær inn mat á útgjöldum)

## Viðmið um árangur

Þessi eiginleiki telst vel heppnaður þegar:
- Notendur geta fljótt skráð núverandi mataræðisvenjur sínar
- Notendur sjá skýran samanburð á peningum, tíma og lífsorku milli valkosta
- Notendur skilja langtímaáhrif mataræðisvals á FI markmið
- Reiknivélin gefur hagnýtar tillögur byggðar á raunverulegu tímakaupi
- Útreikningar eru nákvæmir og aðgengilegir öllum notendum

## Tengsl

### Krefst
- **Raunverulegt Tímakaups reiknivél**: Fyrir `actualHourlyWage` gildi sem notað er í lífsorku útreikningum

### Notar
- **Sömu UI íhluti**: Svipuð hönnun og aðalreiknivélin
- **Sömu export/import virkni**: Matkostnaðargögn fylgja með öllum appgögnum
- **Sama localStorage snið**: Fylgir gagnaskema appsins

### Geymt með
- Öll matkostnaðargögn geymd í localStorage undir lykli: `peninganaedalifid_matkostnadur`
- Fylgir aðalgögnum í export/import

## Framtíðarútvíkkun (Utan gildissviðs MVP)

Eftirfarandi eiginleikar eru utan gildissviðs fyrir fyrstu útgáfu en gætu verið gagnlegir síðar:

### Grafísk framsetning
- Línurit sem sýnir kostnaðarþróun yfir tíma
- Skífurit sem sýnir hlutfall mismunandi mataræðisflokka
- Samanburðargraf sem ber saman núverandi venjur við markmið

### Mataræðismarkmið
- Setja sér markmið um fjölda máltíða heima
- Fylgjast með framvindu í átt að markmiði
- Tilkynningar þegar markmið náð

### Matseðilsáætlun
- Vikuleg matseðilsáætlun með kostnaðarmati
- Innkaupalisti byggður á matseðli
- Tengsl við uppskriftir með kostnaðarmati

### Samfélagseiginleikar
- Deila atburðarásasamanburði (nafnlaust)
- Sjá meðaltal annarra notenda (nafnlaust)
- Uppskriftadeiling með kostnaðarmati

### Bein bankatengingar
- Sjálfvirk greining á veitingahúsaútgjöldum úr kortafærslum
- Sjálfvirk greining á matvörukaupum
- Viðvaranir ef útgjöld fara yfir fjárhagsáætlun

### Hollustueiginleikar
- Næringarmat fyrir máltíðir
- Heilsufarslegar ábendingar
- Tengsl við heilsufarsgögn

### AI tillögur
- Sérsniðnar tillögur um hvernig best að spara
- Greinandi innsýn í eyðslumynstur
- Spá um langtímaáhrif breytinga
