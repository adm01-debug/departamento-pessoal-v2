import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Configuracoes from '@/pages/Configuracoes';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Configuracoes Page', () => { it('renderiza página', () => { render(<BrowserRouter><Configuracoes /></BrowserRouter>); expect(screen.getByText(/configuração/i)).toBeInTheDocument(); }); });
