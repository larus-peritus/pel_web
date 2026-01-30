'use client';

import * as React from 'react';
import { ExpenseBaselineStatus } from './ExpenseBaselineStatus';
import { UserFinancialInputs } from './UserFinancialInputs';
import { AssumptionsControls } from './AssumptionsControls';

/**
 * InputsSection Component
 *
 * Main section for user financial inputs and assumptions.
 * Orchestrates the three main input components with clear visual hierarchy.
 *
 * Features:
 * - Section header
 * - ExpenseBaselineStatus at top (important context)
 * - UserFinancialInputs form
 * - AssumptionsControls (collapsible advanced settings)
 * - Clear spacing and visual hierarchy
 * - Responsive layout
 */
export function InputsSection() {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-neutral-900">
          Þínar fjárhagslegar upplýsingar
        </h2>
        <p className="text-neutral-600">
          Sláðu inn núverandi fjárhagsstöðu þína til að fá persónulegar ráðleggingar um
          FIRE-markmiðin þín.
        </p>
      </div>

      {/* Expense Baseline Status - Priority Display */}
      <ExpenseBaselineStatus />

      {/* User Financial Inputs - Main Form */}
      <div>
        <UserFinancialInputs />
      </div>

      {/* Advanced Settings - Collapsible */}
      <div>
        <AssumptionsControls />
      </div>

      {/* Help Section */}
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl" role="img" aria-label="info">
            💡
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-primary-900">Ráð fyrir nákvæmar niðurstöður</h3>
            <ul className="mt-2 space-y-1 text-sm text-primary-800">
              <li>• Búðu til útgjaldagrunn fyrir nákvæmar útgjaldatölur</li>
              <li>• Reiknaðu raunverulegt tímakaup þitt fyrir betri innsýn</li>
              <li>• Vertu heiðarlegur um núverandi sparnaðarhlutfall</li>
              <li>• Íhugaðu vandlega markaldur starfsloka</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
