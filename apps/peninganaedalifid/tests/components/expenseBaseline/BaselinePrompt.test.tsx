import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BaselinePrompt } from '@/components/expenseBaseline/BaselinePrompt';

describe('BaselinePrompt', () => {
  it('renders with default message and button', () => {
    render(<BaselinePrompt />);

    expect(screen.getByText(/þú hefur ekki sett upp útgjaldagrunn/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /setja upp útgjaldagrunn/i })).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Þú þarft að setja upp útgjaldagrunn til að nota þessa reiknivél';
    render(<BaselinePrompt message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders with custom button text', () => {
    const customButtonText = 'Fara í uppsetningu';
    render(<BaselinePrompt buttonText={customButtonText} />);

    expect(screen.getByRole('button', { name: customButtonText })).toBeInTheDocument();
  });

  it('links to default URL when no custom link provided', () => {
    render(<BaselinePrompt />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/utgjaldareiknivel');
  });

  it('links to custom URL when provided', () => {
    const customLink = '/fi-number';
    render(<BaselinePrompt linkTo={customLink} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', customLink);
  });

  it('displays info alert with educational text', () => {
    render(<BaselinePrompt />);

    expect(screen.getByText(/útgjaldagrunnurinn er grunnurinn að fire áætluninni þinni/i)).toBeInTheDocument();
    expect(screen.getByText(/þremur stigum/i)).toBeInTheDocument();
    expect(screen.getByText(/lágmarks, þægilegt og lúxus/i)).toBeInTheDocument();
  });

  it('calls onSetup callback when provided and button clicked', async () => {
    const user = userEvent.setup();
    const mockOnSetup = vi.fn();

    render(<BaselinePrompt onSetup={mockOnSetup} />);

    const button = screen.getByRole('button', { name: /setja upp útgjaldagrunn/i });
    await user.click(button);

    expect(mockOnSetup).toHaveBeenCalledTimes(1);
  });

  it('does not render link when onSetup callback provided', () => {
    const mockOnSetup = vi.fn();
    render(<BaselinePrompt onSetup={mockOnSetup} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders button inside link when no onSetup callback', () => {
    render(<BaselinePrompt />);

    const link = screen.getByRole('link');
    const button = screen.getByRole('button', { name: /setja upp útgjaldagrunn/i });

    expect(link).toContainElement(button);
  });

  it('combines custom props correctly', () => {
    const mockOnSetup = vi.fn();
    const customMessage = 'Custom message';
    const customButtonText = 'Custom button';

    render(
      <BaselinePrompt
        message={customMessage}
        buttonText={customButtonText}
        onSetup={mockOnSetup}
      />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: customButtonText })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
