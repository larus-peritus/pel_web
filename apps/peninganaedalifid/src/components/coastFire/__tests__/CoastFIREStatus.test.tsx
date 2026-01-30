/**
 * Tests for CoastFIREStatus component
 */

import { render, screen } from '@testing-library/react';
import { CoastFIREStatus } from '../CoastFIREStatus';
import type { CoastFIREStatus as StatusType } from '@/types/coastFire';

describe('CoastFIREStatus', () => {
  describe('Coasting status', () => {
    it('should display coasting status with success colors', () => {
      render(<CoastFIREStatus status="coasting" />);

      expect(screen.getByText('Þú ert á ró!')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass('bg-success-50');
    });

    it('should show coasting message', () => {
      render(<CoastFIREStatus status="coasting" />);

      expect(
        screen.getByText(/Þú hefur nú þegar náð Ró FIRE/)
      ).toBeInTheDocument();
    });
  });

  describe('Future status', () => {
    it('should display future status with info colors', () => {
      render(<CoastFIREStatus status="future" coastFireAge={45} />);

      expect(screen.getByText('Ró FIRE framundan')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass('bg-primary-50');
    });

    it('should show coast fire age badge', () => {
      render(<CoastFIREStatus status="future" coastFireAge={45} />);

      expect(screen.getByText('Aldur 45')).toBeInTheDocument();
    });

    it('should show future message', () => {
      render(<CoastFIREStatus status="future" coastFireAge={45} />);

      expect(
        screen.getByText(/Þú munt ná Ró FIRE á næstu árum/)
      ).toBeInTheDocument();
    });
  });

  describe('Impossible status', () => {
    it('should display impossible status with warning colors', () => {
      render(<CoastFIREStatus status="impossible" />);

      expect(screen.getByText('Ró FIRE ómögulegt')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass('bg-warning-50');
    });

    it('should show impossible message with suggestions', () => {
      render(<CoastFIREStatus status="impossible" />);

      expect(
        screen.getByText(/Með núverandi forsendum munu fjárfestingar/)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role status', () => {
      render(<CoastFIREStatus status="coasting" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live polite', () => {
      render(<CoastFIREStatus status="future" coastFireAge={45} />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should have accessible icon label', () => {
      render(<CoastFIREStatus status="coasting" />);

      expect(screen.getByRole('img', { name: 'Þú ert á ró!' })).toBeInTheDocument();
    });
  });
});
