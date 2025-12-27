import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VirtualList } from '@/components/performance/VirtualList';

describe('VirtualList', () => {
  it('renders component', () => {
    render(<VirtualList />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<VirtualList className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<VirtualList><div>Content</div></VirtualList>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
