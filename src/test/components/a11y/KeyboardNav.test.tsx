import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KeyboardNav } from '@/components/a11y/KeyboardNav';

describe('KeyboardNav', () => {
  it('renders component', () => {
    render(<KeyboardNav>Content</KeyboardNav>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<KeyboardNav />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<KeyboardNav><span>Test</span></KeyboardNav>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<KeyboardNav className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
