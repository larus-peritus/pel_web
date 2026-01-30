/**
 * Retirement Simulator Calculator Page
 * Route: /eftirlaunahermir
 *
 * Monte Carlo simulation for retirement planning with Icelandic pension integration.
 * Helps users estimate probability of retirement success based on portfolio,
 * savings rate, expenses, and withdrawal strategy.
 */

import type { Metadata } from 'next';
import { EftirlaunahermirClient } from './EftirlaunahermirClient';

export const metadata: Metadata = {
  title: 'Eftirlaunahermir | Peningana Edal Ifið',
  description:
    'Monte Carlo hermun til að meta líkur á árangri eftirlaunaplansins þíns. Tekur tillit til markaðssveifla, verðbólgu og íslensks lífeyriskerfis.',
  openGraph: {
    title: 'Eftirlaunahermir - Monte Carlo hermun fyrir eftirlaun',
    description:
      'Mettu líkur á árangri eftirlaunaáætlunarinnar með þúsundum atburðarása. Lífeyrissjóður og ellilífeyrir teknir með í reikninginn.',
  },
};

export default function EftirlaunahermirPage() {
  return <EftirlaunahermirClient />;
}
