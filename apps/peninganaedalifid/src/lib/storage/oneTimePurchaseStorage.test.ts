/**
 * Tests for One-Time Purchase localStorage functions
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from './oneTimePurchaseStorage';
import type { OneTimePurchaseState } from '../../types/oneTimePurchase.types';
import { INITIAL_STATE, STORAGE_KEY } from '../../types/oneTimePurchase.types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Replace global localStorage with mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('saveToLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('saves state successfully', () => {
    const state: OneTimePurchaseState = {
      ...INITIAL_STATE,
      mainPurchase: {
        price: 2_000_000,
        name: 'Nýr bíll',
      },
    };

    const result = saveToLocalStorage(state);

    expect(result).toBe(true);
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeDefined();
  });

  test('saves state with comparison options', () => {
    const state: OneTimePurchaseState = {
      ...INITIAL_STATE,
      mainPurchase: { price: 2_000_000, name: 'Option 1' },
      comparisonOptions: [
        { price: 1_500_000, name: 'Option 2' },
        { price: 2_500_000, name: 'Option 3' },
      ],
      showComparison: true,
    };

    const result = saveToLocalStorage(state);

    expect(result).toBe(true);

    const saved = localStorageMock.getItem(STORAGE_KEY);
    expect(saved).toBeDefined();

    const parsed = JSON.parse(saved!);
    expect(parsed.comparisonOptions).toHaveLength(2);
    expect(parsed.showComparison).toBe(true);
  });

  test('handles quota exceeded error', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock setItem to throw quota exceeded error
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = () => {
      throw new Error('QuotaExceededError');
    };

    const result = saveToLocalStorage(INITIAL_STATE);

    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Restore
    localStorageMock.setItem = originalSetItem;
    consoleErrorSpy.mockRestore();
  });
});

describe('loadFromLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('loads saved state successfully', () => {
    const state: OneTimePurchaseState = {
      ...INITIAL_STATE,
      mainPurchase: { price: 2_000_000, name: 'Nýr bíll' },
    };

    saveToLocalStorage(state);
    const loaded = loadFromLocalStorage();

    expect(loaded).toEqual(state);
  });

  test('returns null if no data exists', () => {
    const loaded = loadFromLocalStorage();
    expect(loaded).toBeNull();
  });

  test('returns null if data is invalid JSON', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    localStorageMock.setItem(STORAGE_KEY, 'invalid json{');
    const loaded = loadFromLocalStorage();

    expect(loaded).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test('returns null if data is missing required fields', () => {
    const invalidState = { someOtherData: 'test' };
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(invalidState));

    const loaded = loadFromLocalStorage();

    expect(loaded).toBeNull();
  });

  test('loads state with comparison options', () => {
    const state: OneTimePurchaseState = {
      ...INITIAL_STATE,
      mainPurchase: { price: 2_000_000, name: 'Option 1' },
      comparisonOptions: [{ price: 1_500_000, name: 'Option 2' }],
      showComparison: true,
    };

    saveToLocalStorage(state);
    const loaded = loadFromLocalStorage();

    expect(loaded).toEqual(state);
    expect(loaded?.comparisonOptions).toHaveLength(1);
    expect(loaded?.showComparison).toBe(true);
  });
});

describe('clearLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('clears saved state', () => {
    saveToLocalStorage(INITIAL_STATE);
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeDefined();

    const result = clearLocalStorage();

    expect(result).toBe(true);
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
  });

  test('succeeds even if no data exists', () => {
    const result = clearLocalStorage();
    expect(result).toBe(true);
  });

  test('handles removal error', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock removeItem to throw error
    const originalRemoveItem = localStorageMock.removeItem;
    localStorageMock.removeItem = () => {
      throw new Error('RemoveError');
    };

    const result = clearLocalStorage();

    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Restore
    localStorageMock.removeItem = originalRemoveItem;
    consoleErrorSpy.mockRestore();
  });
});
