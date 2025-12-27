import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Colaboradores from '@/pages/Colaboradores';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Colaboradores Page', () => { it('renderiza página', () => { render(<BrowserRouter><Colaboradores /></BrowserRouter>); expect(screen.getByText(/colaborador/i)).toBeInTheDocument(); }); });
