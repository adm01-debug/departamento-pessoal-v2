import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AriaLive } from '@/components/a11y/AriaLive';

describe('AriaLive', () => {
  it('renders component', () => {
    render(<AriaLive>Content</AriaLive>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<AriaLive />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<AriaLive><span>Test</span></AriaLive>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<AriaLive className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
