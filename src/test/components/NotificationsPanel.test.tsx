import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationsPanel } from '@/components/notificacoes/NotificationsPanel';
describe('NotificationsPanel', () => { it('renderiza painel', () => { render(<NotificationsPanel />); expect(screen.getByText(/notificações/i)).toBeInTheDocument(); }); });
