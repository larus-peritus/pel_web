# Kröfur: Sparnaðarmarkmið Lífsorku Mælir (Savings Goal Life Energy Tracker)

## Yfirlit

**Eiginleiki**: Sparnaðarmarkmið Lífsorku Mælir (Savings Goal Life Energy Tracker)
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2 - Sparnaðarreiknivélar (2.2.6)
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni
**Bókartilvísun**: "Your Money or Your Life" eftir Vicki Robin - Kafli 4 (Tracking Progress)

## Vandamálslýsing

Flestir hafa sparnaðarmarkmið (útborgun, ferðasjóður, neyðarsjóður) en skilja ekki:
- **Hversu margar vinnustundir** eftir eru til að ná markmiðinu
- **Hversu mikið af þínu lífi** þú hefur þegar lagt til hliðar
- **Hversu nálægt þú ert** í raun í áþreifanlegum tímaeindum

Með því að sjá sparnaðarmarkmið í samhengi við lífsorku (vinnustundir) geta notendur:
- Séð áþreifanlegan árangur ("Ég hef þegar unnið 14 daga fyrir þetta markmið!")
- Skilið hvað vantar í vinnustundum, ekki bara krónum
- Halda áfram með hvata þegar þeir sjá framfarir í merkingarbærum einingum

## Notendafrásagnir

### NS-1: Búa til sparnaðarmarkmið
**Sem** notandi með langtíma sparnaðarmarkmið,
**vil ég** geta búið til sparnaðarmarkmið með nafni og markupphæð,
**svo að** ég geti fylgst með framförum í lífsorku-einingum.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi smellir á "Bæta við markmiði", **skal kerfið** sýna eyðublað með:
   - Nafn markmiðs (texti, t.d. "Útborgun á húsnæði")
   - Markkrónutala (tölutegund, t.d. 3.000.000 kr)
   - Núverandi sparnaður (tölutegund, t.d. 750.000 kr)
   - Mánaðarleg framlag (tölutegund, t.d. 50.000 kr)

2. **Þegar** notandi vistar markmið, **skal kerfið** bæta því við listann yfir virk markmið.

3. **Kerfið skal** geyma öll markmið í localStorage.

4. **Þegar** notandi uppfærir gildi, **skal kerfið** endurreikna framfarir samstundis.

5. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna skilaboð um að fylla fyrst út tímakaups reiknivélina.

---

### NS-2: Sjá framfarir í lífsorku-klukkustundum
**Sem** notandi með sparnaðarmarkmið,
**vil ég** sjá framfarir mínar í vinnustundum, ekki bara krónum,
**svo að** ég skilji hversu mikið af lífsorku minni ég hef þegar lagt í þetta markmið.

**Samþykktarviðmið (EARS snið)**:

1. **Fyrir hvert markmið skal kerfið** sýna:
   - Framfarir í prósentum (t.d. 25%)
   - Upphæð í krónum (t.d. 750.000 kr af 3.000.000 kr)
   - **Vinnustundir unnin** = Núverandi sparnaður / Raunverulegt tímakaup
   - **Vinnustundir eftir** = (Markkrónutala - Núverandi) / Raunverulegt tímakaup

2. **Kerfið skal** nota raunverulegt tímakaup úr Tímakaups reiknivélinni.

3. **Kerfið skal** sýna vinnustundir í skiljanlegu sniði:
   - < 8 stundir: "X klukkustundir"
   - 8-80 stundir: "X vinnudagar" (8 klst. dagur)
   - > 80 stundir: "X vinnuvikur" (40 klst. vika)

4. **Kerfið skal** sýna sjónrænt framfarastiku með litakóðun:
   - 0-33%: rautt (byrjað)
   - 34-66%: gult (á góðri leið)
   - 67-99%: blátt (næstum þarna)
   - 100%+: grænt (náð)

---

### NS-3: Sjá tíma þangað til markmið næst
**Sem** notandi sem leggur mánaðarlega til hliðar,
**vil ég** sjá hvenær ég næ markmiðinu ef ég held áfram með núverandi framlagi,
**svo að** ég geti skipulagt í samræmi við það.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** mánaðarlegt framlag er > 0, **skal kerfið** reikna út:
   - Mánuði þangað til markmiðs næst = (Markkrónutala - Núverandi) / Mánaðarlegt framlag
   - Áætlaða dagsetningu þegar markmiði verður náð

