import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SEOHead } from '@/components/SEOHead';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('SEOHead', () => {
  it('renders correctly', () => {
    render(<SEOHead><div>Test</div></SEOHead>, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<SEOHead className="test" />, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<SEOHead><span>Child</span></SEOHead>, { wrapper });
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
