'use client';

import { cn } from '@/lib/utils';

/**
 * Props for Checkbox component
 */
export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  id?: string;
}

/**
 * Checkbox - Controlled checkbox input with label
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms"
 *   checked={accepted}
 *   onChange={setAccepted}
 * />
 * ```
 */
export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  helpText,
  className,
  id,
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={cn(
            'h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500',
            disabled && 'cursor-not-allowed opacity-50',
            error && 'border-red-500'
          )}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-sm font-medium text-neutral-700 cursor-pointer select-none',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>

      {/* Helper text */}
      {helpText && !error && (
        <p className="text-xs text-neutral-500 ml-6">{helpText}</p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 ml-6">{error}</p>
      )}
    </div>
  );
}
