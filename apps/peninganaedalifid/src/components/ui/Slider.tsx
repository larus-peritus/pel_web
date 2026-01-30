import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      value,
      onChange,
      min,
      max,
      step = 1,
      showValue = false,
      formatValue,
      required,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for accessibility
    const inputId = id || React.useId();

    // Handle change event
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value);
      onChange(newValue);
    };

    // Calculate percentage for gradient background
    const percentage = ((value - min) / (max - min)) * 100;

    // Format display value
    const displayValue = formatValue ? formatValue(value) : value.toString();

    return (
      <div className="w-full">
        {/* Label and Value Display */}
        {(label || showValue) && (
          <div className="mb-2 flex items-center justify-between">
            {label && (
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-neutral-700"
              >
                {label}
                {required && (
                  <span className="ml-1 text-danger-500" aria-label="required">
                    *
                  </span>
                )}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-semibold text-neutral-900">
                {displayValue}
              </span>
            )}
          </div>
        )}

        {/* Slider Track Container */}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            required={required}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={displayValue}
            className={cn(
              // Base styles - remove default appearance
              'w-full appearance-none cursor-pointer',
              'focus:outline-none',
              // Track styles (webkit) - use transparent to let gradient show through
              '[&::-webkit-slider-runnable-track]:h-2',
              '[&::-webkit-slider-runnable-track]:rounded-full',
              '[&::-webkit-slider-runnable-track]:bg-transparent',
              // Track styles (firefox)
              '[&::-moz-range-track]:h-2',
              '[&::-moz-range-track]:rounded-full',
              '[&::-moz-range-track]:bg-transparent',
              // Thumb styles (webkit)
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-primary-600',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:shadow-sm',
              '[&::-webkit-slider-thumb]:transition-all',
              '[&::-webkit-slider-thumb]:duration-150',
              '[&::-webkit-slider-thumb]:border-2',
              '[&::-webkit-slider-thumb]:border-white',
              '[&::-webkit-slider-thumb]:-mt-1.5', // Center thumb vertically
              // Thumb hover (webkit)
              '[&::-webkit-slider-thumb]:hover:bg-primary-700',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              // Thumb active (webkit)
              '[&::-webkit-slider-thumb]:active:bg-primary-800',
              '[&::-webkit-slider-thumb]:active:scale-105',
              // Thumb styles (firefox)
              '[&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:w-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-primary-600',
              '[&::-moz-range-thumb]:cursor-pointer',
              '[&::-moz-range-thumb]:border-2',
              '[&::-moz-range-thumb]:border-white',
              '[&::-moz-range-thumb]:shadow-sm',
              '[&::-moz-range-thumb]:transition-all',
              '[&::-moz-range-thumb]:duration-150',
              '[&::-moz-range-thumb]:border-none', // Firefox has different border handling
              // Thumb hover (firefox)
              '[&::-moz-range-thumb]:hover:bg-primary-700',
              '[&::-moz-range-thumb]:hover:scale-110',
              // Thumb active (firefox)
              '[&::-moz-range-thumb]:active:bg-primary-800',
              '[&::-moz-range-thumb]:active:scale-105',
              // Focus styles
              'focus-visible:outline-none',
              'focus-visible:[&::-webkit-slider-thumb]:ring-2',
              'focus-visible:[&::-webkit-slider-thumb]:ring-primary-500',
              'focus-visible:[&::-webkit-slider-thumb]:ring-offset-2',
              'focus-visible:[&::-moz-range-thumb]:ring-2',
              'focus-visible:[&::-moz-range-thumb]:ring-primary-500',
              'focus-visible:[&::-moz-range-thumb]:ring-offset-2',
              // Disabled styles
              'disabled:cursor-not-allowed',
              'disabled:opacity-50',
              '[&:disabled::-webkit-slider-thumb]:cursor-not-allowed',
              '[&:disabled::-webkit-slider-thumb]:bg-neutral-400',
              '[&:disabled::-moz-range-thumb]:cursor-not-allowed',
              '[&:disabled::-moz-range-thumb]:bg-neutral-400',
              // Custom className
              className
            )}
            style={
              {
                // Create gradient fill effect using CSS custom properties
                // Filled: primary-600 (blue), Unfilled: neutral-200 (light grey) for clear contrast
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
                borderRadius: '9999px',
                height: '8px',
                // Override for webkit browsers
                '--slider-percentage': `${percentage}%`,
              } as React.CSSProperties
            }
            {...props}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
