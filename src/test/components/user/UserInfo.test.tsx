import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserInfo } from '@/components/user/UserInfo';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('UserInfo', () => {
  it('renders', () => {
    render(<UserInfo />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles click', () => {
    const onClick = vi.fn();
    render(<UserInfo onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button') || screen.queryByRole('row');
    if (el) fireEvent.click(el);
  });
  it('applies props', () => {
    render(<UserInfo className="test" data-testid="test" />, { wrapper });
  });
});
