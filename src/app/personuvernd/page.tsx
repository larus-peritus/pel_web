import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'Persónuverndarstefna | Peningana eða lífið',
  description: 'Persónuverndarstefna fyrir Peningana eða lífið reiknivélarnar.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-neutral-50">
      <Section className="bg-white py-12">
        <Container size="md">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
            Persónuverndarstefna
          </h1>

          <div className="prose prose-neutral max-w-none space-y-6">
            <p className="text-neutral-700 leading-relaxed">
              Hjá Peritus slf. tökum við persónuvernd mjög alvarlega. Þessi stefna útskýrir hvernig
              við meðhöndlum upplýsingar á Peningana eða lífið vefsíðunni.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              1. Gagnasöfnun
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              <strong>Við söfnum engum persónuupplýsingum.</strong> Allar upplýsingar sem þú slærð
              inn í reiknivélarnar okkar eru geymdar eingöngu í vafranum þínum (localStorage) og
              eru aldrei sendar á netþjóna okkar.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              2. Staðbundin gagnageymsla
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Fjárhagsupplýsingar þínar eru geymdar í localStorage vafrans þíns. Þetta þýðir:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2">
              <li>Gögnin yfirgefa aldrei tækið þitt</li>
              <li>Við höfum engan aðgang að upplýsingunum þínum</li>
              <li>Þú getur eytt gögnunum hvenær sem er með því að hreinsa vafragögn</li>
              <li>Gögnin eru aðeins aðgengileg á því tæki og vafra þar sem þú slóst þau inn</li>
            </ul>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              3. Vefkökur (Cookies)
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Við notum aðeins nauðsynlegar vefkökur sem eru nauðsynlegar til að vefsíðan virki rétt.
              Við notum engar rakningarvefkökur eða auglýsingavefkökur. Allar auglýsingar og borðar
              á síðunni eru handvirkt settir inn og hafa enga rakningu virka.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              4. Greiningartól
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Við notum Vercel Analytics til að safna almennum upplýsingum um heimsóknir á síðuna,
              svo sem fjölda heimsókna og hvaða síður eru skoðaðar. Þetta hjálpar okkur að skilja
              hvernig síðan er notuð og hvar við getum bætt hana.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Vercel Analytics safnar <strong>ekki</strong> persónuupplýsingum og notar ekki
              hefðbundnar rakningarvefkökur. Gögnin eru samanlögð og nafnlaus - við sjáum ekki
              upplýsingar um einstaka notendur eða hegðun þeirra.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              5. Auglýsingar
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Á síðunni geta birst auglýsingaborðar. Þessar auglýsingar eru:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2">
              <li>Handvirkt settar inn af okkur - ekki hluti af stærra auglýsinganeti</li>
              <li>Án rakningar - engin vefköku eða rakningartækni frá auglýsendum</li>
              <li>Án persónumiðunar - auglýsingarnar eru þær sömu fyrir alla notendur</li>
              <li>Valdar af okkur - við veljum auglýsendur sem við teljum gagnlega fyrir notendur okkar</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-4">
              Við notum ekki auglýsinganet eins og Google Ads eða sambærilegar þjónustur sem
              rekja notendur á milli vefsíðna.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              6. Fréttabréf
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Ef þú skráir þig á fréttabréfið okkar söfnum við netfanginu þínu. Þetta er eina
              persónuupplýsingin sem við söfnum og hún er notuð eingöngu til að senda þér fréttabréfið.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Við notum <strong>Buttondown</strong> til að senda fréttabréfið. Buttondown geymir netfangið þitt
              á öruggan hátt og uppfyllir alþjóðlegar persónuverndarreglur (GDPR). Þú getur lesið{' '}
              <a
                href="https://buttondown.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                persónuverndarstefnu Buttondown
              </a>{' '}
              fyrir frekari upplýsingar.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Þú getur afskráð þig af fréttabréfinu hvenær sem er með því að smella á afskráningartengil
              neðst í hverju fréttabréfi. Við eyðum netfanginu þínu úr listanum um leið og þú afskráir þig.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              7. Þriðju aðilar
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Við deilum engum upplýsingum með þriðju aðilum að undanskildu netfangi áskrifenda fréttabréfs
              sem er geymt hjá Buttondown (sjá kafla 6). Auglýsendur á síðunni fá engar upplýsingar um notendur frá okkur.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              8. Öryggi
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Þar sem öll gögn eru geymd staðbundið í vafranum þínum, þá er öryggi þeirra háð
              öryggi tækisins þíns og vafrans. Við mælum með að nota öruggan vafra og halda
              tækinu þínu uppfærðu.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              9. Réttindi þín
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Þú hefur fulla stjórn á öllum gögnum í localStorage vafrans þíns. Ef þú ert skráður
              á fréttabréfið geturðu afskráð þig hvenær sem er og við eyðum þá netfanginu þínu.
              Þú getur einnig haft samband við okkur til að óska eftir eyðingu netfangsins.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              10. Breytingar á stefnu
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Ef við breytum þessari persónuverndarstefnu munum við uppfæra þessa síðu.
              Mikilvægar breytingar verða tilkynntar á forsíðu.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              11. Samskipti
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Ef þú hefur spurningar um persónuvernd, vinsamlegast hafðu samband við okkur
              á <a href="mailto:info@peritus.is" className="text-primary-600 hover:underline">info@peritus.is</a>.
            </p>

            <p className="text-neutral-500 text-sm mt-12">
              Síðast uppfært: {new Date().toLocaleDateString('is-IS', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
