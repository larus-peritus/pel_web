import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'value' | 'onChange'
  > {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      options,
      value,
      onChange,
      error,
      placeholder,
      required,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const selectId = id || React.useId();
    const errorId = error ? `${selectId}-error` : undefined;

    // Handle change event
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            id={selectId}
            ref={ref}
            value={value}
            onChange={handleChange}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            className={cn(
              // Base styles
              'w-full appearance-none rounded-lg border px-4 py-3 pr-10 text-base',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'transition-colors duration-200',
              // Background for dropdown arrow
              'bg-white',
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
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className={cn(
                'h-5 w-5',
                error ? 'text-danger-500' : 'text-neutral-700'
              )}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

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

Select.displayName = 'Select';

export { Select };
