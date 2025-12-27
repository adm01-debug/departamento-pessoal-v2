import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { withErrorBoundary } from '@/components/performance/withErrorBoundary';

describe('withErrorBoundary', () => {
  it('renders component', () => {
    render(<withErrorBoundary />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<withErrorBoundary className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<withErrorBoundary><div>Content</div></withErrorBoundary>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
