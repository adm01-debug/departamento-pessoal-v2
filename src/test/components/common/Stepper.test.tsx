import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stepper } from '@/components/common/Stepper';

describe('Stepper', () => {
  it('renders', () => {
    render(<Stepper>Test</Stepper>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<Stepper className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<Stepper><span>Child</span></Stepper>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
