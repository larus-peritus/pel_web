import { Metadata } from 'next';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { CalculatorPageContent } from '@/components/calculator';

export const metadata: Metadata = {
  title: 'Peningana eða lífið - Þín leið að fjárhagslegu frelsi',
  description: 'Reiknaðu raunverulegt tímakaup þitt með því að taka tillit til alls falins vinnukostnaðar og tíma. Byggt á aðferðafræði Your Money or Your Life.',
};

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <CalculatorPageContent />
    </CalculatorProvider>
  );
}
