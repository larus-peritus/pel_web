'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import type { InflationScore } from '@/types/calculator';

interface InflationScoreCardProps {
  score: number; // Lifestyle creep percentage
  scoreLevel: InflationScore;
  trend?: 'up' | 'down' | 'stable'; // Optional trend indicator
}

/**
 * Display the lifestyle inflation score
 * Large, color-coded display with Icelandic interpretation
 */
export function InflationScoreCard({ score, scoreLevel, trend }: InflationScoreCardProps) {
  // Get color based on score level
  const getColor = () => {
    switch (scoreLevel) {
      case 'healthy':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          scoreText: 'text-green-600',
          ring: 'ring-green-500',
        };
      case 'caution':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          scoreText: 'text-yellow-600',
          ring: 'ring-yellow-500',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          scoreText: 'text-orange-600',
          ring: 'ring-orange-500',
        };
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          scoreText: 'text-red-600',
          ring: 'ring-red-500',
        };
    }
  };

  // Get interpretation text
  const getInterpretation = () => {
    switch (scoreLevel) {
      case 'healthy':
        return {
          title: 'Heilbrigð fjármálastjórn',
          description: 'Útgjöldin þín eru að halda í við eða undir tekjuaukningu. Þetta er frábært!',
        };
      case 'caution':
        return {
          title: 'Vökul athygli',
          description: 'Útgjöldin þín eru að aukast lítillega umfram tekjur. Fylgstu með þróuninni.',
        };
      case 'warning':
        return {
          title: 'Varúð',
          description: 'Útgjöldin þín eru að aukast verulega umfram tekjur. Tími til að endurskoða venjur.',
        };
      case 'critical':
        return {
          title: 'Alvarleg lífsstílsverðbólga',
          description: 'Útgjöldin þín eru langt umfram tekjuaukningu. Þetta getur tafið FI markmið þín verulega.',
        };
    }
  };

  // Get trend icon
  const getTrendIcon = () => {
    if (!trend) return null;

    switch (trend) {
      case 'up':
        return <span className="text-red-500 text-2xl">↑</span>;
      case 'down':
        return <span className="text-green-500 text-2xl">↓</span>;
      case 'stable':
        return <span className="text-gray-500 text-2xl">→</span>;
    }
  };

  const colors = getColor();
  const interpretation = getInterpretation();

  return (
    <Card className={`${colors.bg} ${colors.border} border-2`}>
      <CardContent className="p-6">
        <div className="text-center">
          {/* Score */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${colors.bg} ring-4 ${colors.ring} ${colors.scoreText}`}>
              <div>
                <div className="text-4xl font-bold">
                  {score >= 0 ? '+' : ''}{score.toFixed(1)}%
                </div>
                <div className="text-xs font-medium mt-1">verðbólga</div>
              </div>
            </div>
            {trend && (
              <div className="flex flex-col items-center">
                {getTrendIcon()}
              </div>
            )}
          </div>

          {/* Interpretation */}
          <div>
            <h3 className={`text-lg font-bold ${colors.text} mb-2`}>
              {interpretation.title}
            </h3>
            <p className={`text-sm ${colors.text}`}>
              {interpretation.description}
            </p>
          </div>

          {/* Score explanation */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Lífsstílsverðbólga</strong> er hversu mikið útgjöldin þín hafa aukist umfram tekjuaukningu þína.
              {score >= 0 ? ' Jákvæð tala þýðir að útgjöld vaxa hraðar en tekjur.' : ' Neikvæð tala þýðir að þú ert að spara meira.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
