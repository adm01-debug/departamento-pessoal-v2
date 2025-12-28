import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AlertContainer } from '@/components/alert/AlertContainer';

describe('AlertContainer', () => {
  it('renders correctly', () => {
    render(<AlertContainer>Alert content</AlertContainer>);
    expect(screen.getByText('Alert content')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<AlertContainer variant="error">Error</AlertContainer>);
    expect(container.firstChild).toHaveClass('error');
  });

  it('supports custom className', () => {
    const { container } = render(<AlertContainer className="custom">Content</AlertContainer>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has correct ARIA role', () => {
    render(<AlertContainer role="alert">Alert</AlertContainer>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<AlertContainer><span>Child</span></AlertContainer>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
