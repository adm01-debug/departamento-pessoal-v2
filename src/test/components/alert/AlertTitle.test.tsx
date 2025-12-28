import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AlertTitle } from '@/components/alert/AlertTitle';

describe('AlertTitle', () => {
  it('renders correctly', () => {
    render(<AlertTitle>Alert content</AlertTitle>);
    expect(screen.getByText('Alert content')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<AlertTitle variant="error">Error</AlertTitle>);
    expect(container.firstChild).toHaveClass('error');
  });

  it('supports custom className', () => {
    const { container } = render(<AlertTitle className="custom">Content</AlertTitle>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has correct ARIA role', () => {
    render(<AlertTitle role="alert">Alert</AlertTitle>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<AlertTitle><span>Child</span></AlertTitle>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
