/**
 * FrugalityTips - Personalized frugality tips based on expense analysis
 *
 * Features:
 * - Generated tips based on user's expenses
 * - Difficulty levels (easy, moderate, hard)
 * - Potential savings display
 * - Iceland-specific resources/links
 * - Mark as implemented toggle
 */

'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import { EXPENSE_CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/types/leanFire';
import type { FrugalityTip } from '@/types/leanFire';

export function FrugalityTips() {
  const { leanFireResults } = useCalculator();

  const [implementedTips, setImplementedTips] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  if (!leanFireResults?.frugalityTips || leanFireResults.frugalityTips.length === 0) {
    return null;
  }

  const tips = leanFireResults.frugalityTips;

  const handleToggleImplemented = (tipId: string) => {
    const newImplemented = new Set(implementedTips);
    if (newImplemented.has(tipId)) {
      newImplemented.delete(tipId);
    } else {
      newImplemented.add(tipId);
    }
    setImplementedTips(newImplemented);
  };

  // Filter tips by difficulty
  const filteredTips =
    filterDifficulty === 'all'
      ? tips
      : tips.filter((tip) => tip.difficulty === filterDifficulty);

  // Calculate potential savings from implemented tips
  const implementedSavings = tips
    .filter((tip) => implementedTips.has(tip.id))
    .reduce((sum, tip) => sum + tip.potentialSavings, 0);

  const implementedCount = implementedTips.size;

  // Difficulty color mapping
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Ábendingar um sparnaðarleiðir
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Persónulegar ábendingar byggðar á útgjöldum þínum
          </p>
        </div>

        {/* Summary */}
        {implementedCount > 0 && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {implementedCount}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Útfærðar ábendingar
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {implementedSavings.toLocaleString()} kr
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Mánaðarlegur sparnaður
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter by difficulty */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Sía eftir erfiðleika:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterDifficulty('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterDifficulty === 'all'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Allt
            </button>
            <button
              onClick={() => setFilterDifficulty('easy')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterDifficulty === 'easy'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Auðvelt
            </button>
            <button
              onClick={() => setFilterDifficulty('moderate')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterDifficulty === 'moderate'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Í meðallagi
            </button>
            <button
              onClick={() => setFilterDifficulty('hard')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterDifficulty === 'hard'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Erfitt
            </button>
          </div>
        </div>

        {/* Tips List */}
        <div className="space-y-3">
          {filteredTips.map((tip) => {
            const isImplemented = implementedTips.has(tip.id);

            return (
              <div
                key={tip.id}
                className={`bg-white rounded-lg p-5 border-2 transition-all ${
                  isImplemented
                    ? 'border-green-300 bg-green-50'
                    : 'border-yellow-200 hover:border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {tip.title}
                      </h4>

                      {/* Category badge */}
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                        {EXPENSE_CATEGORY_LABELS[tip.category]}
                      </span>

                      {/* Difficulty badge */}
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          difficultyColors[tip.difficulty]
                        }`}
                      >
                        {DIFFICULTY_LABELS[tip.difficulty]}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{tip.description}</p>

                    {/* Icelandic resources */}
                    {tip.icelandicResources && tip.icelandicResources.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs font-medium text-blue-900 mb-1">
                          Íslenskar auðlindir:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tip.icelandicResources.map((resource, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div className="ml-4">
                    <Checkbox
                      checked={isImplemented}
                      onChange={() => handleToggleImplemented(tip.id)}
                      label=""
                    />
                  </div>
                </div>

                {/* Savings metrics */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Hugsanlegur sparnaður:</span>
                    <span className="text-sm font-bold text-green-600">
                      {tip.potentialSavings.toLocaleString()} kr/mán
                    </span>
                  </div>

                  {tip.timelineImpact > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Tímaáhrif:</span>
                      <span className="text-sm font-bold text-purple-600">
                        {tip.timelineImpact.toFixed(1)} mánuðir
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTips.length === 0 && (
          <Alert variant="info">
            <p className="text-sm">
              Engar ábendingar á þessu erfiðleikastigi. Prófaðu aðra síu.
            </p>
          </Alert>
        )}

        {/* Info note */}
        <Alert variant="info">
          <p className="text-sm">
            <strong>Ábending:</strong> Byrjaðu á auðveldum ábendingum til að byggja upp
            sparnaðarvenjur. Þú getur alltaf bætt við erfiðari atriðum síðar.
          </p>
        </Alert>
      </div>
    </Card>
  );
}
