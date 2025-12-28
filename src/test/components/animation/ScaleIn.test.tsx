import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ScaleIn } from '@/components/animation/ScaleIn';

describe('ScaleIn', () => {
  it('renders children', () => {
    render(<ScaleIn>Animated content</ScaleIn>);
    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('applies animation class', () => {
    const { container } = render(<ScaleIn>Content</ScaleIn>);
    expect(container.firstChild).toHaveClass('animate');
  });

  it('supports custom duration', () => {
    const { container } = render(<ScaleIn duration={500}>Content</ScaleIn>);
    expect(container.firstChild).toHaveStyle({ animationDuration: '500ms' });
  });

  it('supports delay', () => {
    const { container } = render(<ScaleIn delay={200}>Content</ScaleIn>);
    expect(container.firstChild).toHaveStyle({ animationDelay: '200ms' });
  });

  it('respects reduced motion preference', async () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { container } = render(<ScaleIn>Content</ScaleIn>);
    expect(container.firstChild).not.toHaveClass('animate');
  });
});
