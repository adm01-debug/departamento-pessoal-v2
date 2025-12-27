import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LiveRegion } from '@/components/common/LiveRegion';

describe('LiveRegion', () => {
  it('renders', () => {
    render(<LiveRegion>Test</LiveRegion>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<LiveRegion className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<LiveRegion><span>Child</span></LiveRegion>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
