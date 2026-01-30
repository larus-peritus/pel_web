'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { TargetMilestone } from './TargetMilestone';

/**
 * Target Progress Tracker
 *
 * Displays progress toward standard emergency fund targets:
 * - 3 months (minimum safety)
 * - 6 months (recommended)
 * - 12 months (strong foundation)
 */
export function TargetProgressTracker() {
  const { emergencyFundResults } = useCalculator();

  if (!emergencyFundResults) return null;

  const { targets, monthsOfFreedom } = emergencyFundResults;

  // Check if all targets are achieved
  const allAchieved = targets.every((target) => target.isAchieved);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
          Markmið neyðarsjóðs
        </h2>
        <p className="text-neutral-600">
          Fylgstu með framvindu þinni í átt að fjárhagslegum markmiðum
        </p>
      </div>

      {/* Congratulations message if all achieved */}
      {allAchieved && (
        <div className="bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-300 rounded-lg p-6 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">
            Til hamingju!
          </h3>
          <p className="text-emerald-800">
            Þú hefur náð öllum helstu markmiðum neyðarsjóðs. Þú hefur sterkan fjárhagslegan grunn og gott öryggi.
            Íhugaðu að fjárfesta aukapeninga fyrir langtíma markmið.
          </p>
        </div>
      )}

      {/* Target Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {targets.map((target) => (
          <TargetMilestone
            key={target.months}
            target={target}
          />
        ))}
      </div>

      {/* Progress indicator */}
      {!allAchieved && (
        <div className="text-center text-sm text-neutral-600">
          <p>
            Núverandi staða: <strong>{monthsOfFreedom.toFixed(1)} mánuðir</strong>
          </p>
        </div>
      )}
    </div>
  );
}
