'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';

/**
 * AWHPrompt Component
 *
 * Prompts the user to calculate their Actual Hourly Wage (AWH) to unlock
 * the life energy display feature. Shows benefits of calculating AWH and
 * provides a link to the AWH calculator.
 *
 * Features:
 * - Info alert explaining benefits of AWH
 * - Explains what life energy display would show
 * - Link to AWH calculator (/raunverulegt-timakaup)
 * - Can be dismissed (optional state)
 * - All text in Icelandic
 *
 * Based on "Your Money or Your Life" Chapter 2 concept of actual hourly wage.
 *
 * @example
 * ```tsx
 * <AWHPrompt />
 * ```
 */
export function AWHPrompt() {
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't render if dismissed
  if (isDismissed) {
    return null;
  }

  return (
    <Alert
      variant="info"
      title="Sjáðu FI-tölu þína í árum vinnu"
      onDismiss={() => setIsDismissed(true)}
    >
      <div className="space-y-3">
        <p className="leading-relaxed">
          Með því að reikna út þitt <strong>raunverulega tímalaun</strong> (Actual Hourly Wage)
          geturðu séð FI-tölu þína í <strong>lífsorku</strong> - hversu mörg ár af vinnu
          hún jafngildir.
        </p>

        <div className="bg-primary-100 rounded-lg p-3 border border-primary-300">
          <p className="text-sm font-semibold text-primary-900 mb-2">
            Hvað myndirðu sjá?
          </p>
          <ul className="text-sm space-y-1.5 text-primary-800">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Hversu mörg ár af vinnu FI-talan þín jafngildir</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Hversu mörg ár eru eftir til að ná FI</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Sjónræna framvindu til fjármálafrelsis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Hvatningarskilaboð byggð á framvindu þinni</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/raunverulegt-timakaup"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <span>Reikna raunverulegt tímalaun</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-lg hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
          >
            Ekki núna
          </button>
        </div>

        <div className="pt-2 border-t border-primary-200">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-primary-900 hover:text-primary-700 transition-colors">
              Hvað er raunverulegt tímalaun?
            </summary>
            <div className="mt-2 text-primary-800 space-y-2 leading-relaxed">
              <p>
                Raunverulegt tímalaun (AWH) er hugtak úr bókinni <em>"Your Money or Your Life"</em>.
                Það tekur mið af öllum þeim peningum og tíma sem þú eyðir vegna vinnunnar þinnar,
                ekki bara launaseðilinn.
              </p>
              <p>
                AWH reikniferillinn tekur til vinnu-tengdra útgjalda (akstur, föt, matur),
                aukavinnustunda (undirbúningur, ferðatími, niðurstaða), og lætur þig sjá
                hvað þú <strong>raunverulega</strong> færð borgað fyrir hverja klukkustund
                af lífi þínu.
              </p>
              <p className="font-medium">
                Margir finna út að raunverulega tímalaun þeirra eru 20-40% lægri en þeir héldu!
              </p>
            </div>
          </details>
        </div>
      </div>
    </Alert>
  );
}
