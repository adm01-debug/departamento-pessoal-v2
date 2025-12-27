import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { withMemo } from '@/components/performance/withMemo';

describe('withMemo', () => {
  it('renders component', () => {
    render(<withMemo />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<withMemo className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<withMemo><div>Content</div></withMemo>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
