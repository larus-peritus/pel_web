# Kröfur: Einstakskaupaverkfæri (One-Time Purchase Decision Tool)

## Yfirlit

**Eiginleiki**: Einstakskaupaverkfæri
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2.1.6 - Kostnaðargreiningar
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Stór kaup (bíll, húsgögn, raftæki, endurbætur á heimili) virðast oft eðlileg þegar maður hugsar um þau sem "bara" krónutölur. En þegar þú sérð þau í samhengi við lífsorku (klukkustundir af lífi þínu) og tækifæriskostnað (hvað peningarnir hefðu vaxið í ef þú hefðir fjárfest þá í staðinn), getur það breytt ákvörðuninni.

Verkfærið hjálpar notendum að:
- Sjá raunverulegan kostnað í lífsorku klukkustundum
- Skilja tækifæriskostnað í framtíðarverðmæti
- Taka upplýstar ákvarðanir um hvort kaupin séu þess virði

## Notendafrásagnir

### NS-1: Reikna lífsorku kostnað eins kaups
**Sem** notandi sem íhugar stór kaup,
**vil ég** sjá hversu margar klukkustundir af lífsorku kaupin munu kosta,
**svo að** ég geti metið hvort þau séu virði vinnutímans.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi slær inn kaupverð (í íslenskum krónum), **skal kerfið** reikna út:
   - Fjöldi vinnuklukkustunda sem þarf til að vinna sér inn þessa upphæð (miðað við raunverulegt tímakaup)
   - Sýna niðurstöðu á læsilegu formi (t.d. "34 klukkustundir" eða "1 vika og 2 dagar")

2. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna skilaboð um að fylla fyrst út tímakaups reiknivélina með hlekk til að gera það.

3. **Kerfið skal** sýna niðurstöðu samstundis við innslátt (enginn "Reikna" hnappur nauðsynlegur).

---

### NS-2: Sjá tækifæriskostnað
**Sem** notandi sem stefnir að fjárhagslegu frelsi,
**vil ég** sjá hvað peningarnir hefðu vaxið í ef ég hefði fjárfest þá í staðinn,
**svo að** ég skilji langtíma áhrif kaupanna.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna framtíðarverðmæti kaupverðs ef fjárfest með sjálfgefna 7% ávöxtun:
   - Eftir 10 ár
   - Eftir 20 ár
   - Eftir 30 ár

2. **Kerfið skal** leyfa notanda að breyta ávöxtunarkröfu (frá 0% til 15%).

3. **Þegar** notandi breytir ávöxtunarkröfu, **skal kerfið** uppfæra útreikninga samstundis.

4. **Kerfið skal** sýna niðurstöður á skýran hátt með bæði krónutölum og stutt útskýring (t.d. "Ef þú fjárfestir þessa upphæð í staðinn...").

---

### NS-3: Bera saman valkosti
**Sem** notandi sem íhugar mismunandi valkosti fyrir sama þarfina,
**vil ég** geta borið saman kostnað í lífsorku og tækifæriskostnað,
**svo að** ég geti valið skynsamlegri kostinn.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** leyfa notanda að bæta við allt að 3 kaupmöguleikum samtímis.

2. **Fyrir hvern valkost skal** notandi geta slegið inn:
   - Nafn/lýsing (t.d. "Nýr bíll", "Notaður bíll", "Engin bíll + leigubíll")
   - Kaupverð

3. **Kerfið skal** sýna samanburð hlið við hlið:
   - Lífsorku klukkustundir fyrir hvern valkost
   - Tækifæriskostnaður fyrir hvern valkost
   - Mismun á milli valkosta

4. **Kerfið skal** auðkenna ódýrasta kostinn með sjónrænu merki.

---

### NS-4: Sjá áhrif á FI tímalínu (valfrjálst)
**Sem** notandi sem veit hversu margar klukkustundir ég þarf að vinna til FI,
**vil ég** sjá hversu mikið kaupin tefja FI dagsetninguna mína,
**svo að** ég geti vegið það á móti gagnsemi kaupanna.

**Samþykktarviðmið (EARS snið)**:

1. **Ef** notandi hefur skilgreint sparnaðarhlutfall og FI markmið í prófíl sínum, **skal kerfið** reikna og sýna:
   - Hversu margar aukavinnu klukkustundir kaupin bæta við FI tímalínuna
   - Hversu mörgum dögum/mánuðum kaupin tefja FI dagsetningu

2. **Ef** notandi hefur ekki skilgreint FI markmið, **skal kerfið** sleppa þessum hluta (ekki sýna villur eða varanlegra skilaboð).