2. **Kerfið skal** sýna þessar upplýsingar á skýran hátt:
   - "Þú nærð þessu markmiði eftir X mánuði (áætluð dagsetning: XX/XX/XXXX)"
   - "Það þýðir X vinnuvikur í viðbót"

3. **Ef** mánaðarlegt framlag er 0, **skal kerfið** sýna:
   - "Engin mánaðarleg innborgun - markmið mun ekki nást nema þú bætir við framlagi"

4. **Ef** markmið er þegar náð (núverandi ≥ markkrónutala), **skal kerfið** sýna:
   - "🎉 Markmið náð! Þú vannst X vinnuvikur fyrir þetta."

---

### NS-4: Fylgjast með mörgum markmiðum samtímis
**Sem** notandi með mörg sparnaðarmarkmið,
**vil ég** geta búið til allt að 5 markmið samtímis,
**svo að** ég geti forgangsraðað og séð heildarmyndina.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** leyfa notanda að búa til allt að 5 markmið samtímis.

2. **Þegar** notandi reynir að búa til markmið nr. 6, **skal kerfið** sýna skilaboð:
   - "Hámark náð. Þú getur haft allt að 5 markmið í einu. Eyddu markmiði eða ljúktu því til að bæta við nýju."

3. **Kerfið skal** sýna öll markmið í lista með:
   - Nafn markmiðs
   - Framfarir í % og krónum
   - Vinnustundir eftir
   - Framfarastika

4. **Kerfið skal** raða markmiðum eftir prósentuframförum (hæst fyrst) sjálfgefið.

5. **Kerfið skal** leyfa notanda að breyta röðun:
   - Eftir % framförum (hæst/lægst)
   - Eftir upphæð (stærst/minst)
   - Eftir tíma þangað til náð (næst/fjærst)
   - Handvirk röð (drag-and-drop eða upp/niður hnappar)

---

### NS-5: Halda utan um áfanga (milestones)
**Sem** notandi sem vill fagna framförum,
**vil ég** sjá áfanga og viðurkenningar meðfram leiðinni,
**svo að** ég haldi áfram hvötum.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna áfanga við ákveðin prósentuhlutföll:
   - 10% - "Byrjað vel!"
   - 25% - "Fjórðungur náð!"
   - 50% - "Hálfnað!"
   - 75% - "Þrír fjórðu hlutar!"
   - 100% - "Markmiði náð! 🎉"

2. **Þegar** framfarir ná áfanga í fyrsta skipti, **skal kerfið** sýna lítið tilkynningaspjald (toast/banner):
   - "🎉 Áfangi náð: Þú ert komin(n) með [X]% af [nafn markmiðs]!"

3. **Kerfið skal** vista hvaða áfanga hefur verið náð fyrir hvert markmið svo sama tilkynning sést ekki aftur.

4. **Kerfið skal** sýna sjónræna áfangamerkingu á framfarastiku.

---

### NS-6: Breyta eða eyða markmiðum
**Sem** notandi með breytileg markmið,
**vil ég** geta breytt eða eytt markmiðum,
**svo að** listinn endurspegli núverandi áherslur mínar.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** hafa "Breyta" hnapp við hvert markmið sem:
   - Opnar eyðublað með núverandi gildum
   - Leyfir notanda að uppfæra öll gildi
   - Vistar breytingar í localStorage

2. **Kerfið skal** hafa "Eyða" hnapp við hvert markmið með:
   - Staðfestingarskilaboðum: "Ertu viss um að þú viljir eyða þessu markmiði?"
   - "Já, eyða" og "Hætta við" valkosti

3. **Þegar** markmið er eytt, **skal kerfið** fjarlægja það úr listanum og localStorage.

4. **Kerfið skal** hafa "Merkja sem lokið" valkost sem:
   - Færir markmið í "Lokin markmið" kafla
   - Vistar lokadagsetningu
   - Fjarlægir úr virkum markmiðum en vistar í sögu

---

