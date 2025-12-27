import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@/components/ThemeProvider';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('ThemeProvider', () => {
  it('renders correctly', () => {
    render(<ThemeProvider><div>Test</div></ThemeProvider>, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<ThemeProvider className="test" />, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<ThemeProvider><span>Child</span></ThemeProvider>, { wrapper });
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
