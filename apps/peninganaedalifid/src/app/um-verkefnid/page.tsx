import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'Hvernig síðan var búin til | Peningana eða lífið',
  description: 'Upplýsingar um hvernig Peningana eða lífið vefsíðan var búin til með gervigreindaraðstoð.',
};

export default function AboutPage() {
  return (
    <div className="bg-neutral-50">
      <Section className="bg-white py-12">
        <Container size="md">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
            Hvernig þessi þjónusta var búin til
          </h1>

          <div className="prose prose-neutral max-w-none space-y-6">
            <p className="text-neutral-700 leading-relaxed text-lg">
              Þessi þjónusta var þróuð með nýstárlegri nálgun sem notar gervigreind til að aðstoða
              við hugbúnaðarþróun, með því að nýta sér nútímaverkfæri eins og Claude Code og Cursor
              til að stjórna öllu þróunarferlinu. Þessi síða lýsir ferlinu og aðferðafræði sem
              notuð var við að búa til Peningana eða lífið.
            </p>

            <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4">
              Hugbúnaðarþróun með gervigreind
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Allt þróunarferlið var stjórnað með verkfærum sem notuð eru með gervigreind sem vinna
              ásamt mannlegum forriturum til að flýta fyrir þróun, tryggja gæði kóða og viðhalda
              samræmi í gegnum allt verkefnið.
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">
              Aðal þróunarverkfæri:
            </h3>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2">
              <li><strong>Claude Code:</strong> Háþróuð gervigreindaraðstoð fyrir kóðaforritun, skipulagningu og prófanir</li>
              <li><strong>Cursor:</strong> Gervigreindarstýrt IDE sem veitir yfirsýn yfir kóða og forritunarþróun</li>
            </ul>

            <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4">
              Þróunarferli
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Þróunin fylgdi skipulagri nálgun, með notkun gervigreindarverkfæra á hverju stigi:
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">
              1. Áætlun og arkitektúr
            </h3>
            <p className="text-neutral-700 leading-relaxed">
              Sérhæfðir erindrekar (agents) greindu kröfur og buðu upp á útgáfur af uppbyggingu sem passar
              fyrir lausnina.
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">
              2. Kóðaframkvæmd
            </h3>
            <p className="text-neutral-700 leading-relaxed">
              Kóði var skrifaður í samvinnu erindreka (agents), sem veitti tillögur í rauntíma,
              bjó til grunnkóða og hjálpaði við að innleiða flókna eiginleika eins og fjármálareiknivélar,
              gagnageymslu í vafra og íslenska staðfærslu.
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">
              3. Endurtekin betrun
            </h3>
            <p className="text-neutral-700 leading-relaxed">
              Í gegnum þróunina hjálpuðu gervigreindarverkfæri við að endurskipuleggja kóða, hagræða
              afkastagetu og bæta kóðagæði. Verkfærin fundu hugsanleg vandamál snemma og buðu upp á
              umbætur byggðar á bestu starfsvenjum.
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">
              4. Prófun og gæðaeftirlit
            </h3>
            <p className="text-neutral-700 leading-relaxed">
              Gervigreindaraðstoð var notuð til að búa til POC, bera kennsl á jaðartilvik og tryggja
              að prófanir séu framkvæmdar. Verkfærin hjálpuðu við að viðhalda prófunargæðum og samhengi
              fyrir allan kóðagrunninn.
            </p>

            <h3 className="text-xl font-semibold text-neutral-800 mt-6 mb-3">
              5. Persónuvernd og öryggi
            </h3>
            <p className="text-neutral-700 leading-relaxed">
              Persónuvernd var samþætt í gegnum allt þróunarferlið. Gervigreindarverkfæri hjálpuðu við
              að innleiða staðbundna gagnageymslu (localStorage) sem tryggir að öll fjárhagsgögn notenda
              haldist á þeirra eigin tækjum og séu aldrei send á netþjóna.
            </p>

            <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4">
              Útgáfustjórnun og samvinna
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Git var notað í gegnum allt þróunarferlið, með gervigreindarverkfærum sem hjálpuðu við
              að skrifa commit skilaboð, leggja til greinastrategíur (branch policy) og viðhalda
              hreinni commit sögu. Allar breytingar voru yfirfarnar af forriturum.
            </p>

            <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4">
              Samfelld samþætting og útfærsla
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Verkefnið notar CI/CD ferla sem voru settar upp með gervigreindaraðstoð. Sjálfvirk
              prófun, linting og útfærsluferli tryggja kóðagæði. Gervigreindarverkfærin hjálpuðu
              við að stilla GitHub Actions verkflæði.
            </p>

            <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4">
              Útfærsla og innviðir
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Þjónustan er útfærð með nútíma skýja innviðum. Gervigreindarverkfæri aðstoðuðu við
              velja hentuga rekstarleið, byggða á rektrarsniðmátum frá Peritus. Allt útfærsluferlið
              var sjálfvirkt og skjalfest.
            </p>

            <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4">
              Kostir hugbúnaðarþróunar með gervigreind
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Þessi nálgun við þróun býður upp á marga kosti:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2">
              <li><strong>Hærri kóðagæði:</strong> Samræmt mynstur, bestu starfsvenjur við kóðaskrif og umfangsmikil villumeðhöndlun</li>
              <li><strong>Betri samhengi:</strong> Gervigreindarverkfæri hjálpa við að viðhalda kóðatengingum og arkitektúrmynstrum um allan kóðagrunninn</li>
              <li><strong>Bætt nám:</strong> Forritarar geta lært af gervigreindartillögum og bætt færni sína</li>
              <li><strong>Bætt samvinna:</strong> Gervigreindarverkfæri starfa sem samfelldur þróunaraðili, tiltækur 24/7</li>
            </ul>

            <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4">
              Niðurstaða
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Þessi þjónusta sýnir kraft gervigreindaraðstoðar við hugbúnaðarþróun þegar hún er
              sameinuð mannlegri sérfræðiþekkingu. Með því að nýta verkfæri eins og Claude Code
              og Cursor í gegnum allt þróunarferlið—frá áætlun til útfærslu—gátum við byggt trausta,
              skalanlega lausn á skilvirkan hátt.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Gervigreindarverkfærin skiptu ekki út mannlegum forriturum heldur bættu getu þeirra,
              sem gerði okkur kleift að einbeita sér að því að leysa flókin vandamál á meðan
              gervigreindin sá um einfaldari verkefni.
            </p>

            <h2 className="text-2xl font-semibold text-neutral-900 mt-10 mb-4">
              Hafa samband
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Ef þú hefur spurningar um þróunarferlið eða vilt vita meira um hugbúnaðarþróun með
              gervigreind, hafðu samband:
            </p>

            <div className="mt-8 p-6 bg-neutral-100 rounded-lg">
              <p className="text-neutral-700">
                <a href="mailto:info@peritus.is" className="text-primary-600 hover:underline font-medium text-lg">
                  info@peritus.is
                </a>
              </p>
              <p className="text-neutral-600 text-sm mt-4">
                <strong>Peritus slf.</strong><br />
                Reykjavík, Ísland<br />
                <a href="https://peritus.is" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  peritus.is
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
