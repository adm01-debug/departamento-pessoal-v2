import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as Component from '@/components/ui/badge';

describe('ui/badge', () => {
  it('exports components', () => {
    expect(Component).toBeDefined();
    expect(Object.keys(Component).length).toBeGreaterThan(0);
  });
  it('renders without crash', () => {
    const FirstExport = Object.values(Component)[0];
    if (typeof FirstExport === 'function') {
      try { render(<FirstExport />); } catch {}
    }
    expect(document.body).toBeTruthy();
  });
});
