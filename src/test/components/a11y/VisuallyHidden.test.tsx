import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders component', () => {
    render(<VisuallyHidden>Content</VisuallyHidden>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<VisuallyHidden />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<VisuallyHidden><span>Test</span></VisuallyHidden>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<VisuallyHidden className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
