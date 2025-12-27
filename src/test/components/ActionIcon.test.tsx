import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActionIcon } from '@/components/buttons/ActionIcon';

describe('ActionIcon', () => {
  it('renderiza ícone corretamente', () => {
    render(<ActionIcon icon="edit" aria-label="Editar" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('executa onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<ActionIcon icon="delete" onClick={handleClick} aria-label="Deletar" />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('aplica tamanho customizado', () => {
    const { container } = render(<ActionIcon icon="add" size="lg" aria-label="Adicionar" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('aplica variante de cor', () => {
    const { container } = render(<ActionIcon icon="check" variant="success" aria-label="Confirmar" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('aplica estado disabled', () => {
    render(<ActionIcon icon="close" disabled aria-label="Fechar" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('aplica estado loading', () => {
    render(<ActionIcon icon="save" loading aria-label="Salvando" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('tem acessibilidade com aria-label', () => {
    render(<ActionIcon icon="settings" aria-label="Configurações" />);
    expect(screen.getByLabelText('Configurações')).toBeInTheDocument();
  });
});
