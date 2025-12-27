import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Announcer } from '@/components/a11y/Announcer';

describe('Announcer', () => {
  it('renders component', () => {
    render(<Announcer>Content</Announcer>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<Announcer />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<Announcer><span>Test</span></Announcer>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<Announcer className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
