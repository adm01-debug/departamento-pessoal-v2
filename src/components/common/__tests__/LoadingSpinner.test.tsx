import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';
describe('LoadingSpinner', () => {
  it('should render', () => {
    expect(LoadingSpinner).toBeDefined();
  });
});
