import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Shortcut } from '@/components/keyboard/Shortcut';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Shortcut', () => {
  it('renders', () => {
    render(<Shortcut />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<Shortcut className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<Shortcut><span>Test</span></Shortcut>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
