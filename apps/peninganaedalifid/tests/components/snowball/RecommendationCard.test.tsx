import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecommendationCard } from '@/components/snowball/RecommendationCard';
import type { SnowballResults } from '@/types/snowball';

describe('RecommendationCard', () => {
  it('displays best scenario name prominently', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'snowballInvest',
      isCloseCall: false,
      reasoning: 'Fjárfesting skilar meiri ávöxtun en vextir á láni.',
      lifeEnergyDifference: 50,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    expect(screen.getByText('Snjóbolti í fjárfestingu')).toBeInTheDocument();
  });

  it('displays reasoning text', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'snowballLoan',
      isCloseCall: false,
      reasoning: 'Að borga af láni fyrr minnkar vaxtabyrði verulega.',
      lifeEnergyDifference: 30,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    expect(screen.getByText(/Að borga af láni fyrr minnkar vaxtabyrði/)).toBeInTheDocument();
  });

  it('displays life energy difference with klst suffix', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'snowballInvest',
      isCloseCall: false,
      reasoning: 'Test reasoning',
      lifeEnergyDifference: 42.7,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    expect(screen.getByText(/42\.7 klst/)).toBeInTheDocument();
    expect(screen.getByText(/meira frítíma á ævinni/)).toBeInTheDocument();
  });

  it('shows close call badge when isCloseCall is true', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'base',
      isCloseCall: true,
      reasoning: 'Aðferðirnar eru mjög svipaðar.',
      lifeEnergyDifference: 5,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    expect(screen.getByText('Jafntefli - persónuleg val')).toBeInTheDocument();
  });

  it('does not show close call badge when isCloseCall is false', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'snowballLoan',
      isCloseCall: false,
      reasoning: 'Clear winner',
      lifeEnergyDifference: 50,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    expect(screen.queryByText('Jafntefli - persónuleg val')).not.toBeInTheDocument();
  });

  it('shows close call explanation when isCloseCall is true', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'base',
      isCloseCall: true,
      reasoning: 'Test',
      lifeEnergyDifference: 3,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    expect(screen.getByText(/Aðferðirnar eru næstum jafn góðar/)).toBeInTheDocument();
    expect(screen.getByText(/persónulegu óskum og áhættusækni/)).toBeInTheDocument();
  });

  it('applies green border for clear recommendation', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'snowballInvest',
      isCloseCall: false,
      reasoning: 'Test',
      lifeEnergyDifference: 50,
    };

    const { container } = render(<RecommendationCard recommendation={recommendation} />);

    const card = container.querySelector('.border-success-300');
    expect(card).toBeInTheDocument();
  });

  it('applies yellow border for close call', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'base',
      isCloseCall: true,
      reasoning: 'Test',
      lifeEnergyDifference: 5,
    };

    const { container } = render(<RecommendationCard recommendation={recommendation} />);

    const card = container.querySelector('.border-warning-300');
    expect(card).toBeInTheDocument();
  });

  it('displays all three scenario names correctly', () => {
    const scenarios: Array<SnowballResults['recommendation']['bestScenario']> = [
      'base',
      'snowballLoan',
      'snowballInvest',
    ];

    const expectedNames = [
      'Grunnur (aukagreiðsla eingöngu)',
      'Snjóbolti á lán',
      'Snjóbolti í fjárfestingu',
    ];

    scenarios.forEach((scenario, index) => {
      const recommendation: SnowballResults['recommendation'] = {
        bestScenario: scenario,
        isCloseCall: false,
        reasoning: 'Test',
        lifeEnergyDifference: 10,
      };

      const { unmount } = render(<RecommendationCard recommendation={recommendation} />);
      expect(screen.getByText(expectedNames[index])).toBeInTheDocument();
      unmount();
    });
  });

  it('handles zero life energy difference gracefully', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'base',
      isCloseCall: true,
      reasoning: 'Scenarios are identical',
      lifeEnergyDifference: 0,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    // Should not display life energy panel when difference is 0
    expect(screen.queryByText('Munur í lífsorku')).not.toBeInTheDocument();
  });

  it('displays multiline reasoning correctly', () => {
    const multilineReasoning = `Lína 1: Vextir á láni eru hærri en vænt ávöxtun.
Lína 2: Greiða skuldir fyrr minnkar áhættu.
Lína 3: Fjárhagslegt öryggi batnar.`;

    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'snowballLoan',
      isCloseCall: false,
      reasoning: multilineReasoning,
      lifeEnergyDifference: 40,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    expect(screen.getByText(/Lína 1: Vextir á láni/)).toBeInTheDocument();
    expect(screen.getByText(/Lína 2: Greiða skuldir fyrr/)).toBeInTheDocument();
    expect(screen.getByText(/Lína 3: Fjárhagslegt öryggi/)).toBeInTheDocument();
  });

  it('renders card header and content sections', () => {
    const recommendation: SnowballResults['recommendation'] = {
      bestScenario: 'base',
      isCloseCall: false,
      reasoning: 'Test',
      lifeEnergyDifference: 10,
    };

    render(<RecommendationCard recommendation={recommendation} />);

    expect(screen.getByText('Tilmæli')).toBeInTheDocument();
    expect(screen.getByText('Besta aðferðin fyrir þig')).toBeInTheDocument();
  });
});
