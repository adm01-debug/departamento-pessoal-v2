import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  it('deve renderizar título', () => {
    render(<EmptyState title="Nenhum item" />);
    expect(screen.getByText('Nenhum item')).toBeInTheDocument();
  });
  it('deve renderizar descrição', () => {
    render(<EmptyState title="Vazio" description="Adicione itens" />);
    expect(screen.getByText('Adicione itens')).toBeInTheDocument();
  });
  it('deve renderizar botão de ação', () => {
    const onClick = vi.fn();
    render(<EmptyState title="Vazio" action={{ label: 'Adicionar', onClick }} />);
    fireEvent.click(screen.getByText('Adicionar'));
    expect(onClick).toHaveBeenCalled();
  });
});
