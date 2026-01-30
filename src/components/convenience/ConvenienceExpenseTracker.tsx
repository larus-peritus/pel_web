'use client';

import React, { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Alert } from '@/components/ui/Alert';
import { QuickAddExpense } from './QuickAddExpense';
import { ExpenseList } from './ExpenseList';
import { WorkdayComparison } from './WorkdayComparison';
import { CategoryBreakdown } from './CategoryBreakdown';
import { GoalProgress } from './GoalProgress';
import { calculateWorkdayComparison } from '@/lib/calculations/convenienceExpenses';
import { Card, CardContent } from '@/components/ui/Card';

/**
 * Main convenience expense tracker component
 * Integrates all convenience tracking features
 */
export function ConvenienceExpenseTracker() {
  const {
    convenienceExpenses,
    expenseSummary,
    convenienceGoal,
    results,
    setConvenienceGoal,
    deleteConvenienceGoal,
    updateConvenienceExpense,
    deleteConvenienceExpense,
  } = useCalculator();

  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const actualHourlyWage = results?.actualHourlyWage || 0;

  // Calculate workday comparison
  const workdayComparison = calculateWorkdayComparison(convenienceExpenses);

  // Handle edit (simple implementation - could be enhanced with modal)
  const handleEdit = (id: string) => {
    // For MVP, we'll just scroll to the item
    // In a full implementation, this would open an edit modal
    setEditingExpenseId(id);
    console.log('Edit expense:', id);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteConvenienceExpense(id);
  };

  return (
    <div className="space-y-8">
      {/* Warning if no actual hourly wage */}
      {actualHourlyWage === 0 && (
        <Alert
          variant="warning"
          title="Raunverulegt tímakaup vantar"
        >
          Til að sjá lífsorku-kostnað þarftu að fylla fyrst út Raunverulega
          Tímakaups reiknivélina hér að ofan. Þú getur samt skráð kostnað núna.
        </Alert>
      )}

      {/* Desktop layout: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Input and list (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick add expense */}
          <QuickAddExpense />

          {/* Expense list */}
          <ExpenseList
            expenses={convenienceExpenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Right column: Analytics (1/3 width) */}
        <div className="space-y-8">
          {/* Summary cards */}
          {expenseSummary && (
            <div className="space-y-4">
              {/* Weekly summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Vika (síðustu 7 daga)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {expenseSummary.totalWeekly.toLocaleString('is-IS', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      kr
                    </p>
                    {actualHourlyWage > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {expenseSummary.lifeEnergyWeekly.toFixed(1)} klst lífsorka
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Mánuður (síðustu 30 daga)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {expenseSummary.totalMonthly.toLocaleString('is-IS', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      kr
                    </p>
                    {actualHourlyWage > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {expenseSummary.lifeEnergyMonthly.toFixed(1)} klst lífsorka
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Annual summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Ár (áætlað)
                    </p>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                      {expenseSummary.totalAnnualized.toLocaleString('is-IS', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      kr
                    </p>
                    {actualHourlyWage > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {expenseSummary.lifeEnergyAnnualized.toFixed(1)} dagar
                        lífsorka
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Goal progress */}
          {expenseSummary && (
            <GoalProgress
              goal={convenienceGoal || undefined}
              currentMonthly={expenseSummary.totalMonthly}
              actualHourlyWage={actualHourlyWage}
              onSetGoal={setConvenienceGoal}
              onDeleteGoal={deleteConvenienceGoal}
            />
          )}

          {/* Workday comparison */}
          {convenienceExpenses.length > 0 && (
            <WorkdayComparison comparison={workdayComparison} />
          )}

          {/* Category breakdown */}
          {expenseSummary && <CategoryBreakdown summary={expenseSummary} />}
        </div>
      </div>
    </div>
  );
}
