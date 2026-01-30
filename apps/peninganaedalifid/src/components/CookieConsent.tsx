'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Consent status type
 */
export type ConsentStatus = 'accepted' | 'declined' | 'pending';

/**
 * Storage key for cookie consent preference
 */
const CONSENT_STORAGE_KEY = 'cookie-consent';

/**
 * Get the current consent status from localStorage
 * @returns The current consent status
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') {
    return 'pending';
  }

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      return stored;
    }
    return 'pending';
  } catch (error) {
    console.warn('Failed to read consent status from localStorage:', error);
    return 'pending';
  }
}

/**
 * Set the consent status in localStorage
 * @param status - The consent status to store
 */
function setConsentStatus(status: ConsentStatus): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch (error) {
    console.warn('Failed to save consent status to localStorage:', error);
  }
}

/**
 * Cookie Consent Banner Component
 *
 * Shows a banner on first visit asking for cookie consent.
 * Stores the user's preference in localStorage.
 * Controls analytics and ad personalization based on consent.
 *
 * @example
 * ```tsx
 * // In root layout
 * <CookieConsent />
 * ```
 */
export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check consent status on mount (client-side only)
  useEffect(() => {
    const status = getConsentStatus();

    // Only show banner if consent is pending
    if (status === 'pending') {
      setIsVisible(true);
    }

    setIsLoading(false);
  }, []);

  const handleAccept = () => {
    setConsentStatus('accepted');
    setIsVisible(false);

    // Trigger analytics initialization if needed
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      } as any);
    }
  };

  const handleDecline = () => {
    setConsentStatus('declined');
    setIsVisible(false);

    // Update consent for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      } as any);
    }
  };

  // Don't render anything during initial load (SSR or hydration)
  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent banner"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-neutral-200 shadow-lg',
        'animate-in slide-in-from-bottom duration-300'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Message */}
          <div className="flex-1">
            <p className="text-sm text-neutral-700 sm:text-base">
              We use cookies to analyze site usage and provide personalized ads.
              Your data stays on your device and is never shared.{' '}
              <a
                href="#privacy"
                className="underline hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Learn more
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 sm:shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDecline}
              className="flex-1 sm:flex-none"
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-none"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Window.gtag type is declared in @/hooks/useAnalytics
