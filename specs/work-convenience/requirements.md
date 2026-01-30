# Krofur: Vinnuthreytukostnadur (Work Convenience Tracker)

## Yfirlit

**Eiginleiki**: Vinnuthreytukostnadur (Work Convenience Tracker)
**App**: peninganaedalifid.is
**Forgangsrod**: Fasi 2.1.9 - Kostnadarreiknivelar
**Tengsl**: Notar raunverulegt timakaup ur Raunverulegu Timakaups reiknivelinni

## Vandam alslysing

Vinnuthreyta leidir til "threytuskatts" - utgjalda sem vid myndum ekki gera ef vid vaerum ekki utslitinn af vinnu. Taka-ut mat, leigu bill, tilbuinn matur ur budinni - thessir kostnadir staffa beint af vinnuthreyta og eru oft osjaleganlegir.

Med thvi ad fylgjast med thessum kostnadum og sja mannarlega arnarhrifin (badi a liffrelsi og fjarhagslegu frelsi) geta notendur:
- Sja raunverulegan kostnag vinnuthreyta
- Bera saman vinnudaga og fridaga
- Meta hvort starfi se thess virt midag vid hidden kostnad
- Setja ser markmi d um ad draga ur threytuskattinum

## Notendafrasagnir

### NS-1: Skra threytukostnad fljott
**Sem** notandi sem er threyttur eftir vinnudag,
**vil eg** geta skrad threytukostnad a faum sekund um,
**svo ad** eg geti fylgst med stadmyndinni an thess ad gera thad flokid.

**Samthykktarvidmid (EARS snid)**:

1. **Thegar** notandi smellir a "Skra threytukostnad", **skal kerfid** synja eydublad med:
   - Upphad (kronutala)
   - Flokkur (val ur lista)
   - Dagsetning (sjalgefid i dag)
   - Athugasemd (valfrjals)

2. **Thegar** notandi fylli r ut og vistar, **skal kerfid** baeta kostnadinum vid listann.

3. **Kerfid skal** geyma threytukostnad i localStorage og flytja thann med utflutningi/innflutningi.

4. **Thegar** notandi smellir a "Eyda", **skal kerfid** fjarlafgja kostnadinn ur listanum.

5. **Thegar** notandi breytir gildum, **skal kerfid** uppfaera utreikninga samstundis.

---

### NS-2: Sja arleg ahrif
**Sem** notandi sem vill skilja raunverulegan kostnag,
**vil eg** sja hversu mikid threytukostnadur kostar mig a ari,
**svo ad** eg geti gert upplysaar akvarganir um vinnuna mina.

**Samthykktarvidmid (EARS snid)**:

1. **Thegar** notandi hefur skrad threytukostnad, **skal kerfid** synja:
   - Heildar viku kostnad (sidasta 7 daga)
   - Heildar managar kostnad (sidasta 30 daga)
   - Arshreifad kostnad (managar × 12)

2. **Kerfid skal** reikna medaltal a vinnudag vs fridaga.

3. **Kerfid skal** synja liffsorgu kostnag (klukkustundir) fyrir hvert tima bil.

4. **Ef** raunverulegt timakaup er ekki skilgreint, **skal kerfid** synja skilaboJ um ad fylla fyrst ut timakaups reikniveling.

---

### NS-3: Bera saman vinnudaga og fridaga
**Sem** notandi sem grunar ad vinnuthreyta kosti mikid,
**vil eg** sja mun a threytukostnaJi a vinnudogum vs fridogum,
**svo ad** eg geti sja raunverulegan kostnag vinnunnar.

**Samthykktarvidmid (EARS snid)**:

1. **Kerfid skal** flokka alla kostnaJ i "vinnudagar" og "fridagar".

2. **Thegar** notandi skrar kostnag, **skal kerfid** greina sjalfvirkt hvort dagur er vinnudagur ega frIdagur (Ma-Fo vs La-Su).

