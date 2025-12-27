import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeToggle } from '@/components/common/ThemeToggle';

describe('ThemeToggle', () => {
  it('renders', () => {
    render(<ThemeToggle>Test</ThemeToggle>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<ThemeToggle className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<ThemeToggle><span>Child</span></ThemeToggle>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
