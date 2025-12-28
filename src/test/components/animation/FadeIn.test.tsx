import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FadeIn } from '@/components/animation/FadeIn';

describe('FadeIn', () => {
  it('renders children', () => {
    render(<FadeIn>Animated content</FadeIn>);
    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('applies animation class', () => {
    const { container } = render(<FadeIn>Content</FadeIn>);
    expect(container.firstChild).toHaveClass('animate');
  });

  it('supports custom duration', () => {
    const { container } = render(<FadeIn duration={500}>Content</FadeIn>);
    expect(container.firstChild).toHaveStyle({ animationDuration: '500ms' });
  });

  it('supports delay', () => {
    const { container } = render(<FadeIn delay={200}>Content</FadeIn>);
    expect(container.firstChild).toHaveStyle({ animationDelay: '200ms' });
  });

  it('respects reduced motion preference', async () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { container } = render(<FadeIn>Content</FadeIn>);
    expect(container.firstChild).not.toHaveClass('animate');
  });
});
