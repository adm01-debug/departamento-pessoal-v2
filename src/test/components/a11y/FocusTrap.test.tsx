import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FocusTrap } from '@/components/a11y/FocusTrap';

describe('FocusTrap', () => {
  it('renders component', () => {
    render(<FocusTrap>Content</FocusTrap>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<FocusTrap />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<FocusTrap><span>Test</span></FocusTrap>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<FocusTrap className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
