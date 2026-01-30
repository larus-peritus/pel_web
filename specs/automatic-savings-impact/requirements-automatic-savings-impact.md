# Kröfur: Sjálfvirk sparnaðaráhrif reiknivél

## Yfirlit

**Eiginleiki**: Sjálfvirk sparnaðaráhrif reiknivél (Automatic Savings Impact Calculator)
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2.2 - Sparnaðar reiknivélar
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Sjálfvirkar sparnaðarflutningar ("borgaðu þér fyrst") eru ein öflugasta aðferðin til að byggja upp auð, en flestir skilja ekki raunverulegan áhrif þeirra til lengri tíma litið. Sjálfvirk 10.000 kr millifærsla á mánuði virðist lítil, en með samsettum vöxtum getur hún:
- Orðið að milljónum króna eftir 10-20 ár
- Gefið þér mánuði eða ár af fjárhagslegu frelsi
- "Unnið fyrir þig" á meðan þú sefur (óbeinn lífsorku ávinningur)

Með því að sjá sjálfvirkan sparnað í samhengi við framtíðarverðmæti og lífsorku geta notendur:
- Verið áhugasamir um að hefja sjálfvirkan sparnað
- Séð ávinning þess að hækka núverandi sjálfvirkan sparnað
- Skilja kraft samsettrar ávöxtunar og tíma
- Framkvæma "borgaðu þér fyrst" hugmyndafræðina úr YMOYL

## Notendafrásagnir

### NS-1: Reikna framtíðarverðmæti sjálfvirks sparnaðar
**Sem** notandi sem veltir fyrir mér að hefja sjálfvirkan sparnað,
**vil ég** sjá hversu mikið mánaðarlegur sparnaður gæti vaxið yfir tíma,
**svo að** ég skilji langtímaávinninginn af að byrja núna.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi slær inn mánaðarlega sparnaðarupphæð, **skal kerfið** reikna framtíðarverðmæti við sjálfgefna vexti (7%).

2. **Þegar** notandi slær inn tímabil (í árum), **skal kerfið** sýna:
   - Heildar framtíðarverðmæti í ISK
   - Heildar innborganir (höfuðstóll)
   - Heildarvöxtur (ávöxtun)
   - Prósentuhlutfall vaxtar af heildarverðmæti

3. **Kerfið skal** sýna framtíðarverðmæti fyrir bæði 10 ár og 20 ár sjálfgefið.

4. **Þegar** notandi breytir inntaksgildum, **skal kerfið** uppfæra útreikninga samstundis (< 50ms).

5. **Ef** notandi slær inn 0 eða neikvæða upphæð, **skal kerfið** sýna viðvörunarboð: "Upphæð verður að vera hærri en 0 kr".

---

### NS-2: Sjá lífsorku sem "unnin óbeint"
**Sem** notandi með skilgreint raunverulegt tímakaup,
**vil ég** sjá hversu mörg tímakaup af lífsorku ég "vinn óbeint" með samsettum vöxtum,
**svo að** ég skilji hvernig peningar geta unnið fyrir mig.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur skráð raunverulegt tímakaup og sjálfvirkan sparnað, **skal kerfið** reikna:
   - Lífsorku klukkustundir sem settar eru inn (höfuðstóll)
   - Lífsorku klukkustundir sem "aflað" er með vöxtum
   - Hlutfall "ókeypis" lífsorku af heildarverðmæti

2. **Kerfið skal** sýna lykilinnsýn: "Með því að sjálfvirka X kr á mánuði muntu hafa Y mánuði af frelsi eftir Z ár"

3. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna ISK gildi en fela lífsorku útreikninga.

4. **Kerfið skal** sýna viðvörun ef tímakaup vantar: "Fylltu fyrst út Tímakaups reiknivélina til að sjá lífsorku áhrif"

---

### NS-3: Bera saman mismunandi upphæðir og tímabil
**Sem** notandi sem vill fínstilla sjálfvirkan sparnað,
**vil ég** geta borið saman mismunandi upphæðir og tímabil,
**svo að** ég geti fundið rétta jafnvægið fyrir aðstæður mínar.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á "Samanburðar ham" sem sýnir tvær eða fleiri aðstæður hlið við hlið.

2. **Þegar** notandi stillir sleða fyrir upphæð, **skal kerfið** uppfæra framtíðarverðmæti í rauntíma.

3. **Kerfið skal** sýna mismun á milli aðstæðna:
   - Mismunur í framtíðarverðmæti (ISK)
   - Mismunur í fjölda frelsismánaða
   - Mismunur í "unninn lífsorku"

