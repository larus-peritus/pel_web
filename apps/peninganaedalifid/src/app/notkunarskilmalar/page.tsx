import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'Notkunarskilmálar | Peningana eða lífið',
  description: 'Notkunarskilmálar fyrir Peningana eða lífið reiknivélarnar.',
};

export default function TermsPage() {
  return (
    <div className="bg-neutral-50">
      <Section className="bg-white py-12">
        <Container size="md">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
            Notkunarskilmálar
          </h1>

          <div className="prose prose-neutral max-w-none space-y-6">
            <p className="text-neutral-700 leading-relaxed">
              Velkomin á Peningana eða lífið. Með því að nota þessa vefsíðu samþykkir þú eftirfarandi skilmála.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              1. Almenn notkun
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Þessi vefsíða býður upp á fjármálareiknivélar og fræðsluefni um fjárhagslegt frelsi.
              Allar upplýsingar eru veittar eingöngu í fræðsluskyni og eru ekki fjármálaráðgjöf.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              2. Engin fjármálaráðgjöf
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Útreikningar og upplýsingar á þessari síðu eru eingöngu til fræðslu og almennrar
              leiðbeiningar. Þetta er ekki fjármálaráðgjöf, skattaráðgjöf eða fjárfestingarráðgjöf.
              Leitaðu alltaf til viðurkennds sérfræðings áður en þú tekur mikilvægar fjárhagslegar ákvarðanir.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              3. Nákvæmni upplýsinga
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Við reynum að tryggja að allar upplýsingar séu réttar og uppfærðar, en getum ekki
              ábyrgst nákvæmni allra útreikinga eða upplýsinga. Notendur bera ábyrgð á að staðfesta
              upplýsingar hjá viðeigandi aðilum.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              4. Persónuvernd
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Öll gögn sem þú slærð inn í reiknivélarnar eru geymdar staðbundið í vafranum þínum.
              Við söfnum ekki persónuupplýsingum og sendum engin gögn á netþjóna okkar.
              Sjá <a href="/personuvernd" className="text-primary-600 hover:underline">persónuverndarstefnu</a> okkar
              fyrir frekari upplýsingar.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              5. Takmarkanir á ábyrgð
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Peritus slf. ber ekki ábyrgð á neinu tjóni sem kann að hljótast af notkun þessarar
              vefsíðu eða trausti á upplýsingum sem hér er að finna. Notkun er alfarið á eigin ábyrgð.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              6. Auglýsingar
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Á síðunni kunna að birtast auglýsingaborðar. Þessir borðar eru handvirkt settir inn
              af okkur og eru ekki hluti af stærra auglýsinganeti. Við notum ekki auglýsinganet
              eins og Google Ads eða sambærilegar þjónustur.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Auglýsingarnar hafa enga rakningu og safna engum upplýsingum um notendur. Við berum
              ekki ábyrgð á efni eða þjónustu auglýsenda, þó að við reynum að velja auglýsendur
              sem við teljum gagnlega og áreiðanlega.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              7. Breytingar á skilmálum
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Við áskiljum okkur rétt til að breyta þessum skilmálum hvenær sem er. Breytingar
              taka gildi um leið og þær eru birtar á síðunni.
            </p>

            <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
              8. Samskipti
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Ef þú hefur spurningar um þessa skilmála, vinsamlegast hafðu samband við okkur
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
