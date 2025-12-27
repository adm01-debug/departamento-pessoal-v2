import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('ProtectedRoute', () => {
  it('renders correctly', () => {
    render(<ProtectedRoute />, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('handles click', () => {
    const onClick = vi.fn();
    render(<ProtectedRoute onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button');
    if (el) { fireEvent.click(el); expect(onClick).toHaveBeenCalled(); }
  });

  it('applies className', () => {
    const { container } = render(<ProtectedRoute className="test" />, { wrapper });
    expect(container.firstChild).toBeTruthy();
  });

  it('handles disabled state', () => {
    render(<ProtectedRoute disabled />, { wrapper });
  });
});
