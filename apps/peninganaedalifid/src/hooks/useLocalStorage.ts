'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/storage/localStorage';

/**
 * Options for useLocalStorage hook
 */
export interface UseLocalStorageOptions {
  /**
   * Debounce delay in milliseconds before writing to localStorage
   * @default 300
   */
  debounceMs?: number;

  /**
   * Callback function called when an error occurs
   */
  onError?: (error: Error) => void;
}

/**
 * Return type for useLocalStorage hook
 */
export type UseLocalStorageReturn<T> = [
  value: T,
  setValue: (value: T | ((prev: T) => T)) => void,
  state: {
    isLoading: boolean;
    error: Error | null;
  },
];

/**
 * Custom hook for managing state with localStorage persistence
 *
 * Features:
 * - SSR-safe: Returns initial value during server-side rendering
 * - Debounced writes: Reduces localStorage operations (default 300ms)
 * - Error handling: Catches and reports localStorage errors
 * - Loading state: Indicates when initial value is being loaded
 * - Type-safe: Generic type parameter for type safety
 *
 * @param key - The localStorage key to use
 * @param initialValue - The initial value if no stored value exists
 * @param options - Configuration options
 * @returns Tuple of [value, setValue, { isLoading, error }]
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [name, setName, { isLoading }] = useLocalStorage('user_name', 'Guest');
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <input
 *       value={name}
 *       onChange={(e) => setName(e.target.value)}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom debounce and error handling
 * const [settings, setSettings, { error }] = useLocalStorage(
 *   'app_settings',
 *   { theme: 'light', language: 'en' },
 *   {
 *     debounceMs: 500,
 *     onError: (err) => console.error('Storage error:', err),
 *   }
 * );
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {},
): UseLocalStorageReturn<T> {
  const { debounceMs = 300, onError } = options;

  // State for the stored value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Loading state for initial hydration
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Error state
  const [error, setError] = useState<Error | null>(null);

  // Ref to track if component is mounted
  const isMountedRef = useRef<boolean>(false);

  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize state from localStorage on mount (client-side only)
  useEffect(() => {
    isMountedRef.current = true;

    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      // Try to load from localStorage
      const item = safeGetItem<T>(key);

      if (item !== null) {
        setStoredValue(item);
      }

      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load from localStorage');
      setError(error);
      setIsLoading(false);

      if (onError) {
        onError(error);
      }
    }

    return () => {
      isMountedRef.current = false;

      // Clean up debounce timer on unmount
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [key, onError]);

  // Setter function with debounced localStorage write
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Calculate new value (handle both direct values and updater functions)
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Update React state immediately for responsive UI
        setStoredValue(valueToStore);

        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Debounced write to localStorage
        debounceTimerRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;

          try {
            const success = safeSetItem(key, valueToStore);

            if (!success) {
              const error = new Error('Failed to write to localStorage');
              setError(error);

              if (onError) {
                onError(error);
              }
            } else {
              // Clear error on successful write
              setError(null);
            }
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to write to localStorage');
            setError(error);

            if (onError) {
              onError(error);
            }
          }
        }, debounceMs);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update state');
        setError(error);

        if (onError) {
          onError(error);
        }
      }
    },
    [key, storedValue, debounceMs, onError],
  );

  return [storedValue, setValue, { isLoading, error }];
}
