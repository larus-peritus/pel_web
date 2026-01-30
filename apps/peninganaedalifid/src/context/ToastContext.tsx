'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Toast {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // Default: 5000ms
}

export interface ToastOptions {
  variant: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (options: ToastOptions) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (options: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: Toast = {
        id,
        variant: options.variant,
        message: options.message,
        duration: options.duration ?? 5000,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after duration
      const duration = toast.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
