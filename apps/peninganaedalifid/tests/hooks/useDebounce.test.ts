import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));

    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 300 } }
    );

    expect(result.current).toBe('first');

    // Change value
    rerender({ value: 'second', delay: 300 });

    // Value should not change immediately
    expect(result.current).toBe('first');

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should now be updated
    expect(result.current).toBe('second');
  });

  it('should use default delay of 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });

    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('second');
  });

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );

    // First change
    rerender({ value: 'second' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Second change before delay expires
    rerender({ value: 'third' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Third change before delay expires
    rerender({ value: 'fourth' });

    // Value should still be 'first' because timer keeps resetting
    expect(result.current).toBe('first');

    // Now advance full delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('fourth');
  });

  it('should handle custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('second');
  });

  it('should handle number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it('should handle object values', () => {
    const obj1 = { name: 'Alice', age: 30 };
    const obj2 = { name: 'Bob', age: 25 };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: obj1 } }
    );

    expect(result.current).toBe(obj1);

    rerender({ value: obj2 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(obj2);
  });

  it('should handle boolean values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: false } }
    );

    expect(result.current).toBe(false);

    rerender({ value: true });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(true);
  });

  it('should handle null and undefined', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: null as string | null } }
    );

    expect(result.current).toBeNull();

    rerender({ value: undefined as string | null | undefined });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBeUndefined();
  });

  it('should cleanup timer on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('value', 300));

    // Unmount before timer fires
    unmount();

    // Advance timers - should not cause any errors
    act(() => {
      vi.advanceTimersByTime(300);
    });
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 0),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('second');
  });

  it('should handle multiple rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 1 } }
    );

    // Simulate rapid typing
    for (let i = 2; i <= 10; i++) {
      rerender({ value: i });
      act(() => {
        vi.advanceTimersByTime(50); // Less than delay
      });
    }

    // Should still have initial value
    expect(result.current).toBe(1);

    // Advance past the delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(10);
  });
});
