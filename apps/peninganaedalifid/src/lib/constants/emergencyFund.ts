/**
 * Emergency Fund Freedom Meter - Constants
 *
 * Icelandic expense examples and target definitions
 * Last updated: January 2026
 */

import type { ExpenseExample } from '@/types/emergencyFund';

/**
 * Icelandic monthly expense examples
 * Based on typical costs in Iceland as of January 2026
 *
 * NOTE: These should be reviewed annually to reflect current costs
 */
export const ICELANDIC_EXPENSE_EXAMPLES: ExpenseExample[] = [
  {
    id: 'minimal',
    label: 'Lágmark (grunn þarfir)',
    amount: 200000,
    description: 'Leigu í smærri íbúð, grunnmatur, lágmarks veitur',
  },
  {
    id: 'average',
    label: 'Meðaltal (þægilegt)',
    amount: 350000,
    description: 'Meðalleiga, heilnæmt mataræði, venjulegur kostnaður',
  },
  {
    id: 'generous',
    label: 'Rúmlegt',
    amount: 500000,
    description: 'Rýmri húsnæði, góður matur, fleiri þægindi',
  },
];

/**
 * Emergency fund target milestones (in months)
 * Standard FIRE community targets: 3, 6, 12 months
 */
export const EMERGENCY_FUND_TARGETS = [3, 6, 12] as const;

/**
 * Explanations for each target milestone
 * Why each target is important
 */
export const TARGET_EXPLANATIONS: Record<number, string> = {
  3: 'Lágmarksöryggi fyrir smærri neyðartilvik og skammtíma atvinnutap',
  6: 'Mælt með fyrir flesta - bætir við öryggi og sveigjanleika',
  12: 'Sterkur grunnur fyrir langtíma fjármálaöryggi og frelsismarkmið',
};

/**
 * Icelandic risk rating labels
 */
export const RISK_RATING_TRANSLATIONS = {
  underfunded: 'Vanfjármögnuð',
  minimal: 'Lágmarks',
  moderate: 'Hóflegt',
  strong: 'Sterkur',
  excellent: 'Framúrskarandi',
} as const;

/**
 * Educational content for emergency funds
 */
export const EMERGENCY_FUND_EDUCATION = {
  title: 'Hvað er neyðarsjóður?',
  introduction:
    'Neyðarsjóður er sparnaður sem þú hefur til hliðar fyrir óvænt útgjöld eða tekjutap. Hann gefur þér frelsi til að takast á við neyðartilvik án þess að fara í skuldir.',
  why: {
    title: 'Hvers vegna er þetta mikilvægt?',
    points: [
      'Verndar þig gegn óvæntum útgjöldum (bílaviðgerðir, heilbrigðiskostnaður)',
      'Veitir öryggi ef þú missir vinnuna',
      'Gefur þér frelsi til að segja nei við slæma vinnu',
      'Minnkar fjárhagslega streitu',
      'Fyrsta skrefið í átt að fjárhagslegri sjálfstæði',
    ],
  },
  targets: {
    title: 'Hvers vegna 3/6/12 mánuðir?',
    explanation:
      '3 mánuðir eru lágmarkið fyrir grunnöryggi. 6 mánuðir eru væru betri. 12 mánuðir gefur sterkan grunn fyrir langtíma markmið.',
  },
};
