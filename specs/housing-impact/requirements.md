# Kröfur: Húsnæðiskostnaðarreiknivél (Housing Impact Calculator)

## Yfirlit

**Eiginleiki**: Húsnæðiskostnaðarreiknivél
**App**: peninganaedalifid.is
**Forgangsröð**: Fasi 2 - Áhrif Útgjalda (2.1.4)
**Tengsl**: Notar raunverulegt tímakaup úr Raunverulegu Tímakaups reiknivélinni

## Vandamálslýsing

Húsnæðiskostnaður er oft stærsti einstaki útgjaldaliður í fjárhagsáætlun fólks, en flestir vanmeta raunverulegan kostnað húsnæðis. Þegar fólk metur húsnæðisákvarðanir (leiga vs kaupa, velja íbúðalán, lækka húsnæðiskostnað) hugsar það oft bara um mánaðarlega greiðslu - ekki heildarkostnaðinn í peninga og lífsorku.

**Raunverulegur húsnæðiskostnaður felur í sér**:
- Leiga eða höfuðstóll + vextir íbúðaláns
- Fasteignagjöld (fasteignaskattur)
- Húseigendatrygging
- Viðhaldskostnaður (ef eignarhúsnæði)
- Félagsgjöld (ef fjöleignarhús)
- Hita- og rafmagnskostnaður (oft gleymt)
- **Vaxtakostnaður á lánstíma** - kannski dýrasti þátturinn
- **Fórnarkostnaður** - hvað þessi peningur myndi gera ef hann væri fjárfestur

**Íslensk sérstöðu**:
- **Verðtryggð lán** (indexed loans) - vextir + verðbólga
- **Óverðtryggð lán** (non-indexed loans) - bara vextir
- Háir fasteignagjöld í höfuðborgarsvæðinu
- Hátt hlutfall húseigna vs leigu samanborið við Evrópu
- Vaxtagjöld allt að 5-6% fyrir óverðtryggð, 3-4% + verðbólga fyrir verðtryggð

Þegar þú sérð húsnæðiskostnað í samhengi við lífsorku og framtíðarverðmæti getur þú:
- Tekið upplýsta ákvörðun um leiga vs kaupa
- Metið hvort það borgi sig að minnka húsnæði
- Séð raunverulegan kostnað á endurfjármögnun (refinance)
- Borið saman mismunandi lánakjör
- Áttað þig á fórnarkostnaði stórs húsnæðis

## Notendafrásagnir

### NS-1: Skrá upplýsingar um húsnæðiskostnað

**Sem** notandi sem vill skilja raunverulegan kostnað húsnæðis,
**vil ég** geta skráð allar upplýsingar um húsnæðiskostnað,
**svo að** ég geti séð heildarkostnaðinn í lífsorku og fjárhagslegum áhrifum.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi opnar reiknivélina, **skal kerfið** sýna val um húsnæðistegund:
   - Leiguhúsnæði
   - Eignarhúsnæði með láni
   - Eignarhúsnæði án láns (greitt upp)

2. **Ef** notandi velur "Leiguhúsnæði", **skal kerfið** sýna reiti:
   - Mánaðarleg leiga (kr, áskilið)
   - Hitakostnaður innifalinn? (já/nei, sjálfgefið nei)
   - Rafmagnskostnaður innifalinn? (já/nei, sjálfgefið nei)
   - Ef hitakostnaður ekki innifalinn: Mánaðarlegur hitakostnaður (kr)
   - Ef rafmagnskostnaður ekki innifalinn: Mánaðarlegur rafmagnskostnaður (kr)

3. **Ef** notandi velur "Eignarhúsnæði með láni", **skal kerfið** sýna reiti:
   - Lánstegund (val: Verðtryggt lán, Óverðtryggt lán)
   - Heildarupphæð láns (kr, áskilið)
   - Ársvextir (%, áskilið)
   - Lánstími (ár, áskilið, 1-40 ár)
   - Ef verðtryggt: Áætluð verðbólga á ári (%, sjálfgefið 3.5%)
   - Fasteignagjöld á ári (kr, áskilið)
   - Húseigendatrygging á ári (kr, áskilið)
   - Viðhaldskostnaður á ári (kr, áskilið)
   - Félagsgjöld á mánuði (kr, sjálfgefið 0)
   - Mánaðarlegur hitakostnaður (kr, áskilið)
   - Mánaðarlegur rafmagnskostnaður (kr, áskilið)

4. **Ef** notandi velur "Eignarhúsnæði án láns", **skal kerfið** sýna reiti:
   - Áætlað virði eignar (kr, valfrjálst, fyrir fórnarkostnað)
   - Fasteignagjöld á ári (kr, áskilið)
   - Húseigendatrygging á ári (kr, áskilið)
   - Viðhaldskostnaður á ári (kr, áskilið)
   - Félagsgjöld á mánuði (kr, sjálfgefið 0)
   - Mánaðarlegur hitakostnaður (kr, áskilið)
   - Mánaðarlegur rafmagnskostnaður (kr, áskilið)

