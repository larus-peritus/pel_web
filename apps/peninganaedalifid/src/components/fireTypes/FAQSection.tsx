'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface FAQSectionProps {
  className?: string;
}

interface FAQItem {
  question: string;
  answer: string;
  relatedLinks?: Array<{ text: string; url: string }>;
  category?: 'basics' | 'types' | 'iceland' | 'strategy' | 'concerns';
}

/**
 * FAQSection - Frequently Asked Questions about FIRE in Icelandic
 *
 * Features:
 * - 10+ common FIRE questions in Icelandic
 * - Expandable accordion format for easy navigation
 * - Related links where appropriate
 * - Categorized questions for organization
 * - Search/filter capability
 * - Clear, accessible, beginner-friendly answers
 *
 * Requirements: Epic 8, Task 8.3
 */
export function FAQSection({ className }: FAQSectionProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const faqItems: FAQItem[] = [
    {
      question: 'Hvað er FIRE hreyfingin?',
      answer:
        'FIRE stendur fyrir "Financial Independence, Retire Early" eða á íslensku "Fjárhagslegt sjálfstæði, snemmbúin starfslok". Þetta er hreyfing fólks sem sparar og fjárfestir mikið hlutfall af tekjum sínum (oft 50-70%) til að ná fjárhagslegu sjálfstæði og geta hætt að vinna árum eða áratugum fyrir hefðbundinn eftirlaunaaldur. Markmiðið er að eiga nægjanlega fjármuni til að lifa á ávöxtun fjárfestinganna endalaust án þess að vinna.',
      category: 'basics',
      relatedLinks: [
        { text: 'r/FIREyFI (Íslenskt FIRE samfélag)', url: 'https://www.reddit.com/r/FIREyFI/' },
      ],
    },
    {
      question: 'Hvaða FIRE tegund hentar mér best?',
      answer:
        'Það fer eftir tekjum þínum, útgjöldum, aldri og gildum. LeanFIRE hentar ef þú ert tilbúinn að lifa sparlega og vilt ná FIRE fljótt. RegularFIRE er fyrir flesta - þægilegur lífsstíl með raunhæfu markmið. CoastFIRE hentar ungum sparendum sem vilja sveigjanleika. BaristaFIRE er fyrir þá sem vilja vinna minna en ekki hætta alveg. FatFIRE er fyrir hátekjufólk sem vill ekki gefa eftir lífsstíl. Notaðu reiknivélar okkar til að sjá hvað hentar þér!',
      category: 'types',
    },
    {
      question: 'Hvað er munurinn á LeanFIRE og FatFIRE?',
      answer:
        'LeanFIRE byggir á mjög lágum útgjöldum (t.d. 250-350 þús kr/mán) til að ná FIRE fljótt með minni sparnaði. Þú lifir sparlega en ert fljótur í markinu. FatFIRE er andstæðan - há útgjöld (1+ milljón kr/mán) sem krefst mikillar FI-tölu (300M+) og langrar sparnaðartíma. FatFIRE er fyrir hátekjufólk sem vill halda lúxus lífsstíl. Munurinn er í raun lífsstíl vs. tími - spara í lífsgæðum núna eða vinna lengur.',
      category: 'types',
    },
    {
      question: 'Er 4% reglan örugg á Íslandi?',
      answer:
        '4% reglan er byggð á bandarískum gögnum og markaði. Á Íslandi mælum við oft með lægri úttektarhlutfall, um 3.5%, vegna nokkurra ástæðna: (1) Meiri verðbólga á Íslandi söguleg séð, (2) Minni og sveiflukenndari hlutabréfamarkaður, (3) Hærri skattlagning á fjárfestingar, (4) Minni sögulegt gögn. Til að vera öruggur skaltu nota 30x margfaldara (3.33%) eða 33x (3%) í stað 25x (4%). Þetta þýðir hærri FI-tölu en öruggari eftirlaunastefnu.',
      category: 'iceland',
      relatedLinks: [
        { text: 'Trinity Study', url: 'https://www.aaii.com/journal/199802/feature.pdf' },
      ],
    },
    {
      question: 'Hvernig reikna ég FI-töluna mína?',
      answer:
        'FI-talan þín er einfaldlega árlegar útgjöld þín margfaldað með 25-30 (við mælum með 30 á Íslandi). Dæmi: Ef þú eyðir 500.000 kr á mánuði eru árleg útgjöld 6.000.000 kr. FI-tala = 6.000.000 × 30 = 180.000.000 kr. Þegar þú átt 180M í fjárfestingum getur þú tekið út 3.33% (6M) árlega endalaust. Notaðu FI-tölu reiknivélina okkar til að reikna nákvæmlega fyrir þína aðstæður!',
      category: 'basics',
    },
    {
      question: 'Hvað er CoastFIRE og hvernig virkar það?',
      answer:
        'CoastFIRE þýðir að spara nóg snemma í lífinu þannig að fjárfestingarnar þínar vaxa sjálfkrafa að fullri FI-tölu fram til eftirlaunaaldurs (67 ára). Þú "coastar" með vinnu sem dekkar bara núverandi útgjöld - enginn sparnaður nauðsynlegur. Dæmi: 30 ára með 30M sparaðar. Við 6% ávöxtun verða þær 156M við 67 ára (RegularFIRE markmið). Þú getur tekið léttara starf strax, unnið við það sem þér finnst skemmtilegt, og látið tímann og samsettu vextina gera restina.',
      category: 'types',
      relatedLinks: [
        { text: 'Coast FIRE reiknivél', url: 'https://www.coastfire.com/' },
      ],
    },
    {
      question: 'Get ég náð FIRE með lágar tekjur?',
      answer:
        'Já, en það er erfiðara og tekur lengri tíma. Lykillinn er að hækka tekjur og/eða lækka útgjöld markvisst. Aðferðir: (1) Hækka tekjur - aukatekjur, þróa færni, skipta um starf, (2) LeanFIRE markmið - lágmarksútgjöld þýðir lægri FI-tölu, (3) Flytja úr Reykjavík til að lækka húsnæðiskostnað, (4) Samnýting - búa með öðrum til að deila kostnaði, (5) CoastFIRE - spara snemma meðan ungur og búa heima. Það er hægt en krefst meira skipulag og fórna en hjá hátekjufólki.',
      category: 'concerns',
    },
    {
      question: 'Hversu mikið ætti ég að spara?',
      answer:
        'Sparnaðarhlutfall þitt er einn mikilvægasti þátturinn í hversu fljótt þú nærð FIRE. Alþjóðlegt meðaltal í FIRE samfélaginu er 40-60% af tekjum eftir skatta. Á Íslandi með háum sköttum og lífskostnaði er 30-50% raunhæfara fyrir flesta. Hærra = hraðari FIRE. Dæmi: Með 50% sparnaðarhlutfall getur þú náð FIRE á ~17 árum. Með 30% tekur það ~28 ár. Byrjaðu á því sem er raunhæft (jafnvel 15-20%) og auktu smám saman.',
      category: 'strategy',
    },
    {
      question: 'Hvenær er ég tilbúinn til að hætta að vinna?',
      answer:
        'Þú ert tilbúinn þegar: (1) FI-talan þín er náð (30x árleg útgjöld), (2) Þú hefur 6-12 mánaða neyðarsjóð til viðbótar, (3) Þú hefur áætlun um hvað þú vilt gera eftir vinnu, (4) Þú hefur hugsað um heilsufarsávinning og lífeyri (ef viðeigandi), (5) Þú hefur prófað útgjaldastig þitt í nokkra mánuði til að staðfesta, (6) Þú ert sátt með áhættu (markaðsáhætta, verðbólga). Margir gera "eitt ár í viðbót" til öryggis. Það er persónulegt ákvörðun!',
      category: 'strategy',
    },
    {
      question: 'Hvað gerist ef markaðurinn hrynur?',
      answer:
        'Þetta er mikilvægasta spurningin! Markaðshrun í upphafi eftirlaunaára getur verið hættulegt (sequence of returns risk). Lausnir: (1) Nota 3.5% eða lægri úttekt, (2) Hafa 2-3 ára útgjöld í reiðufé/skuldabréfum, (3) Vera sveigjanlegur - draga úr útgjöldum í niðursveiflu, (4) Hafa fleiri ár "púða" - miða við 33x í stað 30x, (5) Íhuga BaristaFIRE - létt hlutavinna getur hjálpað í lægð. Þess vegna er FI-tala margfaldari hærri á Íslandi (30x vs 25x í USA).',
      category: 'concerns',
      relatedLinks: [
        { text: 'Um sequence risk', url: 'https://www.investopedia.com/terms/s/sequence-risk.asp' },
      ],
    },
    {
      question: 'Hvernig fjárfesti ég á Íslandi fyrir FIRE?',
      answer:
        'Fyrir FIRE á Íslandi mælum við með: (1) Lífeyrissjóður - nýttu lífeyrissparnað að fullu (frítekjumark, séreignarsparnaður), (2) Vísitölusjóðir - lággjaldi alþjóðlegir hlutabréfasjóðir í Birtu/Stefni (t.d. Landsbréf Global Stock Market), (3) ISK vs. erlend gjaldmiðill - dreifa áhættu, (4) Skattahagræðing - nýta frítekjumarkið, (5) Forðast hátt gjöld - forðast virka sjóði með >1% gjöldum. Byrjaðu einfalt, fjölbreytt, lággjaldi.',
      category: 'iceland',
    },
    {
      question: 'Hvað með lífeyrissjóðinn minn?',
      answer:
        'Lífeyrissjóður er stór hluti af FIRE á Íslandi! Þú greiðir 4% (launþegi) + 11.5% (vinnuveitandi) = 15.5% af launum í lífeyrissjóð. Þetta er hluti af FIRE áætluninni þinni. Þú getur: (1) Reiknað með lífeyri frá 67 ára og lækka FI-tölu þína fyrir það tímabil, (2) Notað frítekjumark til að taka lífeyri snemma til að fylla bil, (3) Nýtt séreignarsparnað (4% viðbót) til að auka sparnað, (4) Íhuga CoastFIRE þar sem lífeyrir getur verið stór hluti af "coast" stefnu. Ekki gleyma honum!',
      category: 'iceland',
    },
    {
      question: 'Er FIRE bara fyrir ríka?',
      answer:
        'Nei! FIRE er fyrir alla sem hafa vilja og aga til að spara. FIRE snýst ekki um að vera "ríkur" heldur um að nýta peninga skynsamlega til að kaupa frjálsan tíma. Margir FIRE forkólfar voru meðaltekjufólk (kennarar, hjúkrunarfræðingar, verkfræðingar) sem sýndu aga í sparnaði. Það sem skiptir máli er sparnaðarhlutfall, ekki heildarfjárhæð. Jafnvel með meðaltekjur getur þú náð FIRE á 15-25 árum með 30-50% sparnaði. LeanFIRE og CoastFIRE eru sérstaklega raunhæf fyrir lágar/meðaltekjur.',
      category: 'concerns',
    },
    {
      question: 'Hvað ef ég vil eignast börn?',
      answer:
        'Börn auka útgjöld og því hækkar FI-talan þín, en FIRE með börnum er algjörlega hægt. Ábendingar: (1) Reiknaðu raunhæf barnakostnaður inn í FI-tölu (fæðingarorlof, dagvistun, fötnaður, mat), (2) Mundu að kostnaður minnkar eftir að börn flytja að heiman (~18 ára) - þú getur minnkað útgjöld þá, (3) Íhugaðu RegularFIRE eða FatFIRE í stað LeanFIRE til að hafa meira pláss, (4) Nýttu íslensk velferðarkerfi (fæðingarorlof, barnabætur, dagvistarstuðning), (5) Fjölskylda getur deilt kostnaði (bíll, húsnæði). Margir ná FIRE með börnum!',
      category: 'concerns',
    },
  ];

  // Filter FAQ items based on search
  const filteredFAQs = faqItems.filter(
    (item) =>
      searchTerm === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Category labels
  const categoryLabels: Record<string, string> = {
    basics: 'Grunnatriði',
    types: 'FIRE tegundir',
    iceland: 'FIRE á Íslandi',
    strategy: 'Stefnumótun',
    concerns: 'Algengar áhyggjur',
  };

  return (
    <Card className={cn('overflow-hidden', className)} title="Algengar spurningar">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
        <h3 className="text-xl font-bold text-green-900">
          ❓ Algengar spurningar um FIRE
        </h3>
        <p className="text-sm text-green-700 mt-1">
          Svör við {faqItems.length} algengum spurningum um FIRE á Íslandi
        </p>
      </div>

      <div className="p-6">
        {/* Search box */}
        <div className="mb-6">
          <label htmlFor="faq-search" className="sr-only">
            Leita í spurningum
          </label>
          <div className="relative">
            <input
              id="faq-search"
              type="text"
              placeholder="Leita í spurningum og svörum..."
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
              {filteredFAQs.length} af {faqItems.length} spurningum
            </p>
          )}
        </div>

        {/* FAQ items */}
        <div className="space-y-2">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => {
              const isExpanded = expandedQuestions.has(index);
              return (
                <div
                  key={index}
                  className={cn(
                    'border rounded-lg transition-all duration-200',
                    isExpanded
                      ? 'border-green-300 shadow-sm bg-green-50'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleQuestion(index)}
                    className="w-full px-4 py-3 flex items-start justify-between text-left hover:bg-neutral-50 rounded-lg transition-colors"
                    aria-expanded={isExpanded}
                    aria-controls={`faq-${index}`}
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="font-semibold text-neutral-900">
                        {item.question}
                      </h4>
                      {item.category && !isExpanded && (
                        <span className="inline-block mt-1 text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          {categoryLabels[item.category]}
                        </span>
                      )}
                    </div>
                    <svg
                      className={cn(
                        'w-5 h-5 text-neutral-700 transition-transform duration-200 flex-shrink-0',
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

                  {isExpanded && (
                    <div
                      id={`faq-${index}`}
                      className="px-4 pb-4 pt-2"
                      role="region"
                      aria-label={item.question}
                    >
                      <p className="text-neutral-700 leading-relaxed mb-3">
                        {item.answer}
                      </p>
                      {item.relatedLinks && item.relatedLinks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-200">
                          <p className="text-sm font-medium text-neutral-600 mb-2">
                            Tengdir hlekkir:
                          </p>
                          <div className="space-y-1">
                            {item.relatedLinks.map((link, linkIndex) => (
                              <a
                                key={linkIndex}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                              >
                                {link.text}
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-700">
                Engar spurningar fundust sem passa við leitina &quot;{searchTerm}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Helper text */}
        {!searchTerm && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>💡 Ábending:</strong> Ef þú finnur ekki svar við spurningunni þinni
              hér, skaltu kíkja á{' '}
              <a
                href="https://www.reddit.com/r/FIREyFI/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-700"
              >
                r/FIREyFI
              </a>{' '}
              eða{' '}
              <a
                href="https://www.reddit.com/r/financialindependence/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-700"
              >
                r/financialindependence
              </a>{' '}
              fyrir fleiri upplýsingar.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
