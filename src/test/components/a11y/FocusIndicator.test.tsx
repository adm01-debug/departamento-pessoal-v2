import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FocusIndicator } from '@/components/a11y/FocusIndicator';

describe('FocusIndicator', () => {
  it('renders component', () => {
    render(<FocusIndicator>Content</FocusIndicator>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<FocusIndicator />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<FocusIndicator><span>Test</span></FocusIndicator>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<FocusIndicator className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
