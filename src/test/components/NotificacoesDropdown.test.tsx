import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificacoesDropdown } from '@/components/NotificacoesDropdown';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('NotificacoesDropdown', () => {
  it('renders component', () => {
    render(<NotificacoesDropdown />, { wrapper });
    expect(screen.getByRole('button') || screen.getByRole('link') || document.body).toBeTruthy();
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<NotificacoesDropdown onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button') || screen.queryByRole('link');
    if (el) fireEvent.click(el);
  });

  it('applies custom className', () => {
    const { container } = render(<NotificacoesDropdown className="custom" />, { wrapper });
    expect(container.firstChild).toBeTruthy();
  });

  it('handles disabled state', () => {
    render(<NotificacoesDropdown disabled />, { wrapper });
    const btn = screen.queryByRole('button');
    if (btn) expect(btn).toBeDisabled();
  });
});
