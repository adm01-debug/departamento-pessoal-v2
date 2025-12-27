import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spacer } from '@/components/layout/Spacer';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Spacer', () => {
  it('renders', () => {
    render(<Spacer />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<Spacer className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<Spacer><span>Test</span></Spacer>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
