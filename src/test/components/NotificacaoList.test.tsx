import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificacaoList } from '@/components/notificacoes/NotificacaoList';
const mockNotificacoes = [{ id: '1', titulo: 'Not 1' }, { id: '2', titulo: 'Not 2' }];
describe('NotificacaoList', () => { it('renderiza lista', () => { render(<NotificacaoList notificacoes={mockNotificacoes} />); expect(screen.getByText('Not 1')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<NotificacaoList notificacoes={[]} />); expect(screen.getByText(/nenhuma notificação/i)).toBeInTheDocument(); }); });
