/**
 * FIRETypeDefinitionsSection Component
 *
 * Main section displaying all FIRE type definitions in a responsive grid.
 * Loads definitions from constants, passes personalized calculations to cards,
 * and handles type selection.
 *
 * Features:
 * - Section header with explanation
 * - Responsive grid (1/2/3 columns based on screen size)
 * - All 5 FIRE type cards
 * - Personalized calculations integration
 * - Card selection handling
 * - Link to comparison section
 */

'use client';

import { FIRETypeCard } from './FIRETypeCard';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FIRE_TYPE_DEFINITIONS } from '@/lib/constants/fireTypes';
import type { FIRETypeId, FIRECalculation, FIRERecommendation } from '@/types/fireTypes';

interface FIRETypeDefinitionsSectionProps {
  /** Calculations for each FIRE type (optional - shows personalized numbers if provided) */
  calculations?: Record<FIRETypeId, FIRECalculation>;

  /** Recommendations (optional - shows ranking and badges) */
  recommendations?: FIRERecommendation[];

  /** Currently selected FIRE type */
  selectedType?: FIRETypeId | null;

  /** Callback when user selects a FIRE type */
  onSelectType?: (typeId: FIRETypeId) => void;

  /** Callback when user clicks "Learn more" */
  onLearnMore?: (typeId: FIRETypeId) => void;

  /** Callback for scrolling to comparison section */
  onViewComparison?: () => void;

  /** Whether to show the comparison link */
  showComparisonLink?: boolean;
}

export function FIRETypeDefinitionsSection({
  calculations,
  recommendations,
  selectedType,
  onSelectType,
  onLearnMore,
  onViewComparison,
  showComparisonLink = false,
}: FIRETypeDefinitionsSectionProps) {
  /**
   * Get recommendation data for a specific type
   */
  const getRecommendationForType = (typeId: FIRETypeId) => {
    if (!recommendations) return undefined;
    return recommendations.find((rec) => rec.fireTypeId === typeId);
  };

  /**
   * Check if type is recommended (rank 1-3)
   */
  const isRecommended = (typeId: FIRETypeId): boolean => {
    const rec = getRecommendationForType(typeId);
    return rec ? rec.rank <= 3 : false;
  };

  /**
   * Get rank for type
   */
  const getRank = (typeId: FIRETypeId): number | undefined => {
    const rec = getRecommendationForType(typeId);
    return rec?.rank;
  };

  /**
   * Sort definitions by recommendation rank (if available)
   */
  const sortedDefinitions = [...FIRE_TYPE_DEFINITIONS].sort((a, b) => {
    const rankA = getRank(a.id) || 999;
    const rankB = getRank(b.id) || 999;
    return rankA - rankB;
  });

  return (
    <section className="py-8 space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          FIRE Tegundir
        </h2>
        <p className="text-lg text-gray-700">
          Fimm mismunandi leiðir til fjármálafrelsis. Hver og ein hentar ólíkum
          lífsstíl, tekjum og markmiðum. Veldu þá leið sem passar best fyrir þig.
        </p>

        {/* Info Alert */}
        {calculations && recommendations && (
          <Alert variant="info" className="text-left">
            <p className="text-sm">
              <strong>Athugið:</strong> Tölurnar hér að neðan eru reiknaðar út frá
              þínum upplýsingum. Tegundir eru raðaðar eftir því hversu vel þær henta
              þinni stöðu.
            </p>
          </Alert>
        )}
      </div>

      {/* FIRE Type Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDefinitions.map((definition) => (
          <FIRETypeCard
            key={definition.id}
            definition={definition}
            calculation={calculations?.[definition.id]}
            isSelected={selectedType === definition.id}
            isRecommended={isRecommended(definition.id)}
            rank={getRank(definition.id)}
            onSelect={onSelectType}
            onLearnMore={onLearnMore}
          />
        ))}
      </div>

      {/* Comparison Link */}
      {showComparisonLink && onViewComparison && (
        <div className="text-center pt-4">
          <Button
            onClick={onViewComparison}
            variant="secondary"
            size="lg"
          >
            Bera saman allar tegundir
          </Button>
        </div>
      )}

      {/* Educational Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
        <h3 className="font-semibold text-blue-900 mb-2">
          Hvað ætti ég að velja?
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Það er engin ein rétt leið. Þú getur líka blandað saman aðferðum eða skipt
          um stefnu með tímanum. Margir byrja með LeanFIRE markmið en skipuleggja
          fyrir RegularFIRE. Aðrir nota CoastFIRE sem millimarkmið á leiðinni.
          Mikilvægast er að velja leið sem virkar fyrir þinn lífsstíl og markmið.
        </p>
      </div>
    </section>
  );
}
