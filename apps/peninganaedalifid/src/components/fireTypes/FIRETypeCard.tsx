/**
 * FIRETypeCard Component
 *
 * Displays a single FIRE type with its definition, personalized calculations,
 * pros/cons, and action buttons. Responsive card layout with color coding.
 *
 * Features:
 * - Icon, name (Icelandic + English subtitle)
 * - Tagline and description
 * - Personalized numbers (if calculation data available)
 * - "Ideal for" candidates
 * - Pros and cons
 * - "Learn more" expandable details
 * - "Select this type" button
 * - Color coding per FIRE type
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { FIRETypeDefinition, FIRECalculation, FIRETypeId } from '@/types/fireTypes';

interface FIRETypeCardProps {
  definition: FIRETypeDefinition;
  calculation?: FIRECalculation;
  isSelected?: boolean;
  isRecommended?: boolean;
  rank?: number;
  onSelect?: (typeId: FIRETypeId) => void;
  onLearnMore?: (typeId: FIRETypeId) => void;
}

/**
 * Color mapping for FIRE types to Tailwind classes
 */
const COLOR_CLASSES = {
  amber: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    badge: 'bg-amber-100 text-amber-800',
    button: 'bg-amber-600 hover:bg-amber-700',
    icon: 'bg-amber-100',
  },
  green: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    text: 'text-green-900',
    badge: 'bg-green-100 text-green-800',
    button: 'bg-green-600 hover:bg-green-700',
    icon: 'bg-green-100',
  },
  cyan: {
    border: 'border-cyan-200',
    bg: 'bg-cyan-50',
    text: 'text-cyan-900',
    badge: 'bg-cyan-100 text-cyan-800',
    button: 'bg-cyan-600 hover:bg-cyan-700',
    icon: 'bg-cyan-100',
  },
  purple: {
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    badge: 'bg-purple-100 text-purple-800',
    button: 'bg-purple-600 hover:bg-purple-700',
    icon: 'bg-purple-100',
  },
  pink: {
    border: 'border-pink-200',
    bg: 'bg-pink-50',
    text: 'text-pink-900',
    badge: 'bg-pink-100 text-pink-800',
    button: 'bg-pink-600 hover:bg-pink-700',
    icon: 'bg-pink-100',
  },
};

/**
 * Format ISK currency
 */
function formatISK(amount: number): string {
  return new Intl.NumberFormat('is-IS', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format years to readable string
 */
function formatYears(years: number | null): string {
  if (years === null || years === Infinity) return 'Óvíst';

  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);

  if (wholeYears === 0) {
    if (months === 0) return 'Minna en mánuður';
    return `${months} mánuðir`;
  }
  if (months === 0) return `${wholeYears} ár`;
  return `${wholeYears} ár og ${months} mánuðir`;
}

export function FIRETypeCard({
  definition,
  calculation,
  isSelected = false,
  isRecommended = false,
  rank,
  onSelect,
  onLearnMore,
}: FIRETypeCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const colorScheme = COLOR_CLASSES[definition.color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.green;

  const handleSelectClick = () => {
    if (onSelect) {
      onSelect(definition.id);
    }
  };

  const handleLearnMoreClick = () => {
    if (onLearnMore) {
      onLearnMore(definition.id);
    }
  };

  return (
    <Card
      className={`
        relative transition-all duration-200
        ${isSelected ? `ring-2 ring-offset-2 ${colorScheme.border.replace('border-', 'ring-')}` : ''}
        ${isRecommended ? `border-2 ${colorScheme.border}` : 'border border-gray-200'}
      `}
    >
      {/* Recommended Badge */}
      {isRecommended && rank && (
        <div className="absolute -top-3 left-4">
          <Badge variant="success" className={colorScheme.badge}>
            {rank === 1 ? 'Mælt með' : `#${rank} valkostur`}
          </Badge>
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
          <div className={`${colorScheme.button} rounded-full p-1`}>
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <CardHeader className={`${colorScheme.bg} border-b border-gray-200`}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`${colorScheme.icon} rounded-lg p-3 text-3xl`}>
            {definition.icon}
          </div>

          {/* Name and Tagline */}
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${colorScheme.text}`}>
              {definition.nameIs}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">{definition.nameEn}</p>
            <p className="text-sm font-medium text-gray-700 mt-2">{definition.tagline}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">{definition.description}</p>

        {/* Personalized Numbers */}
        {calculation && (
          <div className={`${colorScheme.bg} rounded-lg p-4 space-y-2`}>
            <h4 className="font-semibold text-sm text-gray-900">Þínar tölur</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">FI tala</p>
                <p className="font-bold text-gray-900">{formatISK(calculation.fiNumber)} kr</p>
              </div>
              <div>
                <p className="text-gray-600">Tími til FI</p>
                <p className="font-bold text-gray-900">{formatYears(calculation.yearsToFI)}</p>
              </div>
              <div>
                <p className="text-gray-600">Mánaðarútgjöld</p>
                <p className="font-bold text-gray-900">{formatISK(calculation.monthlyExpenses)} kr</p>
              </div>
              <div>
                <p className="text-gray-600">Framvinda</p>
                <p className="font-bold text-gray-900">{calculation.currentProgress.toFixed(1)}%</p>
              </div>
            </div>

            {/* BaristaFIRE specific */}
            {calculation.baristaData && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Þarf {formatISK(calculation.baristaData.partTimeIncomeNeeded)} kr/mán í hlutavinnu
                </p>
              </div>
            )}

            {/* CoastFIRE specific */}
            {calculation.coastData && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  {calculation.coastData.isCoasting
                    ? 'Þú ert nú þegar kominn á Coast!'
                    : `Coast eftir ${formatYears(calculation.coastData.yearsUntilCoast)}`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Ideal For */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-2">Hentar best fyrir:</h4>
          <ul className="space-y-1">
            {definition.bestFor.slice(0, 3).map((item, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className={`${colorScheme.text} mt-0.5`}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Pros */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-green-600">✓</span> Kostir
              </h4>
              <ul className="space-y-1.5">
                {definition.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-red-600">✗</span> Gallar
              </h4>
              <ul className="space-y-1.5">
                {definition.cons.map((con, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">-</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not For */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Hentar ekki fyrir:</h4>
              <ul className="space-y-1">
                {definition.notFor.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Learn More Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          {showDetails ? (
            <>
              Sjá minna <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Sjá ítarlegar upplýsingar <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </CardContent>

      <CardFooter className="gap-2 bg-gray-50 border-t border-gray-200">
        <Button
          onClick={handleLearnMoreClick}
          variant="secondary"
          className="flex-1"
        >
          Lesa meira
        </Button>
        <Button
          onClick={handleSelectClick}
          className={`flex-1 ${colorScheme.button} text-white`}
          disabled={isSelected}
        >
          {isSelected ? 'Valið' : 'Velja þetta'}
        </Button>
      </CardFooter>
    </Card>
  );
}
