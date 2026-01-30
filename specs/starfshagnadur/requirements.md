# Kröfur: Starfshagnaðarmælir (Job Profit/Loss Scorecard)

## Yfirlit

**Eiginleiki**: Starfshagnaðarmælir
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2 - Kjarnareiknivélar
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Margir halda að starf þeirra sé arðbært vegna þess að þeir fá regluleg laun. En þegar allur kostnaður tengdur starfinu er tekinn inn í myndina - vinnufatnaður, búnaður, símenntunar kostnað, ótaldur yfirvinna, þreytutími og stressa tengd útgjöld - getur "arðbært" starf í raun verið tap.

Þetta er lykilhugmynd úr "Your Money or Your Life": Margir starfa hafa falinn kostnað sem étur inn í launin:
- Vinnuvið tengd útgjöld (fatnaður, búnaður, símenntunar/þjálfun)
- Streita og heilsutengdur kostnaður (endurhlaðningartími, heilbrigðisútgjöld)
- Tækifæriskostnaður (gætirðu þénað meira annars staðar?)
- Hliðarverkanir (eyðir þú meira vegna þess að þú ert stressaður/þreyttur?)

Starfshagnaðarmælirinn hjálpar notendum að greina hvort starf þeirra sé sannarlega arðbært þegar ALLUR kostnaður er talinn með. Með því að sjá raunverulegt tímakaup eftir allan kostnað og tíma geta notendur tekið upplýstar ákvarðanir um störf sín.

## Takmarkanir og forsendur

### Takmarkanir
- Allir útreikningar eru á viðskiptavindarhlið (client-side)
- Engin gögn geymd á netþjóni
- Notandi verður að hafa fyllt út Raunverulegt Tímakaup reiknivélina fyrst
- Eingöngu fyrir launafólk og sjálfstætt starfandi (ekki fyrir atvinnurekendur)

### Forsendur
- Notandi kann að meta peningalegt gildi fríðinda (þ.e. bílanotkun, heilsutryggingu)
- Notandi getur áætlað tíma sem fer í undirbúning og endurhlaðningu
- Notandi er heiðarlegur um allan kostnað (auðvelt að gleyma kostnaði)
- Áætlaðar ávöxtunartölur eru raunhæfar (7% langtímaávöxtun)

## Árangursmælikvarðar

Árangur eiginleikans mælast þegar:
- ✅ Notandi getur skráð allar tekjur og kostnað tengdan starfi
- ✅ Notandi sér raunverulegt tímakaup eftir allan kostnað og tíma
- ✅ Notandi sér "arðsemisstig" sem sýnir hvort starfið sé arðbært
- ✅ Notandi getur borið saman mismunandi atburðarás (hlutastarf, annað starf, sjálfstætt starfandi)
- ✅ Notandi skilur hvar peningar og tími fara
- ✅ Útreikningar eru nákvæmir og endurspeglast samstundis
- ✅ Gögn eru geymd og fylgja með útflutningi/innflutningi

## Notendafrásagnir

### NS-1: Skrá tekjur starfs
**Sem** notandi sem vill skilja raunverulegar tekjur mínar,
**vil ég** geta skráð allar tekjur tengdar starfi mínu,
**svo að** ég geti séð heildarmyndina af því sem ég þéna.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi smellir á "Skrá tekjur", **skal kerfið** sýna eyðublað með:
   - Brúttó árslaun (krónutala)
   - Árlegir bónusar (krónutala)
   - Peningalegt gildi fríðinda (bílanotkun, heilsutrygging, o.s.frv.)

2. **Þegar** notandi fyllir út og vistar, **skal kerfið** bæta tekjunum við útreikninga.

3. **Kerfið skal** geyma tekjuupplýsingar í localStorage og flytja þær með útflutningi/innflutningi.

4. **Þegar** notandi breytir gildum, **skal kerfið** uppfæra útreikninga samstundis.

5. **Ef** notandi slær inn 0 eða neikvæða tölu, **skal kerfið** sýna villuboð.

---

### NS-2: Skrá vinnuvið tengd útgjöld
**Sem** notandi sem vill sjá allan kostnað tengdan starfi,
**vil ég** geta skráð öll útgjöld sem ég hef vegna starfsins,
**svo að** ég geti séð raunverulegan kostnað.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi smellir á "Bæta við útgjaldi", **skal kerfið** sýna eyðublað með:
   - Nafn útgjalds (texti)
   - Árlegur kostnaður (krónutala)
   - Flokkur (val úr lista: Fatnaður, Máltíðir, Búnaður, Menntun, Aðild/Leyfi, Annað)

