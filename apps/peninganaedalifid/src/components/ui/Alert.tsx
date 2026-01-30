import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const variants = {
  success: 'bg-success-50 text-success-800 border-success-200',
  error: 'bg-danger-50 text-danger-800 border-danger-200',
  warning: 'bg-warning-50 text-warning-800 border-warning-200',
  info: 'bg-primary-50 text-primary-800 border-primary-200',
};

const iconColors = {
  success: 'text-success-600',
  error: 'text-danger-600',
  warning: 'text-warning-600',
  info: 'text-primary-600',
};

// Simple SVG icons for each variant
const icons = {
  success: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  info: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export function Alert({
  variant,
  title,
  children,
  onDismiss,
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4',
        variants[variant],
        className
      )}
    >
      <div className="flex">
        {/* Icon */}
        <div className={cn('flex-shrink-0', iconColors[variant])}>
          {icons[variant]}
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className={cn('text-sm', title ? '' : 'mt-0')}>
            {children}
          </div>
        </div>

        {/* Dismiss button */}
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onDismiss}
              className={cn(
                'inline-flex rounded-md p-1.5',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'hover:opacity-75 transition-opacity',
                iconColors[variant],
                variant === 'success' && 'focus:ring-success-600',
                variant === 'error' && 'focus:ring-danger-600',
                variant === 'warning' && 'focus:ring-warning-600',
                variant === 'info' && 'focus:ring-primary-600'
              )}
              aria-label="Dismiss alert"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
