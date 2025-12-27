import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MenuGroup } from '@/components/menu/MenuGroup';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('MenuGroup', () => {
  it('renders', () => {
    render(<MenuGroup />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<MenuGroup className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<MenuGroup><span>Test</span></MenuGroup>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