3. **Kerfið skal** sýna þessar upplýsingar á jákvæðan hátt (ekki hræðandi), t.d. "Ef þú hættir við þessi kaup, nærðu FI 3 mánuðum fyrr."

---

### NS-5: Vista og endurskoða fyrri útreikninga
**Sem** notandi sem vill rifja upp fyrri kaupaákvarðanir,
**vil ég** geta vistað útreikninga til skamms tíma,
**svo að** ég geti borið saman yfir tíma án þess að slá allt inn aftur.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** vista síðasta útreikning í localStorage.

2. **Þegar** notandi kemur aftur á síðuna, **skal kerfið** sýna síðasta útreikning (ef til staðar).

3. **Kerfið skal** bjóða upp á "Hreinsa" hnapp til að byrja á nýju.

4. **Gögn skulu** flytjast með aðal útflutningi/innflutningi kerfisins (en þetta er ekki nauðsynlegt fyrir MVP).

---

## Inntaksforskriftir

### Aðalinntök
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Kaupverð | Krónutala | - | Áskilið, > 0 | Kostnaður við kaupin |
| Nafn kaupa | Texti | - | Valfrjálst | Lýsing (t.d. "Nýr bíll") |

### Stillingar
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Ávöxtunarkrafa | Prósenta | 7% | 0% - 15% | Vænt ávöxtun fjárfestinga |
| Tímabil fyrir framtíðarvirði | Lista | [10, 20, 30] ár | Föst | Tímabil til útreikninga |

### Samanburðarinntök (valfrjálst)
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Valkostur 1-3: Nafn | Texti | - | Valfrjálst | Lýsing á hverjum valkosti |
| Valkostur 1-3: Verð | Krónutala | - | > 0 ef notað | Kaupverð valkosts |

## Útreikningsformúlur

### Lífsorgu klukkustundir
```
Lífsorgu klukkustundir = Kaupverð / Raunverulegt tímakaup

Dæmi:
Kaupverð: 2.000.000 kr
Raunverulegt tímakaup: 4.500 kr/klst
Niðurstaða: 2.000.000 / 4.500 = 444,4 klukkustundir
```

### Framtíðarverðmæti (ef fjárfest)
```
FV = PV × (1 + r)^n

Þar sem:
- PV = Kaupverð (upphafleg fjárfesting)
- r = Árleg ávöxtun (sjálfgefið 7% = 0,07)
- n = Fjöldi ára

Dæmi:
PV: 2.000.000 kr
r: 7% (0,07)
n: 10 ár
FV = 2.000.000 × (1,07)^10 = 3.933.778 kr
```

### FI töf (ef FI gögn til staðar)
```
Aukavinnu klukkustundir = Lífsorgu klukkustundir

FI töf í dögum = (Kaupverð / Árlegur sparnaður) × 365

Dæmi:
Kaupverð: 2.000.000 kr
Árlegur sparnaður: 1.200.000 kr
FI töf = (2.000.000 / 1.200.000) × 365 = 608 dagar ≈ 20 mánuðir
```

## Úttaksforskriftir

### Aðalúttak
**Fyrir hvert kaup sýnt:**
- **Lífsorgu kostnaður**:
  - Klukkustundir (t.d. "444 klukkustundir")
  - Umreiknað í vinnudaga eða -vikur ef viðeigandi (t.d. "11 vinnuvikur")
- **Tækifæriskostnaður**:
  - Framtíðarverðmæti eftir 10 ár
  - Framtíðarverðmæti eftir 20 ár
  - Framtíðarverðmæti eftir 30 ár
  - Hver tala sýnd í krónum með skýrum texta

### Aukaúttak (ef viðeigandi)
- **FI áhrif** (ef FI gögn til staðar):
  - Aukavinnu klukkustundir til FI
  - Töf á FI dagsetningu (dagar/mánuðir)
- **Samanburður** (ef margir valkostir):
  - Hlið við hlið tafla með öllum úttökum
  - Merkja ódýrasta kostinn
  - Sýna mun á milli valkosta

### Sniðmát texta
```
"Til að vinna sér inn [kaupverð], þarft þú að vinna í [klukkustundir] ([dagar/vikur])."

"Ef þú fjárfestir [kaupverð] í staðinn með 7% ávöxtun, myndir þú eiga [framtíðarverðmæti] eftir [ár]."

"Þessi kaup tefja FI dagsetninguna þína um [dagar/mánuði]."
```

## Kröfur sem ekki tengjast virkni

### Afköst
- **Útreikningar**: < 50ms fyrir alla útreikninga
- **Engar netbeiðnir**: Allir útreikningar á viðskiptavindarhlið