2. **Kerfið skal** bjóða upp á flýtival fyrir algeng útgjöld:
   - Vinnufatnaður og skór
   - Hádegismáltíðir úti vs heima
   - Búnaður og verkfæri
   - Þjálfun og símenntunar námskeið
   - Fagfélög og fagleyfi
   - Sérfræði hugbúnaður eða áskriftir

3. **Þegar** notandi velur forstillt útgjald, **skal kerfið** fylla út nafn og flokk sjálfkrafa.

4. **Kerfið skal** leyfa notanda að breyta forstilltum gildum.

5. **Þegar** notandi vistar útgjald, **skal kerfið** bæta því við lista og uppfæra útreikninga.

6. **Þegar** notandi smellir á "Eyða", **skal kerfið** fjarlægja útgjaldið úr listanum.

7. **Kerfið skal** sýna samtölu útgjalda eftir flokkum.

---

### NS-3: Skrá tímakostnað starfs
**Sem** notandi sem vill sjá raunverulegan tíma sem fer í starfið,
**vil ég** geta skráð allan tíma tengdan starfinu,
**svo að** ég geti séð hversu mikinn tíma starfið tekur í raun.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi smellir á "Skrá tíma", **skal kerfið** sýna eyðublað með:
   - Vinnustundir á viku (opinber tími)
   - Ótölduð yfirvinna á viku (klukkustundir)
   - Undirbúningstími á dag (klæðast, förðun, o.s.frv.)
   - Endurhlaðningartími á dag (aftanvakning, slökun eftir vinnu)
   - Ferðatími til og frá vinnu (klukkustundir á dag)

2. **Kerfið skal** reikna heildarvinnutíma sem:
   ```
   Heildar vinnustundir á viku = Opinber tími + Yfirvinna + (Undirbúning × 5) + (Endurhlaðning × 5) + (Ferðatími × 5)
   ```

3. **Þegar** notandi breytir gildum, **skal kerfið** uppfæra útreikninga samstundis.

4. **Ef** notandi slær inn neikvæða tölu, **skal kerfið** sýna villuboð.

5. **Kerfið skal** sýna samanburð milli "opinbers tíma" og "raunverulegs tíma".

---

### NS-4: Sjá raunverulegt tímakaup eftir kostnað
**Sem** notandi með skilgreindar tekjur, útgjöld og tíma,
**vil ég** sjá raunverulegt tímakaup mitt eftir allan kostnað,
**svo að** ég geti séð hvað ég þéna í raun á hverri klukkustund.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur skráð tekjur, útgjöld og tíma, **skal kerfið** reikna:
   ```
   Nettó árstekjur = Brúttó laun + Bónusar + Fríðindi - Heildar útgjöld
   Raunverulegt tímakaup = Nettó árstekjur / (Heildar vinnustundir á viku × 52)
   ```

2. **Kerfið skal** sýna:
   - Raunverulegt tímakaup (kr/klst)
   - Opinbert tímakaup (án útgjalda og auka tíma)
   - Mismun milli þeirra (kr og %)

3. **Ef** raunverulegt tímakaup er neikvætt, **skal kerfið** sýna viðvörunarboð um að starfið sé tap.

4. **Kerfið skal** uppfæra útreikninga samstundis þegar inntak breytist.

---

### NS-5: Sjá arðsemisstig starfs
**Sem** notandi sem vill skilja hvort starfið mitt sé arðbært,
**vil ég** sjá "arðsemisstig" sem ber saman raunverulegt tímakaup við aðra möguleika,
**svo að** ég geti metið hvort starfið skipti sig.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** reikna arðsemisstig sem:
   ```
   Arðsemisstig = (Raunverulegt tímakaup / Markmiðs tímakaup) × 100
   ```

2. **Kerfið skal** sýna arðsemisstig með litakóðun:
   - Grænt (≥100%): Starfið er arðbært
   - Gult (75-99%): Starfið er í lagi en gæti verið betra
   - Rautt (<75%): Starfið er líklega ekki þess virði

3. **Kerfið skal** leyfa notanda að setja "markmiðs tímakaup" fyrir samanburð.

