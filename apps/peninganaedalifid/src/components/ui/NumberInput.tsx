import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  label?: string;
  error?: string;
  helpText?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showStepper?: boolean;
  suffix?: string; // Optional unit suffix (e.g., "km", "kr", "mín")
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      label,
      error,
      helpText,
      required,
      id,
      value,
      onChange,
      min,
      max,
      step = 1,
      showStepper = false,
      suffix,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helpTextId = helpText ? `${inputId}-help` : undefined;

    // Track internal validation error
    const [validationError, setValidationError] = React.useState<
      string | undefined
    >(error);

    // Update validation error when external error prop changes
    React.useEffect(() => {
      setValidationError(error);
    }, [error]);

    // Combine aria-describedby attributes
    const describedBy =
      [errorId, helpTextId].filter(Boolean).join(' ') || undefined;

    // Validate value against min/max
    const validateValue = (val: number): string | undefined => {
      if (min !== undefined && val < min) {
        return `Value must be at least ${min}`;
      }
      if (max !== undefined && val > max) {
        return `Value must be at most ${max}`;
      }
      return undefined;
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        onChange(newValue);
        // Clear validation error when typing
        if (validationError && !error) {
          setValidationError(undefined);
        }
      } else if (e.target.value === '' || e.target.value === '-') {
        // Allow empty input or minus sign for negative numbers
        onChange(0);
      }
    };

    // Handle blur - validate min/max
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        // Validate and show error if needed
        const validationErr = validateValue(newValue);
        setValidationError(validationErr);

        // Clamp value to min/max if defined
        let clampedValue = newValue;
        if (min !== undefined && newValue < min) {
          clampedValue = min;
          onChange(min);
        } else if (max !== undefined && newValue > max) {
          clampedValue = max;
          onChange(max);
        }
      }

      // Call original onBlur if provided
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    // Handle keyboard arrows
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        decrement();
      }

      // Call original onKeyDown if provided
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    // Increment value
    const increment = () => {
      if (disabled) return;

      const newValue = value + step;
      if (max === undefined || newValue <= max) {
        onChange(newValue);
        setValidationError(undefined);
      }
    };

    // Decrement value
    const decrement = () => {
      if (disabled) return;

      const newValue = value - step;
      if (min === undefined || newValue >= min) {
        onChange(newValue);
        setValidationError(undefined);
      }
    };

    // Determine if we should show an error
    const showError = error || validationError;

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
            type="number"
            id={inputId}
            ref={ref}
            required={required}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step={step}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={describedBy}
            className={cn(
              // Base styles
              'w-full rounded-lg border px-4 py-3 text-base text-neutral-900',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'transition-colors duration-200',
              // State-based styles
              showError
                ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
              // Disabled styles
              'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500',
              // Add padding on the right if stepper or suffix is shown
              (showStepper || suffix) && 'pr-16',
              // Custom className
              className
            )}
            {...props}
          />

          {/* Suffix display (e.g., "km", "kr", "mín") */}
          {suffix && !showStepper && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-700">
              {suffix}
            </span>
          )}

          {showStepper && (
            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 flex-col">
              <button
                type="button"
                onClick={increment}
                disabled={disabled || (max !== undefined && value >= max)}
                aria-label="Increment value"
                className={cn(
                  'flex h-6 w-8 items-center justify-center rounded-t border border-neutral-300 bg-white text-neutral-700',
                  'hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary-500',
                  'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400',
                  'transition-colors duration-150'
                )}
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={decrement}
                disabled={disabled || (min !== undefined && value <= min)}
                aria-label="Decrement value"
                className={cn(
                  'flex h-6 w-8 items-center justify-center rounded-b border border-t-0 border-neutral-300 bg-white text-neutral-700',
                  'hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary-500',
                  'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400',
                  'transition-colors duration-150'
                )}
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {helpText && !showError && (
          <p id={helpTextId} className="mt-1.5 text-sm text-neutral-600">
            {helpText}
          </p>
        )}

        {showError && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-danger-600"
            role="alert"
          >
            {showError}
          </p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
