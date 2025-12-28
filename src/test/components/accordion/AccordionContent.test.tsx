import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionContent } from '@/components/accordion/AccordionContent';

describe('AccordionContent', () => {
  it('renders correctly', () => {
    render(<AccordionContent>Test content</AccordionContent>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AccordionContent className="custom">Content</AccordionContent>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<AccordionContent onClick={onClick}>Clickable</AccordionContent>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalled();
  });

  it('supports disabled state', () => {
    render(<AccordionContent disabled>Disabled</AccordionContent>);
    expect(screen.getByText('Disabled').closest('div')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has correct ARIA attributes', () => {
    const { container } = render(<AccordionContent>Content</AccordionContent>);
    expect(container.querySelector('[role]')).toBeInTheDocument();
  });
});
