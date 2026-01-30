import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MilestoneMarker } from '../MilestoneMarker';

describe('MilestoneMarker', () => {
  const defaultProps = {
    fireTypeId: 'regularfire' as const,
    age: 52,
    year: 2046,
    position: 65,
  };

  describe('Rendering', () => {
    it('renders marker with correct ARIA label', () => {
      render(<MilestoneMarker {...defaultProps} />);

      const marker = screen.getByRole('button');
      expect(marker).toHaveAttribute(
        'aria-label',
        'Venjulegt FIRE við 52 ára aldur (2046)'
      );
    });

    it('displays FIRE type icon', () => {
      render(<MilestoneMarker {...defaultProps} />);

      // RegularFIRE icon is 🎯
      const icon = screen.getByText('🎯');
      expect(icon).toBeInTheDocument();
    });

    it('displays age and year labels', () => {
      render(<MilestoneMarker {...defaultProps} />);

      expect(screen.getByText('52 ára')).toBeInTheDocument();
      expect(screen.getByText('2046')).toBeInTheDocument();
    });

    it('positions marker correctly based on position prop', () => {
      const { container } = render(<MilestoneMarker {...defaultProps} position={75} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ left: '75%' });
    });
  });

  describe('FIRE Type Styling', () => {
    it('applies correct color scheme for LeanFIRE', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} fireTypeId="leanfire" />
      );

      // Icon is 🔥
      expect(screen.getByText('🔥')).toBeInTheDocument();
    });

    it('applies correct color scheme for FatFIRE', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} fireTypeId="fatfire" />
      );

      // Icon is 💎
      expect(screen.getByText('💎')).toBeInTheDocument();
    });

    it('applies correct color scheme for CoastFIRE', () => {
      render(
        <MilestoneMarker {...defaultProps} fireTypeId="coastfire" />
      );

      // Icon is 🏖️
      expect(screen.getByText('🏖️')).toBeInTheDocument();
    });
  });

  describe('Achieved State', () => {
    it('shows checkmark for achieved milestones', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} isAchieved={true} />
      );

      // Checkmark SVG should be present
      const checkmark = container.querySelector('svg path[d*="M5 13l4 4L19 7"]');
      expect(checkmark).toBeInTheDocument();
    });

    it('does not show checkmark for unachieved milestones', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} isAchieved={false} />
      );

      // Checkmark should not be present
      const checkmark = container.querySelector('svg path[d*="M5 13l4 4L19 7"]');
      expect(checkmark).not.toBeInTheDocument();
    });

    it('applies glow effect to achieved milestones', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} isAchieved={true} />
      );

      // Should have accent background color
      const iconCircle = container.querySelector('.bg-green-500');
      expect(iconCircle).toBeInTheDocument();
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onClick when marker is clicked', () => {
      const onClick = jest.fn();
      render(<MilestoneMarker {...defaultProps} onClick={onClick} />);

      const marker = screen.getByRole('button');
      fireEvent.click(marker);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter key is pressed', () => {
      const onClick = jest.fn();
      render(<MilestoneMarker {...defaultProps} onClick={onClick} />);

      const marker = screen.getByRole('button');
      fireEvent.keyDown(marker, { key: 'Enter' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space key is pressed', () => {
      const onClick = jest.fn();
      render(<MilestoneMarker {...defaultProps} onClick={onClick} />);

      const marker = screen.getByRole('button');
      fireEvent.keyDown(marker, { key: ' ' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onHover when mouse enters', () => {
      const onHover = jest.fn();
      const { container } = render(
        <MilestoneMarker {...defaultProps} onHover={onHover} />
      );

      const wrapper = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(wrapper);

      expect(onHover).toHaveBeenCalledWith(true);
    });

    it('calls onHover when mouse leaves', () => {
      const onHover = jest.fn();
      const { container } = render(
        <MilestoneMarker {...defaultProps} onHover={onHover} />
      );

      const wrapper = container.firstChild as HTMLElement;
      fireEvent.mouseLeave(wrapper);

      expect(onHover).toHaveBeenCalledWith(false);
    });
  });

  describe('Active State', () => {
    it('applies active styling when isActive is true', () => {
      render(<MilestoneMarker {...defaultProps} isActive={true} />);

      const marker = screen.getByRole('button');
      expect(marker).toHaveAttribute('aria-pressed', 'true');
      expect(marker).toHaveClass('ring-2', 'ring-blue-500');
    });

    it('does not apply active styling when isActive is false', () => {
      render(<MilestoneMarker {...defaultProps} isActive={false} />);

      const marker = screen.getByRole('button');
      expect(marker).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Orientation', () => {
    it('positions correctly for horizontal orientation', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} orientation="horizontal" position={50} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ left: '50%', top: '50%' });
    });

    it('positions correctly for vertical orientation', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} orientation="vertical" position={50} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ top: '50%', left: '50%' });
    });
  });

  describe('Accessibility', () => {
    it('is keyboard focusable', () => {
      render(<MilestoneMarker {...defaultProps} />);

      const marker = screen.getByRole('button');
      marker.focus();

      expect(marker).toHaveFocus();
    });

    it('has visible focus indicator', () => {
      render(<MilestoneMarker {...defaultProps} />);

      const marker = screen.getByRole('button');
      expect(marker).toHaveClass('focus-visible:ring-2');
    });

    it('includes descriptive ARIA label with all information', () => {
      render(
        <MilestoneMarker
          fireTypeId="leanfire"
          age={45}
          year={2035}
          position={60}
        />
      );

      const marker = screen.getByRole('button');
      expect(marker).toHaveAttribute(
        'aria-label',
        'Sparsamt FIRE við 45 ára aldur (2035)'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles position at 0%', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} position={0} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ left: '0%' });
    });

    it('handles position at 100%', () => {
      const { container } = render(
        <MilestoneMarker {...defaultProps} position={100} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ left: '100%' });
    });

    it('handles very young age', () => {
      render(<MilestoneMarker {...defaultProps} age={25} year={2030} />);

      expect(screen.getByText('25 ára')).toBeInTheDocument();
      expect(screen.getByText('2030')).toBeInTheDocument();
    });

    it('handles very old age', () => {
      render(<MilestoneMarker {...defaultProps} age={85} year={2070} />);

      expect(screen.getByText('85 ára')).toBeInTheDocument();
      expect(screen.getByText('2070')).toBeInTheDocument();
    });
  });
});
