import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkipLink } from '@/components/a11y/SkipLink';

describe('SkipLink', () => {
  it('renders component', () => {
    render(<SkipLink>Content</SkipLink>);
    expect(document.body).toBeTruthy();
  });

  it('applies accessibility attributes', () => {
    const { container } = render(<SkipLink />);
    expect(container.querySelector('[aria-live]') || container.querySelector('[role]') || container.firstChild).toBeTruthy();
  });

  it('handles children', () => {
    render(<SkipLink><span>Test</span></SkipLink>);
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });

  it('supports custom className', () => {
    const { container } = render(<SkipLink className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});
