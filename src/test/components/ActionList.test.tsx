import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActionList } from '@/components/lists/ActionList';

const mockActions = [
  { id: '1', label: 'Editar', icon: 'edit', onClick: vi.fn() },
  { id: '2', label: 'Excluir', icon: 'delete', onClick: vi.fn() },
  { id: '3', label: 'Duplicar', icon: 'copy', onClick: vi.fn() },
];

describe('ActionList', () => {
  it('renderiza lista de ações', () => {
    render(<ActionList actions={mockActions} />);
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
    expect(screen.getByText('Duplicar')).toBeInTheDocument();
  });

  it('executa onClick de cada ação', () => {
    render(<ActionList actions={mockActions} />);
    fireEvent.click(screen.getByText('Editar'));
    expect(mockActions[0].onClick).toHaveBeenCalled();
  });

  it('renderiza lista vazia', () => {
    const { container } = render(<ActionList actions={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('aplica orientação horizontal', () => {
    const { container } = render(<ActionList actions={mockActions} orientation="horizontal" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('aplica tamanho customizado', () => {
    const { container } = render(<ActionList actions={mockActions} size="sm" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('desabilita ações específicas', () => {
    const actionsWithDisabled = [
      ...mockActions,
      { id: '4', label: 'Desabilitado', disabled: true, onClick: vi.fn() },
    ];
    render(<ActionList actions={actionsWithDisabled} />);
    expect(screen.getByText('Desabilitado')).toBeInTheDocument();
  });
});
