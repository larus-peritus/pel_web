/**
 * LeanFIRECard - Calculator hub card for LeanFIRE
 *
 * Features:
 * - Quick status display
 * - Minimum FI number if calculated
 * - Link to full calculator
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface LeanFIRECardProps {
  /** Navigate to full calculator */
  onNavigate: () => void;
}

export function LeanFIRECard({ onNavigate }: LeanFIRECardProps) {
  const { leanFireResults } = useCalculator();

  const hasResults = leanFireResults !== null;
  const minimumFI = leanFireResults?.minimumFINumber || 0;
  const barebonesMonthly = leanFireResults?.barebonesMonthly || 0;

  return (
    <Card className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 border-green-300 hover:border-green-400 transition-all cursor-pointer group">
      <div className="space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🍃</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                LeanFIRE
              </h3>
              <p className="text-sm text-gray-600">Lágmarks FIRE skipuleggjandi</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700">
          Náðu fjárhagslegu frelsi með lágmarksútgjöldum. Reiknaðu lágmarks FI-tölu
          þína, berðu saman staði á Íslandi, og fáðu ábendingar um sparnaðarleiðir.
        </p>

        {/* Results Preview */}
        {hasResults ? (
          <div className="bg-white rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lágmarks FI-tala:</span>
              <span className="text-lg font-bold text-green-700">
                {minimumFI.toLocaleString()} kr
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mánaðarleg útgjöld:</span>
              <span className="text-sm font-semibold text-gray-900">
                {barebonesMonthly.toLocaleString()} kr
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-green-600">
                <span>✓</span>
                <span>Reiknivél fullbúin</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              Byrjaðu að reikna lágmarks FI-tölu þína
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onNavigate}
          variant="primary"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {hasResults ? 'Skoða LeanFIRE áætlun' : 'Byrja að reikna'}
        </Button>

        {/* Features */}
        <div className="pt-3 border-t border-green-200">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-green-600">•</span>
              <span>Lágmarks FI-tala útreikningur</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">•</span>
              <span>Landfræðilegur samanburður (Reykjavík vs Landsbyggð)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">•</span>
              <span>Útgjaldaminnkunar atburðarás</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">•</span>
              <span>Persónulegar sparnaðarábendingar</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
