'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export interface NewsletterSubscribeProps {
  /** Buttondown username/publication ID */
  buttondownId?: string;
  /** Custom heading text */
  heading?: string;
  /** Custom description text */
  description?: string;
  /** Callback when subscription succeeds */
  onSuccess?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Compact mode for inline display */
  compact?: boolean;
}

/**
 * NewsletterSubscribe - Buttondown newsletter subscription form
 *
 * Uses Buttondown's embed form API for newsletter subscriptions.
 * All text in Icelandic.
 *
 * @example
 * ```tsx
 * <NewsletterSubscribe
 *   buttondownId="peninganaedalifid"
 *   onSuccess={() => console.log('Subscribed!')}
 * />
 * ```
 */
export function NewsletterSubscribe({
  buttondownId = 'peninganaedalifid',
  heading,
  description,
  onSuccess,
  className,
  compact = false,
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Vinsamlegast sláðu inn gilt netfang');
      return;
    }

    try {
      // Submit to Buttondown API
      const response = await fetch(
        `https://api.buttondown.email/v1/subscribers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            referrer_url: typeof window !== 'undefined' ? window.location.href : '',
          }),
        }
      );

      if (response.ok || response.status === 201) {
        setStatus('success');
        setEmail('');
        onSuccess?.();
      } else {
        // Fallback: Use form submission method
        const form = document.createElement('form');
        form.action = `https://buttondown.email/api/emails/embed-subscribe/${buttondownId}`;
        form.method = 'POST';
        form.target = '_blank';

        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = 'email';
        emailInput.value = email;
        form.appendChild(emailInput);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        setStatus('success');
        setEmail('');
        onSuccess?.();
      }
    } catch {
      // Fallback to direct form submission
      const form = document.createElement('form');
      form.action = `https://buttondown.email/api/emails/embed-subscribe/${buttondownId}`;
      form.method = 'POST';
      form.target = '_blank';

      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email';
      emailInput.value = email;
      form.appendChild(emailInput);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setStatus('success');
      setEmail('');
      onSuccess?.();
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-lg bg-success-50 border border-success-200 p-4',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-success-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <div>
            <p className="font-medium text-success-800">Takk fyrir skráninguna!</p>
            <p className="text-sm text-success-700 mt-0.5">
              Þú færð staðfestingarpóst á netfangið þitt.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {!compact && (heading || description) && (
        <div className="mb-4">
          {heading && (
            <h3 className="text-lg font-semibold text-neutral-900">{heading}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className={cn(compact ? 'flex gap-2' : 'space-y-3')}>
        <div className={compact ? 'flex-1' : ''}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="netfang@dæmi.is"
            required
            disabled={status === 'loading'}
            error={status === 'error' ? errorMessage : undefined}
            aria-label="Netfang"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={status === 'loading'}
          disabled={status === 'loading' || !email}
          className={compact ? 'shrink-0' : 'w-full'}
        >
          {status === 'loading' ? 'Skrái...' : 'Skrá mig'}
        </Button>
      </form>

      <p className="mt-3 text-xs text-neutral-500">
        Við sendum aldrei ruslpóst. Þú getur afskráð þig hvenær sem er.
      </p>
    </div>
  );
}

export default NewsletterSubscribe;
