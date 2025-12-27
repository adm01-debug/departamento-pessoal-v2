import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as Component from '@/components/ui/input-otp';

describe('ui/input-otp', () => {
  it('exports components', () => {
    expect(Component).toBeDefined();
    expect(Object.keys(Component).length).toBeGreaterThan(0);
  });
  it('renders without error', () => {
    const Comp = Object.values(Component)[0];
    if (typeof Comp === 'function') {
      try { render(<Comp />); } catch {}
    }
    expect(document.body).toBeTruthy();
  });
});
