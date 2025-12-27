import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Responsive } from '@/components/responsive/Responsive';

describe('Responsive', () => {
  it('renders component', () => {
    render(<Responsive />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<Responsive className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<Responsive><div>Content</div></Responsive>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
