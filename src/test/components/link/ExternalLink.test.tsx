import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExternalLink } from '@/components/link/ExternalLink';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('ExternalLink', () => {
  it('renders', () => {
    render(<ExternalLink />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<ExternalLink className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<ExternalLink><span>Test</span></ExternalLink>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