5. **Þegar** notandi breytir gildum, **skal kerfið** uppfæra útreikninga samstundis.

6. **Kerfið skal** geyma húsnæðisupplýsingar í localStorage.

7. **Kerfið skal** leyfa notanda að vista allt að 4 mismunandi húsnæðissviðsmyndir til samanburðar.

8. **Kerfið skal** leyfa notanda að gefa hverri sviðsmynd lýsandi heiti (t.d. "Núverandi íbúð", "Minni íbúð í úthverfum", "Kaupa hús").

---

### NS-2: Sjá raunverulegan mánaðarlegan og árlegan kostnað

**Sem** notandi sem vill sjá allan kostnað, ekki bara leigu eða húsnæðislán,
**vil ég** sjá heildar mánaðarlegan og árlegan kostnað húsnæðis,
**sso að** ég skilji hversu mikið þetta kostar mig í raun.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur fyllt út upplýsingar um húsnæði, **skal kerfið** sýna:
   - Mánaðarleg húsnæðisgreiðsla (leiga eða lán)
   - Fasteignagjöld á mánuði (árlegt / 12)
   - Tryggingar á mánuði (árlegt / 12)
   - Viðhald á mánuði (árlegt / 12)
   - Félagsgjöld á mánuði
   - Hiti á mánuði
   - Rafmagn á mánuði
   - **Heildar mánaðarkostnaður** (samtala allra)
   - **Heildar árskostnaður** (mánaðarkostnaður × 12)

2. **Ef** húsnæðistegund er "Eignarhúsnæði með láni", **skal kerfið** sýna viðbótarupplýsingar:
   - Mánaðarleg lá nsgreiðsla (höfuðstóll + vextir)
   - Heildar vaxtagreiðslur yfir lánstíma
   - Heildar greiðslur yfir lánstíma (höfuðstóll + vextir)
   - Hlutfall vaxta af heildarkostnaði (%)

3. **Kerfið skal** sýna sundurliðun á öllum kostnaðarliðum með skýrum merkingum.

4. **Kerfið skal** sýna samanburð á "það sem fólk hugsar um" (leiga/lán) vs. "raunverulegur kostnaður" (allt innifalið).

5. **Þegar** notandi skoðar eignarhúsnæði með láni, **skal kerfið** sýna ábendingu:
   "Athugið: Yfir X ára lánstíma greiðir þú Y kr í vexti - það er Z% af heildarkostnaði."

6. **Ef** lánstegund er "Verðtryggt lán", **skal kerfið** sýna ábendingu:
   "Athugið: Verðtryggð lán hækka með verðbólgu. Miðað við X% verðbólgu á ári mun lánið hækka um ~Y kr á ári."

---

### NS-3: Sjá lífsorku kostnað

**Sem** notandi með skilgreint raunverulegt tímakaup,
**vil ég** sjá hversu margar klukkustundir af lífsorku húsnæðiskostnaður er,
**svo að** ég skilji raunverulegan kostnað í tíma og lífsorku.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi hefur skráð húsnæði og raunverulegt tímakaup er þekkt, **skal kerfið** sýna:
   - Mánaðarkostnaður umreiknaður í klukkustundir (kostnaður / raunverulegt tímakaup)
   - Árskostnaður umreiknaður í klukkustundir
   - Árskostnaður umreiknaður í vinnudaga (miðað við 8 klst vinnudag)
   - Árskostnaður umreiknaður í vinnuvikur (miðað við 40 klst vinnuviku)

2. **Kerfið skal** sýna lífsorku kostnað á skýran og áhrifamikinn hátt með texta eins og:
   "Húsnæðiskostnaður þinn er **X klukkustundir** á mánuði - það er **Y vinnudagar** á ári sem fara bara í að borga fyrir húsnæði."

3. **Ef** raunverulegt tímakaup er ekki skilgreint, **skal kerfið** sýna skilaboð:
   "Til að sjá lífsorku kostnað þarftu fyrst að fylla út Raunverulegt Tímakaup í aðalreiknivélinni."

4. **Kerfið skal** nota raunverulegt tímakaup (actualHourlyWage) úr aðalreiknivélinni, ekki nafnverð tímakaup.

5. **Þegar** lífsorku kostnaður er yfir 160 klukkustundir á mánuði (4 vikur af 40 klst), **skal kerfið** sýna ábendingu:
   "⚠️ Húsnæðiskostnaður þinn er yfir hálfur mánuður af lífsorku. Íhugaðu að minnka húsnæðiskostnað með minni íbúð eða ódýrara hverfi."

---

