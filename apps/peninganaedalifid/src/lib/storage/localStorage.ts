/**
 * Safe localStorage wrapper with SSR compatibility and error handling
 *
 * All functions check for browser environment and wrap operations in try-catch
 * to handle quota exceeded errors and other localStorage failures gracefully.
 */

/**
 * Safely read from localStorage with JSON parsing and error handling
 *
 * @param key - The localStorage key to read
 * @returns The parsed value or null if not found or error occurs
 *
 * @example
 * ```ts
 * const userData = safeGetItem<UserData>('user_data');
 * if (userData) {
 *   console.log(userData.name);
 * }
 * ```
 */
export function safeGetItem<T>(key: string): T | null {
  // SSR-safe: return null during server-side rendering
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to read "${key}" from localStorage:`, error);
    return null;
  }
}

/**
 * Safely write to localStorage with JSON stringification and error handling
 *
 * @param key - The localStorage key to write
 * @param value - The value to store (will be JSON stringified)
 * @returns true if successful, false if error occurs
 *
 * @example
 * ```ts
 * const success = safeSetItem('user_data', { name: 'John', age: 30 });
 * if (!success) {
 *   console.error('Failed to save user data');
 * }
 * ```
 */
export function safeSetItem(key: string, value: unknown): boolean {
  // SSR-safe: return false during server-side rendering
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to write "${key}" to localStorage:`, error);
    return false;
  }
}

/**
 * Safely remove from localStorage with error handling
 *
 * @param key - The localStorage key to remove
 * @returns true if successful, false if error occurs
 *
 * @example
 * ```ts
 * const success = safeRemoveItem('user_data');
 * if (success) {
 *   console.log('User data cleared');
 * }
 * ```
 */
export function safeRemoveItem(key: string): boolean {
  // SSR-safe: return false during server-side rendering
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove "${key}" from localStorage:`, error);
    return false;
  }
}
