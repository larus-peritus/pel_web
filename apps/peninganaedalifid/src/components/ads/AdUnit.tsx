'use client';

import { useEffect, useRef } from 'react';
import { env } from '@/lib/env';
import { cn } from '@/lib/utils';

export interface AdUnitProps {
  /**
   * Ad slot ID from Google AdSense
   * Example: "1234567890"
   */
  slot: string;

  /**
   * Ad format type
   * @default 'auto'
   */
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * AdSense Ad Unit Component
 *
 * Renders a Google AdSense ad unit with the specified slot and format.
 * Handles ad blockers gracefully and collapses if no ad loads.
 * Only renders if AdSense is enabled via environment configuration.
 *
 * @example
 * ```tsx
 * <AdUnit slot="1234567890" format="horizontal" />
 * ```
 */
export function AdUnit({ slot, format = 'auto', className }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);

  // Don't render if AdSense is not configured
  if (!env.adsense.isEnabled || !env.adsense.id) {
    return null;
  }

  useEffect(() => {
    // Push ad to AdSense queue
    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Type assertion for adsbygoogle
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (error) {
      // Ad blocker or AdSense script failed to load
      // Fail silently - ad container will collapse via CSS
      console.debug('AdSense ad failed to load:', error);
    }
  }, []);

  return (
    <div
      className={cn(
        // Container styling
        'ad-container',
        // Collapse if empty (when ad fails to load)
        'min-h-0 overflow-hidden',
        className,
      )}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={env.adsense.id}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
