# Kröfur: Lífsstílsverðbólguskynjarinn (Lifestyle Inflation Detector)

## Yfirlit

**Eiginleiki**: Lífsstílsverðbólguskynjarinn (Lifestyle Inflation Detector)
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2.1.10 - Útgjaldatengdir reiknivélar
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni
**Bókatengsl**: "Your Money or Your Life" kafli 3 & 7 (lifestyle creep patterns)

## Vandamálslýsing

Lífsstílsverðbólga (lifestyle inflation eða "lifestyle creep") er þegar útgjöld þín aukast í takt við tekjur þínar. Þetta gerist oft ómeðvitað:
- Þú færð launahækkun og byrjar að eyða meira í venjubundna hluti
- Lítil "uppfærsla" í einum flokki leiðir til hærri útgjalda í öllum flokkum
- Þægindareyðsla eykst smám saman með tímanum
- "Litlar" mánaðarlegar hækkanir verða að stórum árstölum

Án þess að fylgjast með lífsstílsverðbólgu getur hún eytt öllum ávinningi launahækkunar og seinkað fjárhagslegu frelsi (FI) um mörg ár.

## Notendafrásagnir

### NS-1: Skrá útgjaldatímabil
**Sem** notandi sem vill fylgjast með útgjaldabreytingum yfir tíma,
**vil ég** geta skráð útgjöld mín eftir flokkum fyrir mismunandi tímabil (mánuði/ár),
**svo að** ég geti borið saman útgjöld yfir tíma.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi smellir á "Bæta við tímabili", **skal kerfið** sýna eyðublað með:
   - Heiti tímabils (t.d. "Janúar 2024", "Árið 2023")
   - Dagsetning frá/til (eða mánuður/ár val)
   - Tekjur fyrir tímabilið (fyrir samanburð)

2. **Þegar** notandi vistar tímabil, **skal kerfið** leyfa skráningu útgjalda eftir flokkum:
   - Húsnæði (leiga/veð, rafmagn, hiti, internet)
   - Matur (matvörur, veitingastaðir)
   - Samgöngur (bensín, strætó, bílaviðhald)
   - Áskriftir (streymi, hugbúnaður, líkamsrækt)
   - Þægindi (matur heim, skyndikaupur)
   - Fatnaður
   - Skemmtun
   - Annað

3. **Kerfið skal** leyfa að skrá annað hvort heildarupphæð fyrir flokk eða einstök útgjöld innan flokks.

4. **Kerfið skal** geyma öll tímabil í localStorage með export/import stuðningi.

5. **Þegar** notandi skráir nýtt tímabil, **skal kerfið** sjálfkrafa bera það saman við fyrri tímabil.

---

### NS-2: Greina lífsstílsverðbólgu
**Sem** notandi með mörg skráð tímabil,
**vil ég** sjá hvar útgjöld mín hafa aukist,
**svo að** ég geti greint lífsstílsverðbólgu.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur skráð að minnsta kosti tvö tímabil, **skal kerfið** reikna:
   - Heildaútgjaldabreytingu (króna og prósenta)
   - Breytingu í hverjum flokki (króna og prósenta)
   - "Lífsstílsskrið" prósenta (percentage creep)

2. **Kerfið skal** auðkenna flokka þar sem útgjöld hafa aukist meira en tekjur.

3. **Kerfið skal** sýna "verðbólguskor" (inflation score):
   - Grænt (0-5%): Heilbrigt - útgjöld hafa stöðugst eða minnkað
   - Gult (5-15%): Varkár - smávægileg lífsstílsverðbólga
   - Appelsínugult (15-30%): Viðvörun - umtalsverð lífsstílsverðbólga
   - Rautt (30%+): Áhyggjuefni - veruleg lífsstílsverðbólga

4. **Kerfið skal** bera saman útgjaldaaukningu við tekjuaukningu:
   - Ef tekjur hækkuðu um 10% en útgjöld um 12% → lífsstílsverðbólga
   - Ef tekjur hækkuðu um 10% en útgjöld um 8% → heilbrigt

5. **Kerfið skal** sýna "þögla uppfærslur" (quiet upgrades):
   - Flokkar þar sem lítilsháttar hækkanir hafa orðið að stórum kostnaði

---

### NS-3: Sjá FI áhrif lífsstílsverðbólgu
**Sem** notandi sem stefnir að fjárhagslegu frelsi,
**vil ég** sjá hvernig lífsstílsverðbólga hefur áhrif á FI tímalínu mína,
**svo að** ég geti séð raunverulegan kostnað aukinna útgjalda.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** reikna áhrif lífsstílsverðbólgu á FI:
   - Hversu mörg ár seinkun á FI dagsetningu vegna aukinnar eyðslu
   - Framtíðarvirði sparnaðar sem tapast (við 7% ávöxtun)
   - "Týndur FI" kostnaður í lífsorku (klukkustundum)

