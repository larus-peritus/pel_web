import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils/cn';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const result = cn('text-red-500', false && 'hidden', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should resolve Tailwind conflicts', () => {
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });

  it('should handle arrays', () => {
    const result = cn(['text-red-500', 'bg-blue-500']);
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle objects', () => {
    const result = cn({
      'text-red-500': true,
      'bg-blue-500': false,
      'p-4': true,
    });
    expect(result).toBe('text-red-500 p-4');
  });

  it('should handle mixed inputs', () => {
    const result = cn(
      'text-red-500',
      ['bg-blue-500', false && 'hidden'],
      { 'p-4': true, 'm-2': false }
    );
    expect(result).toBe('text-red-500 bg-blue-500 p-4');
  });

  it('should handle undefined and null', () => {
    const result = cn('text-red-500', undefined, null, 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });
});
