import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionItem } from '@/components/accordion/AccordionItem';

describe('AccordionItem', () => {
  it('renders correctly', () => {
    render(<AccordionItem>Test content</AccordionItem>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AccordionItem className="custom">Content</AccordionItem>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<AccordionItem onClick={onClick}>Clickable</AccordionItem>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalled();
  });

  it('supports disabled state', () => {
    render(<AccordionItem disabled>Disabled</AccordionItem>);
    expect(screen.getByText('Disabled').closest('div')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has correct ARIA attributes', () => {
    const { container } = render(<AccordionItem>Content</AccordionItem>);
    expect(container.querySelector('[role]')).toBeInTheDocument();
  });
});
