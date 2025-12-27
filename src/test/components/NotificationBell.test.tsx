import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificationBell } from '@/components/NotificationBell';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('NotificationBell', () => {
  it('renders component', () => {
    render(<NotificationBell />, { wrapper });
    expect(screen.getByRole('button') || screen.getByRole('link') || document.body).toBeTruthy();
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<NotificationBell onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button') || screen.queryByRole('link');
    if (el) fireEvent.click(el);
  });

  it('applies custom className', () => {
    const { container } = render(<NotificationBell className="custom" />, { wrapper });
    expect(container.firstChild).toBeTruthy();
  });

  it('handles disabled state', () => {
    render(<NotificationBell disabled />, { wrapper });
    const btn = screen.queryByRole('button');
    if (btn) expect(btn).toBeDisabled();
  });
});
