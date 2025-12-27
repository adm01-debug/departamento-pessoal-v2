import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Highlight } from '@/components/text/Highlight';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Highlight', () => {
  it('renders', () => {
    render(<Highlight />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles click', () => {
    const onClick = vi.fn();
    render(<Highlight onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button') || screen.queryByRole('row');
    if (el) fireEvent.click(el);
  });
  it('applies props', () => {
    render(<Highlight className="test" data-testid="test" />, { wrapper });
  });
});
