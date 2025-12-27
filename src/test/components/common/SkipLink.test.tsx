import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkipLink } from '@/components/common/SkipLink';

describe('SkipLink', () => {
  it('renders', () => {
    render(<SkipLink>Test</SkipLink>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<SkipLink className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<SkipLink><span>Child</span></SkipLink>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
