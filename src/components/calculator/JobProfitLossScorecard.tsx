'use client';

import React, { useMemo, useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { calculateProfitabilityGrade } from '@/lib/calculations/profitability';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';
import { formatCurrency } from '@/lib/utils/formatters';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';
import { PROFITABILITY_LABELS } from '@/lib/constants/profitability';
import type { ProfitabilityGrade } from '@/types/calculator';

/**
 * Props for JobProfitLossScorecard component
 */
export interface JobProfitLossScorecardProps {
  className?: string;
}

/**
 * Grade badge color mapping
 */
const GRADE_COLORS: Record<ProfitabilityGrade, string> = {
  A: 'bg-gradient-to-br from-success-500 to-success-600 text-white',
  B: 'bg-gradient-to-br from-success-400 to-success-500 text-white',
  C: 'bg-gradient-to-br from-warning-400 to-warning-500 text-white',
  D: 'bg-gradient-to-br from-warning-500 to-warning-600 text-white',
  F: 'bg-gradient-to-br from-danger-500 to-danger-600 text-white',
};

/**
 * Badge variant mapping based on severity
 */
const BADGE_VARIANT_MAP = {
  success: 'success' as const,
  warning: 'warning' as const,
  error: 'danger' as const,
};

/**
 * Alert variant mapping based on severity
 */
const ALERT_VARIANT_MAP = {
  success: 'success' as const,
  warning: 'warning' as const,
  error: 'error' as const,
};

/**
 * Job Profit/Loss Scorecard Component
 *
 * Displays a comprehensive profitability assessment of the user's job,
 * including:
 * - Letter grade (A-F) based on wage reduction
 * - Net life energy gained/lost per week and month
 * - Income breakdown (gross → expenses → net)
 * - Time breakdown (base → extra → total hours)
 * - Plain language summary with recommendations
 *
 * Based on "Your Money or Your Life" Chapter 2 methodology.
 */
export function JobProfitLossScorecard({ className }: JobProfitLossScorecardProps) {
  const { results } = useCalculator();
  const [showScore, setShowScore] = useState(false);

  // Calculate profitability assessment
  const profitability = useMemo(
    () => calculateProfitabilityGrade(results),
    [results]
  );

  // Check if we have valid data from main calculator
  const hasValidData = results && results.actualHourlyWage > 0;

  // Show intro screen if no score revealed yet or no valid data
  if (!showScore || !profitability || !results) {
    return (
      <Card className={cn('max-w-3xl mx-auto', className)}>
        <CardHeader>
          <h2 className="text-2xl font-bold text-neutral-900">
            {PROFITABILITY_LABELS.cardTitle}
          </h2>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Introduction */}
          <div className="text-center py-4">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg text-neutral-700 mb-6">
              Fáðu einkunn fyrir hagkvæmni starfsins þíns miðað við raunverulegt tímakaup.
            </p>
          </div>

          {/* Grading explanation */}
          <div className="bg-neutral-50 p-5 rounded-lg space-y-4">
            <h3 className="font-semibold text-neutral-900">Hvernig einkunnin er reiknuð:</h3>
            <p className="text-sm text-neutral-600">
              Einkunnin er byggð á því hversu mikið raunverulegt tímakaup þitt lækkar
              frá upphaflegutímakaupi vegna vinnukostnaðar (ferðir, fatnaður, matur, o.fl.) og
              aukatíma sem fer í vinnuna.
            </p>

            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              <div className="p-2 rounded bg-success-100">
                <div className="font-bold text-success-700">A</div>
                <div className="text-xs text-success-600">&lt;15%</div>
              </div>
              <div className="p-2 rounded bg-success-50">
                <div className="font-bold text-success-600">B</div>
                <div className="text-xs text-success-500">15-30%</div>
              </div>
              <div className="p-2 rounded bg-warning-50">
                <div className="font-bold text-warning-600">C</div>
                <div className="text-xs text-warning-500">30-45%</div>
              </div>
              <div className="p-2 rounded bg-warning-100">
                <div className="font-bold text-warning-700">D</div>
                <div className="text-xs text-warning-600">45-60%</div>
              </div>
              <div className="p-2 rounded bg-danger-50">
                <div className="font-bold text-danger-600">F</div>
                <div className="text-xs text-danger-500">&gt;60%</div>
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Dæmi: Ef upphaflegt tímakaup þitt er 6.000 kr/klst en raunverulegt tímakaup er 4.500 kr/klst,
              þá er lækkun 25% og einkunnin er <strong>B</strong>.
            </p>
          </div>

          {/* Data source notice */}
          <Alert variant="info">
            <div className="text-sm">
              <strong>Gögn úr aðalreiknivél:</strong> Einkunnin byggir á upplýsingum sem þú slóst inn
              í aðalreiknivélina (tekjur, vinnustundir, kostnaður). Breyttu þar til að sjá aðra einkunn.
            </div>
          </Alert>

          {/* Show score button */}
          {hasValidData ? (
            <Button
              onClick={() => setShowScore(true)}
              className="w-full"
              size="lg"
            >
              Sýna einkunn mína
            </Button>
          ) : (
            <Alert variant="warning">
              <div className="text-sm">
                <strong>Fylltu út aðalreiknivélina fyrst</strong> til að fá einkunn.
                Þú þarft að slá inn tekjur og vinnustundir.
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  const {
    grade,
    gradeLabel,
    gradeExplanation,
    totalHoursInvested,
    equivalentHoursAtNominal,
    invisibleHours,
    totalHoursInvestedMonthly,
    equivalentHoursAtNominalMonthly,
    invisibleHoursMonthly,
    isProfit,
    severity,
  } = profitability;

  const {
    nominalHourlyWage,
    actualHourlyWage,
    netAnnualIncome,
    totalMoneyExpenses,
    baseWeeklyHours,
    totalExtraHours,
    totalWeeklyHours,
  } = results;

  // Calculate gross annual income for display
  const grossAnnualIncome = netAnnualIncome + totalMoneyExpenses;

  // Calculate average hours per day
  const avgHoursPerDay = totalWeeklyHours / 5; // Assuming 5 work days

  return (
    <Card className={cn('max-w-3xl mx-auto', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">
            {PROFITABILITY_LABELS.cardTitle}
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowScore(false)}
          >
            Til baka
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Grade Display Section */}
        <div className="flex flex-col items-center text-center space-y-3 py-4">
          <div
            className={cn(
              'w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg',
              GRADE_COLORS[grade]
            )}
          >
            <span className="text-5xl font-bold">{grade}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">{gradeLabel}</h3>
            <p className="text-sm text-neutral-600 mt-1 max-w-md">{gradeExplanation}</p>
          </div>
        </div>

        {/* Invisible Hours Section */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Ósýnilegur tími
          </h3>
          <p className="text-sm text-neutral-600 mb-3">
            Munurinn á tíma sem þú gefur í vinnuna og verðmætunum sem þú færð til baka.
          </p>

          {/* Weekly View */}
          <div className="bg-neutral-50 p-4 rounded-lg space-y-3 mb-4">
            <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Á viku
            </div>

            {/* Hours Invested */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-700">
                Tími sem þú gefur
              </span>
              <div className="font-semibold text-neutral-900">
                {totalHoursInvested.toFixed(1)} klst
              </div>
            </div>

            {/* Equivalent Hours */}
            <div className="flex justify-between items-center border-t border-neutral-200 pt-2">
              <span className="text-sm text-neutral-700">
                Tími sem þú færð
                <span className="text-xs text-neutral-500 block">
                  (miðað við upphaflegt tímakaup: {formatCurrency(Math.round(nominalHourlyWage))}/klst)
                </span>
              </span>
              <div className="font-semibold text-success-700">
                {equivalentHoursAtNominal.toFixed(1)} klst
              </div>
            </div>

            {/* Invisible Hours */}
            <div className="flex justify-between items-center border-t-2 border-neutral-300 pt-2">
              <span className="text-sm font-semibold text-neutral-900">
                = Ósýnilegur tími
              </span>
              <div
                className={cn(
                  'font-bold text-lg',
                  invisibleHours > 0 ? 'text-danger-700' : 'text-success-700'
                )}
              >
                {invisibleHours > 0 ? '+' : ''}{invisibleHours.toFixed(1)} klst
              </div>
            </div>
          </div>

          {/* Monthly Summary */}
          <div
            className={cn(
              'p-4 rounded-lg border-2',
              invisibleHours > 0
                ? 'bg-danger-50 border-danger-200'
                : 'bg-success-50 border-success-200'
            )}
          >
            <div className="text-sm font-medium text-neutral-600 mb-1">
              Á mánuði tapar þú:
            </div>
            <div
              className={cn(
                'text-2xl font-bold',
                invisibleHours > 0 ? 'text-danger-700' : 'text-success-700'
              )}
            >
              {formatLifeEnergy(Math.abs(invisibleHoursMonthly))}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {invisibleHours > 0
                ? 'í falinn kostnað og ólaunaðan tíma'
                : 'þú færð meira verðmæti en tíma sem þú gefur!'}
            </div>
          </div>

          <p className="text-xs text-neutral-500 mt-3 italic">
            Þetta er munurinn á heildartíma (vinna + ferðatími + aukatími) og þeim tíma sem þyrfti
            til að vinna sömu nettótekjur ef þú fengir borgað upphaflegt tímakaup þitt.
          </p>
        </div>

        {/* Income Breakdown Section */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">
            {PROFITABILITY_LABELS.incomeBreakdownSection}
          </h3>
          <div className="space-y-2 bg-neutral-50 p-4 rounded-lg">
            {/* Gross Income */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-700">
                {PROFITABILITY_LABELS.grossIncome}
              </span>
              <div className="text-right">
                <div className="font-semibold text-neutral-900">
                  {formatCurrency(grossAnnualIncome)}
                </div>
                <div className="text-xs text-neutral-500">
                  ({formatLifeEnergy(grossAnnualIncome / actualHourlyWage)})
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="flex justify-between items-center border-t border-neutral-200 pt-2">
              <span className="text-sm text-danger-700 font-medium">
                − {PROFITABILITY_LABELS.totalExpenses}
              </span>
              <div className="text-right">
                <div className="font-semibold text-danger-700">
                  {formatCurrency(totalMoneyExpenses)}
                </div>
                <div className="text-xs text-neutral-500">
                  ({formatLifeEnergy(totalMoneyExpenses / actualHourlyWage)})
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div className="flex justify-between items-center border-t-2 border-neutral-300 pt-2">
              <span className="text-sm font-semibold text-neutral-900">
                = {PROFITABILITY_LABELS.netIncome}
              </span>
              <div className="text-right">
                <div className="font-bold text-lg text-neutral-900">
                  {formatCurrency(netAnnualIncome)}
                </div>
                <div className="text-xs text-neutral-500">
                  ({formatLifeEnergy(netAnnualIncome / actualHourlyWage)})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Breakdown Section */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">
            {PROFITABILITY_LABELS.timeBreakdownSection}
          </h3>
          <div className="space-y-2 bg-neutral-50 p-4 rounded-lg">
            {/* Base Hours */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-700">
                {PROFITABILITY_LABELS.baseHours}
              </span>
              <div className="font-semibold text-neutral-900">
                {baseWeeklyHours.toFixed(1)} {PROFITABILITY_LABELS.hoursShort}
              </div>
            </div>

            {/* Extra Hours */}
            <div className="flex justify-between items-center border-t border-neutral-200 pt-2">
              <span className="text-sm text-warning-700 font-medium">
                + {PROFITABILITY_LABELS.extraHours}
              </span>
              <div className="font-semibold text-warning-700">
                {totalExtraHours.toFixed(1)} {PROFITABILITY_LABELS.hoursShort}
              </div>
            </div>

            {/* Total Hours */}
            <div className="flex justify-between items-center border-t-2 border-neutral-300 pt-2">
              <span className="text-sm font-semibold text-neutral-900">
                = {PROFITABILITY_LABELS.totalHours}
              </span>
              <div className="text-right">
                <div className="font-bold text-lg text-neutral-900">
                  {totalWeeklyHours.toFixed(1)} {PROFITABILITY_LABELS.hoursShort}
                </div>
                <div className="text-xs text-neutral-500">
                  ({avgHoursPerDay.toFixed(1)} {PROFITABILITY_LABELS.hoursPerDay})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plain Language Summary */}
        <Alert variant={ALERT_VARIANT_MAP[severity]}>
          <div className="space-y-3">
            <p className="font-medium">{gradeExplanation}</p>
            <div className="text-sm space-y-2">
              <p>
                <strong>Upphaflegt tímakaup:</strong> {formatCurrency(Math.round(nominalHourlyWage))}/klst
                <span className="text-neutral-500"> (laun ÷ vinnustundir)</span>
              </p>
              <p>
                <strong>Raunverulegt tímakaup:</strong> {formatCurrency(Math.round(actualHourlyWage))}/klst
                <span className="text-neutral-500"> (nettótekjur ÷ heildartími)</span>
              </p>
              <p className="pt-2 border-t border-neutral-200">
                <strong>Niðurstaða:</strong> Þú gefur{' '}
                <strong>{totalHoursInvested.toFixed(1)} klst/viku</strong> í vinnuna,
                en færð aðeins verðmæti sem samsvarar{' '}
                <strong>{equivalentHoursAtNominal.toFixed(1)} klst</strong> miðað við upphaflegt tímakaup.
                {invisibleHours > 0 ? (
                  <>
                    {' '}Þú tapar{' '}
                    <strong className="text-danger-700">
                      {invisibleHours.toFixed(1)} klst/viku
                    </strong>{' '}
                    í falinn kostnað.
                  </>
                ) : (
                  <>
                    {' '}Þú færð{' '}
                    <strong className="text-success-700">
                      {Math.abs(invisibleHours).toFixed(1)} klst/viku
                    </strong>{' '}
                    umfram það sem þú gefur!
                  </>
                )}
              </p>
            </div>
          </div>
        </Alert>
      </CardContent>
    </Card>
  );
}
