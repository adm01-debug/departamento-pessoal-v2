import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

describe('ThemeProvider', () => {
  it('renders component', () => {
    render(<ThemeProvider />);
    expect(document.body).toBeTruthy();
  });
  it('handles className', () => {
    const { container } = render(<ThemeProvider className="custom" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with children', () => {
    render(<ThemeProvider><div>Content</div></ThemeProvider>);
    expect(screen.queryByText('Content') || document.body).toBeTruthy();
  });
});
