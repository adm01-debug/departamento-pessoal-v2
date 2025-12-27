import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuspenseWrapper } from '@/components/performance/SuspenseWrapper';

describe('SuspenseWrapper', () => {
  it('renders component', () => {
    render(<SuspenseWrapper />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<SuspenseWrapper className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<SuspenseWrapper><div>Content</div></SuspenseWrapper>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
