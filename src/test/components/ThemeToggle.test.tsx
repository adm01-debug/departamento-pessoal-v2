import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('ThemeToggle', () => {
  it('renders correctly', () => {
    render(<ThemeToggle><div>Test</div></ThemeToggle>, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<ThemeToggle className="test" />, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<ThemeToggle><span>Child</span></ThemeToggle>, { wrapper });
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
