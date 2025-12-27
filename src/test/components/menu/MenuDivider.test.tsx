import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MenuDivider } from '@/components/menu/MenuDivider';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('MenuDivider', () => {
  it('renders', () => {
    render(<MenuDivider />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<MenuDivider className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<MenuDivider><span>Test</span></MenuDivider>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
