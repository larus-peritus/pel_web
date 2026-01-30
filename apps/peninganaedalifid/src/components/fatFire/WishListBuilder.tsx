/**
 * WishListBuilder - Wish list feature for lifestyle desires
 *
 * Features:
 * - Add/remove wish list items
 * - Category selector with icons
 * - Priority toggle (must-have vs nice-to-have)
 * - Monthly cost input
 * - Total display by priority
 */

'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import type { WishListItem, WishListCategory, WishListPriority } from '@/types/fatFire';
import {
  WISH_LIST_CATEGORIES,
  FATFIRE_TOOLTIPS,
} from '@/lib/constants/fatFire';
import { formatCurrency } from '@/lib/utils/formatters';

export function WishListBuilder() {
  const { fatFireState, updateFatFireState } = useCalculator();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<{
    name: string;
    category: WishListCategory;
    monthlyCost: number;
    priority: WishListPriority;
    description?: string;
  }>({
    name: '',
    category: 'premium-housing',
    monthlyCost: 0,
    priority: 'must-have',
    description: '',
  });

  if (!fatFireState) return null;

  const wishListItems = fatFireState.wishListItems;

  // Calculate totals by priority
  const mustHaveTotal = wishListItems
    .filter((item) => item.priority === 'must-have')
    .reduce((sum, item) => sum + item.monthlyCost, 0);

  const niceToHaveTotal = wishListItems
    .filter((item) => item.priority === 'nice-to-have')
    .reduce((sum, item) => sum + item.monthlyCost, 0);

  const totalWishList = mustHaveTotal + niceToHaveTotal;

  const handleAddItem = () => {
    if (!newItem.name.trim() || newItem.monthlyCost <= 0) {
      return;
    }

    const item: WishListItem = {
      id: `wishlist-${Date.now()}-${Math.random()}`,
      name: newItem.name.trim(),
      category: newItem.category,
      monthlyCost: newItem.monthlyCost,
      priority: newItem.priority,
      description: newItem.description?.trim() || undefined,
      createdAt: new Date(),
    };

    updateFatFireState({
      wishListItems: [...wishListItems, item],
    });

    // Reset form
    setNewItem({
      name: '',
      category: 'premium-housing',
      monthlyCost: 0,
      priority: 'must-have',
      description: '',
    });
    setShowAddForm(false);
  };

  const handleRemoveItem = (id: string) => {
    updateFatFireState({
      wishListItems: wishListItems.filter((item) => item.id !== id),
    });
  };

  const handleTogglePriority = (id: string) => {
    updateFatFireState({
      wishListItems: wishListItems.map((item) =>
        item.id === id
          ? {
              ...item,
              priority: item.priority === 'must-have' ? 'nice-to-have' : 'must-have',
            }
          : item
      ),
    });
  };

  const getCategoryConfig = (categoryId: WishListCategory) => {
    return WISH_LIST_CATEGORIES.find((cat) => cat.id === categoryId);
  };

  return (
    <Card variant="elevated" className="border-amber-200">
      <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-amber-900">
              Óskalisti{' '}
              <Tooltip content={FATFIRE_TOOLTIPS.WISH_LIST_PRIORITY}>
                <span className="text-xs text-gray-700">ℹ️</span>
              </Tooltip>
            </h2>
            <p className="mt-1 text-sm text-amber-700">
              Bættu við lífsstíls óskum fyrir eftirlaunaárin
            </p>
          </div>
          <span className="text-3xl">✨</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Existing Items */}
        {wishListItems.length > 0 ? (
          <div className="space-y-3">
            {wishListItems.map((item) => {
              const categoryConfig = getCategoryConfig(item.category);
              return (
                <div
                  key={item.id}
                  className="rounded-lg border-2 border-gray-200 bg-white p-4 transition-all hover:border-amber-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">
                        {categoryConfig?.icon ?? '💎'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleTogglePriority(item.id)}
                            className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                              item.priority === 'must-have'
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {item.priority === 'must-have'
                              ? 'Nauðsynlegt'
                              : 'Gott-að-hafa'}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">
                          {categoryConfig?.labelIs ?? 'Óskalisti'}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-700">
                            {item.description}
                          </p>
                        )}
                        <p className="mt-2 text-lg font-semibold text-amber-600">
                          {formatCurrency(item.monthlyCost)}/mán
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-700 hover:text-red-500 transition-colors"
                      aria-label="Fjarlægja"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <span className="text-4xl">✨</span>
            <p className="mt-2 text-sm text-gray-600">
              Engir hlutir á óskarlistanum ennþá.
              <br />
              Bættu við lífsstílsóskum þínum hér að neðan!
            </p>
          </div>
        )}

        {/* Add New Item Button */}
        {!showAddForm && (
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
          >
            + Bæta við ósk
          </Button>
        )}

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="space-y-4 rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
            <h3 className="font-semibold text-amber-900">Ný ósk</h3>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Flokkur
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {WISH_LIST_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setNewItem({ ...newItem, category: category.id })
                    }
                    className={`rounded-lg border-2 p-2 text-center transition-all ${
                      newItem.category === category.id
                        ? 'border-amber-500 bg-amber-100'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl">{category.icon}</div>
                    <p className="mt-1 text-xs font-medium text-gray-700">
                      {category.labelIs}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nafn
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                placeholder="t.d. Sumarbústaður á Þingvöllum"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Monthly Cost */}
            <NumberInput
              label="Mánaðarkostnaður"
              value={newItem.monthlyCost}
              onChange={(value) =>
                setNewItem({ ...newItem, monthlyCost: value })
              }
              min={0}
              suffix="kr"
            />

            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Forgangur
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setNewItem({ ...newItem, priority: 'must-have' })
                  }
                  className={`flex-1 rounded-lg border-2 p-3 text-center transition-all ${
                    newItem.priority === 'must-have'
                      ? 'border-amber-500 bg-amber-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">Nauðsynlegt</p>
                  <p className="text-xs text-gray-600">
                    Innifalið í grunn FI númeri
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewItem({ ...newItem, priority: 'nice-to-have' })
                  }
                  className={`flex-1 rounded-lg border-2 p-3 text-center transition-all ${
                    newItem.priority === 'nice-to-have'
                      ? 'border-amber-500 bg-amber-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">Gott-að-hafa</p>
                  <p className="text-xs text-gray-600">Sýnt sérstaklega</p>
                </button>
              </div>
            </div>

            {/* Description (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lýsing (valfrjálst)
              </label>
              <textarea
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                placeholder="Stuttur lýsing..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleAddItem}
                disabled={!newItem.name.trim() || newItem.monthlyCost <= 0}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
              >
                Bæta við
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Hætta við
              </Button>
            </div>
          </div>
        )}

        {/* Summary */}
        {wishListItems.length > 0 && (
          <div className="space-y-2 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-800">Nauðsynlegt:</span>
              <span className="font-semibold text-amber-900">
                {formatCurrency(mustHaveTotal)}/mán
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-800">Gott-að-hafa:</span>
              <span className="font-semibold text-amber-900">
                {formatCurrency(niceToHaveTotal)}/mán
              </span>
            </div>
            <div className="border-t-2 border-amber-300 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900">Heildaróskalisti:</span>
                <span className="text-lg font-bold text-amber-900">
                  {formatCurrency(totalWishList)}/mán
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
