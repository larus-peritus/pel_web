'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { NewsletterSubscribe } from './NewsletterSubscribe';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'peninganaedalifid_welcome_shown';

export interface WelcomeModalProps {
  /** Force modal to show (for testing) */
  forceShow?: boolean;
  /** Callback when modal is dismissed */
  onDismiss?: () => void;
  /** Buttondown publication ID */
  buttondownId?: string;
}

/**
 * WelcomeModal - First-visit welcome modal with app introduction and newsletter signup
 *
 * Shows automatically on first visit. Includes:
 * - App description and purpose
 * - How to use the tools
 * - Benefits of using the calculators
 * - Newsletter signup (Buttondown)
 *
 * Remembers dismissal in localStorage.
 *
 * @example
 * ```tsx
 * // In your layout or main page:
 * <WelcomeModal buttondownId="peninganaedalifid" />
 * ```
 */
export function WelcomeModal({
  forceShow = false,
  onDismiss,
  buttondownId = 'peninganaedalifid',
}: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // Check if user has seen the modal before
  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    // Only run on client
    if (typeof window === 'undefined') return;

    const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenWelcome) {
      // Small delay for smoother UX after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user has seen the modal
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    onDismiss?.();
  };

  const handleSubscribeSuccess = () => {
    setHasSubscribed(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      closeOnOverlayClick={false}
    >
      {/* Hero Section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <span className="text-3xl" role="img" aria-label="Velkomin">💰</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">
          Velkomin á Peningana eða Lífið!
        </h2>
        <p className="mt-2 text-neutral-600">
          Reiknivélar og innsýn fyrir fjárhagslegt sjálfstæði
        </p>
      </div>

      {/* What is this? */}
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Til hvers?
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Peningana eða Lífið er safn af ókeypis reiknivélum sem hjálpa þér að skilja
            raunverulegan kostnað vinnu þinnar og finna leið til fjárhagslegs sjálfstæðis og/eða snemmbúinna starfsloka (FI-RE).
            Allar reiknivélar eru sérsniðnar að íslenskum aðstæðum - með íslenskum launum,
            verðbólgu og lífeyriskerfinu í huga.
          </p>
        </section>

        {/* Benefits */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">
            Hvað get ég lært?
          </h3>
          <ul className="space-y-2">
            {[
              {
                icon: '⏱️',
                title: 'Raunverulegt tímakaup',
                desc: 'Reiknaðu hvað þú færð í raun á klukkustund eftir allan falinn kostnað',
              },
              {
                icon: '🎯',
                title: 'FI-töluna þína',
                desc: 'Finndu út hversu mikið þú þarft til að verða fjárhagslega sjálfstæð/ur',
              },
              {
                icon: '📊',
                title: 'Samanburð á útgjöldum',
                desc: 'Sjáðu hvernig útgjöld þín breytast í "lífsorku" - klukkustundir af vinnu',
              },
              {
                icon: '🔥',
                title: 'FIRE leiðir',
                desc: 'Kannaðu mismunandi leiðir til snemmbúinna starfsloka',
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="text-xl shrink-0" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <span className="font-medium text-neutral-900">{item.title}</span>
                  <span className="text-neutral-600 text-sm"> - {item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* How to use */}
        <section className="bg-neutral-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Hvernig byrja ég?
          </h3>
          <ol className="space-y-2 text-sm text-neutral-600">
            <li className="flex gap-2">
              <span className="font-bold text-primary-600">1.</span>
              <span>
                <strong>Byrjaðu á Raunverulegu tímakaupi</strong> - þetta er grunnurinn að öllum
                öðrum útreikningum
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary-600">2.</span>
              <span>
                <strong>Settu upp útgjaldagrunn</strong> - skráðu mánaðarlega útgjöld þín til að sjá hver staðan er
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary-600">3.</span>
              <span>
                <strong>Kannaðu FIRE reiknivélarnar</strong> - finndu leiðina sem hentar þér best
              </span>
            </li>
          </ol>
        </section>

        {/* Newsletter Signup */}
        <section className={cn(
          'border-t border-neutral-200 pt-6',
          hasSubscribed && 'pb-0'
        )}>
          <NewsletterSubscribe
            buttondownId={buttondownId}
            heading="Fáðu fréttir og ráð"
            description="Skráðu þig á póstlistann okkar til að fá tilkynningar um nýjar reiknivélar, fjárhagsráð og uppfærslur."
            onSuccess={handleSubscribeSuccess}
          />
        </section>
      </div>

      {/* Footer */}
      <ModalFooter>
        <Button
          variant={hasSubscribed ? 'primary' : 'secondary'}
          onClick={handleClose}
          className="w-full sm:w-auto"
        >
          {hasSubscribed ? 'Byrja að nota síðuna' : 'Sleppa og halda áfram'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/**
 * Hook to reset welcome modal (for testing)
 */
export function useResetWelcomeModal() {
  return () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
}

export default WelcomeModal;
