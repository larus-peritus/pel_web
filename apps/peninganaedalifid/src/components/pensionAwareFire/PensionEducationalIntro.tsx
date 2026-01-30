/**
 * PensionEducationalIntro Component for Pension-Aware FIRE Calculator
 *
 * Educational introduction explaining why traditional FIRE calculations over-estimate
 * savings needs in Iceland due to the three-tier pension system (Séreign, Lífeyrissjóður, TR).
 *
 * Features:
 * - Clear explanation of the "over-saving" problem
 * - Overview of Icelandic pension system (séreign, lífeyrissjóður, TR)
 * - Three-phase retirement planning approach
 * - Concrete example showing 106M ISK savings (144M → 38M)
 * - Collapsible sections for clean UI
 * - Dismissible with localStorage persistence
 * - All content in Icelandic
 * - Blue/indigo color scheme (pension/planning theme)
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export interface PensionEducationalIntroProps {
  /** Whether the intro is collapsed */
  collapsed: boolean;
  /** Callback when user toggles collapsed state */
  onToggle: () => void;
  /** Callback when user dismisses the intro */
  onDismiss: () => void;
  /** Optional className for styling */
  className?: string;
}

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export function PensionEducationalIntro({
  collapsed,
  onToggle,
  onDismiss,
  className,
}: PensionEducationalIntroProps) {
  // Track which sections are expanded (all collapsed by default for cleaner initial view)
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set()
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
      new Set(['why-high', 'pension-system', 'three-phases', 'example'])
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
      id: 'why-high',
      title: 'Af hverju hefðbundin FIRE-tala er of há',
      icon: '📈',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <p>
            Hefðbundin FIRE aðferðafræði (Financial Independence, Retire Early) gerir ráð fyrir
            að þú þurfir <strong>25-30x árleg útgjöld</strong> til að lifa á fjárfestingunum
            þínum að eilífu. Þetta er byggið á 4% reglunni eða 3-3.5% úttektarhlutfalli.
          </p>
          <p>
            En þessi nálgun <strong>hunsar algerlega íslenska lífeyriskerfið</strong>. Hún gerir
            ráð fyrir að þú þurfir að draga öll útgjöld þín af eigin sparnaði þangað til þú deyrð.
          </p>

          <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 mb-2">Vandamálið:</p>
            <p className="text-blue-800">
              Ef þú þarft 400.000 kr/mán í útgjöld og notar 30x margfaldara, þá þarftu
              144.000.000 kr í FI-tölu. En á Íslandi færðu lífeyri frá <strong>þremur aðilum</strong>:
              séreign (60+), lífeyrissjóði (62-67+), og TR ellilífeyri (67+). Þú þarft því ekki
              að draga allt af eigin sparnaði!
            </p>
          </div>

          <div className="rounded-lg bg-indigo-50 p-4 border-l-4 border-indigo-500">
            <p className="font-semibold text-indigo-900 mb-2">Niðurstaða:</p>
            <p className="text-indigo-800">
              Hefðbundin FIRE tala leiðir til <strong>gífurlegs yfirsparnað</strong> fyrir Íslendinga.
              Þú gætir unnið í 10-15 ár lengur en nauðsynlegt er!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'pension-system',
      title: 'Íslenska lífeyriskerfið',
      icon: '🏦',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <p>
            Íslenska lífeyriskerfið er þríþætt og veitir verulegan stuðning við eftirlaun:
          </p>

          <div className="space-y-3">
            <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💰</span>
                <h4 className="font-semibold text-blue-900">1. Séreign (60+ ára)</h4>
              </div>
              <ul className="text-blue-800 text-sm space-y-1 ml-6 list-disc">
                <li>Þinn persónulegi lífeyrissjóðssparnaður</li>
                <li>Aðgengilegur frá 60 ára aldri</li>
                <li><strong>EKKI tekjutengdur</strong> (engin means-testing)</li>
                <li>Getur þjónað sem brú á milli starfsloka og fullra lífeyris</li>
              </ul>
            </div>

            <div className="rounded-lg bg-indigo-50 p-4 border-l-4 border-indigo-600">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏢</span>
                <h4 className="font-semibold text-indigo-900">2. Lífeyrissjóður (62-67+ ára)</h4>
              </div>
              <ul className="text-indigo-800 text-sm space-y-1 ml-6 list-disc">
                <li>Iðgjaldatengdur lífeyrir frá lífeyrissjóði</li>
                <li>Byrjar á milli 62-67 ára (fer eftir sjóði)</li>
                <li>Byggist á öllu framlagi yfir starfsævi</li>
                <li>Greiðist út ævilangt</li>
              </ul>
            </div>

            <div className="rounded-lg bg-sky-50 p-4 border-l-4 border-sky-600">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏛️</span>
                <h4 className="font-semibold text-sky-900">3. TR Ellilífeyrir (67+ ára)</h4>
              </div>
              <ul className="text-sky-800 text-sm space-y-1 ml-6 list-disc">
                <li>Grunnellilífeyrir frá ríkinu (Tryggingastofnun)</li>
                <li>Byrjar við 67 ára aldur</li>
                <li><strong>Tekjutengdur</strong> (means-tested)</li>
                <li>Lækkar um 45% af tekjum yfir 36.500 kr/mán</li>
                <li>Hámark ~380.000 kr/mán</li>
              </ul>
            </div>
          </div>

          <Alert variant="info" className="mt-3">
            <p className="text-xs">
              <strong>Athugaðu:</strong> Séreign úttektir teljast EKKI til tekna við útreikning
              á TR ellilífeyri. Þetta gerir séreign sérstaklega verðmæta fyrir snemmbúin eftirlaun.
            </p>
          </Alert>
        </div>
      ),
    },
    {
      id: 'three-phases',
      title: 'Þrjú stig eftirlaunaáætlunar',
      icon: '🎯',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <p>
            Þessi reiknivél skiptir eftirlaunum þínum í <strong>þrjú stig</strong> byggt á því
            hvenær hver tegund lífeyris hefst:
          </p>

          <div className="space-y-3">
            <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🚀</span>
                <h4 className="font-semibold text-red-900">Stig 1: Gap tímabil (eftirlaun → 60 ára)</h4>
              </div>
              <div className="text-red-800 text-sm space-y-2">
                <p>
                  <strong>Einkenni:</strong> Fullkomlega sjálfsfjármagnað. Þú dregur allt af eigin
                  sparnaði.
                </p>
                <p>
                  <strong>Lengd:</strong> 0-20+ ár (fer eftir hvenær þú ferð á eftirlaun)
                </p>
                <p>
                  <strong>Lykill:</strong> Þetta er "gap" sem þú þarft að brúa. Því síðar sem þú
                  ferð á eftirlaun, því styttra er þetta tímabil.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌉</span>
                <h4 className="font-semibold text-amber-900">Stig 2: Séreign brú (60-67 ára)</h4>
              </div>
              <div className="text-amber-800 text-sm space-y-2">
                <p>
                  <strong>Einkenni:</strong> Séreign hjálpar til. Mögulega lífeyrissjóður líka
                  (ef hann byrjar fyrir 67).
                </p>
                <p>
                  <strong>Lengd:</strong> Allt að 7 ár (60-67)
                </p>
                <p>
                  <strong>Lykill:</strong> Séreign dregur verulega úr þörfinni á eigin sparnaði.
                  Einnig teljast séreign úttektir EKKI til tekna fyrir TR means-testing síðar.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎉</span>
                <h4 className="font-semibold text-green-900">Stig 3: Fullur lífeyrir (67+ ára)</h4>
              </div>
              <div className="text-green-800 text-sm space-y-2">
                <p>
                  <strong>Einkenni:</strong> Allir lífeyrisgjafar virkir (lífeyrissjóður + TR).
                  Mögulega ekkert þörf fyrir eigin sparnað.
                </p>
                <p>
                  <strong>Lengd:</strong> Afgangur ævinnar (~23 ár ef þú lifir til 90)
                </p>
                <p>
                  <strong>Lykill:</strong> Í sameiningu geta hluti lífeyrissjóðs og TR getur uppfyllt þarfir þínar.
                  Séreign getur haldið áfram ef eitthvað er eftir.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800 border border-blue-200 mt-3">
            <strong>Innsýn:</strong> Með því að átta sig á þessum þremur stigum geturðu reiknað
            út <strong>nákvæmlega hversu mikið</strong> þú þarft að spara fyrir hvert stig, í stað
            þess að giska á 30x útgjöld að eilífu.
          </div>
        </div>
      ),
    },
    {
      id: 'example',
      title: 'Dæmi: Hvernig þetta sparar milljónir',
      icon: '💡',
      content: (
        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border-2 border-blue-200">
            <p className="font-semibold text-blue-900 mb-3 text-base">
              Dæmi: Jón, 35 ára, vill fara á eftirlaun við 50
            </p>

            <div className="space-y-3">
              <div className="rounded bg-white p-3 border border-blue-200">
                <p className="font-semibold text-neutral-900 mb-2 text-sm">📊 Forsendur:</p>
                <div className="space-y-1 text-neutral-700 text-xs">
                  <div className="flex justify-between">
                    <span>Núverandi aldur:</span>
                    <strong>35 ára</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Eftirlaunaaldur:</span>
                    <strong>50 ára</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mánaðarleg útgjöld:</span>
                    <strong>{formatCurrency(400_000)}/mán</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lífeyrissjóður (væntanlegur):</span>
                    <strong>{formatCurrency(350_000)}/mán frá 67</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Séreign (væntanleg við 60):</span>
                    <strong>{formatCurrency(15_000_000)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>TR ellilífeyrir (væntanlegur):</span>
                    <strong>{formatCurrency(340_000)}/mán frá 67</strong>
                  </div>
                </div>
              </div>

              <div className="rounded bg-red-50 p-3 border-2 border-red-300">
                <p className="font-semibold text-red-900 mb-2 text-sm flex items-center gap-2">
                  <span>❌</span> Hefðbundin FIRE aðferð
                </p>
                <div className="space-y-1 text-red-800 text-xs">
                  <div className="flex justify-between">
                    <span>Árlega útgjöld:</span>
                    <strong>{formatCurrency(400_000 * 12)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>FI margfaldari:</span>
                    <strong>30x</strong>
                  </div>
                  <div className="h-px bg-red-300 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">FI-tala (samtals):</span>
                    <strong className="text-base text-red-700">{formatCurrency(144_000_000)}</strong>
                  </div>
                </div>
                <p className="text-red-700 text-xs mt-2 italic">
                  Gerir ráð fyrir að þú þurfir 144M til að draga alla 400k/mán að eilífu.
                </p>
              </div>

              <div className="rounded bg-green-50 p-3 border-2 border-green-400">
                <p className="font-semibold text-green-900 mb-2 text-sm flex items-center gap-2">
                  <span>✅</span> Lífeyristengd FIRE aðferð
                </p>
                <div className="space-y-1 text-green-800 text-xs">
                  <div className="flex justify-between">
                    <span>Stig 1 (50-60 ára): Gap tímabil</span>
                    <strong>{formatCurrency(28_500_000)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Stig 2 (60-67 ára): Séreign brú</span>
                    <strong>{formatCurrency(9_500_000)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Stig 3 (67+ ára): Fullur lífeyrir</span>
                    <strong>{formatCurrency(0)} (fullþakið)</strong>
                  </div>
                  <div className="h-px bg-green-400 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">FI-tala (samtals):</span>
                    <strong className="text-base text-green-700">{formatCurrency(38_000_000)}</strong>
                  </div>
                </div>
                <p className="text-green-700 text-xs mt-2 italic">
                  Tekur tillit til þess að lífeyrir tekur við eftir 60/67 ára aldur.
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 p-4 border-2 border-blue-400">
                <p className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2">
                  <span>🎉</span> Niðurstaða: Sparnaður
                </p>
                <div className="space-y-1 text-blue-800 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Sparnaður í krónum:</span>
                    <strong className="text-lg text-blue-700">{formatCurrency(106_000_000)}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sparnaður í prósentum:</span>
                    <strong className="text-lg text-blue-700">73% minna!</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Meðal ársparnaði 1.5M:</span>
                    <strong className="text-lg text-blue-700">~70 ár sparaður tími!</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800 border border-indigo-200">
            <strong>Lykillinn:</strong> Íslenska lífeyriskerfið veitir þér <strong>verulegan
            stuðning</strong> eftir 60/67 ára aldur. Þú þarft bara að brúa bilið milli starfsloka
            og þess að lífeyrir byrjar. Það er MIKLU ódýrara en að spara fyrir alla ævina.
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card className={cn('border-2 border-blue-200 shadow-md', className)}>
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
              Hvers vegna er hefðbundin FIRE-tala of há fyrir Íslendinga?
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Lærðu um íslenska lífeyriskerfið og hvernig það sparar þér milljónir
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
            <Button variant="secondary" size="sm" onClick={onDismiss} className="ml-auto">
              Fela þetta ávallt
            </Button>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              return (
                <div
                  key={section.id}
                  className="rounded-lg border border-blue-200 bg-white overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-blue-50"
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
                      className="px-4 py-3 border-t border-blue-100 bg-blue-50/30"
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
            <strong>Athugasemd:</strong> Þessi reiknivél notar einfölduð líkön til að meta
            lífeyriskerfið. Raunverulegur lífeyrir fer eftir framlögum, ávöxtun sjóðs, og breytingum
            á lögum. TR ellilífeyrir er means-tested og getur breyst. Notaðu opinbera TR reiknivélina
            fyrir nákvæmar tölur og leitaðu til fjármálaráðgjafa fyrir persónulega ráðgjöf.
          </div>
        </CardContent>
      )}
    </Card>
  );
}
