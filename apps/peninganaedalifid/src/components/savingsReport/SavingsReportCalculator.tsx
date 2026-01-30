'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { SavingsEditor } from './SavingsEditor';
import { SavingsDashboard } from './SavingsDashboard';

/**
 * SavingsReportCalculator - Main component for savings report feature
 *
 * Features:
 * - Auto-detects mode (editor if no data, dashboard if data exists)
 * - View mode toggle between dashboard and editor
 * - Educational intro section (collapsible)
 * - AWH warning if not calculated
 * - Renders SavingsEditor or SavingsDashboard based on mode
 *
 * @returns JSX.Element
 */
export function SavingsReportCalculator() {
  const {
    hasSavingsReport,
    initializeSavingsReport,
    results
  } = useCalculator();

  // Determine initial mode: editor if no data exists, dashboard if data exists
  const hasData = hasSavingsReport();
  const [viewMode, setViewMode] = useState<'dashboard' | 'editor'>(hasData ? 'dashboard' : 'editor');
  const [showIntro, setShowIntro] = useState(true);

  // Initialize savings report if starting fresh (no data exists)
  const handleStartFresh = () => {
    initializeSavingsReport();
    setViewMode('editor');
  };

  // Check if AWH is available
  const hasAWH = results?.actualHourlyWage && results.actualHourlyWage > 0;

  return (
    <div className="space-y-6">
      {/* Educational Intro Section (Collapsible) */}
      {showIntro && (
        <Card className="bg-gradient-to-r from-success-50 to-primary-50 border-success-200">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Um sparnaðarskýrsluna
                </h3>
                <div className="text-sm text-neutral-700 space-y-2">
                  <p>
                    Sparnaðarskýrslan hjálpar þér að fylgjast með öllum sparnaði þínum á einum stað.
                    Skráðu núverandi stöðu og mánaðarleg framlög í hverjum flokki.
                  </p>
                  <p>
                    <strong>Lífsorka:</strong> Sjáðu sparnaðinn þinn í vinnutímum þegar raunverulegt
                    tímakaup er reiknað út.
                  </p>
                  <p>
                    <strong>Sparnaðarhlutfall:</strong> Við reiknum sjálfkrafa sparnaðarhlutfall þitt
                    út frá tekjum og framlögum.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="ml-4 text-neutral-500 hover:text-neutral-700 text-2xl leading-none"
                aria-label="Loka kynningartexta"
              >
                ×
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* AWH Warning */}
      {!hasAWH && (
        <Alert variant="warning" className="mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-medium mb-1">Raunverulegt tímakaup vantar</p>
              <p className="text-sm">
                Til að sjá sparnaðinn þinn í lífsorku (vinnutímum) þarftu að reikna
                raunverulegt tímakaup þitt fyrst í "Tímakaup" flipanum.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">
          Sparnaðarskýrsla
        </h2>

        {hasData && (
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'dashboard' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('dashboard')}
            >
              Yfirlit
            </Button>
            <Button
              variant={viewMode === 'editor' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('editor')}
            >
              Breyta
            </Button>
          </div>
        )}
      </div>

      {/* Render appropriate mode */}
      {!hasData && viewMode === 'editor' && (
        <Card className="p-6 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl">💰</div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Engin sparnaðargögn skráð
            </h3>
            <p className="text-neutral-600">
              Byrjaðu að fylgjast með sparnaðinum þínum með því að skrá núverandi stöðu
              og mánaðarleg framlög í hverjum flokki.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleStartFresh}
            >
              Byrja að skrá sparnað
            </Button>
          </div>
        </Card>
      )}

      {hasData && viewMode === 'dashboard' && (
        <SavingsDashboard onEditClick={() => setViewMode('editor')} />
      )}

      {hasData && viewMode === 'editor' && (
        <SavingsEditor />
      )}
    </div>
  );
}
