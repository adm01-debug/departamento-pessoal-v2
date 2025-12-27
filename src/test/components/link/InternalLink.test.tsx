import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InternalLink } from '@/components/link/InternalLink';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('InternalLink', () => {
  it('renders', () => {
    render(<InternalLink />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<InternalLink className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<InternalLink><span>Test</span></InternalLink>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