4. **Kerfið skal** bjóða upp á algengar forstillingar:
   - 5.000 kr/mán
   - 10.000 kr/mán
   - 25.000 kr/mán
   - 50.000 kr/mán
   - Sérsniðin upphæð

---

### NS-4: Sjá áhrif tíðni (vikuleg vs mánaðarleg)
**Sem** notandi sem vill hámarka vöxt,
**vil ég** sjá mismun á vikulegum og mánaðarlegum millifærslum,
**svo að** ég geti valið bestu tíðni fyrir mig.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** leyfa notanda að velja tíðni:
   - Vikulega
   - Tveggja vikna fresti
   - Mánaðarlega
   - Sérsniðin (X sinnum á ári)

2. **Þegar** notandi skiptir um tíðni, **skal kerfið** reikna samsvarandi framtíðarverðmæti.

3. **Kerfið skal** sýna mismun á framtíðarverðmæti milli tíðna (oft mjög lítill).

4. **Kerfið skal** útskýra: "Tíðni hefur lítil áhrif - mikilvægast er að byrja!"

---

### NS-5: Áhersla á venjumyndun og "borgaðu þér fyrst"
**Sem** notandi sem vill byggja upp góðar fjárhagsvenjur,
**vil ég** sjá fræðsluefni um sjálfvirkan sparnað,
**svo að** ég skilji gildi þess að "borga mér fyrst".

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** innihalda infobox með lykilhugtökum:
   - "Borgaðu þér fyrst" (Pay Yourself First) skilgreining
   - Kraftur sjálfvirkni (removes willpower)
   - Samsett ávöxtun útskýring

2. **Kerfið skal** sýna hvatningu: "Betri að hefja með 1.000 kr en að bíða eftir fullkomnri upphæð"

3. **Kerfið skal** bjóða upp á "Byrja smátt" reiknivél sem sýnir jafnvel 1.000 kr/mán áhrif yfir tíma.

---

### NS-6: Leiðrétta fyrir verðbólgu (valfrjálst)
**Sem** notandi sem vill sjá "raunverulegt" gildi,
**vil ég** geta leiðrétt fyrir verðbólgu,
**svo að** ég sjái framtíðarverðmæti í núverandi krónum.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á rofa: "Leiðrétta fyrir verðbólgu"

2. **Þegar** verðbólguleiðrétting er virk, **skal kerfið** sýna bæði:
   - Nafnverð (nominal value)
   - Raunverðmæti (real value) leiðrétt fyrir verðbólgu

3. **Kerfið skal** nota sjálfgefna verðbólguprósentu (2.5% fyrir Ísland).

4. **Kerfið skal** leyfa notanda að breyta verðbólguforsendum.

5. **Kerfið skal** útskýra: "Leiðrétt fyrir 2.5% árlegri verðbólgu"

---

## Inntaksforskriftir

### Sparnaðarinntök
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Mánaðarleg upphæð | Krónutala | 10000 | > 0, < 10.000.000 | Sjálfvirk millifærsla |
| Tíðni | Val | 'monthly' | Einn af 4 valkostum | Hversu oft |
| Tímabil (ár) | Tala | 10 | > 0, <= 50 | Fjárfestingartími |
| Væntanleg ávöxtun | Prósenta | 7 | 0-20 | Áætluð árleg ávöxtun |
| Verðbólguleiðrétting | Boolean | false | - | Valfrjálst |
| Verðbólguprósenta | Prósenta | 2.5 | 0-10 | Ef leiðrétting virk |

### Tíðnivalkostir
| Tíðni | Lykill | Sinnum á ári |
|-------|--------|---------------|
| Vikulega | weekly | 52 |
| Á tveggja vikna fresti | biweekly | 26 |
| Mánaðarlega | monthly | 12 |
| Sérsniðin | custom | Notandi skilgreinir |

## Útreikningsformúlur

### Framtíðarverðmæti (Future Value - FV)

```
FV = PMT × ((1 + r)^n - 1) / r

Þar sem:
- PMT = Greiðsla í hvert skipti (upphæð / tíðni)
- r = Ávöxtun í hverjum tímapunkti (árleg ávöxtun / tíðni)
- n = Heildarfjöldi greiðslna (ár × tíðni)

Dæmi (10.000 kr/mán, 7% ávöxtun, 10 ár):
- PMT = 10.000 kr
- r = 0.07 / 12 = 0.00583
- n = 10 × 12 = 120
- FV = 10.000 × ((1.00583)^120 - 1) / 0.00583
- FV ≈ 1.730.850 kr
```

### Heildar innborganir (Principal)

```
Heildar innborganir = PMT × n

Dæmi:
- 10.000 kr × 120 = 1.200.000 kr
```

### Heildarvöxtur (Interest Earned)

