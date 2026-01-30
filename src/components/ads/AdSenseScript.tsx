'use client';

import Script from 'next/script';
import { env } from '@/lib/env';

/**
 * AdSense Script Loader
 *
 * Loads Google AdSense script in the document head.
 * Only renders if AdSense is enabled via environment configuration.
 *
 * Usage:
 * Add this component once in your root layout or top-level component.
 */
export function AdSenseScript() {
  // Don't render if AdSense is not configured
  if (!env.adsense.isEnabled || !env.adsense.id) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.adsense.id}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
