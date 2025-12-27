import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccordionContent } from '@/components/accordion/AccordionContent';

describe('AccordionContent', () => {
  it('renderiza conteúdo corretamente', () => {
    render(<AccordionContent>Conteúdo interno</AccordionContent>);
    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument();
  });

  it('aplica className customizado', () => {
    const { container } = render(
      <AccordionContent className="content-custom">Texto</AccordionContent>
    );
    expect(container.firstChild).toHaveClass('content-custom');
  });

  it('renderiza elementos filhos complexos', () => {
    render(
      <AccordionContent>
        <p>Parágrafo 1</p>
        <p>Parágrafo 2</p>
      </AccordionContent>
    );
    expect(screen.getByText('Parágrafo 1')).toBeInTheDocument();
    expect(screen.getByText('Parágrafo 2')).toBeInTheDocument();
  });

  it('aplica estilos de padding', () => {
    const { container } = render(
      <AccordionContent forceMount>Conteúdo com padding</AccordionContent>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