2. **Þegar** lífsstílsverðbólga greinist, **skal kerfið** sýna samanburðarsviðsmynd:
   - Núverandi FI dagsetning með aukinni eyðslu
   - Fyrri FI dagsetning ef útgjöld væru haldið föstum
   - Mismunur í árum/mánuðum

3. **Kerfið skal** sýna "kostnaður per flokk":
   - Ef þú hefðir haldið matarkostnaði föstum → X ár fyrr í FI
   - Ef þú hefðir ekki uppfært bíl → Y ár fyrr í FI

4. **Kerfið skal** reikna nauðsynleg tekjusparnaðarhlutfall (savings rate) til að vega upp á móti útgjaldaaukningu.

---

### NS-4: Sjá útgjaldaþróun með myndrænni framsetningu
**Sem** notandi sem vill sjá mynstur yfir tíma,
**vil ég** sjá gröf sem sýna útgjaldaþróun,
**svo að** ég geti greint þróun visuellt.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna línurit (line chart) sem sýnir:
   - Heildarútgjöld á mánuði/ári yfir öll tímabil
   - Tekjur á mánuði/ári yfir öll tímabil
   - Samanburðarlínu sem sýnir "ef útgjöld hefðu haldist föst"

2. **Kerfið skal** sýna súlurit (bar chart) fyrir hvern flokk:
   - Hæð súlu sýnir upphæð
   - Litakóðað eftir aukningarstöðu (grænt/gult/rautt)
   - Samanburður milli tímabila hlið við hlið

3. **Kerfið skal** sýna skífurit (pie chart) fyrir flokkasundurliðun:
   - Hlutfall af heildarútgjöldum fyrir hvert tímabil
   - Sýna hvernig útgjaldadreifing hefur breyst

4. **Þegar** notandi fer með músinni yfir (hover) gagnapunkt, **skal kerfið** sýna:
   - Nákvæm upphæð
   - Prósenta breyting frá fyrra tímabili
   - Lífsorku kostnaður (klukkustundir)

---

### NS-5: Fá viðvaranir um hratt vaxandi útgjöld
**Sem** notandi sem vill varna lífsstílsverðbólgu áður en hún verður vandamál,
**vil ég** fá viðvaranir þegar útgjöld vaxa hraðar en tekjur,
**svo að** ég geti brugðist við tímanlega.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi skráir nýtt tímabil, **skal kerfið** greina og viðvara ef:
   - Heildarútgjöld hafa aukist meira en 10% milli tímabila
   - Einhver flokkur hefur aukist meira en 20%
   - Útgjöld vaxa hraðar en tekjur í 2+ tímabilum í röð
   - "Þægindaútgjöld" (þægindi + matur heim) hafa tvöfaldast

2. **Viðvaranir skulu** vera skýrar og aðgerðamiðaðar:
   - "Matarkostnaður hefur aukist um 35% síðan síðast. Þetta kostar þig 2,3 ár í FI seinkun."
   - "Áskriftir hafa aukist um 1.800 kr/mán. Yfir 10 ár er þetta 3.100.000 kr (7% ávöxtun)."

3. **Kerfið skal** flokka viðvaranir eftir alvarleika:
   - Rauð viðvörun: Alvarleg lífsstílsverðbólga (30%+ aukining)
   - Gul viðvörun: Varkár (10-30% aukining)
   - Græn tilkynning: Heilbrigt (stöðug eða minnkandi útgjöld)

4. **Kerfið skal** bjóða upp á "þögn viðvöruna" (snooze) valkost ef notandi veit um aukninguna og samþykkir hana.

---

### NS-6: Fá tillögur að því að viðhalda lífsstíl
**Sem** notandi sem vill halda í stýringu á útgjöldum,
**vil ég** fá tillögur að því hvernig ég get viðhaldið lífsstíl mínum án aukinnar eyðslu,
**svo að** ég geti notið tekjuhækkunar án verðbólgu.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** lífsstílsverðbólga greinist, **skal kerfið** bjóða upp á tillögur:
   - Ef matur hefur aukist: "Prófaðu að elda heima 2 sinnum í viðbót á viku"
   - Ef áskriftir hafa aukist: "Farðu yfir áskriftalistann þinn - notarðu allt?"
   - Ef þægindaútgjöld hafa aukist: "Skipulagðu máltíðir fyrirfram til að forðast skyndikaupur"

2. **Kerfið skal** sýna "viðhaldsmarkmið" (maintenance goals):
   - Halda [flokki] undir X kr á mánuði
   - Ekki auka [flokk] næstu 6 mánuði
   - Minnka [flokk] um 10% næsta tímabil

3. **Kerfið skal** reikna "leyft rými fyrir uppfærslu":
   - Miðað við tekjur og sparnaðarmarkmið
   - "Þú getur eytt allt að 15.000 kr í viðbót á mánuði án þess að hafa áhrif á FI tímalínu"

