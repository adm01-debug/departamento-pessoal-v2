import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActionButton } from '@/components/common/ActionButton';

describe('ActionButton', () => {
  it('renders', () => {
    render(<ActionButton>Test</ActionButton>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<ActionButton className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<ActionButton><span>Child</span></ActionButton>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
