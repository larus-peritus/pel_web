import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssumptionsControls } from '@/components/fireTypes/AssumptionsControls';
import { CalculatorProvider } from '@/context/CalculatorContext';

const MockProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <CalculatorProvider>{children}</CalculatorProvider>
);

describe('AssumptionsControls Component', () => {
  describe('Rendering', () => {
    it('renders collapsed by default', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      expect(screen.getByText(/Ítarlegri stillingar/i)).toBeInTheDocument();
      expect(screen.getByText(/Breyttu forsendum fyrir útreikninga/i)).toBeInTheDocument();

      // Content should not be visible
      expect(screen.queryByLabelText(/Úttektarhlutfall/i)).not.toBeInTheDocument();
    });

    it('expands when header is clicked', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button', { name: /Ítarlegri stillingar/i });
      fireEvent.click(header);

      expect(screen.getByLabelText(/Úttektarhlutfall/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Vænt ávöxtun/i)).toBeInTheDocument();
    });

    it('collapses when header is clicked again', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');

      // Expand
      fireEvent.click(header);
      expect(screen.getByLabelText(/Úttektarhlutfall/i)).toBeInTheDocument();

      // Collapse
      fireEvent.click(header);
      expect(screen.queryByLabelText(/Úttektarhlutfall/i)).not.toBeInTheDocument();
    });

    it('shows info alert when expanded', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);

      expect(screen.getByText(/Þessar stillingar hafa áhrif á alla FIRE útreikninga/i)).toBeInTheDocument();
    });
  });

  describe('Withdrawal Rate Slider', () => {
    beforeEach(() => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);
    });

    it('displays withdrawal rate slider with correct range', () => {
      const slider = screen.getByLabelText(/Úttektarhlutfall/i) as HTMLInputElement;

      expect(slider).toHaveAttribute('type', 'range');
      expect(slider).toHaveAttribute('min', '3');
      expect(slider).toHaveAttribute('max', '5');
      expect(slider).toHaveAttribute('step', '0.1');
    });

    it('displays default withdrawal rate (4%)', () => {
      expect(screen.getByText(/4\.0%/)).toBeInTheDocument();
    });

    it('shows help text for withdrawal rate', () => {
      expect(screen.getByText(/Hvað er þetta\?/i)).toBeInTheDocument();
      expect(screen.getByText(/25x árleg útgjöld/i)).toBeInTheDocument();
    });

    it('updates withdrawal rate when slider changes', () => {
      const slider = screen.getByLabelText(/Úttektarhlutfall/i) as HTMLInputElement;

      fireEvent.change(slider, { target: { value: '3.5' } });

      expect(screen.getByText(/3\.5%/)).toBeInTheDocument();
    });

    it('calculates correct multiplier for withdrawal rate', () => {
      const slider = screen.getByLabelText(/Úttektarhlutfall/i) as HTMLInputElement;

      fireEvent.change(slider, { target: { value: '3' } });

      // 100 ÷ 3 = 33.3x
      expect(screen.getByText(/33\.3x/i)).toBeInTheDocument();
    });
  });

  describe('Growth Rate Slider', () => {
    beforeEach(() => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);
    });

    it('displays growth rate slider with correct range', () => {
      const slider = screen.getByLabelText(/Vænt ávöxtun/i) as HTMLInputElement;

      expect(slider).toHaveAttribute('type', 'range');
      expect(slider).toHaveAttribute('min', '4');
      expect(slider).toHaveAttribute('max', '8');
      expect(slider).toHaveAttribute('step', '0.25');
    });

    it('displays default growth rate (6%)', () => {
      expect(screen.getByText(/6\.00%/)).toBeInTheDocument();
    });

    it('shows help text for growth rate', () => {
      expect(screen.getByText(/Vænt árleg ávöxtun fjárfestinga/i)).toBeInTheDocument();
      expect(screen.getByText(/regla 72/i)).toBeInTheDocument();
    });

    it('updates growth rate when slider changes', () => {
      const slider = screen.getByLabelText(/Vænt ávöxtun/i) as HTMLInputElement;

      fireEvent.change(slider, { target: { value: '7' } });

      expect(screen.getByText(/7\.00%/)).toBeInTheDocument();
    });

    it('calculates rule of 72 correctly', () => {
      const slider = screen.getByLabelText(/Vænt ávöxtun/i) as HTMLInputElement;

      fireEvent.change(slider, { target: { value: '8' } });

      // 72 ÷ 8 = 9 years
      expect(screen.getByText(/9\.0 árum/i)).toBeInTheDocument();
    });
  });

  describe('Real Return Display', () => {
    beforeEach(() => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);
    });

    it('displays real return calculation', () => {
      expect(screen.getByText(/Raunávöxtun/i)).toBeInTheDocument();
      // 6% - 2.5% = 3.5%
      expect(screen.getByText(/3\.50%/)).toBeInTheDocument();
    });

    it('updates real return when growth rate changes', () => {
      const slider = screen.getByLabelText(/Vænt ávöxtun/i) as HTMLInputElement;

      fireEvent.change(slider, { target: { value: '7' } });

      // 7% - 2.5% = 4.5%
      expect(screen.getByText(/4\.50%/)).toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('reset button is disabled when using default values', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);

      const resetButton = screen.getByText(/Endurstilla sjálfgefin gildi/i);
      expect(resetButton).toBeDisabled();
    });

    it('shows "Sérsniðið" badge when using custom values', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);

      const slider = screen.getByLabelText(/Úttektarhlutfall/i);
      fireEvent.change(slider, { target: { value: '3.5' } });

      expect(screen.getByText(/Sérsniðið/i)).toBeInTheDocument();
    });

    it('enables reset button when using custom values', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);

      const slider = screen.getByLabelText(/Úttektarhlutfall/i);
      fireEvent.change(slider, { target: { value: '3.5' } });

      const resetButton = screen.getByText(/Endurstilla sjálfgefin gildi/i);
      expect(resetButton).not.toBeDisabled();
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);
    });

    it('shows warning for high withdrawal rate', async () => {
      const slider = screen.getByLabelText(/Úttektarhlutfall/i);

      fireEvent.change(slider, { target: { value: '5' } });

      await waitFor(() => {
        expect(screen.getByText(/yfir 5% gæti verið áhættusamt/i)).toBeInTheDocument();
      });
    });

    it('shows warning for low withdrawal rate', async () => {
      const slider = screen.getByLabelText(/Úttektarhlutfall/i);

      fireEvent.change(slider, { target: { value: '3' } });

      await waitFor(() => {
        expect(screen.getByText(/undir 3% er mjög varfærið/i)).toBeInTheDocument();
      });
    });

    it('shows warning for high growth rate', async () => {
      const slider = screen.getByLabelText(/Vænt ávöxtun/i);

      fireEvent.change(slider, { target: { value: '8' } });

      await waitFor(() => {
        expect(screen.getByText(/yfir 10% er bjartsýn/i)).toBeInTheDocument();
      });
    });

    it('shows warning for low growth rate', async () => {
      const slider = screen.getByLabelText(/Vænt ávöxtun/i);

      fireEvent.change(slider, { target: { value: '4' } });

      await waitFor(() => {
        expect(screen.getByText(/undir 4% er svartsýn/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for collapsible section', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      expect(header).toHaveAttribute('aria-expanded', 'false');
      expect(header).toHaveAttribute('aria-controls', 'assumptions-content');

      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('has proper labels for all sliders', () => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);

      expect(screen.getByLabelText(/Úttektarhlutfall/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Vænt ávöxtun/i)).toBeInTheDocument();
    });
  });

  describe('Help Text and Examples', () => {
    beforeEach(() => {
      render(
        <MockProviderWrapper>
          <AssumptionsControls />
        </MockProviderWrapper>
      );

      const header = screen.getByRole('button');
      fireEvent.click(header);
    });

    it('displays contextual example for withdrawal rate', () => {
      expect(screen.getByText(/Með 4\.0% úttektarhlutfall þarftu 25\.0x/i)).toBeInTheDocument();
    });

    it('displays contextual example for growth rate', () => {
      expect(screen.getByText(/tvöfaldast fjárfestingar þínar á/i)).toBeInTheDocument();
    });

    it('updates examples when values change', () => {
      const slider = screen.getByLabelText(/Úttektarhlutfall/i);

      fireEvent.change(slider, { target: { value: '3' } });

      expect(screen.getByText(/Með 3\.0% úttektarhlutfall þarftu 33\.3x/i)).toBeInTheDocument();
    });
  });
});
