'use client';

import Script from 'next/script';
import { env } from '@/lib/env';

/**
 * Google Analytics 4 Integration Component
 *
 * Loads GA4 tracking scripts using Next.js Script component for optimal loading.
 * Only renders if Google Analytics is enabled via environment variables.
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * <GoogleAnalytics />
 * ```
 */
export function GoogleAnalytics() {
  // Don't render if GA is not enabled
  if (!env.ga.isEnabled || !env.ga.id) {
    return null;
  }

  return (
    <>
      {/* Load gtag.js script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${env.ga.id}`}
        strategy="afterInteractive"
      />

      {/* Initialize Google Analytics */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${env.ga.id}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
