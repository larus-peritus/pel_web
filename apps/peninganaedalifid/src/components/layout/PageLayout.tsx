import { cn } from '@/lib/utils';
import { env } from '@/lib/env';
import { AdUnit } from '@/components/ads/AdUnit';
import { Container } from './Container';

export interface PageLayoutProps {
  /**
   * Main content to render in the page
   */
  children: React.ReactNode;

  /**
   * Show header ad zone below navigation
   * @default false
   */
  showHeaderAd?: boolean;

  /**
   * Show sidebar with ad slots (desktop only)
   * @default false
   */
  showSidebarAds?: boolean;

  /**
   * Show footer ad zone above footer
   * @default false
   */
  showFooterAd?: boolean;

  /**
   * Additional CSS classes for the main container
   */
  className?: string;
}

/**
 * PageLayout Component
 *
 * Provides a consistent page layout with designated ad placement zones.
 * Ad zones are configurable per page and only render when AdSense is enabled.
 *
 * Layout structure:
 * - Optional header ad zone (full width, below navigation)
 * - Main content area with optional sidebar (desktop only)
 * - Optional footer ad zone (full width, above footer)
 *
 * Responsive behavior:
 * - Sidebar is hidden on mobile (< 1024px)
 * - Header and footer ads use responsive ad units
 *
 * @example
 * ```tsx
 * <PageLayout showHeaderAd showSidebarAds>
 *   <Section title="Calculator">
 *     <CalculatorForm />
 *   </Section>
 * </PageLayout>
 * ```
 */
export function PageLayout({
  children,
  showHeaderAd = false,
  showSidebarAds = false,
  showFooterAd = false,
  className,
}: PageLayoutProps) {
  const hasAdsEnabled = env.adsense.isEnabled;

  return (
    <div className={cn('w-full', className)}>
      {/* Header Ad Zone - Full width, below navigation */}
      {showHeaderAd && hasAdsEnabled && (
        <div className="border-b border-neutral-200 bg-neutral-50 py-4">
          <Container>
            <AdUnit
              slot="header-banner"
              format="horizontal"
              className="flex justify-center"
            />
          </Container>
        </div>
      )}

      {/* Main Content Area */}
      <Container size="xl">
        <div
          className={cn(
            'flex gap-8',
            // Stack vertically on mobile, side-by-side on desktop
            'flex-col lg:flex-row',
          )}
        >
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Sidebar with Ad Slots - Desktop only */}
          {showSidebarAds && hasAdsEnabled && (
            <aside
              className={cn(
                // Hidden on mobile, visible on desktop
                'hidden lg:block',
                // Fixed width sidebar
                'w-[300px] flex-shrink-0',
              )}
            >
              <div className="space-y-8 sticky top-4">
                {/* Primary sidebar ad - 300x250 */}
                <div className="rounded-lg border border-neutral-200 bg-white p-4">
                  <AdUnit
                    slot="sidebar-primary"
                    format="rectangle"
                    className="flex justify-center"
                  />
                </div>

                {/* Secondary sidebar ad - 300x600 (sticky) */}
                <div className="rounded-lg border border-neutral-200 bg-white p-4">
                  <AdUnit
                    slot="sidebar-secondary"
                    format="vertical"
                    className="flex justify-center"
                  />
                </div>
              </div>
            </aside>
          )}
        </div>
      </Container>

      {/* Footer Ad Zone - Full width, above footer */}
      {showFooterAd && hasAdsEnabled && (
        <div className="mt-12 border-t border-neutral-200 bg-neutral-50 py-4">
          <Container>
            <AdUnit
              slot="footer-banner"
              format="horizontal"
              className="flex justify-center"
            />
          </Container>
        </div>
      )}
    </div>
  );
}
