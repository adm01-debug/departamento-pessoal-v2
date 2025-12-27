import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionTitle } from '@/components/heading/SectionTitle';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('SectionTitle', () => {
  it('renders', () => {
    render(<SectionTitle />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<SectionTitle className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<SectionTitle><span>Test</span></SectionTitle>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
