/**
 * Header component for savings goal page
 */

'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SavingsGoalHeaderProps {
  canAddMore: boolean;
  onAddClick: () => void;
}

export function SavingsGoalHeader({ canAddMore, onAddClick }: SavingsGoalHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sparnaðarmarkmið</h1>
          <p className="mt-2 text-gray-600">
            Fylgdu framförum þínum í lífsorku-einingum, ekki bara krónum
          </p>
        </div>

        <Button
          onClick={onAddClick}
          variant="primary"
          disabled={!canAddMore}
          className="flex items-center gap-2"
          title={!canAddMore ? 'Hámark 5 markmið í einu' : undefined}
        >
          <Plus className="w-4 h-4" />
          Bæta við markmiði
        </Button>
      </div>

      {!canAddMore && (
        <p className="mt-2 text-sm text-amber-600">
          Hámark náð. Þú getur haft allt að 5 markmið í einu. Ljúktu markmiði til að bæta við
          nýju.
        </p>
      )}
    </div>
  );
}