### NS-4: Sjá áhrif á fjárhagslegt frelsi (FI)

**Sem** notandi sem stefnir að fjárhagslegu frelsi,
**vil ég** sjá hversu mikið húsnæðiskostnaður seinka FI markmiðum mínum,
**svo að** ég geti metið hvort húsnæðisval mitt sé skynsamlegt.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** sýna framtíðarverðmæti ef mánaðarlegur húsnæðiskostnaður væri fjárfestur í staðinn:
   - Eftir 5 ár (við 7% ávöxtun)
   - Eftir 10 ár (við 7% ávöxtun)
   - Eftir 20 ár (við 7% ávöxtun)
   - Við starfslok (miðað við 67 ára aldur, ef aldur notanda er þekktur)

2. **Fyrir eignarhúsnæði með láni**, **skal kerfið** sýna:
   - Framtíðarverðmæti ef mánaðargreiðsla láns væri fjárfest í staðinn
   - Framtíðarverðmæti ef eingöngu vaxtagreiðslur væru fjárfestar
   - Samanburður: Eigið fé í húsnæði vs fjárfesting

3. **Kerfið skal** sýna fórnarkostnað með texta eins og:
   "Ef þú myndir fjárfesta mánaðarlegan húsnæðiskostnað þinn í staðinn, myndi hann vaxa í X kr á 10 árum. Þetta er fórnarkostnaður húsnæðisvals þíns."

4. **Ef** notandi hefur skráð FI markmiðsupphæð í aðalreiknivélinni, **skal kerfið** sýna:
   - Hversu stór hluti af FI markmiði húsnæðiskostnaður er
   - Hversu mörgum árum húsnæðiskostnaður seinka FI markmiði (áætlað)

5. **Fyrir leiguhúsnæði**, **skal kerfið** sýna ábendingu:
   "Þú greiðir X kr á mánuði í leigu sem gengur til húseiganda. Ef þú myndir fjárfesta þessa upphæð í staðinn myndi hún vaxa í Y kr á 20 árum."

6. **Fyrir eignarhúsnæði**, **skal kerfið** sýna ábendingu:
   "Þó þú sért að byggja upp eigið fé í húsnæði, þá eru vextir og viðhaldskostnaður fórnarkostnaður. Einungis höfuðstóllsgreiðslur eru sparnaður."

---

### NS-5: Bera saman húsnæðisvalkosti

**Sem** notandi sem vill taka upplýsta ákvörðun,
**vil ég** geta borið saman mismunandi húsnæðisvalkosti hlið við hlið,
**svo að** ég sjái skýran mun á kostnaði og langtímaahrif um.

**Samþykktarviðmið (EARS snið)**:

1. **Kerfið skal** leyfa notanda að búa til allt að 4 mismunandi húsnæðissviðsmyndir.

2. **Þegar** fleiri en ein sviðsmynd er skráð, **skal kerfið** sýna samanburðartöflu með:
   - Heiti hverrar sviðsmyndar
   - Húsnæðistegund (Leiga, Eignarh. með láni, Eignarh. greitt upp)
   - Mánaðarkostnaður (heildar)
   - Lífsorku kostnaður á mánuði (klukkustundir)
   - Framtíðarverðmæti (10 ár) ef fjárfest í staðinn
   - Munur frá ódýrasta valkosti (í krónum og klukkustundum)

3. **Kerfið skal** auðkenna ódýrasta og dýrasta valkostinn með litamerkingum:
   - Grænt fyrir ódýrasta
   - Rautt fyrir dýrasta
   - Gult fyrir miðlungs

4. **Kerfið skal** sýna sparnað ef skipt er úr dýrasta í ódýrasta valkost með texta eins og:
   "Með því að skipta úr [dýrasti] yfir í [ódýrasta] gætir þú sparað **X kr á mánuði** og **Y klukkustundir** af lífsorku. Eftir 10 ár væri munurinn **Z kr** ef fjárfest."

5. **Notandi skal** geta eytt, breytt eða afritað sviðsmyndir.

6. **Kerfið skal** leyfa notanda að merkja eina sviðsmynd sem "núverandi" til að auðvelda samanburð.

7. **Fyrir eignarhúsnæði með láni**, **skal kerfið** sýna viðbótardálk í samanburði:
   - Heildar vaxtagreiðslur yfir lánstíma
   - Hlutfall vaxta af heildarkostnaði

---

### NS-6: Leiga vs kaupa greining

**Sem** notandi sem reynir að ákveða hvort kaupa eða leigja,
**vil ég** sjá skýran samanburð á leiga vs kaupa,
**svo að** ég geti tekið upplýsta ákvörðun.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi býr til 2 sviðsmyndir (ein "Leiguhúsnæði", önnur "Eignarhúsnæði með láni"), **skal kerfið** sýna "Leiga vs Kaupa" greiningu.

