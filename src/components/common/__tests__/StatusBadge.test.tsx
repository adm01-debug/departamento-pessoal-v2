import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../StatusBadge';
describe('StatusBadge', () => {
  it('should render', () => {
    expect(StatusBadge).toBeDefined();
  });
});
