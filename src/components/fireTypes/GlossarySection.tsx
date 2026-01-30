'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface GlossarySectionProps {
  className?: string;
}

interface GlossaryTerm {
  term: string;
  termEn: string;
  definition: string;
  relatedTerms?: string[];
}

/**
 * GlossarySection - Alphabetical glossary of FIRE terms in Icelandic
 *
 * Features:
 * - Alphabetically sorted FIRE terminology
 * - Icelandic terms with English translations
 * - Clear, jargon-free definitions
 * - Related terms cross-references
 * - Collapsible for space efficiency
 * - Search/filter capability
 *
 * Requirements: Epic 8, Task 8.2
 */
export function GlossarySection({ className }: GlossarySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const glossaryTerms: GlossaryTerm[] = [
    {
      term: '4% reglan',
      termEn: '4% Rule',
      definition:
        'Hefðbundin úttektarregla sem segir að þú getir tekið út 4% af FI-tölu þinni á fyrsta ári eftir starfslok og síðan hækkað þá upphæð með verðbólgu á hverju ári. Byggir á Trinity-rannsókninni. Á Íslandi er oft mælt með 3.5% vegna meiri verðbólguáhættu.',
      relatedTerms: ['Trinity-rannsóknin', 'Úttektarhlutfall', 'SWR'],
    },
    {
      term: 'BaristaFIRE',
      termEn: 'Barista FIRE',
      definition:
        'Tegund af FIRE þar sem þú ert hluta fjárhagslega sjálfstæður. Þú vinnur létt hlutastarf (eins og kaffibarþjónn) til að dekka hluta útgjalda á meðan fjárfestingar þínar dekka restina. Krefjast minni sparnaðar en full FIRE en þú ert ekki alveg hættur að vinna.',
      relatedTerms: ['CoastFIRE', 'FIRE', 'Hlutastarf'],
    },
    {
      term: 'CoastFIRE',
      termEn: 'Coast FIRE',
      definition:
        'Þegar þú hefur sparað nóg snemma í lífinu þannig að fjárfestingarnar þínar geta vaxið að fullri FI-tölu án þess að þú bætir við meiru. Þú "coastar" fram að eftirlaunum með vinnu sem dekkar bara núverandi útgjöld, ekki sparnað. Kraftur samsettra vaxta gerir afganginn.',
      relatedTerms: ['Samsettar vextir', 'FIRE', 'FI-tala'],
    },
    {
      term: 'FatFIRE',
      termEn: 'Fat FIRE',
      definition:
        'FIRE með háum lífsstíl og miklum útgjöldum. Þú ert fjárhagslega sjálfstæður án þess að þurfa að draga úr lífsgæðum - ferðalög, veitingahús, áhugamál, allt án takmarkana. Krefst mjög hárra tekna og mikillar FI-tölu.',
      relatedTerms: ['LeanFIRE', 'FIRE', 'Lúxus'],
    },
    {
      term: 'FI-tala',
      termEn: 'FI Number',
      definition:
        'Upphæðin sem þú þarft að hafa sparað til að vera fjárhagslega sjálfstæður. Reiknað sem árlegar útgjöld margfaldað með 25-30 (á Íslandi venjulega 30). Þegar þú nærð þessari tölu getur þú lifað af fjárfestingunum þínum endalaust án þess að vinna.',
      relatedTerms: ['FIRE', 'Úttektarhlutfall', '4% reglan'],
    },
    {
      term: 'FIRE',
      termEn: 'Financial Independence, Retire Early',
      definition:
        'Fjárhagslegt sjálfstæði, snemmbúnar starfslok. Hreyfing og hugmyndafræði sem snýst um að spara og fjárfesta mikið til að ná fjárhagslegri óhæði og geta hætt að vinna árum eða áratugum fyrir hefðbundinn eftirlaunaaldur.',
      relatedTerms: ['FI-tala', 'Sparnaðarhlutfall', 'Fjármálafrelsi'],
    },
    {
      term: 'Fjármálafrelsi',
      termEn: 'Financial Independence',
      definition:
        'Staðan þegar fjárhagslegar eignir þínar gefa nægar tekjur til að dekka öll útgjöld þín endalaust. Þú þarft ekki lengur að vinna fyrir peninga - þú getur valið að vinna bara ef þú vilt. Grunnhugtak í FIRE.',
      relatedTerms: ['FIRE', 'FI-tala', 'Óvirkar tekjur'],
    },
    {
      term: 'Hrein eign',
      termEn: 'Net Worth',
      definition:
        'Heildarverðmæti allra eigna þinna (sparnaður, fjárfestingar, fasteignir, o.fl.) að frádregnum skuldum. Mikilvæg mælikvarði á framvindu í átt að FIRE. Margir fylgjast með þróun hreinnar eignar mánaðarlega eða ársfjórðungslega.',
      relatedTerms: ['Eignir', 'Skuldir', 'FI-tala'],
    },
    {
      term: 'LeanFIRE',
      termEn: 'Lean FIRE',
      definition:
        'FIRE með mjög lágum útgjöldum og einföldum lífsstíl. Þú lifir á lágmarkskostnaði til að ná FIRE fyrr með minni sparnaði. Hentar fólki sem metur frjálsan tíma umfram efnislega hluti og er tilbúið að lifa sparlega.',
      relatedTerms: ['FatFIRE', 'FIRE', 'Sparsamur lífsstíl'],
    },
    {
      term: 'Lífsstílsverðbólga',
      termEn: 'Lifestyle Inflation',
      definition:
        'Þegar útgjöld þín hækka sjálfkrafa þegar tekjur þínar hækka. Þú byrjar að kaupa dýrari hluti, borða oft úti, ferðast meira, o.s.frv. Stærsta hindrunin fyrir FIRE - að halda útgjöldum lágum þegar laun hækka er lykillinn að háu sparnaðarhlutfalli.',
      relatedTerms: ['Sparnaðarhlutfall', 'Útgjöld'],
    },
    {
      term: 'Óvirkar tekjur',
      termEn: 'Passive Income',
      definition:
        'Tekjur sem koma inn án þess að þú þurfir að vinna virkan vinnu fyrir þær. Dæmi: arður úr hlutabréfum, leigutekjur, vextir af sparnaði. Markmið FIRE er að óvirkar tekjur dekki öll útgjöld þín.',
      relatedTerms: ['Fjármálafrelsi', 'FI-tala', 'Arður'],
    },
    {
      term: 'Samsettar vextir',
      termEn: 'Compound Interest',
      definition:
        'Vextir af vöxtum - þegar ávöxtun fjárfestinga þinna er endurfjárfest og byrjar sjálf að skila ávöxtun. Eitt öflugasta verkfærið í FIRE. Með tímanum vex portfolíó þitt veldishraða vegna samsetningar. "Áttunda undur heimsins" að sögn Einstein.',
      relatedTerms: ['Ávöxtun', 'Vöxtur', 'CoastFIRE'],
    },
    {
      term: 'Sequence of Returns Risk',
      termEn: 'Sequence of Returns Risk',
      definition:
        'Hættan á því að markaðurinn hrynji í upphafi eftirlaunaáranna þinna. Þó að meðalávöxtun sé söm, getur röðun ávöxtunar skipt miklu máli. Markaðshrun í byrjun getur eyðilagt portfolíó þitt þó svo markaðurinn jafni sig síðar. Þess vegna er oft mælt með 3.5% frekar en 4% úttekt.',
      relatedTerms: ['Markaðsáhætta', 'Úttektarhlutfall', '4% reglan'],
    },
    {
      term: 'Sparnaðarhlutfall',
      termEn: 'Savings Rate',
      definition:
        'Hlutfall af tekjum þínum (eftir skatta) sem þú sparar og fjárfestir. Einn mikilvægasti þátturinn í FIRE - hærra sparnaðarhlutfall þýðir að þú nærð FIRE hraðar. 50%+ sparnaðarhlutfall er algengt í FIRE samfélaginu. Reiknað sem: (Sparnaður / Tekjur eftir skatta) × 100%.',
      relatedTerms: ['FIRE', 'Tekjur', 'Útgjöld'],
    },
    {
      term: 'SWR',
      termEn: 'Safe Withdrawal Rate',
      definition:
        'Öruggt úttektarhlutfall - hæsta hlutfall sem þú getur tekið út árlega úr portfolíó þínu án þess að eiga á hættu að verða uppiskroppa með peninga. Byggir á sögulegum gögnum. Fyrir FIRE er þetta venjulega 3.5-4% á ári á Íslandi (lægra en í Bandaríkjunum vegna meiri verðbólgu).',
      relatedTerms: ['4% reglan', 'Úttektarhlutfall', 'Trinity-rannsóknin'],
    },
    {
      term: 'Trinity-rannsóknin',
      termEn: 'Trinity Study',
      definition:
        'Mikilvæg rannsókn frá 1998 sem rannsakaði öruggar úttektarhlutfall fyrir eftirlaunasjóði. Sýndi að 4% úttekt með verðbólguleiðréttingu hefur 95%+ árangurshlutfall yfir 30 ára tímabil. Grunnurinn að 4% reglunni. Birtur af Trinity University prófessorum.',
      relatedTerms: ['4% reglan', 'SWR', 'Úttektarhlutfall'],
    },
    {
      term: 'Úttektarhlutfall',
      termEn: 'Withdrawal Rate',
      definition:
        'Hlutfall af heildar FI-tölu sem þú tekur út á hverju ári til að lifa á eftir að ná FIRE. Venjulega 3.5-4% á Íslandi. Lægra úttektarhlutfall þýðir öruggari en krefst hærri FI-tölu. Hærra úttektarhlutfall er áhættusamara en þýðir lægri FI-tölu.',
      relatedTerms: ['4% reglan', 'SWR', 'FI-tala'],
    },
    {
      term: 'Vísitölusjóður',
      termEn: 'Index Fund',
      definition:
        'Fjárfestingarsjóður sem fylgir markaðsvísitölu (t.d. S&P 500). Lág gjöld, breið fjölbreytni, óvirk stjórnun. Mjög vinsælt í FIRE samfélaginu vegna lágra gjalda og áreiðanlegrar langtímaávöxtunar. Dæmi á Íslandi: Landsbréf Global Stock Market í Birtu.',
      relatedTerms: ['Fjárfesting', 'Gjöld', 'Fjölbreytni'],
    },
  ];

  // Sort alphabetically by Icelandic term
  const sortedTerms = [...glossaryTerms].sort((a, b) =>
    a.term.localeCompare(b.term, 'is')
  );

  // Filter based on search
  const filteredTerms = sortedTerms.filter(
    (item) =>
      searchTerm === '' ||
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className={cn('overflow-hidden', className)} title="Orðalisti - FIRE hugtök">
      {/* Header with toggle */}
      <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={isExpanded}
          aria-controls="glossary-content"
        >
          <div>
            <h3 className="text-xl font-bold text-primary-900">
              📚 Orðalisti FIRE hugtaka
            </h3>
            <p className="text-sm text-primary-700 mt-1">
              {glossaryTerms.length} hugtök í stafrófsröð
            </p>
          </div>
          <svg
            className={cn(
              'w-6 h-6 text-primary-600 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div id="glossary-content" className="p-6">
          {/* Search box */}
          <div className="mb-6">
            <label htmlFor="glossary-search" className="sr-only">
              Leita í orðalista
            </label>
            <div className="relative">
              <input
                id="glossary-search"
                type="text"
                placeholder="Leita að hugtaki..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchTerm && (
              <p className="text-sm text-neutral-600 mt-2">
                {filteredTerms.length} af {glossaryTerms.length} hugtökum
              </p>
            )}
          </div>

          {/* Glossary terms */}
          <div className="space-y-6">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((item, index) => (
                <div
                  key={index}
                  id={`term-${item.termEn.toLowerCase().replace(/\s+/g, '-')}`}
                  className="scroll-mt-6"
                >
                  <dt className="mb-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-lg text-primary-900">
                        {item.term}
                      </span>
                      <span className="text-sm text-neutral-700 italic">
                        ({item.termEn})
                      </span>
                    </div>
                  </dt>
                  <dd className="ml-0">
                    <p className="text-neutral-700 leading-relaxed mb-2">
                      {item.definition}
                    </p>
                    {item.relatedTerms && item.relatedTerms.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-neutral-600 font-medium">
                          Tengd hugtök:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.relatedTerms.map((related, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded"
                            >
                              {related}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </dd>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-700">
                  Engin hugtök fundust sem passa við leitina &quot;{searchTerm}&quot;
                </p>
              </div>
            )}
          </div>

          {/* Helper text */}
          {!searchTerm && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>💡 Ábending:</strong> Þú getur notað leitargluggann hér að ofan
                til að finna ákveðið hugtak fljótt. Leitin leitar í bæði íslensku og
                ensku hugtökum og skilgreiningum.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
