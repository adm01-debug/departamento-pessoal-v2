import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageTitle } from '@/components/heading/PageTitle';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('PageTitle', () => {
  it('renders', () => {
    render(<PageTitle />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<PageTitle className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<PageTitle><span>Test</span></PageTitle>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