2. **Greiningin skal** innihalda:
   - Mánaðarkostnaður: Leiga vs Lán + eignarh.kostnaður
   - Munur í mánaðarkostnaði (kr og %)
   - Brotpunktur: Eftir hve mörg ár er kaupa ódýrara en leiga (ef við á)
   - Framtíðarvirði munanna ef fjárfest við 7% ávöxtun

3. **Kerfið skal** taka tillit til:
   - Kaupir: Vextir, fasteignagjöld, tryggingar, viðhald, félagsgjöld, hiti, rafmagn
   - Leiga: Leigugreiðsla, hiti (ef ekki innifalið), rafmagn (ef ekki innifalið)
   - Fórnarkostnaður: Inneignargreiðslur (down payment) sem gætu verið fjárfestar

4. **Kerfið skal** sýna helstu kosti og galla:
   - Leiga: Sveigjanleiki, lægri upphafskostnaður, enginn viðhaldskostnaður
   - Kaupa: Eigið fé safnast, langtímastöðugleiki, hægt að endurbæta

5. **Kerfið skal** sýna ábendingu:
   "Athugið: Þessi greining miðast eingöngu við fjárhagslegan kostnað. Persónulegir þættir eins og stöðugleiki, frelsi til að breyta húsnæði, og tilfinningaleg tengsl við heimili geta verið jafn mikilvæg."

---

### NS-7: Endurfjármögnun (refinance) greining

**Sem** húseigandi með lán,
**vil ég** sjá áhrif endurfjármögnunar,
**svo að** ég geti metið hvort það borgi sig að endurfjármagna.

**Samþykktarviðmið (EARS snið)**:

1. **Þegar** notandi býr til 2 sviðsmyndir af "Eignarhúsnæði með láni" með mismunandi vöxtum eða lánstíma, **skal kerfið** bjóða upp á "Endurfjármögnunargreiningu".

2. **Greiningin skal** sýna:
   - Núverandi lán: Mánaðargreiðsla, vextir eftir, heildar vaxtagreiðslur
   - Nýtt lán: Mánaðargreiðsla, vextir eftir, heildar vaxtagreiðslur
   - Sparnaður á mánuði (kr)
   - Sparnaður á vöxtum yfir lánstíma (kr)
   - Brotpunktur: Hve margir mánuðir þar til sparnaður er meiri en kostnaður við endurfjármögnun

3. **Kerfið skal** leyfa notanda að skrá kostnað við endurfjármögnun:
   - Umsóknargjald
   - Matsgerð
   - Lögfræðikostnaður
   - Samtals kostnaður (kr)

4. **Kerfið skal** sýna hvort endurfjármögnun borgi sig með texta eins og:
   "Með því að endurfjármagna sparar þú X kr á mánuði og Y kr á vöxtum yfir lánstíma. Það kostar Z kr að endurfjármagna, svo brotpunkturinn er eftir W mánuði."

5. **Kerfið skal** sýna ábendingu ef kostnaður við endurfjármögnun er hár:
   "Athugið: Kostnaður við endurfjármögnun er hár (Z kr). Gakktu úr skugga um að sparnaðurinn sé þess virði."

---

## Inntaksforskriftir

### Grunnupplýsingar húsnæðis

| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Heiti | Texti | "Húsnæði 1" | Valfrjálst, max 50 stafir | T.d. "Núverandi íbúð", "Minni íbúð í Breiðholti" |
| Húsnæðistegund | Val | 'rental' | Áskilið | rental, owned_with_loan, owned_paid_off |

### Leiguhúsnæði (ef húsnæðistegund = 'rental')

| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Mánaðarleg leiga | Tala | - | Áskilið, > 0, max 1000000 | kr á mánuði |
| Hitakostnaður innifalinn | Boolean | false | - | Já/Nei val |
| Rafmagnskostnaður innifalinn | Boolean | false | - | Já/Nei val |
| Mánaðarlegur hitakostnaður | Tala | 0 | Ef ekki innifalið: > 0 | kr á mánuði |
| Mánaðarlegur rafmagnskostnaður | Tala | 0 | Ef ekki innifalið: > 0 | kr á mánuði |

### Eignarhúsnæði með láni (ef húsnæðistegund = 'owned_with_loan')

| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Lánstegund | Val | 'indexed' | Áskilið | indexed (verðtryggt), non_indexed (óverðtryggt) |
| Heildarupphæð láns | Tala | - | Áskilið, > 0, max 500000000 | kr (t.d. 40.000.000) |
| Ársvextir | Tala | - | Áskilið, > 0, max 20 | % (t.d. 5.5 fyrir 5,5%) |
| Lánstími | Tala | 25 | Áskilið, 1-40 | ár |
| Verðbólga á ári | Tala | 3.5 | Ef indexed: > 0, max 20 | % (aðeins fyrir verðtryggð lán) |
| Fasteignagjöld á ári | Tala | 150000 | Áskilið, >= 0 | kr á ári |
| Húseigendatrygging á ári | Tala | 50000 | Áskilið, >= 0 | kr á ári |
| Viðhaldskostnaður á ári | Tala | 100000 | Áskilið, >= 0 | kr á ári, ~1% af verðmæti eignar |
| Félagsgjöld á mánuði | Tala | 0 | Valfrjálst, >= 0 | kr á mánuði (ef fjöleignarhús) |
| Mánaðarlegur hitakostnaður | Tala | 20000 | Áskilið, >= 0 | kr á mánuði |
| Mánaðarlegur rafmagnskostnaður | Tala | 8000 | Áskilið, >= 0 | kr á mánuði |

### Eignarhúsnæði greitt upp (ef húsnæðistegund = 'owned_paid_off')

| Reitur | Tegund | Sjálfgefið | Staðfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Áætlað virði eignar | Tala | 0 | Valfrjálst, >= 0 | kr, fyrir fórnarkostnað |
| Fasteignagjöld á ári | Tala | 150000 | Áskilið, >= 0 | kr á ári |
| Húseigendatrygging á ári | Tala | 50000 | Áskilið, >= 0 | kr á ári |
| Viðhaldskostnaður á ári | Tala | 100000 | Áskilið, >= 0 | kr á ári |
| Félagsgjöld á mánuði | Tala | 0 | Valfrjálst, >= 0 | kr á mánuði |
| Mánaðarlegur hitakostnaður | Tala | 20000 | Áskilið, >= 0 | kr á mánuði |
| Mánaðarlegur rafmagnskostnaður | Tala | 8000 | Áskilið, >= 0 | kr á mánuði |

### Húsnæðistegundir

| Tegund | Lykill | Lýsing |
|--------|--------|--------|
| Leiguhúsnæði | rental | Mánaðarleg leiga |
| Eignarhúsnæði með láni | owned_with_loan | Húseigandi með íbúðalán |
| Eignarhúsnæði greitt upp | owned_paid_off | Húseigandi, engin lán |

### Lánstegundir

| Tegund | Lykill | Lýsing |
|--------|--------|--------|
| Verðtryggt lán | indexed | Vextir + verðbólga, lægri nafnvextir |
| Óverðtryggt lán | non_indexed | Bara vextir, hærri nafnvextir |

## Útreikningsformúlur

### Leiguhúsnæði

#### Mánaðarkostnaður
```
Heildar mánaðarkostnaður = Mánaðarleg leiga
                          + (Hitakostnaður ef ekki innifalið)
                          + (Rafmagnskostnaður ef ekki innifalið)

Árskostnaður = Mánaðarkostnaður × 12
```

### Eignarhúsnæði með láni

#### Mánaðarleg lánsgreiðsla (Óverðtryggt lán)
```
r = Ársvextir / 12 / 100  (mánaðarlegur vaxtahlutfall)
n = Lánstími × 12  (fjöldi mánaða)
P = Heildarupphæð láns

Mánaðarleg greiðsla = P × (r × (1 + r)^n) / ((1 + r)^n - 1)

Heildar greiðslur yfir lánstíma = Mánaðarleg greiðsla × n
Heildar vaxtagreiðslur = Heildar greiðslur - P
Hlutfall vaxta = (Heildar vaxtagreiðslur / Heildar greiðslur) × 100
```

**Dæmi**:
```
P = 40.000.000 kr
Ársvextir = 5.5%
Lánstími = 25 ár

r = 5.5 / 12 / 100 = 0.004583
n = 25 × 12 = 300

Mánaðarleg greiðsla = 40,000,000 × (0.004583 × 1.004583^300) / (1.004583^300 - 1)
                    ≈ 245,000 kr

Heildar greiðslur = 245,000 × 300 = 73,500,000 kr
Heildar vaxtagreiðslur = 73,500,000 - 40,000,000 = 33,500,000 kr
Hlutfall vaxta = 45.6%
```

#### Mánaðarleg lánsgreiðsla (Verðtryggt lán)
```
Fyrir verðtryggð lán er formúlan flóknari vegna verðbólgu:

r_real = Ársvextir / 12 / 100  (raunvextir á mánuði)
i = Verðbólga / 12 / 100  (verðbólga á mánuði)
r_nominal = (1 + r_real) × (1 + i) - 1  (nafnvextir)
n = Lánstími × 12

Upphafleg mánaðargreiðsla = P × (r_nominal × (1 + r_nominal)^n) / ((1 + r_nominal)^n - 1)

Athugið: Verðtryggð lán hækka með verðbólgu, svo mánaðargreiðslan hækkar með tímanum.
Einfaldari nálgun: Nota sömu formúlu en r = (Ársvextir + Verðbólga) / 12 / 100
```

