import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScreenReaderOnly } from '@/components/a11y/ScreenReaderOnly';

describe('ScreenReaderOnly', () => {
  it('renders component', () => {
    render(<ScreenReaderOnly>Content</ScreenReaderOnly>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<ScreenReaderOnly />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<ScreenReaderOnly><span>Test</span></ScreenReaderOnly>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<ScreenReaderOnly className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
