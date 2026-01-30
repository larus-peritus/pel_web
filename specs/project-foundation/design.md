# Design: Project Foundation

## Overview

**Feature**: Project Foundation
**App**: peninganaedalifid.is
**Requirements**: [requirements.md](./requirements.md)

---

## Part 1: Project Structure

### Directory Structure

```
apps/peninganaedalifid/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Global styles + Tailwind
│   │   └── [feature]/            # Feature pages
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── CurrencyInput.tsx
│   │   │   ├── NumberInput.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts          # Barrel export
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Container.tsx
│   │   │   └── Section.tsx
│   │   │
│   │   └── [feature]/            # Feature-specific components
│   │
│   ├── lib/                      # Utilities and business logic
│   │   ├── storage/              # Data persistence
│   │   │   ├── localStorage.ts
│   │   │   └── exportImport.ts
│   │   │
│   │   ├── utils/                # General utilities
│   │   │   ├── cn.ts             # className merger
│   │   │   └── formatters.ts
│   │   │
│   │   └── [feature]/            # Feature-specific logic
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── context/                  # React Context providers
│   │   └── ToastContext.tsx
│   │
│   └── types/                    # TypeScript type definitions
│       └── index.ts
│
├── public/                       # Static assets
│   ├── favicon.ico
│   └── og-image.png
│
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Linting | ESLint | 8.x |
| Formatting | Prettier | 3.x |
| Testing | Vitest | 1.x |
| E2E Testing | Playwright | 1.x |
| Package Manager | npm | 10.x |

### Configuration Files

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable experimental features as needed
};

module.exports = nextConfig;
```

#### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Part 2: Base UI Components

### Design Tokens

```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Component Specifications

#### Button Component

```typescript
// components/ui/Button.tsx

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

// Styling classes
const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

#### Input Component

```typescript
// components/ui/Input.tsx

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

// Base styling
const baseStyles = `
  w-full px-4 py-3 rounded-lg border
  focus:outline-none focus:ring-2 focus:ring-offset-0
  disabled:bg-neutral-100 disabled:cursor-not-allowed
  text-base
`;

const stateStyles = {
  default: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
  error: 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
};
```

#### CurrencyInput Component

```typescript
// components/ui/CurrencyInput.tsx

interface CurrencyInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  currency?: string; // Default: 'USD'
}

// Behavior:
// - Shows formatted currency on blur (e.g., "$1,234.56")
// - Shows raw number while editing
// - Strips non-numeric characters on input
// - Handles paste with formatting
```

#### NumberInput Component

```typescript
// components/ui/NumberInput.tsx

interface NumberInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

// Behavior:
// - Validates min/max on blur
// - Shows stepper buttons for increment/decrement
// - Handles keyboard up/down arrows
```

#### Select Component

```typescript
// components/ui/Select.tsx

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}
```

#### Slider Component

```typescript
// components/ui/Slider.tsx

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}
```

#### Card Components

```typescript
// components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined';
  className?: string;
}

// Card styling
const variants = {
  elevated: 'bg-white rounded-xl shadow-sm border border-neutral-200',
  outlined: 'bg-white rounded-xl border-2 border-neutral-200',
};

// Sub-components
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string });
export function CardContent({ children, className }: { children: React.ReactNode; className?: string });
export function CardFooter({ children, className }: { children: React.ReactNode; className?: string });
```

#### Alert Component

```typescript
// components/ui/Alert.tsx

interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
}

const variants = {
  success: 'bg-success-50 text-success-800 border-success-200',
  error: 'bg-danger-50 text-danger-800 border-danger-200',
  warning: 'bg-warning-50 text-warning-800 border-warning-200',
  info: 'bg-primary-50 text-primary-800 border-primary-200',
};
```

#### Toast Component & Context

```typescript
// components/ui/Toast.tsx

interface Toast {
  id: string;
  variant: 'success' | 'error' | 'info';
  message: string;
  duration?: number; // Default: 5000ms
}

// context/ToastContext.tsx
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Usage:
// const { addToast } = useToast();
// addToast({ variant: 'success', message: 'Data saved!' });
```

#### Tooltip Component

```typescript
// components/ui/Tooltip.tsx

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number; // Default: 300ms
}
```

#### Badge Component

```typescript
// components/ui/Badge.tsx

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}
```

---

## Part 3: Layout Components

### Header Component

```typescript
// components/layout/Header.tsx

interface HeaderProps {
  // No props for MVP - static header
}

// Structure:
// ┌─────────────────────────────────────────────────┐
// │  Logo/Title          [Export] [Import] [Menu]   │
// └─────────────────────────────────────────────────┘

// Mobile:
// ┌─────────────────────────────────────────────────┐
// │  Logo/Title                           [Menu ☰]  │
// └─────────────────────────────────────────────────┘
```

### Footer Component

