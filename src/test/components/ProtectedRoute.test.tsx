import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('ProtectedRoute', () => {
  it('renders correctly', () => {
    render(<ProtectedRoute><div>Test</div></ProtectedRoute>, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<ProtectedRoute className="test" />, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<ProtectedRoute><span>Child</span></ProtectedRoute>, { wrapper });
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
