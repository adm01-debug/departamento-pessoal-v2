import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActionCard } from '@/components/cards/ActionCard';

describe('ActionCard', () => {
  it('renderiza título e descrição', () => {
    render(<ActionCard title="Ação Rápida" description="Descrição da ação" />);
    expect(screen.getByText('Ação Rápida')).toBeInTheDocument();
    expect(screen.getByText('Descrição da ação')).toBeInTheDocument();
  });

  it('executa onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<ActionCard title="Clicável" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Clicável'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renderiza ícone quando fornecido', () => {
    render(<ActionCard title="Com Ícone" icon={<span data-testid="icon">🎯</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('aplica variante de cor', () => {
    const { container } = render(<ActionCard title="Sucesso" variant="success" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('exibe badge quando configurado', () => {
    render(<ActionCard title="Com Badge" badge="Novo" />);
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('aplica estado disabled', () => {
    const handleClick = vi.fn();
    render(<ActionCard title="Desabilitado" disabled onClick={handleClick} />);
    fireEvent.click(screen.getByText('Desabilitado'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
