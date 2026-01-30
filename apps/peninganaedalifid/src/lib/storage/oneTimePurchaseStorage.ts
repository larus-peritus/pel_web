/**
 * localStorage persistence for One-Time Purchase state
 */

import type { OneTimePurchaseState } from '../../types/oneTimePurchase.types';
import { STORAGE_KEY } from '../../types/oneTimePurchase.types';

/**
 * Saves One-Time Purchase state to localStorage
 *
 * @param state - State to save
 * @returns Success boolean
 */
export function saveToLocalStorage(state: OneTimePurchaseState): boolean {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save One-Time Purchase state to localStorage:', error);
    return false;
  }
}

/**
 * Loads One-Time Purchase state from localStorage
 *
 * @returns Saved state or null if not found/invalid
 */
export function loadFromLocalStorage(): OneTimePurchaseState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);

    if (!serialized) {
      return null;
    }

    const parsed = JSON.parse(serialized);

    // Basic structure validation
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    // Validate required fields exist
    if (!parsed.mainPurchase || !parsed.settings) {
      return null;
    }

    return parsed as OneTimePurchaseState;
  } catch (error) {
    console.error('Failed to load One-Time Purchase state from localStorage:', error);
    return null;
  }
}

/**
 * Clears One-Time Purchase state from localStorage
 *
 * @returns Success boolean
 */
export function clearLocalStorage(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear One-Time Purchase state from localStorage:', error);
    return false;
  }
}
