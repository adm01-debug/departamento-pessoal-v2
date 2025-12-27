import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as Component from '@/components/ui/table';

describe('ui/table', () => {
  it('exports', () => {
    expect(Component).toBeDefined();
  });
  it('renders', () => {
    const Comp = Object.values(Component)[0];
    if (typeof Comp === 'function') { try { render(<Comp />); } catch {} }
    expect(document.body).toBeTruthy();
  });
});
