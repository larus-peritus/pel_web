import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, required, id, ...props }, ref) => {
    // Generate unique IDs for accessibility
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helpTextId = helpText ? `${inputId}-help` : undefined;

    // Combine aria-describedby attributes
    const describedBy = [errorId, helpTextId].filter(Boolean).join(' ') || undefined;

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

        <input
          id={inputId}
          ref={ref}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={cn(
            // Base styles
            'w-full rounded-lg border px-4 py-3 text-base bg-white text-neutral-900',
            'placeholder:text-neutral-600',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'transition-colors duration-200',
            // State-based styles
            error
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
            // Disabled styles
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500',
            // Custom className
            className
          )}
          {...props}
        />

        {helpText && !error && (
          <p id={helpTextId} className="mt-1.5 text-sm text-neutral-600">
            {helpText}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-danger-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
