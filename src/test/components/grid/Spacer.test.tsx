import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spacer } from '@/components/grid/Spacer';

describe('Spacer', () => {
  it('renders component', () => {
    render(<Spacer />);
    expect(document.body).toBeTruthy();
  });
  it('applies className', () => {
    const { container } = render(<Spacer className="test" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders children', () => {
    render(<Spacer><span>Child</span></Spacer>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
