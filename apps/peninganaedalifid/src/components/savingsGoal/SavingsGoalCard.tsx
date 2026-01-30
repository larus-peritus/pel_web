/**
 * Individual savings goal card
 */

'use client';

import { Edit, Trash2, CheckCircle, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from './ProgressBar';
import { formatISK } from '@/lib/savingsGoal/utils';
import type { SavingsGoal, SavingsGoalCalculations } from '@/types/savingsGoal';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  calculations: SavingsGoalCalculations;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goalId: string) => void;
  onMarkComplete: (goalId: string) => void;
}

export function SavingsGoalCard({
  goal,
  calculations,
  onEdit,
  onDelete,
  onMarkComplete,
}: SavingsGoalCardProps) {
  const isAchieved = calculations.status === 'achieved';

  return (
    <Card className="hover:shadow-lg transition-shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-gray-900">{goal.name}</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(goal)}
            variant="secondary"
            size="sm"
            className="p-2"
            title="Breyta"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {isAchieved && (
            <Button
              onClick={() => onMarkComplete(goal.id)}
              variant="primary"
              size="sm"
              className="p-2 bg-green-600 hover:bg-green-700"
              title="Merkja sem lokið"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={() => onDelete(goal.id)}
            variant="secondary"
            size="sm"
            className="p-2 text-red-600 hover:bg-red-50"
            title="Eyða"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <ProgressBar
          percentage={calculations.progressPercentage}
          status={calculations.status}
          milestones={[10, 25, 50, 75, 100]}
          achievedMilestones={goal.achievedMilestones}
        />
      </div>

      {/* Amount Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600 block mb-1">Upphæð</span>
        <div className="text-lg font-semibold text-gray-900">
          {formatISK(goal.currentAmount)}{' '}
          <span className="text-gray-500 font-normal">af</span>{' '}
          {formatISK(goal.targetAmount)}
        </div>
      </div>

      {/* Stats Display - horizontal on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Unnið</span>
          </div>
          <p className="text-lg font-semibold text-green-700">
            {calculations.formattedHoursWorked}
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-gray-600">Eftir</span>
          </div>
          <p className="text-lg font-semibold text-amber-700">
            {calculations.formattedHoursRemaining}
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Tími til markmiðs</span>
          </div>
          {isAchieved ? (
            <p className="text-lg font-semibold text-green-700">Markmið náð! 🎉</p>
          ) : calculations.monthsToGoal !== null ? (
            <p className="text-lg font-semibold text-blue-700">
              {calculations.monthsToGoal}{' '}
              {calculations.monthsToGoal === 1 ? 'mánuður' : 'mánuðir'}
              {calculations.estimatedCompletionDate && (
                <span className="text-sm text-gray-600 ml-2">
                  ({calculations.estimatedCompletionDate.toLocaleDateString('is-IS')})
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Engin mánaðarleg innborgun</p>
          )}
        </div>
      </div>
    </Card>
  );
}
