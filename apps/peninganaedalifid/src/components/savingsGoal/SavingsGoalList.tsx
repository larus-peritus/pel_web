/**
 * List of savings goal cards
 */

'use client';

import { SavingsGoalCard } from './SavingsGoalCard';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useMilestoneNotification } from '@/hooks/useMilestoneNotification';
import type { SavingsGoal, SavingsGoalCalculations } from '@/types/savingsGoal';

interface SavingsGoalListProps {
  goals: SavingsGoal[];
  getCalculations: (goal: SavingsGoal) => SavingsGoalCalculations;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goalId: string) => void;
  onMarkComplete: (goalId: string) => void;
  showDeleteConfirm: string | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

function GoalWithNotification({
  goal,
  calculations,
  onEdit,
  onDelete,
  onMarkComplete,
}: {
  goal: SavingsGoal;
  calculations: SavingsGoalCalculations;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goalId: string) => void;
  onMarkComplete: (goalId: string) => void;
}) {
  const { addToast } = useToast();

  useMilestoneNotification(goal, calculations, (goalId, goalName, milestone) => {
    const messages: Record<number, string> = {
      10: 'Byrjað vel!',
      25: 'Fjórðungur náð!',
      50: 'Hálfnað!',
      75: 'Þrír fjórðu hlutar!',
      100: 'Markmið náð!',
    };

    addToast({ variant: 'success', message: `🎉 ${messages[milestone]} Þú ert komin(n) með ${milestone}% af ${goalName}!` });
  });

  return (
    <SavingsGoalCard
      goal={goal}
      calculations={calculations}
      onEdit={onEdit}
      onDelete={onDelete}
      onMarkComplete={onMarkComplete}
    />
  );
}

export function SavingsGoalList({
  goals,
  getCalculations,
  onEdit,
  onDelete,
  onMarkComplete,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: SavingsGoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">
          Engin markmið ennþá. Bættu við þínu fyrsta markmiði!
        </p>
      </div>
    );
  }

  return (
    <>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Staðfesta eyðingu</h3>
            <p className="text-gray-600 mb-6">
              Ertu viss um að þú viljir eyða þessu markmiði? Þessa aðgerð er ekki hægt að afturkalla.
            </p>
            <div className="flex gap-3 justify-end">
              <Button onClick={onCancelDelete} variant="secondary">
                Hætta við
              </Button>
              <Button onClick={onConfirmDelete} variant="primary" className="bg-red-600 hover:bg-red-700">
                Já, eyða
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {goals.map((goal) => {
          const calculations = getCalculations(goal);
          return (
            <GoalWithNotification
              key={goal.id}
              goal={goal}
              calculations={calculations}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkComplete={onMarkComplete}
            />
          );
        })}
      </div>
    </>
  );
}
