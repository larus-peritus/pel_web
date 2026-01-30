'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useCalculator } from '@/context/CalculatorContext';
import { CategoryExpenseEditor } from './CategoryExpenseEditor';
import { ExpenseDashboard } from './ExpenseDashboard';
import { ExpenseWizard } from './ExpenseWizard';

type ViewMode = 'dashboard' | 'editor' | 'wizard';

/**
 * Main Current Expense Report Calculator Component
 *
 * Orchestrates dashboard and editor views, handles AWH warnings,
 * and provides educational content about expense tracking.
 */
export function CurrentExpenseReportCalculator() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [showEducation, setShowEducation] = useState(false);
  const { results, currentExpenses, currentExpenseResults } = useCalculator();

  const actualHourlyWage = results?.actualHourlyWage ?? null;
  const hasExpenses = currentExpenses && currentExpenses.categories.some(
    cat => cat.lineItems.length > 0
  );

  return (
    <div className="space-y-6">
      {/* Educational Intro Section (Collapsible) */}
      <Card>
        <button
          onClick={() => setShowEducation(!showEducation)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="font-semibold text-neutral-900">
                Um Núverandi Útgjaldaskýrslu
              </h3>
              <p className="text-sm text-neutral-600">
                Smelltu til að sjá frekari upplýsingar um hvernig þetta tól virkar
              </p>
            </div>
          </div>
          <span className="text-neutral-400">
            {showEducation ? '▼' : '▶'}
          </span>
        </button>

        {showEducation && (
          <div className="p-6 pt-0 space-y-4 border-t border-neutral-200">
            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">
                Hvað er Núverandi Útgjaldaskýrsla?
              </h4>
              <p className="text-neutral-600">
                Núverandi Útgjaldaskýrsla er nákvæmt útgjaldarakningartól sem gerir þér kleift að skrá
                raunveruleg mánaðarleg útgjöld þín með nákvæmum línuliðum. Ólíkt Útgjaldagrunni (sem áætlar
                útgjöld á þremur stigum), fylgist þetta tól með raunverulegum útgjöldum til að hjálpa þér að
                skilja hvert peningarnir fara.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">
                Hvernig er þetta frábrugðið Útgjaldagrunni?
              </h4>
              <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                <li><strong>Útgjaldagrunnur</strong> = Skipulagningartól með þremur stigum (Lágmarks/Þægilegt/Lúxus) - "Hvað MYNDI ég eyða?"</li>
                <li><strong>Núverandi Útgjaldaskýrsla</strong> = Rakningartól fyrir raunveruleg útgjöld - "Hvað eyði ég NÚNA?"</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">
                Hvernig á að nota þetta á áhrifaríkan hátt
              </h4>
              <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                <li>Skráðu öll mánaðarleg útgjöld þín með nákvæmum línuliðum</li>
                <li>Notaðu lífsorku (vinnutíma) til að skilja raunverulegan kostnað</li>
                <li>Borðu saman við útgjaldagrunninn þinn til að sjá hvar þú ert að ofeyða</li>
                <li>Fáðu tillögur um aðrar reiknivélar sem geta hjálpað þér að fínstilla</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">
                Samþætting við aðrar reiknivélar
              </h4>
              <p className="text-neutral-600">
                Gögn úr Núverandi Útgjaldaskýrslu eru sjálfkrafa tiltæk fyrir aðrar reiknivélar:
              </p>
              <ul className="space-y-1 text-neutral-600 list-disc list-inside">
                <li>Áskriftakostnaður - fær áskriftargögn sjálfkrafa</li>
                <li>Vinnuferðakostnaður - fær samgöngukostnað</li>
                <li>Húsnæðiskostnaður - fær húsnæðiskostnað</li>
              </ul>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                <span>🔒</span>
                Persónuvernd
              </h4>
              <p className="text-sm text-neutral-600">
                Öll gögn eru geymd á tækinu þínu. Engar upplýsingar eru sendar á netþjóna.
                Þú getur flutt út og flutt inn gögn fyrir öryggisafrit.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* AWH Warning if not available */}
      {!actualHourlyWage && (
        <Alert variant="warning">
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-semibold">Raunverulegt tímakaup vantar</p>
              <p className="text-sm mt-1">
                Reiknaðu raunverulegt tímakaup þitt fyrst til að sjá útgjöld í lífsorku (vinnutímum).
                Þú getur samt skráð útgjöld þín, en lífsorku birtingar verða ekki tiltækar.
              </p>
            </div>
            <Button
              onClick={() => {
                // This will switch to the main calculator tab
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              variant="primary"
              size="sm"
            >
              Opna Raunverulegt Tímakaup Reiknivél
            </Button>
          </div>
        </Alert>
      )}

      {/* View Toggle and Header - Hidden during wizard */}
      {viewMode !== 'wizard' && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              {viewMode === 'dashboard' ? 'Yfirlit útgjalda' : 'Breyta útgjöldum'}
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              {viewMode === 'dashboard'
                ? 'Sjá samantekt og greiningar á útgjöldum þínum'
                : 'Bættu við og breyttu línuliðum í hverjum flokki'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'dashboard' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('dashboard')}
            >
              📊 Yfirlit
            </Button>
            <Button
              variant={viewMode === 'editor' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('editor')}
            >
              ✏️ Breyta
            </Button>
          </div>
        </div>
      )}

      {/* Main Content - Wizard, Dashboard or Editor */}
      {viewMode === 'wizard' ? (
        <ExpenseWizard
          onComplete={() => setViewMode('dashboard')}
          onCancel={() => setViewMode('dashboard')}
        />
      ) : viewMode === 'dashboard' ? (
        hasExpenses && currentExpenseResults ? (
          <ExpenseDashboard
            results={currentExpenseResults}
            actualHourlyWage={actualHourlyWage}
            onToggleToEditor={() => setViewMode('editor')}
          />
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-6xl">📊</div>
              <h3 className="text-xl font-semibold text-neutral-900">
                Engin útgjöld skráð enn
              </h3>
              <p className="text-neutral-600">
                Við leiðum þig í gegnum hvern útgjaldaflokk til að skrá mánaðarleg útgjöld þín.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setViewMode('wizard')}
                  className="w-full"
                >
                  🧙‍♂️ Byrja leiðsöguferð →
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setViewMode('editor')}
                  className="w-full"
                >
                  Eða bæta við handvirkt
                </Button>
              </div>
            </div>
          </Card>
        )
      ) : (
        <CategoryExpenseEditor />
      )}
    </div>
  );
}
