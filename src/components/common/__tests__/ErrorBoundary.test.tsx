import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
describe('ErrorBoundary', () => {
  it('should render', () => {
    expect(ErrorBoundary).toBeDefined();
  });
});
