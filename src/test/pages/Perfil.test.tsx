import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Perfil from '@/pages/Perfil';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1', nome: 'Test' } }) }));
describe('Perfil Page', () => { it('renderiza página', () => { render(<BrowserRouter><Perfil /></BrowserRouter>); expect(screen.getByText(/perfil/i)).toBeInTheDocument(); }); });
