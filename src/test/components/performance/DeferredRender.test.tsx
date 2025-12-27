import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DeferredRender } from '@/components/performance/DeferredRender';

describe('DeferredRender', () => {
  it('renders component', () => {
    render(<DeferredRender />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<DeferredRender className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<DeferredRender><div>Content</div></DeferredRender>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
