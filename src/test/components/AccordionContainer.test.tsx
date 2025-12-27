import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccordionContainer } from '@/components/accordion/AccordionContainer';

describe('AccordionContainer', () => {
  it('renderiza children corretamente', () => {
    render(
      <AccordionContainer>
        <div>Conteúdo do Accordion</div>
      </AccordionContainer>
    );
    expect(screen.getByText('Conteúdo do Accordion')).toBeInTheDocument();
  });

  it('aplica className customizado', () => {
    const { container } = render(
      <AccordionContainer className="custom-class">
        <div>Conteúdo</div>
      </AccordionContainer>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('suporta tipo single', () => {
    render(
      <AccordionContainer type="single">
        <div>Item 1</div>
        <div>Item 2</div>
      </AccordionContainer>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('suporta tipo multiple', () => {
    render(
      <AccordionContainer type="multiple">
        <div>Item A</div>
        <div>Item B</div>
      </AccordionContainer>
    );
    expect(screen.getByText('Item A')).toBeInTheDocument();
  });

  it('aplica collapsible quando configurado', () => {
    const { container } = render(
      <AccordionContainer collapsible>
        <div>Conteúdo colapsável</div>
      </AccordionContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
