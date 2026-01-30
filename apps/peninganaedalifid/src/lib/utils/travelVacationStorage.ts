/**
 * localStorage persistence for Travel/Vacation Cost Calculator
 */

import {
  STORAGE_KEY,
  type TravelVacationState,
} from '../../types/travelVacation';

/**
 * Saves travel vacation state to localStorage
 *
 * @param state - State to save
 */
export function saveToLocalStorage(state: TravelVacationState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Loads travel vacation state from localStorage
 *
 * @returns Saved state or null if not found
 */
export function loadFromLocalStorage(): TravelVacationState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const state = JSON.parse(serialized) as TravelVacationState;

    // Basic validation to ensure loaded data is valid
    if (!state.mainTrip || !state.settings) {
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Clears travel vacation data from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
