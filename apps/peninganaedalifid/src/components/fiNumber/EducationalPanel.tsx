'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

/**
 * EducationalPanel Component Props
 */
export interface EducationalPanelProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * CollapsibleSection Component
 *
 * Internal component for individual collapsible educational sections.
 */
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-4 text-left hover:bg-neutral-50 transition-colors px-1"
        aria-expanded={isExpanded}
      >
        <span className="text-base font-semibold text-neutral-900">
          {title}
        </span>
        <svg
          className={cn(
            'w-5 h-5 text-neutral-700 transition-transform duration-200 flex-shrink-0 ml-2',
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
        <div className="pb-4 px-1 text-sm text-neutral-700 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * EducationalPanel Component
 *
 * Provides comprehensive educational content about FI (Financial Independence) concepts,
 * withdrawal rates, and Icelandic-specific considerations.
 *
 * Features:
 * - Four collapsible sections covering key FI concepts
 * - Icelandic context and recommendations
 * - Links to external resources
 * - Expandable/collapsible design for better UX
 * - All text in Icelandic
 *
 * Sections:
 * 1. What is FI Number? (Hvað er FI-tala?)
 * 2. What is Withdrawal Rate? (Hvað er úttektarhlutfall?)
 * 3. Why Iceland needs conservative rates (Af hverju þarf íhaldssamara hlutfall á Íslandi?)
 * 4. FAQ (Algengar spurningar)
 *
 * @example
 * ```tsx
 * <EducationalPanel />
 * ```
 */
export const EducationalPanel: React.FC<EducationalPanelProps> = ({
  className,
}) => {
  return (
    <Card variant="outlined" className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h2 className="text-xl font-bold text-neutral-900">
            Fræðsluefni um FI
          </h2>
        </div>
        <p className="text-sm text-neutral-600 mt-2">
          Lærðu um fjárhagslegt frelsi og hvernig það á við í íslensku samhengi
        </p>
      </CardHeader>

      <CardContent className="divide-y divide-neutral-200">
        {/* Section 1: What is FI Number? */}
        <CollapsibleSection
          title="Hvað er FI-tala?"
          defaultExpanded={true}
        >
          <p>
            <strong>FI-talan</strong> (Financial Independence Number) er sú fjárhæð sem þú þarft
            að eiga til að lifa á ávöxtun fjármuna þinna án þess að þurfa að vinna.
          </p>
          <p>
            Formúlan er einföld:
          </p>
          <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-3 font-mono text-sm">
            FI-tala = Árleg útgjöld × Margfaldari
          </div>
          <p>
            <strong>Dæmi:</strong> Ef þú þarft 500.000 kr á mánuði til að lifa (6.000.000 kr á ári)
            og notar 30x margfaldara, þá er FI-talan þín:
          </p>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
            6.000.000 kr × 30 = <strong className="text-primary-700">180.000.000 kr</strong>
          </div>
          <p>
            Þegar þú átt 180 milljónir í fjárfestingum geturðu tekið út 3,33% árlega
            (6 milljónir) og búist við að fjármunirnir endist alla ævi.
          </p>
        </CollapsibleSection>

        {/* Section 2: What is Withdrawal Rate? */}
        <CollapsibleSection title="Hvað er úttektarhlutfall?">
          <p>
            <strong>Úttektarhlutfallið</strong> er sá hundraðshluti af heildareignum þínum
            sem þú tekur út árlega til að lifa á.
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-neutral-900 min-w-[60px]">4,0%:</span>
              <span>25x margfaldari - Klassísk "4% regla" frá Trinity rannsókninni.
              Hefur virkað í Bandaríkjunum en getur verið áhættusamt á Íslandi.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-primary-700 min-w-[60px]">3,33%:</span>
              <span>30x margfaldari - <strong>Mælt með fyrir Ísland</strong>.
              Veitir meiri öryggi gegn verðbólgu og markaðssveiflum.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-neutral-900 min-w-[60px]">3,0%:</span>
              <span>33x margfaldari - Mjög íhaldssamt. Hentar vel fyrir snemma
              starfslok eða áhættufælna fjárfesta.</span>
            </div>
          </div>
          <p className="mt-3">
            <strong>Mikilvægt:</strong> Lægra úttektarhlutfall = stærri FI-tala = meira öryggi.
          </p>
        </CollapsibleSection>

        {/* Section 3: Why Iceland needs conservative rates */}
        <CollapsibleSection title="Af hverju þarf íhaldssamara hlutfall á Íslandi?">
          <p>
            Ísland er ekki Bandaríkin, og það eru nokkrar mikilvægar ástæður fyrir því
            að nota íhaldssamara úttektarhlutfall hér:
          </p>

          <div className="space-y-3 mt-2">
            <div>
              <h4 className="font-semibold text-neutral-900 mb-1">
                1. Hærri verðbólga
              </h4>
              <p>
                Ísland hefur átt við hærri verðbólgu að etja en stórir markaðir.
                Meðalverðbólga á Íslandi hefur verið 3-4% á meðan hún er 2-3%
                í Bandaríkjunum. Þetta þýðir að kaupmáttur þinn rýrnar hraðar.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-1">
                2. Gjaldeyrisáhætta
              </h4>
              <p>
                Íslenska krónan er lítill gjaldmiðill sem getur sveiflast mikið.
                Ef þú fjárfestir erlendis þá tekur þú gjaldeyrisáhættu, og ef
                þú fjárfestir innanlands þá eru takmarkaðir kostir.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-1">
                3. Minni markaður
              </h4>
              <p>
                Íslenskur hlutabréfamarkaður er lítill með fáum fyrirtækjum,
                sem gefur minni dreifingu og meiri áhættu. Erlendir markaðir
                fela í sér gjaldeyrisáhættu (sjá að ofan).
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-1">
                4. Lífeyrissjóðskerfið
              </h4>
              <p>
                Góðu fréttirnar: Íslenskir lífeyrissjóðir eru mjög sterkir og
                geta dregið úr FI-tölunni þinni verulega. Hafðu lífeyri þinn
                með í útreikningnum!
              </p>
            </div>
          </div>

          <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mt-3">
            <p className="text-sm">
              <strong className="text-warning-800">Okkar ráðlegging:</strong>
              <span className="text-warning-700"> Notaðu 30x eða 33x margfaldara
              fyrir Ísland. Þetta gefur þér öryggi gegn verðbólgu og óvissu í
              framtíðinni.</span>
            </p>
          </div>
        </CollapsibleSection>

        {/* Section 4: FAQ */}
        <CollapsibleSection title="Algengar spurningar">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-neutral-900 mb-1">
                Þarf ég að ná FI-tölunni áður en ég get hætt að vinna?
              </h4>
              <p>
                Nei! Margir velja að vinna hlutastörf eða sveigjanlega vinnu eftir
                að hafa náð hluta af FI-tölunni (t.d. 50% = "Lean FI").
                FI-talan er markmiðið fyrir <em>fullt</em> fjárhagslegt frelsi.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-1">
                Hvað ef ég vil fara á eftirlaun fyrir 67 ára aldur?
              </h4>
              <p>
                Þú þarft "brúarupphæð" til að ná frá starfslokum til 67 ára þegar
                lífeyrir byrjar. Notaðu lífeyrisreiknivélina okkar til að reikna þetta.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-1">
                Get ég notað 25x margfaldarann ef ég er tilbúinn að taka áhættuna?
              </h4>
              <p>
                Já, en vertu meðvitaður um áhættuna. Ef verðbólga eða markaðsniðursveifla
                kemur á fyrstu árunum geta fjármunirnir þínir klárast. Íhugaðu að minnsta
                kosti að byrja með 30x og lækka í 25x seinna meir ef markaðurinn gengur vel.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-1">
                Hvar get ég lært meira?
              </h4>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>
                  <a
                    href="https://www.mrmoneymustache.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Mr. Money Mustache
                  </a>
                  {' - Frumkvöðull í FIRE (Financial Independence, Retire Early) hreyfingunni'}
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/financialindependence/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    r/financialindependence
                  </a>
                  {' - Stærsta FIRE samfélagið á netinu'}
                </li>
                <li>
                  <a
                    href="https://www.bogleheads.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Bogleheads
                  </a>
                  {' - Fjárfestingarvit og langtímaáætlanir'}
                </li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>
      </CardContent>
    </Card>
  );
};
