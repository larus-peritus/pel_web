/**
 * EducationalIntro Component for Barista FIRE
 *
 * Comprehensive educational introduction to Barista FIRE with collapsible sections.
 * Explains what Barista FIRE is, provides visual examples, benefits, misconceptions,
 * and links to related calculators.
 *
 * Features:
 * - Clear explanation of Barista FIRE concept
 * - Visual example with realistic Icelandic numbers
 * - Benefits of Barista FIRE approach
 * - Common misconceptions addressed
 * - Collapsible sections for different topics
 * - Links to related calculators
 * - Dismissible with localStorage persistence
 * - All content in Icelandic
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export interface EducationalIntroProps {
  /** Callback when user dismisses the intro */
  onDismiss?: () => void;
  /** Whether the intro is collapsed */
  collapsed?: boolean;
  /** Callback when user toggles collapsed state */
  onToggle?: () => void;
  /** Optional className for styling */
  className?: string;
}

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export function EducationalIntro({
  onDismiss,
  collapsed = false,
  onToggle,
  className,
}: EducationalIntroProps) {
  // Track which sections are expanded (all expanded by default when intro is open)
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(['what-is', 'example', 'benefits', 'misconceptions', 'related'])
  );

  /**
   * Toggle section expansion
   */
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  /**
   * Expand all sections
   */
  const expandAll = () => {
    setExpandedSections(
      new Set(['what-is', 'example', 'benefits', 'misconceptions', 'related'])
    );
  };

  /**
   * Collapse all sections
   */
  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Define educational sections
  const sections: Section[] = [
    {
      id: 'what-is',
      title: 'Hvað er Kaffiþjóna FIRE (Barista FIRE)?',
      icon: '☕',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <p>
            <strong>Barista FIRE</strong> (eða "Kaffiþjóna FIRE" á íslensku) er aðferð þar sem þú
            vinnur hlutastarf til að standa undir daglegum útgjöldum, á meðan fjárfestingar þínar
            vaxa að fullu FI (Financial Independence) án þess að þú þurfir að snerta þær.
          </p>
          <p>
            Nafnið kemur frá hugmyndinni um að vinna sem kaffiþjónn (barista) — þ.e. léttar, álagslitlar
            tekjur sem dekka grunnþarfir á meðan sparnaður vinnur fyrir þig í bakgrunni.
          </p>
          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">Lykilhugtak:</p>
            <p className="text-amber-800">
              Þú þarft ekki að safna allri FI-tölunni áður en þú dregur úr vinnu. Ef þú getur dekkað
              útgjöld með hlutastarfi, þá geta fjárfestingarnar þínar vaxið ósnertar að FI-markmiðinu.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'example',
      title: 'Raunverulegt dæmi',
      icon: '📊',
      content: (
        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 p-5 border border-amber-200">
            <p className="font-semibold text-amber-900 mb-3 text-base">Dæmi: Jón, 40 ára</p>

            <div className="space-y-2 text-amber-800">
              <div className="flex justify-between">
                <span>Núverandi aldur:</span>
                <strong>40 ára</strong>
              </div>
              <div className="flex justify-between">
                <span>Núverandi sparnaður:</span>
                <strong>{formatCurrency(25_000_000)}</strong>
              </div>
              <div className="flex justify-between">
                <span>FI-tala (markmið):</span>
                <strong>{formatCurrency(100_000_000)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Mánaðarleg útgjöld:</span>
                <strong>{formatCurrency(400_000)}</strong>
              </div>
              <div className="h-px bg-amber-300 my-2" />
              <div className="flex justify-between">
                <span>Hlutastarf (brúttó):</span>
                <strong>{formatCurrency(450_000)}/mán</strong>
              </div>
              <div className="flex justify-between">
                <span>Nettó eftir skatt:</span>
                <strong>~{formatCurrency(350_000)}/mán</strong>
              </div>
              <div className="flex justify-between">
                <span>Vænt ávöxtun:</span>
                <strong>6% á ári (raunávöxtun)</strong>
              </div>
              <div className="h-px bg-amber-300 my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Ár að fullu FI:</span>
                <strong className="text-lg text-green-700">~24 ár</strong>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <p className="text-green-900 font-semibold text-sm">
                ✓ Jón getur byrjað Kaffiþjóna FIRE núna!
              </p>
              <p className="text-green-800 text-xs mt-1">
                Hlutastarfið dekkar útgjöld, og 25 milljónir vaxa í 100+ milljónir á 24 árum með
                vaxtavöxtum. Hann fær strax meira frjálsan tíma án þess að draga úr framtíðinni.
              </p>
            </div>
          </div>

          <div className="text-xs text-neutral-600 italic">
            <strong>Athugaðu:</strong> Þetta er einföldun. Raunveruleg ávöxtun sveiflast og skattar
            geta breyst. Lífeyrissjóðsframlög af hlutastarfi bætast einnig við sparnað.
          </div>
        </div>
      ),
    },
    {
      id: 'benefits',
      title: 'Ávinningur Kaffiþjóna FIRE',
      icon: '✨',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Meira frelsi núna:</strong> Þú þarft ekki að
                bíða í áratugi eftir að njóta frítíma. Hlutastarf gefur þér strax meiri tíma fyrir
                fjölskyldu, áhugamál eða ferðalög.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Minni streita:</strong> Þú getur valið léttara
                starf sem þú hefur gaman af, án þess að hafa áhyggjur af háum launum.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Lífeyrissjóðsframlög halda áfram:</strong> Á
                Íslandi bætast ~16% af launum við lífeyrissparnað, sem eykur heildarsparnaðinn.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Vaxtavextir vinna fyrir þig:</strong> Núverandi
                sparnaður vex án þess að þú þurfir að bæta við hann.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Sveigjanleiki:</strong> Þú getur valið hversu
                mikið þú vinnur — 50%, 60%, 80% — eftir þörfum og óskum.
              </div>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'misconceptions',
      title: 'Algeng misskilningur',
      icon: '⚠️',
      content: (
        <div className="space-y-4 text-sm">
          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 1: "Ég þarf að ná fullri FI fyrst"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Nei! Kaffiþjóna FIRE snýst einmitt um að byrja fyrr með
              lægri sparnað, þar sem hlutastarf dekkar útgjöld og sparnaður vex að FI-tölunni.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 2: "Þetta virkar bara fyrir kaffiþjóna"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Nafnið er táknrænt. Þetta getur verið hvaða hlutastarf
              sem er — kennsla, ráðgjöf, smásölu, þjónustu, fjarvinna, o.s.frv.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 3: "Ég mun aldrei ná fullri FI"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Ef sparnaður þinn er nógu mikill og tíminn nógu langur,
              mun hann vaxa að FI-tölunni. Þú nærð fullu FI — bara seinna en ef þú sparar hratt.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 4: "Þetta er bara fyrir fólk með lágar tekjur"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Kaffiþjóna FIRE hentar öllum sem vilja meira frelsi núna.
              Hátekju launafólk getur notað þetta til að skipta í eitthvað sem þau njóta meira.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 5: "Ég þarf að taka út sparnað minn"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Í hefðbundnu Kaffiþjóna FIRE er sparnaður ósnertur.
              Hlutastarf dekkar útgjöld. Þú getur þó valið að blanda ef þú vilt.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'related',
      title: 'Tengdir reiknivélar',
      icon: '🔗',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-neutral-700">
            Þessir reiknivélar hjálpa þér að átta þig á heildarfjármálastöðu þinni:
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="/utgjaldareiknivel"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📋</span>
                <h4 className="font-semibold text-neutral-900">Útgjaldagrunnur</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Reiknaðu mánaðarleg útgjöld þín og FI-tölu út frá lífsstíl.
              </p>
            </a>

            <a
              href="/fi-tala"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <h4 className="font-semibold text-neutral-900">FI-tala Reiknivél</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Reiknaðu hversu mikið þú þarft til að lifa á fjárfestingum.
              </p>
            </a>

            <a
              href="/"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⏰</span>
                <h4 className="font-semibold text-neutral-900">Raunveruleg laun</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Sjáðu hversu mikið þú færð í raun greitt fyrir vinnustund.
              </p>
            </a>

            <a
              href="/ro-fire"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏖️</span>
                <h4 className="font-semibold text-neutral-900">Sjálfvirkt FIRE</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Skoðaðu hvort þú getur hætt að spara og látið vöxtinn gera verkið.
              </p>
            </a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card className={cn('border-2 border-amber-200 shadow-md', className)}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50"
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Opna fræðsluhluta' : 'Loka fræðsluhluta'}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label="Upplýsingar">
            💡
          </span>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Hvað er Kaffiþjóna FIRE? Lærðu meira
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Skilningur á hugtakinu, dæmum og ávinningi
            </p>
          </div>
        </div>
        <span className="text-2xl text-neutral-700 transition-transform" aria-hidden="true">
          {collapsed ? '▼' : '▲'}
        </span>
      </button>

      {/* Content */}
      {!collapsed && (
        <CardContent className="border-t border-neutral-200 space-y-4">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={expandAll}>
              Opna alla hluta
            </Button>
            <Button variant="secondary" size="sm" onClick={collapseAll}>
              Loka öllum hlutum
            </Button>
            {onDismiss && (
              <Button variant="secondary" size="sm" onClick={onDismiss} className="ml-auto">
                Fela þetta ávallt
              </Button>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              return (
                <div
                  key={section.id}
                  className="rounded-lg border border-neutral-200 bg-white overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                    aria-expanded={isExpanded}
                    aria-controls={`section-${section.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl" role="img" aria-hidden="true">
                        {section.icon}
                      </span>
                      <h3 className="font-semibold text-neutral-900 text-sm">
                        {section.title}
                      </h3>
                    </div>
                    <span className="text-lg text-neutral-700" aria-hidden="true">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      id={`section-${section.id}`}
                      className="px-4 py-3 border-t border-neutral-200 bg-neutral-50"
                    >
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
            <strong>Ábending:</strong> Þessi reiknivél notar einfölduð líkön. Raunveruleg
            fjárfesting inniheldur áhættu, skatta og sveiflur sem geta breytt niðurstöðum. Leitaðu til
            fjármálaráðgjafa fyrir persónulega ráðgjöf.
          </div>
        </CardContent>
      )}
    </Card>
  );
}
