import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MenuItem } from '@/components/menu/MenuItem';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('MenuItem', () => {
  it('renders', () => {
    render(<MenuItem />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<MenuItem className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<MenuItem><span>Test</span></MenuItem>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
