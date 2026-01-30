/**
 * EducationalIntro Component for FatFIRE
 *
 * Comprehensive educational introduction to FatFIRE with collapsible sections.
 * Explains what FatFIRE is, provides visual examples, benefits, misconceptions,
 * and links to related calculators.
 *
 * Features:
 * - Clear explanation of FatFIRE concept
 * - Visual example with realistic Icelandic numbers
 * - Benefits of FatFIRE approach
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
      title: 'Hvað er Lúxus FIRE (FatFIRE)?',
      icon: '💎',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <p>
            <strong>FatFIRE</strong> (eða &quot;Lúxus FIRE&quot; á íslensku) er aðferð við fjárhagslegt
            frelsi þar sem þú safnar nógu miklum sparnaði til að lifa á lúxus lífsstíl án þess að
            vinna aftur. Þetta er fyrir fólk sem vill <em>ekki</em> gera málamiðlanir á lífsstíl.
          </p>
          <p>
            Ólíkt LeanFIRE (sem krefst lágmarks útgjalda) eða venjulegum FIRE, þá miðar FatFIRE við
            hámarkslífsstíl: dýrt húsnæði, tíð ferðalög, bíll, afþreyingu og allar þær upplifanir
            sem þú dreymir um.
          </p>
          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">Lykilhugtak:</p>
            <p className="text-amber-800">
              FatFIRE krefst meiri sparnaðar og lengri tíma en aðrar FIRE-aðferðir, en veitir
              fullkomið lífsstílsfrelsi án þess að þurfa að hugsa um peninga eftir að þú hættir
              að vinna.
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
            <p className="font-semibold text-amber-900 mb-3 text-base">Dæmi: Guðrún, 35 ára</p>

            <div className="space-y-2 text-amber-800">
              <div className="flex justify-between">
                <span>Núverandi aldur:</span>
                <strong>35 ára</strong>
              </div>
              <div className="flex justify-between">
                <span>Lúxus mánaðarleg útgjöld:</span>
                <strong>{formatCurrency(800_000)}/mán</strong>
              </div>
              <div className="flex justify-between">
                <span>Árleg útgjöld:</span>
                <strong>{formatCurrency(9_600_000)}</strong>
              </div>
              <div className="h-px bg-amber-300 my-2" />
              <div className="flex justify-between">
                <span>FatFIRE-tala (30x):</span>
                <strong>{formatCurrency(288_000_000)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Óskalisti:</span>
                <strong>+{formatCurrency(100_000)}/mán</strong>
              </div>
              <div className="flex justify-between">
                <span>Aukaútgjöld (splurge):</span>
                <strong>+{formatCurrency(50_000)}/mán</strong>
              </div>
              <div className="h-px bg-amber-300 my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Heildar FatFIRE-tala:</span>
                <strong className="text-lg text-amber-700">{formatCurrency(342_000_000)}</strong>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-100 rounded border border-amber-300">
              <p className="text-amber-900 font-semibold text-sm">
                💎 Guðrún stefnir á lúxus eftirlaun
              </p>
              <p className="text-amber-800 text-xs mt-1">
                Með 342 milljónum á reikningi getur hún tekið út 3,33% á ári ({formatCurrency(950_000)}/mán)
                og lifað á fullkomnum lúxus lífsstíl með öllum draumum sínum uppfylltum.
              </p>
            </div>
          </div>

          <div className="text-xs text-neutral-600 italic">
            <strong>Athugaðu:</strong> Þessar tölur eru til sýnis. FatFIRE krefst mikillar aga og
            háum tekjum eða langan sparnaðartíma. Íslenskur lífeyrir (séreign, lífeyrissjóður, TR)
            getur dregið úr þörfinni.
          </div>
        </div>
      ),
    },
    {
      id: 'benefits',
      title: 'Ávinningur Lúxus FIRE',
      icon: '✨',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Engir málamiðlanir:</strong> Þú þarft ekki að
                draga úr lífsstíl eða segja nei við drauma. Allt sem þú vilt er mögulegt.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Fullkomið frelsi:</strong> Engar áhyggjur af
                peningum, engin þörf á hlutastarfi eða aukatekjum.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Öflugur öryggismunur:</strong> Með 30x
                margfaldara og lúxusútgjöldum ertu vel tryggður gegn óvæntum útgjöldum.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Arfleifð:</strong> Mikill sparnaður gefur þér
                möguleika á að skilja eftir arfleifð fyrir börn eða góðgerðarmál.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Sveigjanleiki:</strong> Þú getur alltaf dregið
                úr útgjöldum ef markaðurinn hrynur, en þú þarft aldrei að.
              </div>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'misconceptions',
      title: 'Algengir misskilningar',
      icon: '⚠️',
      content: (
        <div className="space-y-4 text-sm">
          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 1: &quot;FatFIRE er bara fyrir milljónamæringa&quot;
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Nei! FatFIRE er hægt að ná með dugnaði og réttri áætlun.
              Háar tekjur hjálpa, en tími og samsettur vöxtur eru lykilinn.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 2: &quot;Ég þarf milljóna laun&quot;
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Með góðum sparnaðarvana og 20-30 ára tíma getur þú náð
              FatFIRE með meðallaunum. Lykilinn er að byrja snemma.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 3: &quot;FatFIRE er óábyrgt&quot;
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Þvert á móti! FatFIRE notar varlegan 30x margfaldara
              (3,33% úttekt) og gerir ráð fyrir lúxusútgjöldum. Það er mjög varfærið.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 4: &quot;Ég mun aldrei njóta peninganna&quot;
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> FatFIRE er einmitt um að njóta! Ólíkt öfgakenndum
              sparnaðaraðferðum, FatFIRE leyfir þér að lifa vel bæði núna (innan skynsemi) og
              síðar.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-900 mb-2">
              Misskilningur 5: &quot;Íslendingar þurfa ekki FatFIRE vegna lífeyris&quot;
            </p>
            <p className="text-amber-800">
              <strong>Sannleikur:</strong> Lífeyrir hjálpar, en lúxuslífsstíll krefst meira. FatFIRE
              veitir frelsi <em>áður</em> en lífeyrir byrjar (60-67 ára).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'related',
      title: 'Tengdar reiknivélar',
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
                Reiknaðu mánaðarleg útgjöld þín og fáðu Lúxus-stig sjálfkrafa.
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
              href="/leanfire"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌱</span>
                <h4 className="font-semibold text-neutral-900">LeanFIRE</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Náðu FIRE með lágmarks útgjöldum og einföldum lífsstíl.
              </p>
            </a>

            <a
              href="/barista-fire"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">☕</span>
                <h4 className="font-semibold text-neutral-900">Kaffiþjóna FIRE</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Byrjaðu fyrr með hlutastarfi á meðan sparnaður vex.
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
            💎
          </span>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Hvað er Lúxus FIRE? Lærðu meira...
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