### NS-7: Sjá samtals sparnaðarframfarir
**Sem** notandi með mörg markmið,
**vil ég** sjá heildaryfirlit yfir öll mín markmið,
**svo að** ég sjá heildarmyndina.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna yfirlitskort efst með:
   - Heildarfjöldi markmiða (virk)
   - Heildarmarkkrónutala allra markmiða
   - Heildar núverandi sparnaður
   - Heildar framfarir í % (vigtuð að krónum)
   - Heildar vinnuvikur unnar (samtals)
   - Heildar vinnuvikur eftir (samtals)

2. **Kerfið skal** sýna sjónrænt mælikvarðakort (dashboard card) með þessum upplýsingum.

---

### NS-8: Flytja út og inn gögn
**Sem** notandi sem vill varðveita gögn,
**vil ég** geta flutt út og inn markmið mín,
**svo að** gögn týnist ekki og ég geti flutt þau á milli tækja.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** hafa "Flytja út" hnapp sem:
   - Sækir JSON skrá með öllum markmiðum
   - Skráarnafn: `sparnadarmarkmidin-YYYY-MM-DD.json`

2. **Kerfið skal** hafa "Flytja inn" hnapp sem:
   - Leyfir notanda að hlaða upp JSON skrá
   - Staðfestir skráarsnið
   - Sameiginlegt: Bætir við innfluttum markmiðum við núverandi eða skrifar yfir

3. **Ef** innflutt skrá er í röngu sniði, **skal kerfið** sýna villuskilaboð:
   - "Ekki tókst að flytja inn. Vinsamlegast veldu gilda sparnaðarmarkmið skrá."

4. **Kerfið skal** samræmast flutningskerfi raunskilninga reiknivélarinnar.

---

### NS-9: Sjá fyrir farsímum
**Sem** notandi sem aðgengilegur er á farsíma,
**vil ég** að eiginleikinn virki fullkomlega á litlum skjám,
**svo að** ég geti uppfært framfarir hvar sem er.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** vera fullkomlega virkt á skjám 320px+ breiðum.

2. **Kerfið skal** nota snertiskjáarvæna stýringar (44px+ snertimarkmið).

3. **Kerfið skal** stafla korta lóðrétt á farsímum.

4. **Kerfið skal** halda læsileika með viðeigandi leturstærðum (lágmark 16px fyrir inntak til að koma í veg fyrir iOS zoom).

---

## Inntaksforskriftir

### Sparnaðarmarkmið Inntök

| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Nafn | Texti | - | Áskilið, ekki tómt, hámark 100 stafir | Lýsandi heiti (t.d. "Útborgun á húsnæði") |
| Markkrónutala | Krónutala | - | Áskilið, > 0, hámark 1.000.000.000 | Heildarupphæð markmiðs |
| Núverandi sparnaður | Krónutala | 0 | >= 0, <= Markkrónutala | Upphæð þegar sett í gang |
| Mánaðarlegt framlag | Krónutala | 0 | >= 0 | Hvað mikið er lagt til hliðar mánaðarlega |

### Markmið Stöður

| Staða | Skilyrði | Litur |
|-------|----------|-------|
| Byrjað | 0-33% | Rauður |
| Á góðri leið | 34-66% | Gulur |
| Næstum þarna | 67-99% | Blár |
| Náð | 100%+ | Grænn |

## Útreikningsformúlur

### Vinnustundir Unnar
```
Vinnustundir unnar = Núverandi sparnaður / Raunverulegt tímakaup
```

### Vinnustundir Eftir
```
Vinnustundir eftir = (Markkrónutala - Núverandi sparnaður) / Raunverulegt tímakaup
```

### Framfarir í Prósentum
```
Framfarir % = (Núverandi sparnaður / Markkrónutala) × 100
```

### Mánuðir Þangað Til Náð
```
Ef Mánaðarlegt framlag > 0:
  Mánuðir = (Markkrónutala - Núverandi sparnaður) / Mánaðarlegt framlag
Annars:
  Mánuðir = ∞ (aldrei náð)
```

### Áætluð Dagsetning
```
Áætluð dagsetning = Dagsetning í dag + (Mánuðir × 30 dagar)
```

### Vinnudagar/Vinnuvikur Snið
```
Ef klukkustundir < 8:
  Sniðmát = "X klst."
Ef 8 <= klukkustundir < 80:
  Vinnudagar = klukkustundir / 8
  Sniðmát = "X vinnudagar"
Ef klukkustundir >= 80:
  Vinnuvikur = klukkustundir / 40
  Sniðmát = "X vinnuvikur"
```