**Dæmi** (einfölduð nálgun):
```
P = 40.000.000 kr
Ársvextir = 3.5%
Verðbólga = 3.5%
Lánstími = 25 ár

r = (3.5 + 3.5) / 12 / 100 = 0.005833
n = 300

Mánaðarleg greiðsla ≈ 254,000 kr (hækkar með verðbólgu)
```

#### Heildar mánaðarkostnaður (með láni)
```
Heildar mánaðarkostnaður = Mánaðarleg lánsgreiðsla
                          + Fasteignagjöld / 12
                          + Húseigendatrygging / 12
                          + Viðhaldskostnaður / 12
                          + Félagsgjöld
                          + Hitakostnaður
                          + Rafmagnskostnaður

Árskostnaður = Mánaðarkostnaður × 12
```

### Eignarhúsnæði greitt upp

#### Mánaðarkostnaður
```
Heildar mánaðarkostnaður = Fasteignagjöld / 12
                          + Húseigendatrygging / 12
                          + Viðhaldskostnaður / 12
                          + Félagsgjöld
                          + Hitakostnaður
                          + Rafmagnskostnaður

Árskostnaður = Mánaðarkostnaður × 12
```

#### Fórnarkostnaður (ef eignarvirði er skráð)
```
Fórnarkostnaður er áætlaður mánaðarlegur tekjumissir ef eignarvirði væri fjárfest í staðinn.

Mánaðarlegur fórnarkostnaður = (Eignarvirði × 0.07) / 12

Þetta er ekki hluti af raunverulegum kostnaði, en sýnir fórnarkostnað.
```

### Lífsorku útreikningar

#### Peningar sem lífsorka
```
Lífsorka á mánuði (klst) = Mánaðarkostnaður / Raunverulegt tímakaup
Lífsorka á ári (klst) = Lífsorka á mánuði × 12
Lífsorka á ári (dagar) = Lífsorka á ári (klst) / 24
Lífsorka á ári (vinnudagar) = Lífsorka á ári (klst) / 8
Lífsorka á ári (vinnuvikur) = Lífsorka á ári (klst) / 40
```

**Dæmi**:
```
Mánaðarkostnaður = 300.000 kr
Raunverulegt tímakaup = 5.000 kr

Lífsorka á mánuði = 300,000 / 5,000 = 60 klst
Lífsorka á ári = 60 × 12 = 720 klst = 30 dagar = 90 vinnudagar = 18 vinnuvikur
```

### Framtíðarverðmæti (FI áhrif)

#### Framtíðarvirði með mánaðarlegum innborgunum
```
FV = PMT × ((1 + r)^n - 1) / r

Þar sem:
- PMT = Mánaðarlegur kostnaður
- r = Mánaðarleg ávöxtun (0.07 / 12 = 0.005833)
- n = Fjöldi mánaða

5 ár:   n = 60
10 ár:  n = 120
20 ár:  n = 240
```

**Dæmi**:
```
Mánaðarkostnaður = 300.000 kr
Ávöxtun = 7% á ári

Eftir 10 ár:
FV = 300,000 × ((1 + 0.005833)^120 - 1) / 0.005833
   ≈ 51.900.000 kr
```

### Samanburðarútreikningar

#### Leiga vs Kaupa

```
Munur í mánaðarkostnaði = Kaupa kostnaður - Leigukostnaður

Ef munur > 0 (kaupa dýrara):
  Uppsafnaður munur eftir N mánuði = Munur × N
  Framtíðarvirði munarins = Munur × ((1 + 0.005833)^N - 1) / 0.005833

Ef munur < 0 (leiga dýrari):
  Sparnaður við að kaupa = |Munur| × N
  Uppsafnað eigið fé í húsnæði (nálgun) = Höfuðstóllsgreiðslur yfir N mánuði
```

#### Endurfjármögnun
```
Sparnaður á mánuði = Núverandi greiðsla - Ný greiðsla
Sparnaður yfir lánstíma = (Núverandi heildargreiðslur - Nýjar heildargreiðslur)
Brotpunktur í mánuðum = Kostnaður við endurfjármögnun / Sparnaður á mánuði
```

## Úttaksforskriftir

### Aðalúttak - Einstakar sviðsmyndir

#### Kostnaðaryfirlit
- **Mánaðarkostnaður**: Sýnt sem krónutala með þúsunda skiptum og áherslu
- **Árskostnaður**: Sýnt sem krónutala með áherslu

#### Sundurliðun kostnaðar

**Fyrir leiguhúsnæði**:
- Mánaðarleg leiga: kr
- Hitakostnaður: kr (ef ekki innifalið)
- Rafmagnskostnaður: kr (ef ekki innifalið)
- **Heildar mánaðarkostnaður**: kr (áhersla)

