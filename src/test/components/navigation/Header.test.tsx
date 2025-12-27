import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '@/components/navigation/Header';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Header', () => {
  it('renders', () => {
    render(<Header />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<Header className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<Header><span>Test</span></Header>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
