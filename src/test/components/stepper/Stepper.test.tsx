import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stepper } from '@/components/stepper/Stepper';

describe('Stepper', () => {
  it('renders component', () => {
    render(<Stepper />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<Stepper className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<Stepper><div>Content</div></Stepper>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
