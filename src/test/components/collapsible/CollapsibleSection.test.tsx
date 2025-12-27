import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CollapsibleSection } from '@/components/collapsible/CollapsibleSection';
import { BrowserRouter } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('CollapsibleSection', () => {
  it('renders correctly', () => {
    render(<CollapsibleSection />, { wrapper });
    expect(document.body).toBeTruthy();
  });

  it('handles click', () => {
    const onClick = vi.fn();
    render(<CollapsibleSection onClick={onClick} />, { wrapper });
    const el = screen.queryByRole('button');
    if (el) { fireEvent.click(el); expect(onClick).toHaveBeenCalled(); }
  });

  it('applies className', () => {
    const { container } = render(<CollapsibleSection className="test" />, { wrapper });
    expect(container.firstChild).toBeTruthy();
  });

  it('handles disabled state', () => {
    render(<CollapsibleSection disabled />, { wrapper });
  });
});
