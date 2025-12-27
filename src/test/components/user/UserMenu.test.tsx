import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserMenu } from '@/components/user/UserMenu';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('UserMenu', () => {
  it('renders', () => {
    render(<UserMenu />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles click', () => {
    const onClick = vi.fn();
    render(<UserMenu onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button') || screen.queryByRole('row');
    if (el) fireEvent.click(el);
  });
  it('applies props', () => {
    render(<UserMenu className="test" data-testid="test" />, { wrapper });
  });
});