3. **Kerfid skal** leyfa notanda ad merkja dag handvirkt sem vinnudag ega fridagar (til ad abod leyfisdaga, orlof, o.s.frv.).

4. **Kerfid skal** synja:
   - Medaltal kostnaur a vinnudag
   - Medaltal kostnaur a fridaga
   - Mismun (baJ i kronum og %)

5. **Kerfid skal** synja arsvihri manarglegaa munsins.

---

### NS-4: Flokka threytukostnad
**Sem** notandi sem vill skilja hvar threytuskatturinn rennur,
**vil eg** sja kostnadh flokka dan eftir tegund,
**sso ad** eg geti greint hvar eg eydi mestu.

**Samthykktarvidmid (EARS snid)**:

1. **Kerfid skal** bjoda upp a eftirfarandi flokka:
   - Heimsending (food delivery)
   - Leigubill (taxi/ride-share)
   - Tilbuinn matur (prepared meals from store)
   - Mathus (restaurants)
   - Kaup i vinnu (impulse purchases)
   - Annat

2. **Kerfid skal** synja samtolu fyrir hvern flokk.

3. **Kerfid skal** rada flokkum eftir kostnaJi (haestur fyrst).

4. **Kerfid skal** synja medaltal kostnaJ a tilfelli fyrir hvern flokk.

---

### NS-5: Setja markmi d og fylgjast med framvindu
**Sem** notandi sem vill draga ur threytuskattinum,
**vil eg** geta sett mer markmid og fylgst med thvi hvort eg nai thvi,
**svo ad** eg geti breytt hegdun minni.

**Samthykktarvidmid (EARS snid)**:

1. **Kerfid skal** leyfa notanda ad setja manarlegt markmi d fyrir threytukostnad.

2. **Thegar** markmid er sett, **skal kerfid** synja framvindu (% af markmidi).

3. **Kerfid skal** synja sparnag (i kronum og liffsorgu) ef markmidi er nad.

4. **Kerfid skal** synja thegar notandi hefur naد markmidi (visual feedback).

5. **Kerfid skal** leyfa notanda ad breyta ega eyda markmidi.

---

### NS-6: Flytival fyrir algengar athafnir
**Sem** notandi sem vill skra kostnag hratt,
**vil eg** geta valild ur lista af algengum threytukostnaJi,
**sso ad** eg thurfi ekki ad sla inn allar upplysingar handvirkt.

**Samthykktarvidmid (EARS snid)**:

1. **Kerfid skal** bjoda upp a lista af algengum islenskum threytukostnaði med forstilltum verdm:
   - Heimsending: Wolt, AHA, o.fl. (medalverd)
   - Leigubill: Hreyfill (stuttar vs langar ferdJir)
   - Tilbuinn matur: 10-11, Bonus tilbuinn matur, o.fl.
   - Mathus: Skyndibitastadur, Casual, o.fl.

2. **Thegar** notandi velur forstillta athogun, **skal kerfid** fylla ut upphad, flokk og lysingu sjalfkrafa.

3. **Kerfid skal** leyfa notanda ad breyta forstilltum gildum adur en vistud er.

---

## Inntaksforskriftir

### ThreytukostnađurInntok
| Reitur | Tegund | Sjalgefid | Stadfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| Upph ad | Kronutala | - | Askilid, > 0 | Kostnadur i ISK |
| Flokkur | Val | 'other' | Askilid | Einn af 6 flokkum |
| Dagsetning | Dagsetning | Idagur | Askilid | ISO dagsetning |
| Athugasemd | Texti | '' | Valfrjals | Stutt lysing |
| ErVinnudagur | Boolean | - | Sjalfvirkt greint | Ma-Fo = true, La-Su = false |

