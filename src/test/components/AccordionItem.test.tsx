import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccordionItem } from '@/components/accordion/AccordionItem';

describe('AccordionItem', () => {
  it('renderiza com value obrigatório', () => {
    render(<AccordionItem value="item-1">Item de Accordion</AccordionItem>);
    expect(screen.getByText('Item de Accordion')).toBeInTheDocument();
  });

  it('aplica className customizado', () => {
    const { container } = render(
      <AccordionItem value="item-2" className="item-custom">Conteúdo</AccordionItem>
    );
    expect(container.firstChild).toHaveClass('item-custom');
  });

  it('renderiza múltiplos filhos', () => {
    render(
      <AccordionItem value="item-3">
        <span>Trigger</span>
        <div>Content</div>
      </AccordionItem>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('aplica disabled quando configurado', () => {
    const { container } = render(
      <AccordionItem value="item-4" disabled>Item desabilitado</AccordionItem>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