4. **Ef** markmiðs tímakaup er ekki sett, **skal kerfið** nota lágmarkslaun sem sjálfgefið.

5. **Kerfið skal** sýna textalýsingu á arðsemistiginu (t.d. "Starfið þitt er arðbært!" eða "Starfið þitt er tap").

---

### NS-6: Sjá sundurliðun kostnaðar og tíma
**Sem** notandi sem vill skilja hvar peningar og tími fara,
**vil ég** sjá myndræna sundurliðun,
**svo að** ég geti greint hvar mesta tækifærið er til að bæta.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna sundurliðun útgjalda eftir flokkum:
   - Fatnaður (kr og % af heild)
   - Máltíðir (kr og % af heild)
   - Búnaður (kr og % af heild)
   - Menntun (kr og % af heild)
   - Aðild/Leyfi (kr og % af heild)
   - Annað (kr og % af heild)

2. **Kerfið skal** sýna sundurliðun tíma:
   - Opinber vinnustundir (klst og % af heild)
   - Ótölduð yfirvinna (klst og % af heild)
   - Undirbúningstími (klst og % af heild)
   - Endurhlaðningartími (klst og % af heild)
   - Ferðatími (klst og % af heild)

3. **Kerfið skal** raða flokkum eftir stærð (stærstur fyrst).

4. **Kerfið skal** sýna bæði í krónum og prósentum.

---

### NS-7: Bera saman atburðarás
**Sem** notandi sem veltir fyrir mér breytingum á starfi,
**vil ég** geta borið saman mismunandi atburðarás,
**svo að** ég geti séð hvað myndi gerast ef ég breyti starfi eða vinnustundum.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** bjóða upp á eftirfarandi atburðarás:
   - Núverandi staða
   - Hlutastarf (75% af tíma og launum)
   - Hlutastarf (50% af tíma og launum)
   - Annað starf (notandi slær inn nýjar tölur)
   - Sjálfstætt starfandi (notandi slær inn áætlaðar tekjur og útgjöld)

2. **Þegar** notandi velur atburðarás, **skal kerfið** reikna nýtt raunverulegt tímakaup.

3. **Kerfið skal** sýna samanburð hlið við hlið:
   - Núverandi vs atburðarás
   - Tekjur, útgjöld, tími, raunverulegt tímakaup
   - Mismunur (kr og %)

4. **Kerfið skal** leyfa notanda að vista atburðarásir fyrir síðari samanburð.

5. **Þegar** notandi vistar atburðarás, **skal kerfið** geyma hana í localStorage.

---

### NS-8: Sjá tillögur til að bæta arðsemi
**Sem** notandi sem vill bæta arðsemi starfsins,
**vil ég** sjá tillögur frá kerfinu,
**svo að** ég geti gert breytingar sem skipta máli.

**Samþykktarviðmið (EARS snið)**:

1. **Ef** hádegismáltíðir úti eru yfir 30% af útgjöldum, **skal kerfið** stinga upp á að taka mat að heiman.

2. **Ef** endurhlaðningartími er yfir 2 klst á dag, **skal kerfið** stinga upp á að starf gæti verið of stressandi.

3. **Ef** ótölduð yfirvinna er yfir 10 klst á viku, **skal kerfið** stinga upp á að semja um hærri laun eða minna vinnuálag.

4. **Ef** ferðatími er yfir 1 klst á dag, **skal kerfið** stinga upp á að leita að vinnu nær heimili eða fjarvinna.

5. **Ef** raunverulegt tímakaup er neikvætt, **skal kerfið** stinga upp á að finna annað starf.

6. **Kerfið skal** raða tillögum eftir áhrifum (stærstu tækifærin fyrst).

---

## Inntaksforskriftir

### Tekjuinntök
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Brúttó árslaun | Krónutala | - | Áskilið, > 0 | Árleg laun fyrir skatta |
| Árlegir bónusar | Krónutala | 0 | ≥ 0 | Bónusar, þóknun, o.s.frv. |
| Peningalegt gildi fríðinda | Krónutala | 0 | ≥ 0 | Bílanotkun, heilsutrygging, o.s.frv. |

### Útgjaldainntök
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Nafn | Texti | - | Áskilið, ekki tómt | Heiti útgjalds |
| Árlegur kostnaður | Krónutala | - | Áskilið, > 0 | Árlegur kostnaður |
| Flokkur | Val | 'other' | Áskilið | Einn af 6 flokkum |

