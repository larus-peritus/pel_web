/**
 * Empty state notice when no expense data is available
 * Provides options to set up expense report or enter data manually
 */

'use client';

import Link from 'next/link';

interface NoExpenseDataNoticeProps {
  className?: string;
}

export function NoExpenseDataNotice({ className = '' }: NoExpenseDataNoticeProps) {
  return (
    <div
      className={`bg-amber-50 border border-amber-200 rounded-lg p-6 text-center ${className}`}
      role="alert"
    >
      <div className="text-4xl mb-4" aria-hidden="true">
        ⚠️
      </div>

      <h3 className="text-lg font-semibold text-amber-800 mb-2">
        Engin útgjöld skráð
      </h3>

      <p className="text-amber-700 mb-6 max-w-md mx-auto">
        Til að nota þennan reiknivél þarftu að skrá útgjöld í útgjaldagrunni.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/expense-baseline"
          className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
        >
          Setja upp útgjaldagrunn
        </Link>
      </div>
    </div>
  );
}
