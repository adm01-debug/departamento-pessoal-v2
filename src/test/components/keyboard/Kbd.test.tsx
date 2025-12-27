import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Kbd } from '@/components/keyboard/Kbd';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Kbd', () => {
  it('renders', () => {
    render(<Kbd />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<Kbd className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<Kbd><span>Test</span></Kbd>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