### Tímainntök
| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Vinnustundir á viku | Klukkustundir | - | Áskilið, > 0 | Opinber vinnustundir |
| Yfirvinna á viku | Klukkustundir | 0 | ≥ 0 | Ótölduð yfirvinna |
| Undirbúningstími á dag | Mínútur | 0 | ≥ 0 | Klæðast, förðun, o.s.frv. |
| Endurhlaðningartími á dag | Mínútur | 0 | ≥ 0 | Aftanvakning, slökun |
| Ferðatími á dag | Mínútur | 0 | ≥ 0 | Til og frá vinnu |

### Flokkar útgjalda
| Flokkur | Lykill | Lýsing |
|---------|--------|--------|
| Fatnaður | clothing | Vinnufatnaður, skór |
| Máltíðir | meals | Hádegismatur, kaffi |
| Búnaður | equipment | Verkfæri, tæki |
| Menntun | education | Námskeið, þjálfun |
| Aðild/Leyfi | membership | Fagfélög, fagleyfi |
| Annað | other | Annað |

## Útreikningsformúlur

### Heildar tekjur og útgjöld
```
Heildar árstekjur = Brúttó árslaun + Árlegir bónusar + Peningalegt gildi fríðinda
Heildar ársútgjöld = Summa allra árlegra útgjalda
Nettó árstekjur = Heildar árstekjur - Heildar ársútgjöld
```

### Heildar vinnustundir
```
Undirbúningstími á viku = (Undirbúningstími á dag / 60) × 5
Endurhlaðningartími á viku = (Endurhlaðningartími á dag / 60) × 5
Ferðatími á viku = (Ferðatími á dag / 60) × 5

Heildar vinnustundir á viku = Opinber tími + Yfirvinna + Undirbúningstími + Endurhlaðningartími + Ferðatími
Heildar vinnustundir á ári = Heildar vinnustundir á viku × 52
```

### Raunverulegt tímakaup
```
Opinbert tímakaup = Heildar árstekjur / (Opinber tími × 52)
Raunverulegt tímakaup = Nettó árstekjur / Heildar vinnustundir á ári
```

### Arðsemisstig
```
Arðsemisstig = (Raunverulegt tímakaup / Markmiðs tímakaup) × 100

Litakóðun:
- Grænt: ≥ 100%
- Gult: 75-99%
- Rautt: < 75%
```

### Atburðarás útreikningar

#### Hlutastarf (75%)
```
Ný laun = Núverandi laun × 0.75
Nýr tími = Núverandi tími × 0.75
Ný útgjöld = Núverandi útgjöld × 0.75 (áætlað)
```

#### Hlutastarf (50%)
```
Ný laun = Núverandi laun × 0.50
Nýr tími = Núverandi tími × 0.50
Ný útgjöld = Núverandi útgjöld × 0.50 (áætlað)
```

## Úttaksforskriftir

### Aðalúttak
- **Heildar árstekjur**: Sýnt sem krónutala
- **Heildar ársútgjöld**: Sýnt sem krónutala
- **Nettó árstekjur**: Sýnt sem krónutala
- **Heildar vinnustundir á viku**: Sýnt sem klukkustundir
- **Opinbert tímakaup**: Sýnt sem kr/klst
- **Raunverulegt tímakaup**: Sýnt sem kr/klst
- **Arðsemisstig**: Sýnt sem prósenta með litakóðun

### Aukaúttak
- **Sundurliðun útgjalda eftir flokkum**: Krónutölur og prósentur
- **Sundurliðun tíma eftir tegundum**: Klukkustundir og prósentur
- **Samanburður atburðarása**: Hlið við hlið samanburður
- **Tillögur til að bæta**: Raðaðar eftir áhrifum

## Kröfur sem ekki tengjast virkni

### Afköst
1. **Þegar** notandi slær inn eða breytir gildi, **skal kerfið** uppfæra útreikninga innan við 50ms.

2. **Kerfið skal** framkvæma alla útreikninga á viðskiptavindarhlið (client-side), engar netbeiðnir.

3. **Þegar** notandi hleður síðu með vistuðum gögnum, **skal kerfið** birta útreikninga innan við 100ms.

### Aðgengi
1. **Kerfið skal** uppfylla WCAG 2.1 AA kröfur fyrir aðgengi.

