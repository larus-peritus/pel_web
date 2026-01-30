import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePresets } from '@/hooks/usePresets';
import type { MoneyExpenses } from '@/types/calculator';

describe('usePresets', () => {
  it('should return presets for commute category', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { commute: 0 };

    const { result } = renderHook(() =>
      usePresets('commute', currentValues, onApply)
    );

    expect(result.current.presets).toBeDefined();
    expect(result.current.presets.length).toBeGreaterThan(0);
    expect(result.current.presets[0].category).toBe('commute');
  });

  it('should return presets for clothing category', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { clothing: 0 };

    const { result } = renderHook(() =>
      usePresets('clothing', currentValues, onApply)
    );

    expect(result.current.presets).toBeDefined();
    expect(result.current.presets.length).toBeGreaterThan(0);
    expect(result.current.presets[0].category).toBe('clothing');
  });

  it('should return presets for meals category', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { meals: 0 };

    const { result } = renderHook(() =>
      usePresets('meals', currentValues, onApply)
    );

    expect(result.current.presets).toBeDefined();
    expect(result.current.presets.length).toBeGreaterThan(0);
    expect(result.current.presets[0].category).toBe('meals');
  });

  it('should detect current preset when values match', () => {
    const onApply = vi.fn();
    // Remote/No Commute preset value is 0
    const currentValues: Partial<MoneyExpenses> = { commute: 0 };

    const { result } = renderHook(() =>
      usePresets('commute', currentValues, onApply)
    );

    expect(result.current.currentPreset).not.toBeNull();
    expect(result.current.currentPreset?.id).toBe('commute-none');
    expect(result.current.isCustom).toBe(false);
  });

  it('should detect custom values when no preset matches', () => {
    const onApply = vi.fn();
    // Use a value that doesn't match any preset
    const currentValues: Partial<MoneyExpenses> = { commute: 999 };

    const { result } = renderHook(() =>
      usePresets('commute', currentValues, onApply)
    );

    expect(result.current.currentPreset).toBeNull();
    expect(result.current.isCustom).toBe(true);
  });

  it('should detect short commute preset', () => {
    const onApply = vi.fn();
    // Short Commute preset value is 1200
    const currentValues: Partial<MoneyExpenses> = { commute: 1200 };

    const { result } = renderHook(() =>
      usePresets('commute', currentValues, onApply)
    );

    expect(result.current.currentPreset).not.toBeNull();
    expect(result.current.currentPreset?.id).toBe('commute-short');
  });

  it('should call onApply when applyPreset is called', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { commute: 0 };

    const { result } = renderHook(() =>
      usePresets('commute', currentValues, onApply)
    );

    const presetToApply = result.current.presets[1]; // Get a preset

    act(() => {
      result.current.applyPreset(presetToApply);
    });

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith(presetToApply);
  });

  it('should memoize presets when category does not change', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { commute: 0 };

    const { result, rerender } = renderHook(() =>
      usePresets('commute', currentValues, onApply)
    );

    const firstPresets = result.current.presets;

    rerender();

    const secondPresets = result.current.presets;

    expect(firstPresets).toBe(secondPresets);
  });

  it('should update current preset when values change', () => {
    const onApply = vi.fn();
    const currentValues1: Partial<MoneyExpenses> = { commute: 0 };

    const { result, rerender } = renderHook(
      ({ values }) => usePresets('commute', values, onApply),
      { initialProps: { values: currentValues1 } }
    );

    expect(result.current.currentPreset?.id).toBe('commute-none');

    const currentValues2: Partial<MoneyExpenses> = { commute: 1200 };

    rerender({ values: currentValues2 });

    expect(result.current.currentPreset?.id).toBe('commute-short');
  });

  it('should detect uniform provided clothing preset', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { clothing: 0 };

    const { result } = renderHook(() =>
      usePresets('clothing', currentValues, onApply)
    );

    expect(result.current.currentPreset?.id).toBe('clothing-uniform');
  });

  it('should detect business casual clothing preset', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { clothing: 800 };

    const { result } = renderHook(() =>
      usePresets('clothing', currentValues, onApply)
    );

    expect(result.current.currentPreset?.id).toBe('clothing-business-casual');
  });

  it('should detect meals provided preset', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { meals: 0 };

    const { result } = renderHook(() =>
      usePresets('meals', currentValues, onApply)
    );

    expect(result.current.currentPreset?.id).toBe('meals-provided');
  });

  it('should detect buy daily meals preset', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { meals: 3500 };

    const { result } = renderHook(() =>
      usePresets('meals', currentValues, onApply)
    );

    expect(result.current.currentPreset?.id).toBe('meals-daily');
  });

  it('should have stable applyPreset callback', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = { commute: 0 };

    const { result, rerender } = renderHook(() =>
      usePresets('commute', currentValues, onApply)
    );

    const firstCallback = result.current.applyPreset;

    rerender();

    const secondCallback = result.current.applyPreset;

    expect(firstCallback).toBe(secondCallback);
  });

  it('should handle empty current values', () => {
    const onApply = vi.fn();
    const currentValues: Partial<MoneyExpenses> = {};

    const { result } = renderHook(() =>
      usePresets('commute', currentValues, onApply)
    );

    expect(result.current.presets).toBeDefined();
    expect(result.current.currentPreset).toBeNull();
    expect(result.current.isCustom).toBe(true);
  });
});
