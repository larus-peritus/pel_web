/**
 * Reorderable list of expense categories with up/down buttons
 * Shows priority order and cut allocations
 */

'use client';

import type { CascadingCutCategory } from '@/types/cascadingCut';
import { CategoryPriorityItem } from './CategoryPriorityItem';

interface CategoryPriorityListProps {
  categories: CascadingCutCategory[];
  onReorder: (categoryId: string, direction: 'up' | 'down') => void;
  className?: string;
}

export function CategoryPriorityList({
  categories,
  onReorder,
  className = '',
}: CategoryPriorityListProps) {
  // Sort by priority for display
  const sortedCategories = [...categories].sort((a, b) => a.priority - b.priority);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Forgangur niðurskurðar
        </h3>
        <p className="text-xs text-gray-500">
          Útgjöld efst verða skornin fyrst
        </p>
      </div>

      <div className="space-y-2">
        {sortedCategories.map((category, index) => (
          <CategoryPriorityItem
            key={category.id}
            category={category}
            isFirst={index === 0}
            isLast={index === sortedCategories.length - 1}
            onMoveUp={() => onReorder(category.id, 'up')}
            onMoveDown={() => onReorder(category.id, 'down')}
          />
        ))}
      </div>

      {sortedCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Engar útgjalda flokkar til að sýna
        </div>
      )}
    </div>
  );
}
