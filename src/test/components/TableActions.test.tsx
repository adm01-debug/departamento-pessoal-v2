import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TableActions } from '@/components/tables/TableActions';
const mockActions = [{ label: 'Editar', onClick: vi.fn() }, { label: 'Excluir', onClick: vi.fn() }];
describe('TableActions', () => { it('renderiza ações', () => { render(<TableActions actions={mockActions} />); expect(screen.getByText('Editar')).toBeInTheDocument(); }); it('executa ação', () => { render(<TableActions actions={mockActions} />); fireEvent.click(screen.getByText('Editar')); expect(mockActions[0].onClick).toHaveBeenCalled(); }); });