**Fyrir eignarhúsnæði með láni**:
- Mánaðarleg lánsgreiðsla: kr
- Fasteignagjöld: kr/mánuði
- Tryggingar: kr/mánuði
- Viðhald: kr/mánuði
- Félagsgjöld: kr/mánuði
- Hitakostnaður: kr
- Rafmagnskostnaður: kr
- **Heildar mánaðarkostnaður**: kr (áhersla)

Viðbótarupplýsingar um lán:
- Heildar vaxtagreiðslur yfir lánstíma: kr með áherslu
- Hlutfall vaxta af heildarkostnaði: %

**Fyrir eignarhúsnæði greitt upp**:
- Fasteignagjöld: kr/mánuði
- Tryggingar: kr/mánuði
- Viðhald: kr/mánuði
- Félagsgjöld: kr/mánuði
- Hitakostnaður: kr
- Rafmagnskostnaður: kr
- **Heildar mánaðarkostnaður**: kr (áhersla)
- Fórnarkostnaður: kr/mánuði (ef eignarvirði skráð)

#### Lífsorku úttak
- **Lífsorka á mánuði**: Klukkustundir með áherslu
- **Lífsorka á ári**: Dagar, vinnudagar, og vinnuvikur

Dæmi texti:
```
"Húsnæðiskostnaður þinn er 60 klukkustundir af lífsorku á mánuði.
Það er 90 vinnudagar eða 18 vinnuvikur á ári sem fara bara í að borga fyrir húsnæði!"
```

#### Framtíðarverðmæti (FI áhrif)
- **5 ár**: Krónutala ef fjárfest við 7%
- **10 ár**: Krónutala ef fjárfest við 7% (með áherslu)
- **20 ár**: Krónutala ef fjárfest við 7%

Dæmi texti:
```
"Ef þú myndir fjárfesta mánaðarlegan húsnæðiskostnað þinn í staðinn,
myndi hann vaxa í 51.900.000 kr á 10 árum við 7% ávöxtun."
```

### Samanburðartafla - Margar sviðsmyndir

Þegar 2-4 sviðsmyndir eru til samanburðar:

| Dálkur | Snið | Lýsing |
|--------|------|--------|
| Heiti | Texti | Nafn sviðsmyndar |
| Tegund | Íkon + texti | Leiga/Eignarh. með láni/Eignarh. greitt |
| Mánaðarkostnaður | Krónutala + litamerking | Grænt=ódýrast, rautt=dýrast |
| Lífsorka (mán.) | Klukkustundir + litamerking | Heildar lífsorka á mánuði |
| FV (10 ár) | Krónutala | Framtíðarverðmæti |
| Munur | Krónutala + % | Munur frá ódýrasta |

#### Sparnaður við val á ódýrasta
```
"Með því að velja [ódýrasti valkostur] í stað [dýrasti valkostur]:
- Sparar þú: X kr á mánuði
- Sparar þú: Y klukkustundir af lífsorku
- Eftir 10 ár: Z kr meira á reikningnum (ef mismunur fjárfestur)"
```

### Sérstök úttak

#### Verðtryggð lán ábending
```
"Athugið: Verðtryggð lán hækka með verðbólgu. Miðað við 3,5% verðbólgu á ári
mun lánið þitt hækka um ~X kr á ári. Þetta er innifalið í útreikningum."
```

#### Vaxtagreiðslur ábending
```
"Yfir 25 ára lánstíma greiðir þú 33.500.000 kr í vexti - það er 45,6% af heildarkostnaði.
Einungis höfuðstóllsgreiðslur eru raunverulegur sparnaður."
```

#### Há lífsorka ábending
```
"⚠️ Húsnæðiskostnaður þinn er yfir 4 vikur af lífsorku á mánuði.
Íhugaðu að minnka húsnæðiskostnað með minni íbúð eða ódýrara hverfi."
```

### Myndrænir þættir

#### Kransarit (Pie chart) - Kostnaðarskipting
Sýnir hlutfall fyrir eignarhúsnæði:
- Lánsgreiðsla (X%)
- Fasteignagjöld (Y%)
- Tryggingar (Z%)
- Viðhald (W%)
- Félagsgjöld (V%)
- Hiti (U%)
- Rafmagn (T%)

#### Súlurit (Bar chart) - Samanburður sviðsmynda
Fyrir hverja sviðsmynd:
- Mánaðarkostnaður (kr)
- Lífsorka (klst)

#### Línurit - Vaxtagreiðslur yfir tíma (fyrir lán)
Sýnir:
- Höfuðstóllsgreiðslur (uppsafnað)
- Vaxtagreiðslur (uppsafnað)
- Heildargreiðslur

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

8. **Fyrir verðtryggð lán**, **skal kerfið** sýna skýra ábendingu um að lánsgreiðslur hækka með verðbólgu.

