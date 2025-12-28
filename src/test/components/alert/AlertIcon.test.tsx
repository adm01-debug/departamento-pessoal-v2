import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AlertIcon } from '@/components/alert/AlertIcon';

describe('AlertIcon', () => {
  it('renders correctly', () => {
    render(<AlertIcon>Alert content</AlertIcon>);
    expect(screen.getByText('Alert content')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<AlertIcon variant="error">Error</AlertIcon>);
    expect(container.firstChild).toHaveClass('error');
  });

  it('supports custom className', () => {
    const { container } = render(<AlertIcon className="custom">Content</AlertIcon>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has correct ARIA role', () => {
    render(<AlertIcon role="alert">Alert</AlertIcon>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<AlertIcon><span>Child</span></AlertIcon>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
