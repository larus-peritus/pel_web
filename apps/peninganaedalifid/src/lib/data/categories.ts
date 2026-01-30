/**
 * Six main spending categories for impact analysis
 * Icelandic labels and realistic examples
 */

import { CategoryDefinition } from '@/types/cutImpact';

/**
 * Six main spending categories for impact analysis
 */
export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'subscriptions',
    nameIs: 'Áskriftir',
    icon: '📺',
    examples: 't.d. Netflix, Spotify, líkamsrækt',
  },
  {
    id: 'dining',
    nameIs: 'Veitingastaðir',
    icon: '🍽️',
    examples: 't.d. hádegisverður, kaffihús, kvöldverður',
  },
  {
    id: 'transportation',
    nameIs: 'Samgöngur',
    icon: '🚗',
    examples: 't.d. eldsneyti, bílastæði, Strætó',
  },
  {
    id: 'shopping',
    nameIs: 'Verslanir',
    icon: '🛍️',
    examples: 't.d. föt, raftæki, húsgögn',
  },
  {
    id: 'entertainment',
    nameIs: 'Skemmtun',
    icon: '🎉',
    examples: 't.d. bíó, tónleikar, ferðalög',
  },
  {
    id: 'other',
    nameIs: 'Annað',
    icon: '📦',
    examples: 't.d. fötþvottur, tómstundir, gjafir',
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}