9. **Fyrir lán með háum vöxtum** (> 40% af heildarkostnaði), **skal kerfið** sýna ábendingu um að íhuga endurfjármögnun.

### Persónuvernd og gagnageymsla

1. **Öll** gögn **skulu** vera geymd í localStorage á tæki notanda.

2. **Engin** gögn **skulu** vera send á netþjón nema notandi velji útflutning.

3. **Kerfið skal** vista húsnæðisgögn í localStorage lykli: `housingImpact_scenarios`

4. **Þegar** notandi flytur út gögn, **skulu** húsnæðisgögn vera innifalin í JSON skránni.

5. **Þegar** notandi flytur inn gögn, **skal kerfið** samþætta húsnæðisgögn með öðrum gögnum.

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

2. **Kerfið skal** sannprófa öll inntak áður en útreikningu er framkvæmd.

3. **Ef** inntak er ógilt, **skal kerfið** sýna rauða ramma og skýr villuskilaboð.

4. **Kerfið skal** meðhöndla jaðartilvik:
   - Division by zero (ef raunverulegt tímakaup = 0)
   - Mjög há lán (>100.000.000 kr)
   - Mjög háir vextir (>15%)
   - Mjög langur lánstími (>40 ár)

5. **Þegar** localStorage gögn eru skemmd, **skal kerfið** nota sjálfgefin gildi og tilkynna notanda.

## Takmarkanir og forsendur

### Takmarkanir

- Öll útreikning verður að gerast á viðskiptavindarhlið (client-side)
- Engin tenging við ytri API fyrir vexti eða fasteignaupplýsingar
- Engin tenging við Þjóðskrá eða fasteignamat
- Byggir á einfölduðum lánaformúlum (ætluð sem áætlun, ekki lögfræðilega nákvæmni)
- Allur texti á íslensku
- Verðtryggð lán eru einfölduð (forfaldspunktalán frekar en fullkomlega nákvæmur verðtryggingarútreikningur)

### Forsendur

- Notandi hefur fyllt út raunverulegt tímakaup í aðalreiknivélinni
- Notandi þekkir mánaðarlega leigu eða lánsupplýsingar
- Notandi þekkir árlegan kostnað fyrir fasteignagjöld, tryggingar, viðhald
- Notandi þekkir mánaðarlegan hita- og rafmagnskostnað
- 7% árleg ávöxtun á fjárfestingum (staðlað í FIRE samfélaginu)
- Íslensk meðaltöl fyrir fasteignakostnað eru raunhæf viðmið
- Verðbólga er stöðug (fyrir verðtryggð lán)

## Árangursviðmið

Reiknivélin telst vel heppnuð þegar:
- ✅ Notandi getur skráð húsnæðisupplýsingar á innan við 3 mínútur
- ✅ Notandi sér skýran mun á "augljósum kostnaði" (leiga/lán) og "heildar kostnaði"
- ✅ Notandi skilur hversu margar klukkustundir af lífsorku húsnæðiskostnaður er
- ✅ Notandi getur borið saman allt að 4 mismunandi valkosti hlið við hlið
- ✅ Notandi sér áhrif vaxta og lánstíma á heildarkostnað
- ✅ Notandi skilur fórnarkostnað húsnæðisvals
- ✅ Allar útreikningar eru nákvæmir og samræmast raunveruleikanum
- ✅ Niðurstöður eru sýndar á skýran og auðskiljanlegan hátt
- ✅ Gögn eru vistuð með localStorage og flytjast með export/import
- ✅ Leiga vs kaupa samanburður er skýr og gagnlegur

## Tengsl

- **Krefst**: Raunverulegt Tímakaups reiknivélar (fyrir actualHourlyWage)
- **Notar**: Sömu UI íhluti og aðalreiknivélin
- **Geymt með**: Aðalgögnum í localStorage
- **Hluti af**: "Áhrif Útgjalda" (Expense Impact) flipanum í Phase 2

## Framtíðarútvíkkun (Utan gildissviðs MVP)

- Tengist við Seðlabanka Íslands API fyrir rauntíma vexti
- Samþætting við Þjóðskrá fyrir fasteignaupplýsingar
- Samþætting við húsnæðislánastofnanir fyrir lánauppstilhingar
- Nákvæmari verðtryggingarútreikningur með rauntíma CPI gögnum
- Lánasímulator með nákvæmari greiðsluáætlun (amortization table)
- Samþætting við fasteignamarkaði fyrir leiguverð/söluverð greiningu
- Downsize simulator - samanburður á minna húsnæði með nákvæmum fasteignaverðum
- Skattalegir ávinningar af eignakaupum (ef við á)
- Samanburður við meðaltal annarra notenda
- Útreikningur á "hversu mikið húsnæði hefur þú efni á" miðað við FI markmið
