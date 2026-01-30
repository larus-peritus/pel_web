/**
 * Debt Payoff vs Invest Analyzer Page
 * Next.js page component
 */

import { DebtPayoffPage } from '@/components/debtPayoff';

export const metadata = {
  title: 'Borga skuld eða fjárfesta? | Peningana Eðalífið',
  description:
    'Berðu saman fjárhagslegan ávinning af því að borga aukalega á skuld á móti því að fjárfesta peningana. Tekur tillit til bæði stærðfræðilegra útreikninga og tilfinninga.',
};

export default function DebtPayoffAnalyzerPage() {
  // In a real implementation, you would get actualHourlyWage from CalculatorContext
  // For now, we'll use a placeholder value
  const actualHourlyWage = 5000; // Example: 5000 kr/hour

  return <DebtPayoffPage actualHourlyWage={actualHourlyWage} />;
}
