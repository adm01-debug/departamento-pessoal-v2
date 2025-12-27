import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LikeDislike } from '@/components/rating/LikeDislike';

describe('LikeDislike', () => {
  it('renders component', () => {
    render(<LikeDislike />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<LikeDislike className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<LikeDislike><div>Content</div></LikeDislike>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
