/**
 * Environment configuration with type safety
 */
export const env = {
  ga: {
    id: process.env.NEXT_PUBLIC_GA_ID,
    isEnabled: !!process.env.NEXT_PUBLIC_GA_ID,
  },
  adsense: {
    id: process.env.NEXT_PUBLIC_ADSENSE_ID,
    isEnabled: !!process.env.NEXT_PUBLIC_ADSENSE_ID,
  },
  app: {
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  },
} as const;
