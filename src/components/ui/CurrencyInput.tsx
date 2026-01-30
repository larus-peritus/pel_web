'use client';

import * as React from 'react';
import { cn, formatCurrency } from '@/lib/utils';

export interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
  helpText?: string;
  suffix?: string; // Optional unit suffix (e.g., "kr", "kr/mán", "kr/ár")
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      className,
      label,
      error,
      helpText,
      suffix,
      required,
      id,
      value,
      onChange,
      disabled,
      placeholder,
      ...props
    },
    ref
  ) => {
    // Track focus state to toggle between formatted and raw display
    const [isFocused, setIsFocused] = React.useState(false);

    // Internal input value (string) for controlled input
    const [inputValue, setInputValue] = React.useState(
      isFocused ? String(value) : formatCurrency(value)
    );

    // Generate unique IDs for accessibility
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helpTextId = helpText ? `${inputId}-help` : undefined;

    // Combine aria-describedby attributes
    const describedBy =
      [errorId, helpTextId].filter(Boolean).join(' ') || undefined;

    // Update input value when external value changes
    React.useEffect(() => {
      if (!isFocused) {
        setInputValue(formatCurrency(value));
      }
    }, [value, isFocused]);

    /**
     * Strip non-numeric characters except decimal point
     */
    const stripFormatting = (str: string): string => {
      return str.replace(/[^\d.]/g, '');
    };

    /**
     * Parse string to number, handling edge cases
     */
    const parseValue = (str: string): number => {
      const cleaned = stripFormatting(str);
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    };

    /**
     * Handle focus: show raw number
     */
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setInputValue(String(value));

      // Call user's onFocus if provided
      props.onFocus?.(e);
    };

    /**
     * Handle blur: format as currency
     */
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      // Parse current input and update parent
      const numericValue = parseValue(inputValue);
      onChange(numericValue);

      // Format for display
      setInputValue(formatCurrency(numericValue));

      // Call user's onBlur if provided
      props.onBlur?.(e);
    };

    /**
     * Handle input changes: allow only numeric input
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Allow empty string, numbers, and single decimal point
      const isValid = /^(\d*\.?\d*)$/.test(newValue);

      if (isValid) {
        setInputValue(newValue);

        // Update parent with numeric value
        const numericValue = parseValue(newValue);
        onChange(numericValue);
      }
    };

    /**
     * Handle paste: strip formatting from pasted content
     */
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      const pastedText = e.clipboardData.getData('text');
      const cleaned = stripFormatting(pastedText);

      // Only update if valid number format
      if (/^(\d*\.?\d*)$/.test(cleaned)) {
        setInputValue(cleaned);

        const numericValue = parseValue(cleaned);
        onChange(numericValue);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-danger-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type="text"
            inputMode="decimal"
            required={required}
            disabled={disabled}
            placeholder={placeholder || formatCurrency(0)}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPaste={handlePaste}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            className={cn(
              // Base styles (matching Input component)
              'w-full rounded-lg border px-4 py-3 text-base text-neutral-900',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'transition-colors duration-200',
              // State-based styles
              error
                ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
              // Disabled styles
              'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500',
              // Add padding on the right if suffix is shown
              suffix && 'pr-16',
              // Custom className
              className
            )}
            {...props}
          />

          {/* Suffix display (e.g., "kr", "kr/mán", "kr/ár") */}
          {suffix && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-700">
              {suffix}
            </span>
          )}
        </div>

        {helpText && !error && (
          <p id={helpTextId} className="mt-1.5 text-sm text-neutral-600">
            {helpText}
          </p>
        )}

        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-danger-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