2. **Kerfið skal** leyfa fullt lyklaborðs aðgengi:
   - Tab til að fara á milli reita
   - Enter til að vista
   - Esc til að hætta við

3. **Kerfið skal** virka með skjálesurum (screen readers).

4. **Kerfið skal** hafa nægjanlegt litatálgun samræmi (contrast ratio ≥ 4.5:1).

5. **Kerfið skal** hafa merkingar (labels) á öllum inntaksreitum.

### Persónuvernd
1. **Kerfið skal** geyma öll gögn í localStorage eingöngu.

2. **Kerfið skal** EKKI senda nein gögn á netþjón.

3. **Kerfið skal** flytja gögn með aðalgögnum í export/import virkni.

4. **Kerfið skal** leyfa notanda að eyða öllum gögnum með einum smelli.

### Notendaviðmót
1. **Kerfið skal** nota sama hönnunarkerfi og aðrir reiknivélar í app.

2. **Kerfið skal** virka á öllum skjástærðum (responsive design):
   - Farsímar (< 640px)
   - Spjaldtölvur (640px - 1024px)
   - Tölvur (> 1024px)

3. **Kerfið skal** sýna allan texta á íslensku.

4. **Kerfið skal** nota íslenskt snið fyrir tölur (þúsund aðskilin með punkti, aukastafir með kommu).

5. **Þegar** villa kemur upp, **skal kerfið** sýna skýr villuboð á íslensku.

### Gagnageymsla
1. **Kerfið skal** vista gögn í localStorage undir lyklinum `jobProfitLoss`.

2. **Kerfið skal** uppfæra localStorage samstundis þegar gögn breytast.

3. **Ef** localStorage er fullt, **skal kerfið** sýna villuboð.

4. **Kerfið skal** flytja gögn með sömu export/import virkni og aðrir reiknivélar.

## Tengsl

### Krefst
- **Raunverulegt Tímakaup reiknivélar**: Fyrir samanburð og grunnupplýsingar
- **localStorage API**: Fyrir gagnaeymslu
- **Export/Import virkni**: Fyrir gagnaflutning

### Notar
- **Sömu UI íhluti**: Hnappa, innsláttar reitir, kort
- **Sama hönnunarkerfi**: Litir, leturgerðir, bil
- **Sama localStorage snið**: Samræmi í gagnageymslu

### Geymt með
- Aðalgögnum í localStorage
- Útflutningu JSON skrá

## Framtíðarútvíkkun (Utan gildissviðs MVP)

Eftirfarandi eiginleikar eru utan gildissviðs fyrir MVP en gætu verið bættir við síðar:

1. **Graf sem sýnir breytingar yfir tíma**
   - Fylgjast með breytingum á raunverulegu tímakaup
   - Sjá áhrif breytinga (launahækkun, útgjaldaminnkun)

2. **Samanburður við meðaltal annarra notenda**
   - Nafnlaus samantekt
   - Samanburður við aðra í sömu atvinnugrein

3. **Bein tenging við banka**
   - Sækja launaupplýsingar sjálfkrafa
   - Sækja útgjöld sjálfkrafa

4. **Áminningar og markmið**
   - Setja markmið um að hækka raunverulegt tímakaup
   - Fá ráðleggingar um hvernig á að ná markmiðum

5. **Útreikningur á skattum**
   - Skilja nettó vs brúttó laun
   - Sjá áhrif skatta á raunverulegt tímakaup

6. **Samtengir kostnaður fjölskyldu**
   - Barnapössun vegna vinnu
   - Gæludýrapössun vegna vinnu
   - Heimilisstörf sem þú greiðir fyrir vegna þess að þú hefur ekki tíma

7. **Heilsukostnaður útreikningur**
   - Sjúkradaga vegna streitu
   - Heilbrigðisútgjöld vegna vinnu
   - Meðferðarkostnaður (nudd, sálfræðingur)

8. **AI tillögur**
   - Snjall greining á gögnum
   - Persónulegar tillögur
   - Spá um framtíðar arðsemi

---

## Heimildaskrá

- **Your Money or Your Life** eftir Vicki Robin og Joe Dominguez
- **Raunverulegt Tímakaup**: Grunnhugtak úr aðalreiknivélinni
- **FIRE hreyfing**: Financial Independence, Retire Early
- **Lágmarkslaun á Íslandi**: Fyrir samanburð og sjálfgefin gildi
