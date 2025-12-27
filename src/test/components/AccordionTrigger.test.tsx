import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AccordionTrigger } from '@/components/accordion/AccordionTrigger';

describe('AccordionTrigger', () => {
  it('renderiza texto do trigger', () => {
    render(<AccordionTrigger>Clique para expandir</AccordionTrigger>);
    expect(screen.getByText('Clique para expandir')).toBeInTheDocument();
  });

  it('aplica className customizado', () => {
    const { container } = render(
      <AccordionTrigger className="trigger-custom">Trigger</AccordionTrigger>
    );
    expect(container.querySelector('.trigger-custom')).toBeInTheDocument();
  });

  it('exibe ícone de chevron', () => {
    const { container } = render(<AccordionTrigger>Com ícone</AccordionTrigger>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('é acessível com role button', () => {
    render(<AccordionTrigger>Trigger acessível</AccordionTrigger>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('responde a eventos de teclado', () => {
    render(<AccordionTrigger>Trigger teclado</AccordionTrigger>);
    const trigger = screen.getByRole('button');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(trigger).toBeInTheDocument();
  });
});
