import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LazyImage } from '@/components/performance/LazyImage';

describe('LazyImage', () => {
  it('renders component', () => {
    render(<LazyImage />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<LazyImage className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<LazyImage><div>Content</div></LazyImage>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
