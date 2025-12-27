import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Notificacoes from '@/pages/Notificacoes';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Notificacoes Page', () => { it('renderiza página', () => { render(<BrowserRouter><Notificacoes /></BrowserRouter>); expect(screen.getByText(/notificação/i)).toBeInTheDocument(); }); });