### Heildar Framfarir (Vigtuð)
```
Heildar framfarir % = (Heildar núverandi / Heildar markkrónutala) × 100
```

## Úttaksforskriftir

### Markmið Kort (hvert markmið)
- **Nafn markmiðs**: Texti, stílað sem fyrirsögn
- **Framfarastika**: Sjónrænt með litakóðun
- **Framfarir í %**: Sýnt ofan á stiku
- **Upphæð**: "X kr af Y kr"
- **Vinnustundir unnar**: "Z vinnuvikur unnar"
- **Vinnustundir eftir**: "W vinnudagar eftir"
- **Tími þangað til náð**: "Áætlað: X mánuðir (dagsetning)" eða "Markmið náð! 🎉"

### Yfirlitskort (efst)
- **Fjöldi markmiða**: "X virk markmið"
- **Heildarmarkkrónutala**: Sýnt sem krónutala
- **Heildar núverandi**: Sýnt sem krónutala
- **Heildar framfarir**: Sýnt sem %
- **Heildar vinnuvikur unnar**: Samtals klukkustundir umbreytt
- **Heildar vinnuvikur eftir**: Samtals klukkustundir umbreytt

### Áfangamerkingar
- **10%, 25%, 50%, 75%, 100%**: Sýnt með tákni/merki á framfarastiku
- **Tilkynningaspjald**: Fagna þegar áfangi nær í fyrsta skipti

## Kröfur sem ekki tengjast virkni

### Afköst
- Útreikningar: < 50ms eftir innslátt
- Engin netbeiðni fyrir útreikninga (allt á viðskiptavindarhlið)
- Sjónrænar uppfærslur: < 100ms (smooth transitions)

### Aðgengi
- WCAG 2.1 AA samræmi
- Lyklaborðs aðgengi (Tab, Enter, Escape)
- Skjálesari samhæft með viðeigandi ARIA labels
- Litablinduarvænn litaval (ekki aðeins litur til að gefa til kynna stöðu)
- Focus indicators sýnilegir

### Persónuvernd
- Engin gögn send á netþjón
- Allir útreikningar á viðskiptavindarhlið
- Skýr gagna útflutningur/innflutningur fyrir notandastjórnun
- Engin eftirlit fyrir utan grunnmælingar (ef einhver)

### Stuðningur við Vafra
- Chrome (síðustu 2 útgáfur)
- Firefox (síðustu 2 útgáfur)
- Safari (síðustu 2 útgáfur)
- Edge (síðustu 2 útgáfur)
- Mobile Safari og Chrome

## Tengsl

**Krefst**:
- Raunverulegt Tímakaup úr Tímakaups reiknivélinni (Actual Hourly Wage)

**Samþættist við** (framtíðar):
- FI Number Builder (til að sýna hversu mikið hvert markmið hefur áhrif á FI dag)
- Expense tracking (til að benda á hvar hægt er að spara meira)

## Framtíðarviðbætur (Utan sviðs fyrir MVP)

- **Endurteknar innborganir**: Sjálfvirk uppfærsla á núverandi sparnaði með innborgum
- **Vaxtareikning**: Taka tillit til vaxta á sparnaði
- **Mynd/tákn fyrir markmið**: Sýnileg hvatning
- **Deilingarvalkostur**: Deila árangri á samfélagsmiðlum (nafnlaust)
- **Saga yfir lokin markmið**: Sjá öll lokin markmið með dagsetningu
- **Markmið með undirmarkmiðum**: Stór markmið með smærri áföngum
- **Áminningar**: Push/email tilkynningar þegar áfanga er náð eða til að minna á að uppfæra framfarir

## Árangursviðmið

**Eiginleikinn er árangursríkur ef**:
- Notendur geta búið til, breytt og rakið mörg sparnaðarmarkmið
- Framfarir eru sýndar í lífsorku-einingum (vinnustundir), ekki bara krónum
- Notendur sjá áþreifanlegan árangur með skýrum áföngum
- Allt virkar án netþjóns (client-side only)
- Gögn eru varanleg í localStorage með útflutningi/innflutningi
- Fullkomlega virkt á farsímum
