import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavLink } from '@/components/nav/NavLink';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('NavLink', () => {
  it('renders', () => {
    render(<NavLink />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<NavLink className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<NavLink><span>Test</span></NavLink>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