```
Heildarvöxtur = FV - Heildar innborganir

Dæmi:
- 1.730.850 - 1.200.000 = 530.850 kr
```

### Lífsorku útreikningar

```
Lífsorku klukkustundir settar inn = Heildar innborganir / Raunverulegt tímakaup
Lífsorku klukkustundir unnar óbeint = Heildarvöxtur / Raunverulegt tímakaup

Frelsismánuðir = FV / (Mánaðarleg útgjöld)

Dæmi (með 2.000 kr/klst raunverulegt tímakaup):
- Klukkustundir settar inn = 1.200.000 / 2.000 = 600 klst
- Klukkustundir unnar óbeint = 530.850 / 2.000 = 265 klst
- Heildar lífsorku verðmæti = 865 klst
```

### Verðbólguleiðrétting

```
Raunverðmæti = FV / (1 + i)^t

Þar sem:
- i = Verðbólguprósenta (0.025 fyrir 2.5%)
- t = Ár

Dæmi (1.730.850 kr eftir 10 ár með 2.5% verðbólgu):
- Raunverðmæti = 1.730.850 / (1.025)^10
- Raunverðmæti ≈ 1.351.000 kr (í núverandi krónum)
```

## Úttaksforskriftir

### Aðalúttak
- **Framtíðarverðmæti**: Sýnt sem formöttað ISK gildi
- **Heildar innborganir**: Sýnt sem formöttað ISK gildi
- **Heildarvöxtur**: Sýnt sem formöttað ISK gildi og prósenta
- **Lífsorku klukkustundir settar inn**: Sýnt með einingu
- **Lífsorku klukkustundir unnar óbeint**: Sýnt með einingu
- **Frelsismánuðir**: Sýnt sem "X mánuðir af frelsi"

### Lykilinnsýn
Formað sem:
> "Með því að sjálfvirka 10.000 kr á mánuði muntu hafa 34 mánuði af frelsi eftir 10 ár"

### Sjónræn framsetning
- Graf sem sýnir vöxt yfir tíma (höfuðstóll vs vextir)
- Samanburðarrit fyrir mismunandi upphæðir/tímabil
- Framfarastika sem sýnir hlutfall vaxtar af heildarverðmæti

## Kröfur sem ekki tengjast virkni

### Afköst
- Útreikningar: < 50ms
- Engar netbeiðnir (útreikningar á viðskiptavindarhlið)
- Graf teiknun: < 200ms

### Aðgengi
- WCAG 2.1 AA samræmi
- Lyklaborðs aðgengi fyrir sleða og inntaksreiti
- Skjálesari samhæft með ARIA labels
- Litablinduprófað graf (nota mynstrun auk lita)

### Persónuvernd
- Engin gögn send á netþjón
- Allt geymt í localStorage (valfrjálst)
- Flytur með aðalgögnum (export/import)

### Notendaupplifun
- Rauntíma uppfærslur (debounce 300ms fyrir sleða)
- Skýrar einingar og merki (ISK, klst, mánuðir)
- Tooltips fyrir útskýringar á hugtökum
- Farsímavænt útlit

## Tengsl

- **Krefst**: Raunverulegt Tímakaups reiknivélar (fyrir actualHourlyWage og lífsorku útreikninga)
- **Notar**: Sömu UI íhluti og aðalreiknivélin (Card, Input, Slider)
- **Geymt með**: Aðalgögnum í localStorage (valfrjálst)
- **Tengist**: Öðrum sparnaðar reiknivélum (2.2.x)

## Framtíðarútvíkkun (Utan gildissviðs MVP)

- Sýna "Hvenær ég næ X markmiði" með reverse útreikning
- Tenging við FI Number til að reikna þegar nóg hefur verið safnað
- Sviðsmyndir: Bjartsýnn/Hefðbundinn/Íhaldssöm ávöxtun
- Samanburður við verðbólguverndaða (verðtryggða) valmöguleika
- Útreikningur á skattfrádrætti fyrir lífeyrissjóðsframlög
- "Hvað ef" sviðsmyndir: hækka um 1.000 kr á ári, o.s.frv.
- Samþætting við Savings Goal Life Energy Tracker (2.2.6)

## Viðauki: Dæmi um útreikning

### Dæmi 1: Grunnútreikningur (10 ár)

**Inntak**:
- Mánaðarleg upphæð: 10.000 kr
- Tíðni: Mánaðarlega
- Tímabil: 10 ár
- Ávöxtun: 7%
- Raunverulegt tímakaup: 2.000 kr/klst

