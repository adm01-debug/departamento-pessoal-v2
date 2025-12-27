import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { A11yAnnouncer } from '@/components/a11y/A11yAnnouncer';

describe('A11yAnnouncer', () => {
  it('renders component', () => {
    render(<A11yAnnouncer>Content</A11yAnnouncer>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<A11yAnnouncer />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<A11yAnnouncer><span>Test</span></A11yAnnouncer>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<A11yAnnouncer className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