### Flokkar
| Flokkur | Lykill | Lysing | Medalverd (ISK) |
|---------|--------|--------|-----------------|
| Heimsending | delivery | Wolt, AHA, o.s.frv. | 3000-5000 |
| Leigubill | taxi | Hreyfill, Bolt | 2000-4000 |
| Tilbuinn matur | prepared | 10-11, Bonus | 1500-2500 |
| Mathus | restaurant | Skyndibit, casual | 2500-4000 |
| Kaup i vinnu | impulse | Amazon, verslun | 2000-10000 |
| Annat | other | Annat | - |

### Markmi đ
| Reitur | Tegund | Sjalgefid | Stadfesting | Athugasemdir |
|--------|--------|------------|-------------|--------------|
| ManarlegtMarkmi d | Kronutala | - | > 0 | Markmi đ i ISK/man |
| Byrjunardagur | Dagsetning | Idagur | Askilid | Thegar markmi di byrjar |

## Utreikningsformulur

### Heildarkostnadur
```
Heildar vikukostnadur = Summa sidasta 7 daga
Heildar managarkostnadur = Summa sidasta 30 daga
Heildar arskostnadur = Managarkostnadur × 12
```

### Liffsorgu kostnadur
```
Liffsorgu klukkustundir = Kostnadur / Raunverulegt timakaup
```

### Vinnudagar vs Fridagar
```
Medaltal vinnudags = Summa vinnudaga / Fjoldi vinnudaga
Medaltal fridags = Summa fridaga / Fjoldi fridaga
Mismunur = Medaltal vinnudags - Medaltal fridags
Arsahrif munsins = Mismunur × 52 vikur × 5 vinnudagar/viku
```

### Framvinda markmids
```
Framvinda % = (Raunverulegur managarkostnadur / Markmi d) × 100
Sparnadur = Markmi d - Raunverulegur managarkostnadur (ef nad)
```

## Uttaksforskriftir

### Adaluttak
- **Heildar vikukostnadur**: Synt sem kronutala + liffsorgu klukkustundir
- **Heildar managarkostnadur**: Synt sem kronutala + liffsorgu klukkustundir
- **Heildar arskostnadur**: Synt sem kronutala + liffsorgu dagar

### Vinnudagar Samanburđur
- **Medaltal vinnudags**: Kronutala
- **Medaltal fridags**: Kronutala
- **Mismunur**: Kronutala + % + arsahrif
- **Visual samanburđur**: Bar chart ega grarik

### Flokkasundurliđun
- **Samtola eftir flokkum**: Kronutala + % af heildar
- **Fjoldi tilfella**: Per flokkur
- **Medaltal per tilfelli**: Per flokkur

### MarkmiđsFramvinda
- **Framvinda %**: Progress bar
- **Sparnadur**: Kronutala + liffsorgu (ef nad)
- **Arsahrif sparnađar**: Ef markmidi naد

## Krofur sem ekki tengjast virkni

### Afkost
- Utreikningar: < 50ms
- Engar netbeidnir (utreikningar a vidskiptavindar hlid)

### Adgengi
- WCAG 2.1 AA samraemi
- Lyklabords adgengi
- Skjalesari samhaeft

### Personuvernd
- Engin gogn send a netthjon
- Allt geymt i localStorage
- Flytur med adalgognum (export/import)

## Tengsl

- **Krefst**: Raunverulegt Timakaups reiknivelar (fyrir actualHourlyWage)
- **Notar**: Somu UI ihluti og adalreikniveling
- **Geymt med**: Adalgognum i localStorage

## Framtidaru tvikk un (Utan gildissviđs MVP)

- Graf sem synja threytukostnad yfir tima (trend)
- Veđurgreining: "Kostnadur eykst i votviđri" (correlation)
- Tilkynningar: "Thu ert ad fara yfir markmidid thitt"
- Samanburdur vid medaltal annarra notenda (nafnlaust)
- Tengsl vid bankagogn (sjalfvirk greining)
- AI stings: "Thad lýtur út fyrir ad thurstdagar kosti thig mest"