```typescript
// components/layout/Footer.tsx

// Content:
// - Privacy statement
// - Book attribution ("Inspired by Your Money or Your Life")
// - Version info
// - GitHub link (optional)

// Structure:
// ┌─────────────────────────────────────────────────┐
// │  Your data stays in your browser. Always.       │
// │  Inspired by "Your Money or Your Life"          │
// │  v1.0.0                                         │
// └─────────────────────────────────────────────────┘
```

### Container Component

```typescript
// components/layout/Container.tsx

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'max-w-2xl',   // 672px
  md: 'max-w-4xl',   // 896px
  lg: 'max-w-6xl',   // 1152px
  xl: 'max-w-7xl',   // 1280px
};
```

### Section Component

```typescript
// components/layout/Section.tsx

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

// Provides consistent vertical spacing
// Optional title/description for section headers
```

---

## Part 4: Data Persistence

### Storage Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React App                         │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           useLocalStorage Hook               │    │
│  │                                              │    │
│  │  - Generic hook for any persisted state     │    │
│  │  - Debounced writes (300ms)                 │    │
│  │  - Error handling                           │    │
│  │  - SSR-safe                                 │    │
│  └──────────────────────┬──────────────────────┘    │
│                         │                            │
│  ┌──────────────────────▼──────────────────────┐    │
│  │         Storage Adapter Layer                │    │
│  │                                              │    │
│  │  safeGetItem(key) → T | null                │    │
│  │  safeSetItem(key, value) → boolean          │    │
│  │  safeRemoveItem(key) → boolean              │    │
│  │                                              │    │
│  └──────────────────────┬──────────────────────┘    │
│                         │                            │
│  ┌──────────────────────▼──────────────────────┐    │
│  │              localStorage                    │    │
│  │                                              │    │
│  │  Key: "peninganaedalifid_data"              │    │
│  │  Value: JSON string of StoredState          │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Storage Types

```typescript
// types/storage.ts

interface StoredState {
  version: number;           // Schema version for migrations
  lastUpdated: string;       // ISO timestamp
  calculator?: {
    inputs: CalculatorInputs;
    scenarios: Scenario[];
  };
  // Future features add their data here
}

const CURRENT_VERSION = 1;
const STORAGE_KEY = 'peninganaedalifid_data';
```

### useLocalStorage Hook

```typescript
// hooks/useLocalStorage.ts

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    debounceMs?: number;      // Default: 300
    onError?: (error: Error) => void;
  }
): [T, (value: T | ((prev: T) => T)) => void, { isLoading: boolean; error: Error | null }];

// Features:
// - SSR-safe (returns initial value during SSR)
// - Debounced writes to reduce storage operations
// - Error handling with callback
// - Loading state for initial hydration
// - Type-safe with generics
```

### Storage Adapter

```typescript
// lib/storage/localStorage.ts

/**
 * Safely read from localStorage with error handling
 */
export function safeGetItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
    return null;
  }
}

/**
 * Safely write to localStorage with error handling
 */
export function safeSetItem(key: string, value: unknown): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to write ${key} to localStorage:`, error);
    return false;
  }
}

/**
 * Safely remove from localStorage
 */
