'use client';

/**
 * Side Banners Component
 *
 * Displays placeholder banners fixed on the sides of the viewport.
 * Uses fixed positioning so they don't affect page layout.
 * Banners are manually managed and not part of any ad network.
 */
export function SideBanners() {
  return (
    <>
      {/* Left Banner - Fixed position, shows at 1600px+ to avoid overlapping content */}
      <div className="hidden min-[1595px]:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <div className="w-[160px] h-[600px] bg-white border border-neutral-200 rounded-xl shadow-md flex items-center justify-center p-4">
          <p className="text-neutral-400 text-xs text-center leading-relaxed">
            Hafðu samband ef þú vilt sjá þína sparnaðartengdu auglýsingu hér
          </p>
        </div>
      </div>

      {/* Right Banner - Fixed position, shows at 1600px+ to avoid overlapping content */}
      <div className="hidden min-[1595px]:block fixed right-4 top-1/2 -translate-y-1/2 z-40">
        <div className="w-[160px] h-[600px] bg-white border border-neutral-200 rounded-xl shadow-md flex items-center justify-center p-4">
          <p className="text-neutral-400 text-xs text-center leading-relaxed">
            Hafðu samband ef þú vilt sjá þína sparnaðartengdu auglýsingu hér
          </p>
        </div>
      </div>
    </>
  );
}

// Keep for backwards compatibility but not used
export function SideBannersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
