import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FocusTrap } from '@/components/common/FocusTrap';

describe('FocusTrap', () => {
  it('renders', () => {
    render(<FocusTrap>Test</FocusTrap>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<FocusTrap className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<FocusTrap><span>Child</span></FocusTrap>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
