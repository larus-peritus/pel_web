import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputsSection } from '@/components/fireTypes/InputsSection';
import { CalculatorProvider } from '@/context/CalculatorContext';

const MockProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <CalculatorProvider>{children}</CalculatorProvider>
);

describe('InputsSection Component', () => {
  describe('Rendering', () => {
    it('renders section header', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Þínar fjárhagslegar upplýsingar/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Sláðu inn núverandi fjárhagsstöðu þína/i)
      ).toBeInTheDocument();
    });

    it('renders all three main components', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      // ExpenseBaselineStatus
      expect(screen.getByText(/útgjaldagrunnur/i)).toBeInTheDocument();

      // UserFinancialInputs
      expect(screen.getByLabelText(/Núverandi aldur/i)).toBeInTheDocument();

      // AssumptionsControls
      expect(screen.getByText(/Ítarlegri stillingar/i)).toBeInTheDocument();
    });

    it('renders help section', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Ráð fyrir nákvæmar niðurstöður/i)).toBeInTheDocument();
    });
  });

  describe('Component Order', () => {
    it('displays ExpenseBaselineStatus first (priority)', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const section = container.querySelector('section');
      const children = section?.querySelectorAll(':scope > *');

      // First child after header should contain expense baseline status
      expect(children?.[1].textContent).toContain('útgjaldagrunnur');
    });

    it('displays UserFinancialInputs second', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const section = container.querySelector('section');
      const children = section?.querySelectorAll(':scope > *');

      // Should contain age input
      const secondSection = children?.[2];
      expect(secondSection?.textContent).toContain('Aldur');
    });

    it('displays AssumptionsControls third', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const section = container.querySelector('section');
      const children = section?.querySelectorAll(':scope > *');

      // Should contain assumptions text
      const thirdSection = children?.[3];
      expect(thirdSection?.textContent).toContain('Ítarlegri stillingar');
    });

    it('displays help section last', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const section = container.querySelector('section');
      const children = section?.querySelectorAll(':scope > *');

      // Last section should contain help text
      const lastSection = children?.[children.length - 1];
      expect(lastSection?.textContent).toContain('Ráð fyrir nákvæmar niðurstöður');
    });
  });

  describe('Help Section Content', () => {
    it('displays help icon', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const icon = screen.getByRole('img', { name: /info/i });
      expect(icon).toBeInTheDocument();
      expect(icon.textContent).toBe('💡');
    });

    it('displays all help tips', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Búðu til útgjaldagrunn/i)).toBeInTheDocument();
      expect(screen.getByText(/Reiknaðu raunverulegt tímakaup/i)).toBeInTheDocument();
      expect(screen.getByText(/Vertu heiðarlegur um núverandi sparnaðarhlutfall/i)).toBeInTheDocument();
      expect(screen.getByText(/Íhugaðu vandlega markaldur starfsloka/i)).toBeInTheDocument();
    });

    it('uses bulleted list for tips', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const helpSection = screen.getByText(/Búðu til útgjaldagrunn/i).closest('ul');
      expect(helpSection).toBeInTheDocument();

      const listItems = helpSection?.querySelectorAll('li');
      expect(listItems?.length).toBe(4);
    });
  });

  describe('Visual Hierarchy', () => {
    it('uses proper heading levels', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const h2 = container.querySelector('h2');
      expect(h2?.textContent).toContain('Þínar fjárhagslegar upplýsingar');
      expect(h2?.className).toContain('text-2xl');
      expect(h2?.className).toContain('font-bold');
    });

    it('uses proper spacing between sections', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const section = container.querySelector('section');
      expect(section?.className).toContain('space-y-6');
    });

    it('uses color-coded help section', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const helpSection = container.querySelector('.border-primary-200');
      expect(helpSection).toBeInTheDocument();
      expect(helpSection?.className).toContain('bg-primary-50');
    });
  });

  describe('Layout', () => {
    it('uses semantic section element', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('wraps each component in proper container', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const section = container.querySelector('section');
      const divContainers = section?.querySelectorAll(':scope > div');

      expect(divContainers && divContainers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Integration', () => {
    it('ExpenseBaselineStatus integrates correctly', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      // Should see expense baseline content
      expect(screen.getByText(/Enginn útgjaldagrunnur fundinn/i)).toBeInTheDocument();
    });

    it('UserFinancialInputs integrates correctly', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      // Should see all financial input fields
      expect(screen.getByLabelText(/Núverandi aldur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Hrein eign/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mánaðartekjur/i)).toBeInTheDocument();
    });

    it('AssumptionsControls integrates correctly', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      // Should see assumptions button (collapsed by default)
      expect(screen.getByRole('button', { name: /Ítarlegri stillingar/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('ul')).toBeInTheDocument();
    });

    it('all interactive elements are accessible', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('provides descriptive text for screen readers', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(
        screen.getByText(/Sláðu inn núverandi fjárhagsstöðu þína til að fá persónulegar ráðleggingar/i)
      ).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('uses responsive spacing', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const section = container.querySelector('section');
      expect(section?.className).toContain('space-y-6');
    });

    it('help section uses flex layout', () => {
      const { container } = render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      const helpSection = screen.getByText(/Ráð fyrir nákvæmar niðurstöður/i).closest('div');
      expect(helpSection?.parentElement?.className).toContain('flex');
    });
  });

  describe('Text Content', () => {
    it('uses Icelandic throughout', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Þínar fjárhagslegar upplýsingar/i)).toBeInTheDocument();
      expect(screen.getByText(/núverandi fjárhagsstöðu/i)).toBeInTheDocument();
      expect(screen.getByText(/persónulegar ráðleggingar/i)).toBeInTheDocument();
    });

    it('provides clear instructions', () => {
      render(
        <MockProviderWrapper>
          <InputsSection />
        </MockProviderWrapper>
      );

      expect(
        screen.getByText(/Sláðu inn núverandi fjárhagsstöðu þína til að fá persónulegar ráðleggingar um FIRE-markmiðin þín/i)
      ).toBeInTheDocument();
    });
  });
});
