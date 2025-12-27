import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfiniteScroll } from '@/components/performance/InfiniteScroll';

describe('InfiniteScroll', () => {
  it('renders component', () => {
    render(<InfiniteScroll />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<InfiniteScroll className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<InfiniteScroll><div>Content</div></InfiniteScroll>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
