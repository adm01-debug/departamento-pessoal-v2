import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionTrigger } from '@/components/accordion/AccordionTrigger';

describe('AccordionTrigger', () => {
  it('renders correctly', () => {
    render(<AccordionTrigger>Test content</AccordionTrigger>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AccordionTrigger className="custom">Content</AccordionTrigger>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<AccordionTrigger onClick={onClick}>Clickable</AccordionTrigger>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalled();
  });

  it('supports disabled state', () => {
    render(<AccordionTrigger disabled>Disabled</AccordionTrigger>);
    expect(screen.getByText('Disabled').closest('div')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has correct ARIA attributes', () => {
    const { container } = render(<AccordionTrigger>Content</AccordionTrigger>);
    expect(container.querySelector('[role]')).toBeInTheDocument();
  });
});
