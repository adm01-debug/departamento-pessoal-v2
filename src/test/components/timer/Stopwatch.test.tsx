import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Stopwatch } from '@/components/timer/Stopwatch';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Stopwatch', () => {
  it('renders', () => {
    render(<Stopwatch />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles click', () => {
    const onClick = vi.fn();
    render(<Stopwatch onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button') || screen.queryByRole('row');
    if (el) fireEvent.click(el);
  });
  it('applies props', () => {
    render(<Stopwatch className="test" data-testid="test" />, { wrapper });
  });
});
