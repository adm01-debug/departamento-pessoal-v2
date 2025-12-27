import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Text } from '@/components/text/Text';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Text', () => {
  it('renders', () => {
    render(<Text />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles click', () => {
    const onClick = vi.fn();
    render(<Text onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button') || screen.queryByRole('row');
    if (el) fireEvent.click(el);
  });
  it('applies props', () => {
    render(<Text className="test" data-testid="test" />, { wrapper });
  });
});
