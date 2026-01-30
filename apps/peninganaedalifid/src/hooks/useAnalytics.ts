/**
 * Analytics tracking hook for Google Analytics 4
 *
 * Provides type-safe methods for tracking events and page views.
 * Safely checks for gtag availability before calling.
 *
 * @example
 * ```tsx
 * const { trackEvent, trackPageView } = useAnalytics();
 *
 * // Track a custom event
 * trackEvent('button_click', { button_name: 'export_data' });
 *
 * // Track a page view
 * trackPageView('/calculator');
 * ```
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export function useAnalytics() {
  /**
   * Track a custom event
   *
   * @param eventName - Name of the event to track
   * @param parameters - Optional event parameters (never include sensitive financial data)
   */
  const trackEvent = (
    eventName: string,
    parameters?: Record<string, any>
  ): void => {
    if (typeof window === 'undefined' || !window.gtag) {
      return;
    }

    try {
      window.gtag('event', eventName, parameters);
    } catch (error) {
      console.warn('Failed to track event:', error);
    }
  };

  /**
   * Track a page view
   *
   * @param url - URL path to track (e.g., '/calculator')
   */
  const trackPageView = (url: string): void => {
    if (typeof window === 'undefined' || !window.gtag) {
      return;
    }

    try {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: url,
      });
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  };

  return {
    trackEvent,
    trackPageView,
  };
}
