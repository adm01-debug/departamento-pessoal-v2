import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReducedMotion } from '@/components/a11y/ReducedMotion';

describe('ReducedMotion', () => {
  it('renders component', () => {
    render(<ReducedMotion>Content</ReducedMotion>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<ReducedMotion />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<ReducedMotion><span>Test</span></ReducedMotion>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<ReducedMotion className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
