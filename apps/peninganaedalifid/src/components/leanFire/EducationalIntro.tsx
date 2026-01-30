/**
 * EducationalIntro Component for LeanFIRE
 *
 * Comprehensive educational introduction to LeanFIRE with collapsible sections.
 * Explains what LeanFIRE is, provides visual examples, benefits, misconceptions,
 * and links to related calculators.
 *
 * Features:
 * - Clear explanation of LeanFIRE concept
 * - Visual example with realistic Icelandic numbers
 * - Benefits of LeanFIRE approach
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
      title: 'Hvað er LeanFIRE?',
      icon: '🍃',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <p>
            <strong>LeanFIRE</strong> (eða "Lágmarks FIRE" á íslensku) er aðferð þar sem þú
            nærð fjárhagslegu frelsi með því að lifa á lágmarksútgjöldum — oft kallað "barebones"
            útgjöld. Þetta þýðir minni FI-tölu og þar af leiðandi styttri tíma til að ná markmiðinu.
          </p>
          <p>
            Hugmyndin er einföld: því minna sem þú þarft til að lifa, því minni sparnað þarftu
            til að verða fjárhagslega sjálfstæður. LeanFIRE hentar fólki sem metur frjálsan tíma og
            einfaldleika fram yfir efnisleg gæði.
          </p>
          <div className="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
            <p className="font-semibold text-green-900 mb-2">Lykilhugtak:</p>
            <p className="text-green-800">
              LeanFIRE snýst ekki um að þjást — heldur um að finna hvað skilar raunverulegri
              ánægju og forgangsraða því. Margir í LeanFIRE upplifa meira frelsi og minni streitu
              en í hefðbundnum lífsstíl.
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
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-5 border border-green-200">
            <p className="font-semibold text-green-900 mb-3 text-base">Dæmi: Anna, 35 ára</p>

            <div className="space-y-2 text-green-800">
              <div className="flex justify-between">
                <span>Núverandi aldur:</span>
                <strong>35 ára</strong>
              </div>
              <div className="flex justify-between">
                <span>Lágmarksútgjöld (barebones):</span>
                <strong>{formatCurrency(240_000)}/mán</strong>
              </div>
              <div className="flex justify-between">
                <span>FI-tala (25x útgjöld):</span>
                <strong>{formatCurrency(72_000_000)}</strong>
              </div>
              <div className="h-px bg-green-300 my-2" />
              <div className="flex justify-between">
                <span>Núverandi sparnaður:</span>
                <strong>{formatCurrency(15_000_000)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Mánaðarlegur sparnaður:</span>
                <strong>{formatCurrency(150_000)}/mán</strong>
              </div>
              <div className="flex justify-between">
                <span>Vænt ávöxtun:</span>
                <strong>6% á ári (raunávöxtun)</strong>
              </div>
              <div className="h-px bg-green-300 my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Ár til LeanFIRE:</span>
                <strong className="text-lg text-green-700">~13 ár</strong>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-100 rounded border border-green-200">
              <p className="text-green-900 font-semibold text-sm">
                Samanborið við FatFIRE:
              </p>
              <p className="text-green-800 text-xs mt-1">
                Ef Anna þyrfti 500.000 kr/mán (FatFIRE), væri FI-talan 150M og hún þyrfti
                ~25 ár til að ná markmiðinu. Með LeanFIRE sparar hún 12 ár!
              </p>
            </div>
          </div>

          <div className="text-xs text-neutral-600 italic">
            <strong>Athugaðu:</strong> Þetta er einföldun. Raunveruleg ávöxtun sveiflast og
            útgjöld geta breyst. Lífeyrissjóðsframlög og ellilífeyrir bætast við og lækka
            þörfina á eigin sparnaði.
          </div>
        </div>
      ),
    },
    {
      id: 'benefits',
      title: 'Ávinningur LeanFIRE',
      icon: '✨',
      content: (
        <div className="space-y-3 text-sm text-neutral-700">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Styttri tími til markmiðs:</strong> Lægri
                FI-tala þýðir að þú nærð fjárhagslegu frelsi mörgum árum fyrr en með hærri útgjöld.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Minni áhætta:</strong> Lægri útgjöld
                þýða minni viðkvæmni fyrir markaðssveiflum. Þú þarft minni púða og hefur
                meiri sveigjanleika.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Einfaldara líf:</strong> Fólk sem velur
                LeanFIRE upplifir oft meiri ánægju með minna — minni hlutir, minni skuldbindingar,
                meiri frjálsan tíma.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Umhverfisvænn:</strong> Lægri neysla þýðir
                minni umhverfisáhrif. LeanFIRE samræmist vel sjálfbærni og minimalísma.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <div>
                <strong className="text-neutral-900">Meiri landfræðilegur sveigjanleiki:</strong> Með
                lágmarksútgjöld getur þú búið á ódýrari stöðum — landsbyggð, erlendis, eða í
                minni íbúð.
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
          <div className="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
            <p className="font-semibold text-green-900 mb-2">
              Misskilningur 1: "LeanFIRE þýðir að þjást"
            </p>
            <p className="text-green-800">
              <strong>Sannleikur:</strong> Nei! LeanFIRE snýst um að finna hvað veitir raunverulega
              ánægju. Margir upplifa meiri hamingju með einfaldari lífsstíl, minni stress og
              meiri frjálsan tíma.
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
            <p className="font-semibold text-green-900 mb-2">
              Misskilningur 2: "Ég get ekki notið lífsins"
            </p>
            <p className="text-green-800">
              <strong>Sannleikur:</strong> LeanFIRE fólk nýtur gjarnan lífsins meira — göngutúrar,
              lesa, saman við fjölskyldu, sköpun. Margt af því sem veitir raunverulega ánægju
              kostar lítið eða ekkert.
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
            <p className="font-semibold text-green-900 mb-2">
              Misskilningur 3: "Þetta virkar bara fyrir einhleypa"
            </p>
            <p className="text-green-800">
              <strong>Sannleikur:</strong> Fjölskyldur geta líka notað LeanFIRE. Börnin læra
              verðmæti fjármálalæsi og einfaldleika. Oft þýðir LeanFIRE fleiri gæðastundir með
              fjölskyldunni.
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
            <p className="font-semibold text-green-900 mb-2">
              Misskilningur 4: "Ég get ekki farið á eftirlaun á Íslandi með svona lág útgjöld"
            </p>
            <p className="text-green-800">
              <strong>Sannleikur:</strong> Með lífeyrissjóði og ellilífeyri þarftu ekki að draga
              allt af eigin sparnaði. 240.000 kr/mán er raunhæft á landsbyggðinni eða með
              sameiginlegu húsnæði.
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
            <p className="font-semibold text-green-900 mb-2">
              Misskilningur 5: "Það er enginn varasjóður fyrir óvænt útgjöld"
            </p>
            <p className="text-green-800">
              <strong>Sannleikur:</strong> Góð LeanFIRE áætlun tekur tillit til neyðarsjóðs og
              óvæntra útgjalda. Auk þess gefur lægri úttektarprósentá (3-3.5%) meiri púða en
              hefðbundin 4% regla.
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
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-green-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📋</span>
                <h4 className="font-semibold text-neutral-900">Útgjaldagrunnur</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Reiknaðu lágmarksútgjöld þín (barebones) fyrir LeanFIRE áætlun.
              </p>
            </a>

            <a
              href="/fi-tala"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-green-400 hover:shadow-md"
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
              href="/fatfire"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-green-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👑</span>
                <h4 className="font-semibold text-neutral-900">FatFIRE Reiknivél</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Berðu saman LeanFIRE við FatFIRE til að sjá muninn.
              </p>
            </a>

            <a
              href="/ro-fire"
              className="block rounded-lg border-2 border-neutral-200 bg-white p-4 transition-all hover:border-green-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏖️</span>
                <h4 className="font-semibold text-neutral-900">Coast FIRE Reiknivél</h4>
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
    <Card className={cn('border-2 border-green-200 shadow-md', className)}>
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
              Hvað er LeanFIRE? Lærðu meira
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
          <div className="rounded-lg bg-green-50 p-3 text-xs text-green-800 border border-green-200">
            <strong>Ábending:</strong> Þessi reiknivél notar einfölduð líkön. Raunveruleg
            fjárfesting inniheldur áhættu, skatta og sveiflur sem geta breytt niðurstöðum. Leitaðu til
            fjármálaráðgjafa fyrir persónulega ráðgjöf.
          </div>
        </CardContent>
      )}
    </Card>
  );
}