4. **Kerfið skal** veita tillögur byggðar á flokki:
   - Samgöngur: Íhugaðu hjólreiðar/gangur hluta leiðar
   - Matur: Undirbúningur máltíða um helgar
   - Skemmtun: Ókeypis valkostir (bókasafn, gönguferðir)

5. **Tillögur skulu** vera raunhæfar og íslenskt samhengi:
   - Tilvísanir í íslenskar vörur/þjónustur
   - Veðurskilyrði tekin með í reikninginn (t.d. vetur vs sumar)

---

### NS-7: Bera saman lífsstíl við tekjubreytingar
**Sem** notandi sem hefur fengið launahækkun,
**vil ég** sjá hvort ég hef eytt launahækkuninni eða sparað hana,
**svo að** ég geti séð hvort ég hef aðlagað útgjöld við hærri tekjur.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi skráir tekjubreytingu milli tímabila, **skal kerfið** reikna:
   - Tekjuaukning í krónum og prósentum
   - Útgjaldaaukning í krónum og prósentum
   - Sparnaðaraukning (ef einhver)
   - "Launahækkunar nýtni" prósenta

2. **Kerfið skal** sýna samanburð:
   - Ef tekjur hækkuðu um 100.000 kr/mán:
     - Útgjöld hækkuðu um X kr
     - Sparnaður aukist um Y kr
     - Z% af launahækkuninni fór í aukinn lífsstíl

3. **Kerfið skal** reikna "heilbrigð nýting" markmið:
   - Ákjósanlegt: 0-30% af launahækkun í aukinn lífsstíl
   - Ásættanlegt: 30-50%
   - Áhyggjuefni: 50-80%
   - Alvarleg lífsstílsverðbólga: 80%+

4. **Kerfið skal** sýna "þögul launalækkun":
   - Ef útgjöld aukast meira en tekjur → raun ráðstöfunartekjur minnka

---

### NS-8: Farsímavæn upplifun
**Sem** notandi sem notar símann minn,
**vil ég** hafa fulla virkni á farsíma,
**svo að** ég geti skráð útgjöld hvar sem er.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** virka á skjám frá 320px breidd.

2. **Kerfið skal** hafa snertivænar stjórnun:
   - Stórir smellihnappar (touch targets)
   - Swipe til að breyta á milli tímabila
   - Touch-friendly dropdown valmyndir

3. **Gröf skulu** vera optimized fyrir farsíma:
   - Scrollable horizontal fyrir mörg tímabil
   - Stacked útlit fyrir súlurit
   - Touch til að sjá upplýsingar (tap í stað hover)

4. **Kerfið skal** nota viðeigandi input types:
   - Talnalyklaborð fyrir upphæðir
   - Dagsetningarval fyrir tímabil

---

## Inntaksforskriftir

### Tímabils inntök
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Heiti tímabils | Texti | Auto-generated | Áskilið, ekki tómt | T.d. "Janúar 2024" |
| Mánuður | Tala (1-12) | Núverandi mánuður | 1-12 | Eða null fyrir "ár" |
| Ár | Tala | Núverandi ár | 2020-2030 | Áskilið |
| Tekjur | Krónutala | 0 | >= 0 | Mánaðarlegar nettótekjur |

### Útgjaldaflokkar
| Flokkur | Lykill | Algeng dæmi |
|---------|--------|--------------|
| Húsnæði | housing | Leiga/veð, rafmagn, hiti, internet, þrif |
| Matur | food | Matvörur, veitingastaðir, kaffihús |
| Samgöngur | transportation | Bensín, strætó, bílaviðhald, bílastæði |
| Áskriftir | subscriptions | Netflix, Spotify, líkamsrækt, fréttabréf |
| Þægindi | convenience | Matur heim, taxi, skyndikaupur |
| Fatnaður | clothing | Föt, skór, fylgihlutir |
| Skemmtun | entertainment | Kvikmyndir, tónleikar, tölvuleikir |
| Heilsa | health | Lyfseðlar, sjúkraþjálfun, tannlæknir |
| Annað | other | Gjafir, heimilisbúnaður, dýrahalds |

### Útgjaldainntök (per flokkur)
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Flokkur | Val | 'other' | Áskilið | Einn af 9 flokkum |
| Heildarupphæð | Krónutala | 0 | >= 0 | Samtala fyrir flokkinn |

## Útreikningsformúlur

### Lífsstílsverðbólguprósentur
```
Útgjaldabreyting% = ((Nýtt heildarútgjöld - Eldra heildarútgjöld) / Eldra heildarútgjöld) × 100

Flokkur breyting% = ((Nýtt upphæð - Eldra upphæð) / Eldra upphæð) × 100

Lífsstílsskrið = Útgjaldabreyting% - Tekjubreyting%
```

