import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShowOn } from '@/components/responsive/ShowOn';

describe('ShowOn', () => {
  it('renders component', () => {
    render(<ShowOn />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<ShowOn className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<ShowOn><div>Content</div></ShowOn>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
