/**
 * FIRETypeDetailModal Component
 *
 * Full-screen modal dialog showing comprehensive details about a specific FIRE type.
 * Includes examples, pitfalls, resources, and all detailed information.
 *
 * Features:
 * - Full FIRE type details
 * - Real-world Icelandic examples
 * - Common pitfalls
 * - Resources for learning
 * - Close button (X and Escape key)
 * - Mobile-friendly responsive layout
 * - Keyboard accessible (Tab, Escape)
 */

'use client';

import { useEffect, useCallback } from 'react';
import { X, AlertTriangle, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { FIRETypeDefinition } from '@/types/fireTypes';

interface FIRETypeDetailModalProps {
  definition: FIRETypeDefinition | null;
  onClose: () => void;
}

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
 * Color classes for each FIRE type
 */
const COLOR_CLASSES = {
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    badge: 'bg-amber-100 text-amber-800',
    accent: 'bg-amber-600',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    badge: 'bg-green-100 text-green-800',
    accent: 'bg-green-600',
  },
  cyan: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-900',
    badge: 'bg-cyan-100 text-cyan-800',
    accent: 'bg-cyan-600',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    badge: 'bg-purple-100 text-purple-800',
    accent: 'bg-purple-600',
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-900',
    badge: 'bg-pink-100 text-pink-800',
    accent: 'bg-pink-600',
  },
};

/**
 * Common pitfalls for each FIRE type
 */
const PITFALLS: Record<string, string[]> = {
  leanfire: [
    'Vanmeta kostnað við ófyrirséðar aðstæður',
    'Útiloka félagslegan lífsstíl og einangrun',
    'Gleyma að taka tillit til verðbólgu',
    'Ekki hafa plan fyrir heilsufarskostnað',
    'Of mikil áhersla á peningalegt frelsi, gleymir lífsgæðum',
  ],
  regularfire: [
    'Vanmeta tímann sem tekur að safna',
    'Lifestyle inflation á sparnaðartímanum',
    'Of bjartsýnar fjárfestingarávöxtunarvæntingar',
    'Gleyma að taka tillit til skatta',
    'Ekki nógu stór viðbragðssjóður fyrir óvænt',
  ],
  coastfire: [
    'Vanmeta kostnað við að vinna í hlutastarfi',
    'Gera ráð fyrir of hárri ávöxtun til eftirlauna',
    'Ekki taka tillit til þess hversu erfitt er að finna rétta starf',
    'Gleymum stöðugleikaáhættu',
  ],
  baristafire: [
    'Vanmeta kostnað við hlutavinnu (stress, tími)',
    'Gera ráð fyrir að finna hlutastarf auðveldlega',
    'Ekki taka tillit til launamuna í hlutastarfi',
    'Gleyma að heilsufarslegir kostir verða færri',
  ],
  fatfire: [
    'Lifestyle inflation heldur áfram eftir FI',
    'Of mikil áhætta í fjárfestingum til að ná hærri markmiðum',
    'Gleymum að neyslan getur haldið áfram að aukast',
    'Ekki nægjanleg vernd gegn mörkuðum',
  ],
};

/**
 * Learning resources for each type
 */
const RESOURCES: Record<string, string[]> = {
  leanfire: [
    'r/leanfire á Reddit',
    'Mr. Money Mustache blogg',
    'Early Retirement Extreme',
    'The Simple Path to Wealth (bók)',
  ],
  regularfire: [
    'r/financialindependence á Reddit',
    'Choose FI podcast',
    'The Shockingly Simple Math Behind Early Retirement',
    'Your Money or Your Life (bók)',
  ],
  coastfire: [
    'r/coastfire á Reddit',
    'Mad Fientist blogg',
    'CoastFI Calculator Tools',
  ],
  baristafire: [
    'r/baristafire á Reddit',
    'The Financial Independence Podcast',
    'Part-time FI strategies',
  ],
  fatfire: [
    'r/fatfire á Reddit',
    'BiggerPockets fjárfestingasamfélag',
    'High-income investment strategies',
  ],
};

export function FIRETypeDetailModal({ definition, onClose }: FIRETypeDetailModalProps) {
  /**
   * Handle escape key press
   */
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  /**
   * Set up escape key listener
   */
  useEffect(() => {
    if (definition) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [definition, handleEscapeKey]);

  // Don't render if no definition
  if (!definition) return null;

  const colorScheme = COLOR_CLASSES[definition.color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.green;
  const pitfalls = PITFALLS[definition.id] || [];
  const resources = RESOURCES[definition.id] || [];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${colorScheme.bg} border-b ${colorScheme.border} sticky top-0 z-10`}>
          <div className="p-6 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{definition.icon}</div>
              <div>
                <h2 className={`text-3xl font-bold ${colorScheme.text}`}>
                  {definition.nameIs}
                </h2>
                <p className="text-gray-600 mt-1">{definition.nameEn}</p>
                <Badge variant="info" className={`${colorScheme.badge} mt-2`}>
                  {definition.tagline}
                </Badge>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              aria-label="Loka"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Description */}
          <section>
            <p className="text-lg text-gray-700 leading-relaxed">{definition.description}</p>
          </section>

          {/* Pros and Cons */}
          <section className="grid md:grid-cols-2 gap-6">
            {/* Pros */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Kostir
              </h3>
              <ul className="space-y-2">
                {definition.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 font-bold mt-0.5">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Gallar
              </h3>
              <ul className="space-y-2">
                {definition.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 font-bold mt-0.5">-</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Best For / Not For */}
          <section className="grid md:grid-cols-2 gap-6">
            {/* Best For */}
            <div className={`${colorScheme.bg} border ${colorScheme.border} rounded-lg p-4`}>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Hentar best fyrir
              </h3>
              <ul className="space-y-2">
                {definition.bestFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className={`${colorScheme.text} mt-0.5`}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not For */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <X className="w-5 h-5" />
                Hentar ekki fyrir
              </h3>
              <ul className="space-y-2">
                {definition.notFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-600 mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Real-world Examples */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Dæmi úr raunveruleikanum
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {definition.examples.map((example, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-2"
                >
                  <h4 className="font-semibold text-gray-900">{example.title}</h4>
                  <p className="text-sm text-gray-700">{example.description}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600">Mánaðarútgjöld</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatISK(example.monthlyExpenses)} kr
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">FI tala</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatISK(example.fiNumber)} kr
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Common Pitfalls */}
          {pitfalls.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Algengar gildrur
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {pitfalls.map((pitfall, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-amber-900">
                      <span className="text-amber-600 font-bold mt-0.5">⚠</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Resources */}
          {resources.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Auðlindir til að læra meira
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {resources.map((resource, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                      <span className="text-blue-600 mt-0.5">📚</span>
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-blue-700 mt-4">
                  <strong>Athugið:</strong> Flestar auðlindir eru á ensku en meginreglurnar
                  eiga við í íslensku samhengi með aðlögun að íslenskum skattakerfum og lífskostnaði.
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex justify-end">
            <Button onClick={onClose} variant="primary" size="lg">
              Loka
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
