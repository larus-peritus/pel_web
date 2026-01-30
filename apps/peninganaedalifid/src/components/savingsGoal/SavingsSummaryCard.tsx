/**
 * Summary card showing overview of all goals
 */

'use client';

import { Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatISK } from '@/lib/savingsGoal/utils';
import type { SavingsSummary } from '@/types/savingsGoal';

interface SavingsSummaryCardProps {
  summary: SavingsSummary;
}

export function SavingsSummaryCard({ summary }: SavingsSummaryCardProps) {
  return (
    <Card className="mb-8 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Goals */}
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Virk markmið</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalGoals}</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="flex items-start gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Heildarframfarir</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(summary.overallProgress)}%
            </p>
          </div>
        </div>

        {/* Total Amounts */}
        <div className="flex items-start gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Heildarupphæð</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatISK(summary.totalCurrentAmount)}
            </p>
            <p className="text-xs text-gray-500">af {formatISK(summary.totalTargetAmount)}</p>
          </div>
        </div>

        {/* Hours Worked */}
        <div className="flex items-start gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Unnið</p>
            <p className="text-lg font-semibold text-green-700">
              {summary.formattedTotalHoursWorked}
            </p>
          </div>
        </div>

        {/* Hours Remaining */}
        <div className="flex items-start gap-3">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Eftir</p>
            <p className="text-lg font-semibold text-amber-700">
              {summary.formattedTotalHoursRemaining}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
