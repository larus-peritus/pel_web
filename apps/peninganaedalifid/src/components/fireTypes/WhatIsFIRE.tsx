/**
 * WhatIsFIRE Component
 *
 * Educational introduction to the FIRE movement and FIRE Type Explorer tool.
 * Collapsible/expandable section that can be dismissed with preference saving.
 *
 * Features:
 * - Brief FIRE movement introduction
 * - Why explore FIRE types
 * - How to use this tool
 * - Collapsible/expandable accordion
 * - Dismissible with localStorage preference
 * - Responsive layout
 */

'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Flame, Target, Map, TrendingUp } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'fireExplorer_whatIsFIRE_dismissed';

interface WhatIsFIREProps {
  /** Start expanded or collapsed */
  defaultExpanded?: boolean;

  /** Callback when dismissed */
  onDismiss?: () => void;
}

export function WhatIsFIRE({ defaultExpanded = true, onDismiss }: WhatIsFIREProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isDismissed, setIsDismissed] = useState(false);

  /**
   * Load dismissed preference from localStorage
   */
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch (error) {
      // localStorage not available or error occurred, continue with default state
      console.warn('Failed to load WhatIsFIRE dismissal preference:', error);
    }
  }, []);

  /**
   * Handle dismiss action
   */
  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (error) {
      console.warn('Failed to save WhatIsFIRE dismissal preference:', error);
    }
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  /**
   * Handle show again (clear preference)
   */
  const handleShowAgain = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear WhatIsFIRE dismissal preference:', error);
    }
    setIsDismissed(false);
    setIsExpanded(true);
  };

  // If dismissed, show a small "Show info" button
  if (isDismissed) {
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={handleShowAgain}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Sýna upplýsingar um FIRE aftur
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 flex items-center gap-3 text-left group"
          >
            <div className="bg-orange-100 rounded-lg p-2">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                Hvað er FIRE?
              </h3>
              <p className="text-sm text-gray-600">
                Financial Independence, Retire Early
              </p>
            </div>
            <div className="text-orange-600">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
            aria-label="Loka"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              FIRE (Financial Independence, Retire Early) er hreyfing sem leggur áherslu á að spara
              og fjárfesta hátt hlutfall af tekjum til að ná fjármálafrelsi mun fyrr en hefðbundinn
              65-67 ára eftirlaunaaldur. Markmiðið er ekki endilega að hætta að vinna alveg, heldur
              að hafa <strong>frelsi til að velja</strong> hvernig þú eyðir tímanum þínum.
            </p>
          </section>

          {/* Why Explore FIRE Types */}
          <section className="bg-white bg-opacity-60 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Af hverju að kanna mismunandi FIRE tegundir?
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>
                  <strong>Það er engin ein rétt leið:</strong> FIRE er ekki "one size fits all". Það sem
                  virkar fyrir þig fer eftir tekjum, útgjöldum, lífsstíl og gildum.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>
                  <strong>Raunhæf markmið:</strong> Með því að skilja mismunandi tegundir geturðu sett
                  þér markmið sem henta þinni stöðu í stað þess að reyna að ná ómögulegu markmiði.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>
                  <strong>Sveigjanleikar:</strong> Þú getur byrjað með eina tegund og skipt síðar, eða
                  blandað saman aðferðum (t.d. CoastFIRE sem millimarkmið á leiðinni í RegularFIRE).
                </span>
              </li>
            </ul>
          </section>

          {/* How to Use This Tool */}
          <section className="bg-white bg-opacity-60 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Map className="w-5 h-5 text-orange-600" />
              Hvernig á að nota þetta tól?
            </h4>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <span>
                  <strong>Skoðaðu tegundir hér að neðan:</strong> Lestu um hverja tegund og hvað hún
                  þýðir fyrir þig.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <span>
                  <strong>Sláðu inn þínar tölur:</strong> Gefðu upp núverandi tekjur, sparnað og útgjöld
                  til að fá persónulegar útreikninga.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <span>
                  <strong>Berðu saman valkosti:</strong> Sjáðu hversu lengi það tekur að ná hverri tegund
                  og hvaða sparnaði er þörf.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <span>
                  <strong>Veldu þína leið:</strong> Engin þrýstingur! Þetta er þitt ferðalag. Veldu þá
                  tegund sem passar best og byrjaðu að skipuleggja.
                </span>
              </li>
            </ol>
          </section>

          {/* Key Principle */}
          <Alert variant="info">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Grunnreglan</p>
                <p className="text-sm text-blue-800">
                  FIRE byggir á einföldu stærðfræðilegu reglu: Þegar þú ert með 25-30x af árlegum
                  útgjöldum þínum sparaðar, geturðu lifað af ávöxtun fjárfestinganna (venjulega 3-4%
                  úttekt á ári) án þess að eyða höfuðstólnum. Þetta kallast "safe withdrawal rate".
                </p>
              </div>
            </div>
          </Alert>

          {/* CTA */}
          <div className="text-center pt-2">
            <Button
              onClick={() => setIsExpanded(false)}
              variant="secondary"
              size="sm"
            >
              Ég skil, sýndu mér tegundirnar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
