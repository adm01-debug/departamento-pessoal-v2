import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificacaoItem } from '@/components/notificacoes/NotificacaoItem';
const mockNotificacao = { id: '1', titulo: 'Nova notificação', mensagem: 'Teste', lida: false, data: '2025-01-01' };
describe('NotificacaoItem', () => { it('renderiza notificação', () => { render(<NotificacaoItem notificacao={mockNotificacao} />); expect(screen.getByText('Nova notificação')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<NotificacaoItem notificacao={mockNotificacao} onClick={onClick} />); fireEvent.click(screen.getByText('Nova notificação')); expect(onClick).toHaveBeenCalled(); }); });
