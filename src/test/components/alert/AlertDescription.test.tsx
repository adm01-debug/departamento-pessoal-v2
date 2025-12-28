import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AlertDescription } from '@/components/alert/AlertDescription';

describe('AlertDescription', () => {
  it('renders correctly', () => {
    render(<AlertDescription>Alert content</AlertDescription>);
    expect(screen.getByText('Alert content')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<AlertDescription variant="error">Error</AlertDescription>);
    expect(container.firstChild).toHaveClass('error');
  });

  it('supports custom className', () => {
    const { container } = render(<AlertDescription className="custom">Content</AlertDescription>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has correct ARIA role', () => {
    render(<AlertDescription role="alert">Alert</AlertDescription>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<AlertDescription><span>Child</span></AlertDescription>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