**Útreikningur**:
```
PMT = 10.000 kr
r = 0.07/12 = 0.00583
n = 10 × 12 = 120

FV = 10.000 × ((1.00583)^120 - 1) / 0.00583 = 1.730.850 kr
Innborganir = 10.000 × 120 = 1.200.000 kr
Vöxtur = 1.730.850 - 1.200.000 = 530.850 kr (44% af heildarverðmæti)

Lífsorku sett inn = 1.200.000 / 2.000 = 600 klst
Lífsorku unnin óbeint = 530.850 / 2.000 = 265 klst
Heildar lífsorku = 865 klst
```

**Úttak**:
> "Með því að sjálfvirka 10.000 kr á mánuði muntu hafa 1.730.850 kr eftir 10 ár. Þetta jafngildir 865 klukkustundum af lífsorku, þar af 265 klst unnin óbeint með vöxtum."

---

### Dæmi 2: Samanburður (20 ár)

**Inntak**:
- Mánaðarleg upphæð: 10.000 kr
- Tíðni: Mánaðarlega
- Tímabil: 20 ár
- Ávöxtun: 7%
- Raunverulegt tímakaup: 2.000 kr/klst

**Útreikningur**:
```
PMT = 10.000 kr
r = 0.07/12 = 0.00583
n = 20 × 12 = 240

FV = 10.000 × ((1.00583)^240 - 1) / 0.00583 = 5.238.880 kr
Innborganir = 10.000 × 240 = 2.400.000 kr
Vöxtur = 5.238.880 - 2.400.000 = 2.838.880 kr (118% af innborgunum!)

Lífsorku sett inn = 2.400.000 / 2.000 = 1.200 klst
Lífsorku unnin óbeint = 2.838.880 / 2.000 = 1.419 klst
```

**Lykilinnsýn**:
> "Eftir 20 ár munt þú hafa unnið MEIRA óbeint með vöxtum (1.419 klst) en þú settir inn sjálf/ur (1.200 klst)!"

---

### Dæmi 3: Verðbólguleiðrétting

**Inntak**:
- Framtíðarverðmæti (nafnverð): 1.730.850 kr
- Tímabil: 10 ár
- Verðbólga: 2.5% árlega

**Útreikningur**:
```
Raunverðmæti = 1.730.850 / (1.025)^10
Raunverðmæti = 1.730.850 / 1.280
Raunverðmæti = 1.351.914 kr
```

**Útskýring**:
> "Þótt þú hafir 1.730.850 kr eftir 10 ár, þá jafngildir það 1.351.914 kr í núverandi kaupmætti (miðað við 2.5% árlega verðbólgu)."

---

## Samþykktarviðmið fyrir MVP

Eiginleikinn telst fullnægjandi fyrir MVP þegar:

- ✅ Notandi getur slegið inn upphæð, tíðni og tímabil
- ✅ Kerfið reiknar framtíðarverðmæti, innborganir og vexti rétt
- ✅ Lífsorku útreikningar birtast ef raunverulegt tímakaup er skilgreint
- ✅ Viðvörun birtist ef tímakaup vantar
- ✅ Lykilinnsýn birtist: "Með því að sjálfvirka X muntu hafa Y eftir Z ár"
- ✅ Samanburðarham virkar fyrir tvær upphæðir
- ✅ Graf sýnir vöxt yfir tíma (höfuðstóll vs vextir)
- ✅ Fræðsluefni um "borgaðu þér fyrst" er sýnilegt
- ✅ Allar formúlur staðfestar með handvirkt reiknaðum dæmum
- ✅ Farsímavænt útlit
- ✅ WCAG 2.1 AA samræmi

---

## Prófunaráætlun

### Einingarprófanir
- Staðfesta FV formúlu með þekktum dæmum
- Staðfesta mismunandi tíðni (vikulega, mánaðarlega)
- Staðfesta verðbólguleiðréttingu
- Staðfesta inntaksstaðfestingu (edge cases)

### Samþættingarprófanir
- Staðfesta samþættingu við Tímakaups reiknivél
- Staðfesta localStorage vistun/hleðslu
- Staðfesta export/import með áskriftum

### Notendaprófanir
- Notandi getur reiknað áhrif sjálfvirks sparnaðar
- Notandi skilur lykilinnsýn
- Notandi getur borið saman aðstæður
- Notandi finnur reiknivélina gagnlega

---

## Tilvísanir

- **Your Money or Your Life** - Vicki Robin & Joe Dominguez (Kafli um "Pay Yourself First")
- **The Compound Effect** - Darren Hardy
- **FIRE Movement resources**: r/financialindependence, Bogleheads.org
- **Icelandic context**: Seðlabanki Íslands (verðbólgugögn), Ríkisskattstjóri (lífeyrissparnuður)
