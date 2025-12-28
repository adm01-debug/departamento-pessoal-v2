import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SlideIn } from '@/components/animation/SlideIn';

describe('SlideIn', () => {
  it('renders children', () => {
    render(<SlideIn>Animated content</SlideIn>);
    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('applies animation class', () => {
    const { container } = render(<SlideIn>Content</SlideIn>);
    expect(container.firstChild).toHaveClass('animate');
  });

  it('supports custom duration', () => {
    const { container } = render(<SlideIn duration={500}>Content</SlideIn>);
    expect(container.firstChild).toHaveStyle({ animationDuration: '500ms' });
  });

  it('supports delay', () => {
    const { container } = render(<SlideIn delay={200}>Content</SlideIn>);
    expect(container.firstChild).toHaveStyle({ animationDelay: '200ms' });
  });

  it('respects reduced motion preference', async () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { container } = render(<SlideIn>Content</SlideIn>);
    expect(container.firstChild).not.toHaveClass('animate');
  });
});
