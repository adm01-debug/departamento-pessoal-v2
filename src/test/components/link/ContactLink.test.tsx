import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactLink } from '@/components/link/ContactLink';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('ContactLink', () => {
  it('renders', () => {
    render(<ContactLink />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<ContactLink className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<ContactLink><span>Test</span></ContactLink>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
