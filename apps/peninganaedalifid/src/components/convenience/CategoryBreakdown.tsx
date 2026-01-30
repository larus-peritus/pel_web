'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { ConvenienceExpenseSummary } from '@/types/calculator';

interface CategoryBreakdownProps {
  summary: ConvenienceExpenseSummary;
}

/**
 * Category breakdown of convenience expenses
 */
export function CategoryBreakdown({ summary }: CategoryBreakdownProps) {
  const { byCategory, totalMonthly } = summary;

  // Category colors
  const categoryColors: Record<string, string> = {
    delivery: 'bg-orange-500',
    taxi: 'bg-yellow-500',
    prepared: 'bg-green-500',
    restaurant: 'bg-purple-500',
    impulse: 'bg-pink-500',
    other: 'bg-gray-500',
  };

  if (byCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Sundurliðun eftir flokkum
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 text-center py-8">
            Engin gögn til að sýna. Skráðu kostnað til að sjá sundurliðun.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          Sundurliðun eftir flokkum
        </h3>
        <p className="text-sm text-gray-600 mt-1">Síðustu 30 daga</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {byCategory.map((category) => {
            const colorClass =
              categoryColors[category.category] || categoryColors.other;

            return (
              <div key={category.category}>
                {/* Category header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${colorClass}`}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {category.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({category.count} {category.count === 1 ? 'færsla' : 'færslur'})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {category.total.toLocaleString('is-IS', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      kr
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.percentage.toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 ${colorClass} rounded-full transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                    role="progressbar"
                    aria-valuenow={category.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${category.label}: ${category.percentage.toFixed(0)}%`}
                  />
                </div>

                {/* Average per occurrence */}
                <div className="mt-1 text-xs text-gray-500">
                  Meðaltal:{' '}
                  {(category.total / category.count).toLocaleString('is-IS', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kr per færslu
                </div>
              </div>
            );
          })}
        </div>

        {/* Total summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Samtals (mánaður)
            </span>
            <span className="text-lg font-bold text-gray-900">
              {totalMonthly.toLocaleString('is-IS', {
                maximumFractionDigits: 0,
              })}{' '}
              kr
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
