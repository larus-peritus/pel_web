/**
 * EducationalIntro Component
 *
 * Comprehensive educational introduction to Coast FIRE with collapsible sections.
 * Explains what Coast FIRE is, provides visual examples, benefits, misconceptions,
 * and links to related calculators.
 *
 * Features:
 * - Clear explanation of Coast FIRE concept
 * - Visual example with realistic Icelandic numbers
 * - Benefits of reaching Coast FIRE
 * - Common misconceptions addressed
 * - Collapsible sections for different topics
 * - Links to related calculators (FI Number, Expense Baseline)
 * - Dismissible with localStorage persistence
 * - All content in Icelandic
 *
 * Epic 7, Task 7.1
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
      title: 'Hvað er Sjálfvirkt FIRE (Coast FIRE)?',
      icon: '🏖️',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <p>
            <strong>Coast FIRE</strong> (eða "Sjálfvirkt FIRE" á íslensku) er áfangi þar sem þú hefur
            nógu mikið í fjárfestingum núna til að þær vaxi í FI-töluna þína fyrir starfslok —{' '}
            <strong>án þess að þú þurfir að spara meira</strong>.
          </p>
          <p>
            Hugtakið "coast" kemur frá því að þú getur "coastað" til starfsloka án þess að leggja
            til viðbótarsparnað. Vaxtavextir vinnur fyrir þig.
          </p>
          <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 mb-2">Lykilhugtak:</p>
            <p className="text-blue-800">
              Ef þú ert með X kr í dag og þær vaxa í Y kr (FI-tala þín) fyrir starfslok með
              vaxtavöxtum, þá hefur þú náð Sjálfvirku FIRE. Þú getur hætt að spara núna.
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
          <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 p-5 border border-cyan-200">
            <p className="font-semibold text-cyan-900 mb-3 text-base">Dæmi: Sara, 30 ára</p>

            <div className="space-y-2 text-cyan-800">
              <div className="flex justify-between">
                <span>Núverandi aldur:</span>
                <strong>30 ára</strong>
              </div>
              <div className="flex justify-between">
                <span>Eftirlaunaaldur:</span>
                <strong>67 ára</strong>
              </div>
              <div className="flex justify-between">
                <span>Tími til starfsloka:</span>
                <strong>37 ár</strong>
              </div>
              <div className="h-px bg-cyan-300 my-2" />
              <div className="flex justify-between">
                <span>Núverandi fjárfestingar:</span>
                <strong>{formatCurrency(20_000_000)}</strong>
              </div>
              <div className="flex justify-between">
                <span>FI-tala (markmið):</span>
                <strong>{formatCurrency(100_000_000)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Vænt ávöxtun:</span>
                <strong>6% á ári (raunávöxtun)</strong>
              </div>
              <div className="h-px bg-cyan-300 my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Áætluð staða við 67 ára:</span>
                <strong className="text-lg text-green-700">
                  {formatCurrency(172_721_742)}
                </strong>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <p className="text-green-900 font-semibold text-sm">
                ✓ Sara hefur náð Sjálfvirku FIRE!
              </p>
              <p className="text-green-800 text-xs mt-1">
                20 milljónir í dag munu vaxa í 173 milljónir á 37 árum. Hún getur hætt að spara
                núna og látið vaxtavöxt gera verkið.
              </p>
            </div>
          </div>

          <div className="text-xs text-neutral-600 italic">
            <strong>Athugaðu:</strong> Þetta er einföldun. Raunveruleg fjárfesting fylgir áhætta,
            verðbólgu og sveiflum. Notaðu íhaldssama áætlun og endurskoðaðu reglulega.
          </div>
        </div>
      ),
    },
    {
      id: 'benefits',
      title: 'Ávinningur þess að ná Sjálfvirku FIRE',
      icon: '✨',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Þú getur hætt að spara:</strong> Notaðu
                allar tekjur þínar í núverandi þarfir og lífsstíl án þess að hafa áhyggjur af
                framtíðinni.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Starfssveigjanleiki:</strong> Þú getur valið
                starf sem þú elskar, jafnvel þó það borgi minna, því þú þarft ekki að spara
                meira.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Minni fjárhagslegt álag:</strong> Þú veist
                að framtíðin þín er tryggð með vaxtavöxtum.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Vaxtavextir vinna vinnuna:</strong> Hver
                króna sem þú hefur sparað mun halda áfram að vaxa án frekari sparnaðar.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Millivegur að FI:</strong> Þú þarft ekki að
                ná fullri FI núna — bara að vita að þú munt ná henni síðar.
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
              Misskilningur 1: "Ég þarf að hætta að vinna"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Sjálfvirkt FIRE þýðir bara að þú þarft ekki að spara meira.
              Þú getur haldið áfram að vinna eins lengi og þú vilt og notað tekjurnar í lífsstíl.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 2: "Ég get tekið út núna"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Nei! Fjárfestingarnar þurfa að vaxa ósnertar til
              starfsloka. Ef þú tekur út núna muntu ekki ná FI-tölunni.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 3: "Ávöxtun er tryggð"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Hlutabréfamarkaðir sveiflast. 6% raunávöxtun er
              söguleg langtímameðaltal (á bandarískum markaði), en einstök ár geta verið mjög mismunandi. Notaðu
              íhaldssama áætlun (4-6%).
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 4: "Ég þarf að ná Sjálfvirkt FIRE strax"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Sjálfvirkt FIRE er áfangi, ekki markmið í sjálfu sér. Það er
              í lagi að halda áfram að spara ef þú hefur ekki náð þessum áfanga enn.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 5: "Þetta virkar fyrir alla"
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Sjálfvirkt FIRE hentar best þeim sem eru með nokkurn sparnað
              og langan tíma til starfsloka. Ef þú ert nálægt starfslokum eða með lítinn sparnað
              gæti þú þurft að halda áfram að spara.
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
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-primary-400 hover:shadow-md"
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
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-primary-400 hover:shadow-md"
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
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-primary-400 hover:shadow-md"
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
              href="/fire-leidarvisir"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-primary-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧭</span>
                <h4 className="font-semibold text-neutral-900">FIRE Leiðarvísir</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Kannaðu mismunandi FIRE-leiðir (Lean, Regular, Coast, Barista, Fat).
              </p>
            </a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card className={cn('border-2 border-primary-200 shadow-md', className)}>
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
              Hvað er Sjálfvirkt FIRE? Lærðu meira
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
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800 border border-blue-200">
            <strong>Ábending:</strong> Þessi reiknivél notar einfölduð líkön. Raunveruleg
            fjárfesting inniheldur áhættu, skatta og sveiflur sem geta breytt niðurstöðum. Leitaðu til
            fjármálaráðgjafa fyrir persónulega ráðgjöf.
          </div>
        </CardContent>
      )}
    </Card>
  );
}
