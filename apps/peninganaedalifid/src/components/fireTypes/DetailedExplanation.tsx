'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { cn, formatCurrency } from '@/lib/utils';
import { getFIRETypeDefinition, getFIRETypeColors } from '@/lib/constants/fireTypes';
import type { FIRETypeId } from '@/types/fireTypes';

export interface DetailedExplanationProps {
  fireTypeId: FIRETypeId;
}

/**
 * DetailedExplanation - Comprehensive educational content for a specific FIRE type
 *
 * Features:
 * - Full FIRE type description in Icelandic
 * - How it works (mechanics of achieving this FIRE type)
 * - When to choose this type (bestFor/notFor)
 * - Real-world Icelandic examples from constants
 * - Common pitfalls and mistakes
 * - External resources with links
 * - Collapsible sections for readability
 * - Color-coded by FIRE type
 *
 * Requirements: Epic 8, Task 8.1
 */
export function DetailedExplanation({ fireTypeId }: DetailedExplanationProps) {
  const fireType = getFIRETypeDefinition(fireTypeId);
  const colors = getFIRETypeColors(fireTypeId);

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['description', 'howItWorks'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const isSectionExpanded = (section: string) => expandedSections.has(section);

  // Helper to render collapsible section
  const CollapsibleSection = ({
    id,
    title,
    children,
    defaultExpanded = false,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = isSectionExpanded(id);

    return (
      <div className="border-b border-neutral-200 last:border-b-0">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
          aria-expanded={isExpanded}
          aria-controls={`section-${id}`}
        >
          <h4 className="font-semibold text-neutral-900">{title}</h4>
          <svg
            className={cn(
              'w-5 h-5 text-neutral-700 transition-transform duration-200',
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
            id={`section-${id}`}
            className="px-4 pb-4"
            role="region"
            aria-label={title}
          >
            {children}
          </div>
        )}
      </div>
    );
  };

  // Get common pitfalls based on FIRE type
  const getPitfalls = (id: FIRETypeId): string[] => {
    const pitfalls: Record<FIRETypeId, string[]> = {
      leanfire: [
        'Vanmat á framtíðarþörfum - það sem virkar í dag virkar kannski ekki eftir 20 ár',
        'Félagsleg einangrun vegna takmarkaðra fjármuna fyrir skemmtanir',
        'Að gleyma að taka tillit til óvæntra útgjalda eins og heilsugæslu',
        'Of lítill sparnaðarpúði getur leitt til þess að þurfa að fara aftur að vinna',
        'Erfitt að viðhalda mjög lágum útgjöldum til lengdar',
      ],
      regularfire: [
        'Of bjartsýnislegar áætlanir um markaðsávöxtun',
        'Að gleyma verðbólgu, sérstaklega á Íslandi',
        'Vanmat á útgjöldum í eftirlaunum (heilsa, ferðalög, áhugamál)',
        'Að líta framhjá sköttum og gjöldum',
        'Sequence of returns risk - markaðshrun í upphafi eftirlaunaársins',
      ],
      coastfire: [
        'Vanmat á tíma sem það tekur að ná coast point',
        'Of bjartsýnislegar áætlanir um framtíðarávöxtun',
        'Að gera ráð fyrir of lágum útgjöldum í coasting árum',
        'Markaðshrun skömmu eftir að ná coast point',
        'Erfiðleikar við að finna starf sem dekkar aðeins útgjöld',
      ],
      baristafire: [
        'Vanmat á erfiðleikum við að finna rétt hlutastarf',
        'Yfirmat á tekjum úr hlutastarfi',
        'Að gera ekki ráð fyrir því að hlutastarfstekjur halda ekki í við verðbólgu',
        'Að vanrækja heilsufarsávinning og lífeyri frá fullri vinnu',
        'Erfiðleikar við að viðhalda vinnuskipulagi í hlutastarfi',
      ],
      fatfire: [
        'Lifestyle creep - útgjöld hækka með tekjum',
        'Yfirmat á framtíðartekjum',
        'Að halda of dýrum lífsstíl of lengi',
        'Vanmat á því hversu mikið þarf að spara',
        'Að gleyma sköttum á háum tekjum',
      ],
    };
    return pitfalls[id];
  };

  // Get external resources based on FIRE type
  const getResources = (id: FIRETypeId): Array<{ title: string; url: string; description: string }> => {
    // Common resources for all types
    const commonResources = [
      {
        title: 'r/FIREyFI (Íslenskur FIRE hópur á Reddit)',
        url: 'https://www.reddit.com/r/FIREyFI/',
        description: 'Íslenskt FIRE samfélag með umræðum og ráðgjöf',
      },
      {
        title: 'Mr. Money Mustache',
        url: 'https://www.mrmoneymustache.com/',
        description: 'Frumkvöðull FIRE hreyfingarinnar með praktískum ráðum',
      },
    ];

    const specificResources: Record<FIRETypeId, Array<{ title: string; url: string; description: string }>> = {
      leanfire: [
        {
          title: 'r/leanfire',
          url: 'https://www.reddit.com/r/leanfire/',
          description: 'Samfélag um LeanFIRE með raunverulegum dæmum',
        },
        {
          title: 'Early Retirement Extreme',
          url: 'http://earlyretirementextreme.com/',
          description: 'Um mjög lágan lífsstíl og snemmbúnar starfslok',
        },
      ],
      regularfire: [
        {
          title: 'r/financialindependence',
          url: 'https://www.reddit.com/r/financialindependence/',
          description: 'Stærsta FIRE samfélagið með ítarlegum gögnum',
        },
        {
          title: 'The Trinity Study',
          url: 'https://www.aaii.com/journal/199802/feature.pdf',
          description: 'Rannsóknin sem styður 4% regluna',
        },
      ],
      coastfire: [
        {
          title: 'Coast FIRE Calculator',
          url: 'https://www.coastfire.com/',
          description: 'Reiknivél til að áætla Coast FIRE punkt',
        },
        {
          title: 'The Power of Compound Interest',
          url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
          description: 'Um kraft samsettra vaxta',
        },
      ],
      baristafire: [
        {
          title: 'r/baristafire',
          url: 'https://www.reddit.com/r/baristafire/',
          description: 'Samfélag um BaristaFIRE með raunverulegum sögum',
        },
        {
          title: 'Semi-Retirement Guide',
          url: 'https://www.madfientist.com/retire-even-earlier/',
          description: 'Leiðbeiningar um hluta-FIRE',
        },
      ],
      fatfire: [
        {
          title: 'r/fatFIRE',
          url: 'https://www.reddit.com/r/fatFIRE/',
          description: 'Samfélag um FatFIRE fyrir hátekjufólk',
        },
        {
          title: 'Financial Samurai',
          url: 'https://www.financialsamurai.com/',
          description: 'Ráðgjöf um auðsöfnun og FatFIRE',
        },
      ],
    };

    return [...commonResources, ...specificResources[id]];
  };

  // Get "how it works" explanation based on FIRE type
  const getHowItWorks = (id: FIRETypeId): string[] => {
    const explanations: Record<FIRETypeId, string[]> = {
      leanfire: [
        '1. Reiknaðu út lágmarks útgjöld þín í mánuði (bara nauðsynlegt)',
        '2. Margfaldaðu með 12 til að fá árlegar útgjöld',
        '3. Margfaldaðu með 25-30 til að fá FI-töluna þína',
        '4. Sparaðu eins hátt hlutfall og mögulegt er (oft 50-70%)',
        '5. Fjárfestu í lággjaldi vísitölusjóðum',
        '6. Haltu lífsstílnum lágum til að ná markinu fljótt',
        '7. Þegar þú nærð markinu geturðu hætt að vinna',
        '8. Taktu út 3.5-4% á ári til að lifa á',
      ],
      regularfire: [
        '1. Reiknaðu út þægileg útgjöld þín í mánuði',
        '2. Margfaldaðu með 12 til að fá árlegar útgjöld',
        '3. Margfaldaðu með 25-30 til að fá FI-töluna þína (venjulega 30x á Íslandi)',
        '4. Sparaðu 20-50% af tekjum þínum',
        '5. Fjárfestu í fjölbreyttu safni (hlutabréf, skuldabréf)',
        '6. Haltu stöðugum sparnaði í 15-25 ár',
        '7. Þegar þú nærð markinu geturðu hætt að vinna',
        '8. Taktu út 3.5-4% á ári með tryggum úttektaráætlun',
      ],
      coastfire: [
        '1. Reiknaðu út FI-tölu þína fyrir eftirlaunaaldur (67 ára á Íslandi)',
        '2. Ákvarðaðu hversu langan tíma þú hefur til eftirlaunaaldurs',
        '3. Reiknaðu út hvað þarfnast í dag til að vaxa í FI-tölu (present value)',
        '4. Sparaðu hart fyrstu árin til að ná "coast point"',
        '5. Þegar þú nærð coast point getur þú hætt að spara',
        '6. Vinnur bara til að dekka núverandi útgjöld (ekki spara)',
        '7. Fjárfestingarnar vaxa sjálfkrafa með samsettum vexti',
        '8. Við eftirlaunaaldur ert þú kominn með fulla FI-tölu',
      ],
      baristafire: [
        '1. Reiknaðu út þægileg útgjöld þín í mánuði',
        '2. Ákveðið hversu stórt hlutfall þú vilt dekka með hlutavinnu (t.d. 40%)',
        '3. Reiknaðu FI-tölu fyrir afganginn (t.d. 60% af fullri FI-tölu)',
        '4. Sparaðu til að ná þessari lægri FI-tölu',
        '5. Þegar þú nærð markinu getur þú minnkað við vinnu',
        '6. Finndu hlutastarf sem dekkar hluta útgjalda (20-40% starfshlutfall)',
        '7. Portfolíó þitt gefur restina af tekjunum',
        '8. Þú ert fjárhagslega sjálfstæður með stuðningi frá léttri vinnu',
      ],
      fatfire: [
        '1. Reiknaðu út hámarkslífsstíl þinn í mánuði (engar takmarkanir)',
        '2. Margfaldaðu með 12 til að fá árlegar útgjöld',
        '3. Margfaldaðu með 30-33 til að fá FI-töluna þína (hærri margfaldari)',
        '4. Krefst mjög hárra tekna (oft 1M+ kr/mán eftir skatt)',
        '5. Sparaðu hátt hlutfall þrátt fyrir háan lífsstíl (30-50%)',
        '6. Fjárfestu í fjölbreyttu safni með skattalegri hagræðingu',
        '7. Haltu sparnaði stöðugum í 20-30 ár',
        '8. Við FIRE geturðu haldið háum lífsstílnum með 3-3.5% úttekt',
      ],
    };
    return explanations[id];
  };

  const pitfalls = getPitfalls(fireTypeId);
  const resources = getResources(fireTypeId);
  const howItWorks = getHowItWorks(fireTypeId);

  return (
    <Card
      className={cn('overflow-hidden', colors.border, 'border-2')}
      title={`${fireType.icon} ${fireType.nameIs} - Ítarlegar upplýsingar`}
    >
      {/* Header with icon and name */}
      <div className={cn('px-6 py-4', colors.bg, 'border-b', colors.border)}>
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden="true">
            {fireType.icon}
          </span>
          <div>
            <h3 className={cn('text-2xl font-bold', colors.text)}>
              {fireType.nameIs}
            </h3>
            <p className="text-sm text-neutral-600 mt-1">{fireType.tagline}</p>
          </div>
        </div>
      </div>

      {/* Collapsible sections */}
      <div className="divide-y divide-neutral-200">
        {/* Description */}
        <CollapsibleSection id="description" title="Hvað er þetta?" defaultExpanded>
          <p className="text-neutral-700 leading-relaxed">{fireType.description}</p>
        </CollapsibleSection>

        {/* How it works */}
        <CollapsibleSection id="howItWorks" title="Hvernig virkar þetta?" defaultExpanded>
          <ol className="space-y-2 text-neutral-700">
            {howItWorks.map((step, index) => (
              <li key={index} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </CollapsibleSection>

        {/* When to choose - Best for */}
        <CollapsibleSection id="bestFor" title="Hvenær á að velja þetta?">
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <span className="text-green-600">✓</span> Best fyrir:
              </h5>
              <ul className="space-y-1 text-neutral-700 ml-6">
                {fireType.bestFor.map((item, index) => (
                  <li key={index} className="leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-red-600">✗</span> Ekki fyrir:
              </h5>
              <ul className="space-y-1 text-neutral-700 ml-6">
                {fireType.notFor.map((item, index) => (
                  <li key={index} className="leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* Real-world examples */}
        <CollapsibleSection id="examples" title="Raunveruleg dæmi frá Íslandi">
          <div className="space-y-4">
            {fireType.examples.map((example, index) => (
              <div key={index} className={cn('p-4 rounded-lg', colors.bg)}>
                <h5 className="font-semibold text-neutral-900 mb-2">
                  {example.title}
                </h5>
                <p className="text-neutral-700 text-sm mb-3 leading-relaxed">
                  {example.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Mánaðarútgjöld:</span>
                    <span className="font-semibold text-neutral-900 ml-2">
                      {formatCurrency(example.monthlyExpenses)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">FI-tala:</span>
                    <span className="font-semibold text-neutral-900 ml-2">
                      {formatCurrency(example.fiNumber)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Common pitfalls */}
        <CollapsibleSection id="pitfalls" title="Algengar villur og hindranir">
          <div className={cn('p-4 rounded-lg bg-amber-50 border border-amber-200')}>
            <p className="text-sm text-amber-900 mb-3 font-medium">
              ⚠️ Athugaðu þetta vel áður en þú byrjar:
            </p>
            <ul className="space-y-2 text-neutral-700 text-sm">
              {pitfalls.map((pitfall, index) => (
                <li key={index} className="leading-relaxed pl-4 relative">
                  <span className="absolute left-0 text-amber-600">•</span>
                  {pitfall}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleSection>

        {/* External resources */}
        <CollapsibleSection id="resources" title="Frekari upplýsingar og úrræði">
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h5 className="font-semibold text-primary-700 mb-1">
                      {resource.title}
                    </h5>
                    <p className="text-sm text-neutral-600">{resource.description}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-neutral-700 flex-shrink-0 mt-1"
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
                </div>
              </a>
            ))}
          </div>
        </CollapsibleSection>

        {/* Pros and Cons summary */}
        <CollapsibleSection id="proscons" title="Kostir og gallar í hnotskurn">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <span className="text-green-600">👍</span> Kostir
              </h5>
              <ul className="space-y-1 text-sm text-neutral-700">
                {fireType.pros.map((pro, index) => (
                  <li key={index} className="leading-relaxed pl-4 relative">
                    <span className="absolute left-0 text-green-600">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-red-600">👎</span> Gallar
              </h5>
              <ul className="space-y-1 text-sm text-neutral-700">
                {fireType.cons.map((con, index) => (
                  <li key={index} className="leading-relaxed pl-4 relative">
                    <span className="absolute left-0 text-red-600">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </Card>
  );
}