### Notendavænleiki
- **Einfaldar inntök**: Aðeins nauðsynlegustu reitirnir sýnilegir
- **Samstundis viðbrögð**: Engar "Reikna" hnappar - allt uppfærist við innslátt
- **Læsilegar niðurstöður**: Notið íslensku, skýrar tölur, og samhengi
- **Hjálpartexti**: Skýr útskýring á ávöxtunarkröfu og tækifæriskostnaði

### Aðgengi
- **WCAG 2.1 AA samræmi**
- **Lyklaborðs aðgengi**: Tab-röð skynsamleg
- **Skjálesari samhæft**: Öll úttak með viðeigandi aria-labels

### Persónuvernd
- **Engin gögn send á netþjón**
- **Allt geymt í localStorage**
- **Valfrjáls visting**: Notandi getur hreinsað gögn hvenær sem er

### Viðmót
- **Svörun**: Virkar vel á farsíma og borðtölvu
- **Samræmi**: Fylgir sama stílsniði og aðrir reiknivélar í appinu
- **Íslensku**: Öll UI texti á íslensku

## Tengsl

- **Krefst**: Raunverulegt Tímakaups reiknivélar (fyrir actualHourlyWage)
- **Notar**: Sömu UI íhluti og aðalreiknivélin
- **Valmögulegt**: FI Number Builder (fyrir FI áhrif útreikninga)
- **Geymt með**: Aðalgögnum í localStorage

## Takmarkanir og forsendur

### Forsendur
1. Notandi hefur þegar skilgreint raunverulegt tímakaup sitt
2. Ávöxtunarkrafa 7% er skynsamleg langtíma forsenda fyrir fjölbreyttan hlutabréfasafn
3. Notendur eru látnir velja eigin ávöxtunarkröfu til að sjá næmni
4. Útreikningar miðast við íslenskar krónur (ISK)

### Takmarkanir
1. Tekur ekki tillit til verðbólgu (reiknar í nafnverði)
2. Tekur ekki tillit til skatta á fjárfestingarávöxtun
3. Gerir ráð fyrir jafnri ávöxtun árlega (ekki sveiflukennd)
4. FI áhrif útreikningar eru einföld nálgun (ekki fullkomið FI líkan)

### Utan gildissviðs fyrir MVP
- Langtíma saga yfir öll stórkaup
- Graf sem sýnir uppsöfnuð kaup yfir tíma
- Integration með FI planners til nákvæmari FI date útreiknings
- Samanburður við sambærileg kaup annarra (nafnlaus tölfræði)
- Reminder til að endurskoða ákvörðun eftir X mánuði

## Gæðaviðmið

### Nákvæmni
- Öll stærðfræðiformúla rétt útfærð
- Námundun á sýnilegar 2 aukastafi fyrir krónutölur, 1 aukastafi fyrir klukkustundir
- Niðurstöður samræmast handreikningum

### Gagnsæi
- Skýrt hvaða forsendur eru notaðar (ávöxtunarkrafa sýnileg)
- Notandi getur breytt forsendum
- Formúlur skjalaðar í hjálpartexta

### Notendaupplifun
- Ekki hræðandi tónn - upplýsandi en hlutlægur
- Jákvæður framing þegar mögulegt
- Virðir ákvörðun notanda (ekki að segja þeim hvað þeir eiga að gera)

## Árangursviðmið

### Virkni
- Allir útreikningar framleiða réttar niðurstöður
- Samanburður valkosta virkar með 1-3 valkostum
- Visting og hleðsla úr localStorage virkar áreiðanlega

### Notendaupplifun
- Notendur skilja hvað tölurnar þýða (confirmed með user testing)
- Notendur geta tekið ákvarðanir byggðar á upplýsingum frá verkfærinu
- Engin ruglingur um forsendur eða útreikninga

## Framtíðarútvíkkun

### Fasi 2 útvíkkun
- Bæta við mánaðarlegum kostnaði (t.d. fyrir bíl: fjármögnun + tryggingar + eldsneyti)
- Sýna heildar eignarhalds kostnað yfir árin (Total Cost of Ownership)
- Integration með Car Ownership Cost Calculator

### Fasi 3 útvíkkun
- Saga yfir stórkaup sem tekið hefur verið
- "Endurskoða" virkni - "Var þetta þess virði?" spurningar eftir 6-12 mánuði
- Áætlaður hamingjukostnaður (subjective slider)

### Langtíma útvíkkun
- AI tillögur byggðar á kaupmynstri
- Samanburður við aðra með svipuð markmið (nafnlaust)
- Integration með FI planning tools til nákvæmari timeline útreikninga
