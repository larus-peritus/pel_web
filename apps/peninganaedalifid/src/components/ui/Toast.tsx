'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useToast, type Toast as ToastType } from '@/context/ToastContext';

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

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Trigger fade-in animation
  useEffect(() => {
    // Small delay to trigger transition
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for fade-out animation before removing
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
        'transition-all duration-300 ease-in-out',
        variants[toast.variant],
        isVisible && !isExiting ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className={cn('flex-shrink-0', iconColors[toast.variant])}>
            {icons[toast.variant]}
          </div>

          {/* Message */}
          <div className="ml-3 flex-1 pt-0.5">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>

          {/* Dismiss button */}
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                'inline-flex rounded-md p-1.5',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'hover:opacity-75 transition-opacity',
                iconColors[toast.variant],
                toast.variant === 'success' && 'focus:ring-success-600',
                toast.variant === 'error' && 'focus:ring-danger-600',
                toast.variant === 'warning' && 'focus:ring-warning-600',
                toast.variant === 'info' && 'focus:ring-primary-600'
              )}
              aria-label="Dismiss notification"
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
        </div>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end px-4 py-6 sm:items-end sm:justify-end sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </div>
  );
}
