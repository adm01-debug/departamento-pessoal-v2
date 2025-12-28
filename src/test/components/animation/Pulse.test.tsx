import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Pulse } from '@/components/animation/Pulse';

describe('Pulse', () => {
  it('renders children', () => {
    render(<Pulse>Animated content</Pulse>);
    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('applies animation class', () => {
    const { container } = render(<Pulse>Content</Pulse>);
    expect(container.firstChild).toHaveClass('animate');
  });

  it('supports custom duration', () => {
    const { container } = render(<Pulse duration={500}>Content</Pulse>);
    expect(container.firstChild).toHaveStyle({ animationDuration: '500ms' });
  });

  it('supports delay', () => {
    const { container } = render(<Pulse delay={200}>Content</Pulse>);
    expect(container.firstChild).toHaveStyle({ animationDelay: '200ms' });
  });

  it('respects reduced motion preference', async () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { container } = render(<Pulse>Content</Pulse>);
    expect(container.firstChild).not.toHaveClass('animate');
  });
});
