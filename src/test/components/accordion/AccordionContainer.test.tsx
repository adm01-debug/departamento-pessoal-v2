import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionContainer } from '@/components/accordion/AccordionContainer';

describe('AccordionContainer', () => {
  it('renders correctly', () => {
    render(<AccordionContainer>Test content</AccordionContainer>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AccordionContainer className="custom">Content</AccordionContainer>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<AccordionContainer onClick={onClick}>Clickable</AccordionContainer>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalled();
  });

  it('supports disabled state', () => {
    render(<AccordionContainer disabled>Disabled</AccordionContainer>);
    expect(screen.getByText('Disabled').closest('div')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has correct ARIA attributes', () => {
    const { container } = render(<AccordionContainer>Content</AccordionContainer>);
    expect(container.querySelector('[role]')).toBeInTheDocument();
  });
});
