import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AWHPrompt } from '@/components/fiNumber/AWHPrompt';

describe('AWHPrompt', () => {
  describe('Rendering', () => {
    it('should render the prompt with title and main message', () => {
      render(<AWHPrompt />);

      expect(screen.getByText('Sjáðu FI-tölu þína í árum vinnu')).toBeInTheDocument();
      expect(screen.getByText(/Með því að reikna út þitt/)).toBeInTheDocument();
      expect(screen.getByText(/raunverulega tímalaun/, { selector: 'strong' })).toBeInTheDocument();
    });

    it('should display benefits list', () => {
      render(<AWHPrompt />);

      expect(screen.getByText(/Hversu mörg ár af vinnu FI-talan þín jafngildir/)).toBeInTheDocument();
      expect(screen.getByText(/Hversu mörg ár eru eftir til að ná FI/)).toBeInTheDocument();
      expect(screen.getByText(/Sjónræna framvindu til fjármálafrelsis/)).toBeInTheDocument();
      expect(screen.getByText(/Hvatningarskilaboð byggð á framvindu þinni/)).toBeInTheDocument();
    });

    it('should have a link to AWH calculator', () => {
      render(<AWHPrompt />);

      const link = screen.getByRole('link', { name: /Reikna raunverulegt tímalaun/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/raunverulegt-timakaup');
    });

    it('should have "Ekki núna" button', () => {
      render(<AWHPrompt />);

      expect(screen.getByRole('button', { name: 'Ekki núna' })).toBeInTheDocument();
    });
  });

  describe('Dismissal', () => {
    it('should dismiss the prompt when dismiss button is clicked', () => {
      render(<AWHPrompt />);

      // Alert should be visible initially
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Click the dismiss X button
      const dismissButton = screen.getByRole('button', { name: 'Dismiss alert' });
      fireEvent.click(dismissButton);

      // Alert should be removed
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should dismiss when "Ekki núna" button is clicked', () => {
      render(<AWHPrompt />);

      // Alert should be visible initially
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Click "Ekki núna" button
      const skipButton = screen.getByRole('button', { name: 'Ekki núna' });
      fireEvent.click(skipButton);

      // Alert should be removed
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should not re-render after dismissal', () => {
      render(<AWHPrompt />);

      const dismissButton = screen.getByRole('button', { name: 'Dismiss alert' });
      fireEvent.click(dismissButton);

      // Component should return null
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.queryByText('Sjáðu FI-tölu þína í árum vinnu')).not.toBeInTheDocument();
    });
  });

  describe('Expandable Details', () => {
    it('should have expandable "Hvað er raunverulegt tímalaun?" section', () => {
      render(<AWHPrompt />);

      const detailsElement = screen.getByText('Hvað er raunverulegt tímalaun?');
      expect(detailsElement).toBeInTheDocument();
      expect(detailsElement.tagName.toLowerCase()).toBe('summary');
    });

    it('should show additional information when details are expanded', () => {
      render(<AWHPrompt />);

      // Details content should not be visible initially (collapsed by default)
      expect(screen.queryByText(/Your Money or Your Life/)).not.toBeVisible();

      // Click to expand
      const summary = screen.getByText('Hvað er raunverulegt tímalaun?');
      fireEvent.click(summary);

      // Now content should be visible
      expect(screen.getByText(/Your Money or Your Life/)).toBeVisible();
      expect(screen.getByText(/vinnu-tengdra útgjalda/)).toBeInTheDocument();
      expect(screen.getByText(/20-40% lægri en þeir héldu/)).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should render as an info Alert', () => {
      render(<AWHPrompt />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-primary-50');
    });

    it('should have properly styled action buttons', () => {
      render(<AWHPrompt />);

      const primaryLink = screen.getByRole('link', { name: /Reikna raunverulegt tímalaun/i });
      expect(primaryLink).toHaveClass('bg-primary-600');

      const skipButton = screen.getByRole('button', { name: 'Ekki núna' });
      expect(skipButton).toHaveClass('bg-neutral-100');
    });

    it('should display benefits in a highlighted box', () => {
      render(<AWHPrompt />);

      const benefitsBox = screen.getByText('Hvað myndirðu sjá?').closest('div');
      expect(benefitsBox).toHaveClass('bg-primary-100');
    });
  });

  describe('Content', () => {
    it('should explain life energy concept', () => {
      render(<AWHPrompt />);

      expect(screen.getByText(/lífsorku/)).toBeInTheDocument();
    });

    it('should mention integration with FI number', () => {
      render(<AWHPrompt />);

      expect(screen.getByText('Sjáðu FI-tölu þína í árum vinnu')).toBeInTheDocument();
    });

    it('should provide context about AWH calculation', () => {
      render(<AWHPrompt />);

      // Expand details to see content
      const summary = screen.getByText('Hvað er raunverulegt tímalaun?');
      fireEvent.click(summary);

      expect(screen.getByText(/vinnu-tengdra útgjalda/)).toBeInTheDocument();
      expect(screen.getByText(/aukavinnustunda/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be announced by screen readers as an alert', () => {
      render(<AWHPrompt />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should have accessible dismiss button', () => {
      render(<AWHPrompt />);

      const dismissButton = screen.getByRole('button', { name: 'Dismiss alert' });
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss alert');
    });

    it('should have keyboard-navigable buttons and links', () => {
      render(<AWHPrompt />);

      const link = screen.getByRole('link', { name: /Reikna raunverulegt tímalaun/i });
      const skipButton = screen.getByRole('button', { name: 'Ekki núna' });
      const dismissButton = screen.getByRole('button', { name: 'Dismiss alert' });

      // All should be focusable (have tabIndex implicitly or explicitly)
      expect(link).toBeInTheDocument();
      expect(skipButton).toBeInTheDocument();
      expect(dismissButton).toBeInTheDocument();
    });

    it('should have proper focus styles on interactive elements', () => {
      render(<AWHPrompt />);

      const link = screen.getByRole('link', { name: /Reikna raunverulegt tímalaun/i });
      expect(link).toHaveClass('focus:outline-none');
      expect(link).toHaveClass('focus:ring-2');

      const skipButton = screen.getByRole('button', { name: 'Ekki núna' });
      expect(skipButton).toHaveClass('focus:outline-none');
      expect(skipButton).toHaveClass('focus:ring-2');
    });
  });

  describe('Navigation', () => {
    it('should link to correct AWH calculator path', () => {
      render(<AWHPrompt />);

      const link = screen.getByRole('link', { name: /Reikna raunverulegt tímalaun/i });
      expect(link).toHaveAttribute('href', '/raunverulegt-timakaup');
    });

    it('should have arrow icon on primary link', () => {
      render(<AWHPrompt />);

      const link = screen.getByRole('link', { name: /Reikna raunverulegt tímalaun/i });
      const svg = link.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive button layout classes', () => {
      render(<AWHPrompt />);

      const buttonContainer = screen.getByRole('link', { name: /Reikna raunverulegt tímalaun/i }).parentElement;
      expect(buttonContainer).toHaveClass('flex-col');
      expect(buttonContainer).toHaveClass('sm:flex-row');
    });
  });
});