export function safeRemoveItem(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Check available localStorage space
 */
export function getStorageQuota(): { used: number; available: number } | null {
  // Implementation for quota estimation
}
```

### Export/Import

```typescript
// lib/storage/exportImport.ts

/**
 * Export all data as downloadable JSON file
 */
export function exportData(state: StoredState): void {
  const data = {
    ...state,
    exportedAt: new Date().toISOString(),
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().split('T')[0];
  const filename = `peninganaedalifid-backup-${date}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
export async function importData(file: File): Promise<StoredState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Validate structure
        if (!isValidStoredState(data)) {
          reject(new Error('Invalid file format'));
          return;
        }

        // Migrate if needed
        const migrated = migrateState(data);
        resolve(migrated);
      } catch (error) {
        reject(new Error('Failed to parse file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Validate imported data structure
 */
function isValidStoredState(data: unknown): data is StoredState {
  if (typeof data !== 'object' || data === null) return false;
  if (typeof (data as any).version !== 'number') return false;
  return true;
}

/**
 * Migrate data from older versions
 */
function migrateState(state: StoredState): StoredState {
  let current = state;

  // Version 0 → 1 migration (example)
  if (current.version < 1) {
    // Apply migrations
    current = { ...current, version: 1 };
  }

  return current;
}
```

---

## Part 5: Root Layout

### App Layout

```typescript
// app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Metadata

```typescript
// app/layout.tsx

export const metadata = {
  title: 'Peninganaedalifid - Your Life Energy Calculator',
  description: 'Calculate your actual hourly wage and understand the true cost of your work in life energy.',
  openGraph: {
    title: 'Peninganaedalifid - Your Life Energy Calculator',
    description: 'Calculate your actual hourly wage and understand the true cost of your work in life energy.',
    url: 'https://peninganaedalifid.is',
    siteName: 'Peninganaedalifid',
    type: 'website',
  },
};
```

---

---

## Part 6: Advertising & Analytics

### Google AdSense Integration

#### Script Loading
```typescript
// components/ads/AdSenseScript.tsx
// Loads AdSense script in <head> via next/script

import Script from 'next/script';

interface AdSenseScriptProps {
  publisherId: string; // ca-pub-XXXXXXXXXXXXXXXX
}

export function AdSenseScript({ publisherId }: AdSenseScriptProps) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
```

#### Ad Unit Component
```typescript
// components/ads/AdUnit.tsx

interface AdUnitProps {
  slot: string;           // Ad slot ID from AdSense
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

export function AdUnit({ slot, format = 'auto', responsive = true, className }: AdUnitProps) {
  // Implementation:
  // - Renders <ins class="adsbygoogle"> element
  // - Pushes to adsbygoogle queue on mount
  // - Handles ad blocker gracefully (try/catch)
  // - Collapses container if ad fails to load
}
```

#### Ad Placement Zones
```
┌─────────────────────────────────────────────────────────────────┐
│  Header                                                         │
├─────────────────────────────────────────────────────────────────┤
│  [AD ZONE: Header Banner - 728x90 / Responsive]                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────┐  ┌─────────────────────┐  │
│  │                                 │  │  [AD ZONE: Sidebar] │  │
│  │                                 │  │   300x250           │  │
│  │       Main Content              │  │                     │  │
│  │                                 │  │                     │  │
│  │  [AD ZONE: In-Content]          │  │  [AD ZONE: Sidebar] │  │
│  │   (between sections)            │  │   300x600           │  │
│  │                                 │  │   (sticky)          │  │
│  │                                 │  │                     │  │
│  └─────────────────────────────────┘  └─────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [AD ZONE: Footer Banner - 728x90 / Responsive]                 │
├─────────────────────────────────────────────────────────────────┤
│  Footer                                                         │
└─────────────────────────────────────────────────────────────────┘

Mobile Layout (< 768px):
- No sidebar ads
- Header banner: 320x100 responsive
- In-content ads: 300x250 between major sections
- Footer banner: 320x100 responsive
```

#### Ad-Aware Layout Component
```typescript
// components/layout/PageLayout.tsx

interface PageLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;      // Show sidebar with ads (desktop only)
  showHeaderAd?: boolean;     // Show header banner ad
  showFooterAd?: boolean;     // Show footer banner ad
}

// Provides consistent layout with ad zones
// Sidebar only shows on desktop (lg: breakpoint)
```

### Google Analytics Integration

#### GA4 Script Loading
```typescript
// components/analytics/GoogleAnalytics.tsx

import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string; // G-XXXXXXXXXX
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
```

#### Analytics Hook
```typescript
// hooks/useAnalytics.ts

export function useAnalytics() {
  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Never track sensitive financial data
      const safeParams = sanitizeParams(params);
      window.gtag('event', eventName, safeParams);
    }
  };

  const trackPageView = (path: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: path,
      });
    }
  };

  return { trackEvent, trackPageView };
}

// Predefined events (no financial data tracked)
export const AnalyticsEvents = {
  CALCULATION_PERFORMED: 'calculation_performed',
  SCENARIO_SAVED: 'scenario_saved',
  SCENARIO_LOADED: 'scenario_loaded',
  DATA_EXPORTED: 'data_exported',
  DATA_IMPORTED: 'data_imported',
  PRESET_SELECTED: 'preset_selected',
} as const;
```

#### Route Change Tracking
```typescript
// components/analytics/RouteTracker.tsx
// Uses next/navigation to track route changes

'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function RouteTracker() {
  const pathname = usePathname();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname, trackPageView]);

  return null;
}
```

### Cookie Consent (Optional)

```typescript
// components/CookieConsent.tsx

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

// Simple banner at bottom of page
// Stores preference in localStorage
// Controls whether GA and AdSense personalization are enabled
```

### Environment Variables

```env
# .env.local (not committed)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX

# .env.example (committed, for reference)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_ADSENSE_ID=
```

### Updated Directory Structure

```
src/
├── components/
│   ├── ads/                      # Ad components
│   │   ├── AdSenseScript.tsx
│   │   ├── AdUnit.tsx
│   │   └── index.ts
│   │
│   ├── analytics/                # Analytics components
│   │   ├── GoogleAnalytics.tsx
│   │   ├── RouteTracker.tsx
│   │   └── index.ts
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PageLayout.tsx        # Layout with ad zones
│   │   └── ...
│   │
│   └── CookieConsent.tsx         # Cookie consent banner
│
├── hooks/
│   ├── useAnalytics.ts           # Analytics tracking hook
│   └── ...
```

---

## Testing Strategy

### Unit Tests
- All utility functions (formatters, validators)
- Storage adapter functions
- Export/import functions

### Component Tests
- All UI components render correctly
- Input components handle user interaction
- Button states work (loading, disabled)
- Toast notifications appear and dismiss

### Integration Tests
- useLocalStorage persists and retrieves data
- Export downloads file
- Import loads file and updates state

### Accessibility Tests
- All components pass axe-core checks
- Keyboard navigation works
- Focus management is correct