### FI áhrif
```
Aukin útgjöld (árlega) = (Nýtt mánaðarlegt - Eldra mánaðarlegt) × 12

Aukin FI þörf = Aukin útgjöld × 25  (4% reglan)

FI seinkun (ár) = Aukin FI þörf / Árlegur sparnaður

Tapað framtíðarvirði = Aukin mánaðarleg × ((1 + r)^n - 1) / r
  þar sem r = 0.07/12, n = 120 mánuðir (10 ár)
```

### Launahækkunar nýtni
```
Tekjuaukning = Nýjar tekjur - Eldri tekjur
Útgjaldaaukning = Nýtt útgjöld - Eldra útgjöld
Sparnaðaraukning = Tekjuaukning - Útgjaldaaukning

Nýtniprósenta = (Útgjaldaaukning / Tekjuaukning) × 100

Heilbrigt markmið: < 30%
Ásættanlegt: 30-50%
Áhyggjuefni: 50-80%
Alvarleg: 80%+
```

### Verðbólguskor
```
Heilbrigt (0-5%): Grænt
  - Útgjöld stöðug eða minnka

Varkár (5-15%): Gult
  - Smávægileg aukining, fylgjast með

Viðvörun (15-30%): Appelsínugult
  - Umtalsverð lífsstílsverðbólga

Áhyggjuefni (30%+): Rautt
  - Veruleg lífsstílsverðbólga, bráðaaðgerð
```

## Úttaksforskriftir

### Aðalúttak
- **Heildarútgjaldabreyting**: Króna og prósenta breyting
- **Lífsstílsskrið**: Prósenta breyting útgjalda umfram tekjuaukningu
- **Verðbólguskor**: Litakóðað (grænt/gult/appelsínugult/rautt)
- **FI seinkun**: Ár og mánuðir sem lífsstílsverðbólga seinkar FI

### Aukaúttak
- **Flokkasundurliðun**: Breyting í hverjum flokki með litakóðun
- **Þöglar uppfærslur**: Flokkar með smáhækkunum sem bætast upp
- **Framtíðarvirði**: Hvað tapast af sparnaði næstu 10/20 ár
- **Launahækkunar nýtni**: Prósenta af launahækkun sem fer í lífsstíl
- **Viðvaranir**: Aðgerðamiðaðar viðvaranir með tillögum

### Myndrænar framsetningar
- **Línurit**: Heildarútgjöld vs tekjur yfir tíma
- **Súlurit**: Flokkasundurliðun með samanburði milli tímabila
- **Skífurit**: Útgjaldadreifing í hverjum flokki
- **Þróunarrás**: Hvernig lífsstílsverðbólga þróast yfir tíma

## Kröfur sem ekki tengjast virkni

### Afköst
- Útreikningar: < 100ms
- Graf rendering: < 500ms
- Engar netbeiðnir (útreikningar á viðskiptavindarhlið)
- Debounced localStorage vistun: 500ms

### Aðgengi
- WCAG 2.1 AA samræmi
- Lyklaborðs aðgengi (Tab, Enter, Space)
- Skjálesari samhæft með ARIA labels
- Litakóðun með textamerki (ekki bara litur)
- Focus indicators sýnilegir

### Persónuvernd
- Engin gögn send á netþjón
- Allt geymt í localStorage
- Flytur með export/import
- Engin PII (persónugreinanlegar upplýsingar) geymd

### Vafrastuðningur
- Chrome (síðustu 2 útgáfur)
- Firefox (síðustu 2 útgáfur)
- Safari (síðustu 2 útgáfur)
- Edge (síðustu 2 útgáfur)
- Mobile Safari og Chrome

## Tengsl

- **Krefst**: Raunverulegt Tímakaups reiknivélar (fyrir actualHourlyWage)
- **Notar**: Sömu UI íhluti og aðalreiknivélin
- **Geymt með**: Aðalgögnum í localStorage
- **Samþættist**: Áskriftakostnaðarmælir (samnýtir flokka)

## Framtíðarútvíkkun (Utan gildissviðs MVP)

- Sjálfvirk greining útgjaldamynstra (machine learning)
- Tengja við banka API til að sækja útgjöld sjálfkrafa
- Tilkynningar þegar nýtt tímabil ætti að skráa
- Samanburður við meðaltal annarra notenda (nafnlaust)
- "Áskorun" eiginleiki: Halda útgjöldum föstum í 3 mánuði
- Tengja við verðbólgu tölur til að aðgreina verðbólgu frá lífsstílsverðbólgu
- Vélagreindar tillögur byggðar á hegðunarmynstrum
- Samfélagsþættir: Deildu árangrinum þínum (nafnlaust)
- Móttaka skjala frá netbanka til að parse útgjöld sjálfkrafa
