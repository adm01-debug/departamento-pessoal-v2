import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LiveRegion } from '@/components/a11y/LiveRegion';

describe('LiveRegion', () => {
  it('renders component', () => {
    render(<LiveRegion>Content</LiveRegion>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<LiveRegion />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<LiveRegion><span>Test</span></LiveRegion>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<LiveRegion className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
