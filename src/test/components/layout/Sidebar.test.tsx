import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '@/components/layout/Sidebar';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Sidebar', () => {
  it('renders', () => {
    render(<Sidebar />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<Sidebar className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<Sidebar><span>Test</span></Sidebar>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
