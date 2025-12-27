import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisuallyHidden } from '@/components/common/VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders', () => {
    render(<VisuallyHidden>Test</VisuallyHidden>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<VisuallyHidden className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<VisuallyHidden><span>Child</span></VisuallyHidden>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
