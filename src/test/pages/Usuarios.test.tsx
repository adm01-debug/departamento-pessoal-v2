import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Usuarios from '@/pages/Usuarios';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Usuarios Page', () => { it('renderiza página', () => { render(<BrowserRouter><Usuarios /></BrowserRouter>); expect(screen.getByText(/usuário/i)).toBeInTheDocument(); }); });
