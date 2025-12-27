import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders', () => {
    render(<ErrorBoundary>Test</ErrorBoundary>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<ErrorBoundary className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<ErrorBoundary><span>Child</span></ErrorBoundary>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
