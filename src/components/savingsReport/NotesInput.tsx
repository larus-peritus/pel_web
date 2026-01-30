'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface NotesInputProps {
  /** Notes text value */
  value?: string;
  /** Callback when notes change */
  onChange: (value: string | undefined) => void;
  /** Category ID for unique input ID */
  categoryId: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * NotesInput - Optional textarea for category notes
 *
 * Features:
 * - Textarea for notes
 * - Label: "Athugasemdir (valfrjálst)"
 * - Placeholder text
 *
 * Requirements: US-7, FR-2.4, Task 3.6
 */
export function NotesInput({
  value,
  onChange,
  categoryId,
  className,
}: NotesInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Store undefined if empty, otherwise store the text
    onChange(newValue.trim() === '' ? undefined : newValue);
  };

  return (
    <div className={className}>
      <label
        htmlFor={`${categoryId}-notes`}
        className="block text-sm font-medium text-neutral-700 mb-2"
      >
        Athugasemdir <span className="text-neutral-500 font-normal">(valfrjálst)</span>
      </label>

      <textarea
        id={`${categoryId}-notes`}
        value={value || ''}
        onChange={handleChange}
        placeholder="Bættu við athugasemdum..."
        rows={3}
        className={cn(
          // Base styles
          'w-full rounded-lg border px-4 py-3 text-base text-neutral-900',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'transition-colors duration-200',
          'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
          // Disabled styles
          'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500',
          // Resize
          'resize-y min-h-[80px]',
          className
        )}
        aria-label={`Athugasemdir fyrir ${categoryId}`}
      />

      <p className="mt-1.5 text-xs text-neutral-500">
        T.d. reikningsnúmer, markmið, eða aðrar ábendingar
      </p>
    </div>
  );
}
