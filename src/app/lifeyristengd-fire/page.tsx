/**
 * Pension-Aware FIRE Calculator Page
 * Route: /lifeyristengd-fire
 *
 * Calculator that shows the true FI number needed for early retirement in Iceland
 * by accounting for the three-tier pension system (Séreign at 60, Lífeyrissjóður at 62-67, TR at 67).
 * Breaks retirement into phases and shows how much less users need to save compared to traditional FIRE approaches.
 *
 * Features:
 * - Three-phase retirement planning (Gap, Séreign Bridge, Full Pension)
 * - Integration with Icelandic pension system
 * - Present value calculations for pension streams
 * - Comparison: Traditional FI vs Pension-Adjusted FI
 * - Visual timeline showing retirement phases
 * - Scenario comparison (save up to 3 scenarios)
 * - Educational content explaining the concept
 *
 * Epic 7, Task 7.2
 */

import type { Metadata } from 'next';
import { LifeyristengdFIREClient } from './LifeyristengdFIREClient';

export const metadata: Metadata = {
  title: 'Lífeyristengd FIRE Reiknivél | Peningaæðalífið',
  description:
    'Reiknaðu raunverulega FI-tölu þína með tilliti til íslenska lífeyriskerfisins. Sjáðu hvernig séreign, lífeyrissjóður og TR lífeyrir hafa áhrif á sparnaðarþörf þína.',
  keywords: [
    'FIRE',
    'FI',
    'fjárhagslegt frelsi',
    'lífeyrir',
    'séreign',
    'lífeyrissjóður',
    'TR',
    'ellilífeyrir',
    'eftirlaunaáætlun',
    'Ísland',
  ],
  openGraph: {
    title: 'Lífeyristengd FIRE Reiknivél - Peningaæðalífið',
    description:
      'Finndu raunverulega FI-tölu þína með tilliti til íslenska lífeyriskerfisins. Sparaðu milljónir með því að gera ráð fyrir lífeyri.',
  },
};

export default function LifeyristengdFIREPage() {
  return <LifeyristengdFIREClient />;
}
