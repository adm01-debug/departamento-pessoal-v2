import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from '@/components/ui/ErrorState';

describe('ErrorState', () => {
  it('deve renderizar título padrão', () => {
    render(<ErrorState />);
    expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
  });
  it('deve renderizar título customizado', () => {
    render(<ErrorState title="Falha na conexão" />);
    expect(screen.getByText('Falha na conexão')).toBeInTheDocument();
  });
  it('deve chamar onRetry ao clicar no botão', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Tentar novamente'));
    expect(onRetry).toHaveBeenCalled();
  });
});
