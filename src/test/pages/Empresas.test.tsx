import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Empresas from '@/pages/Empresas';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Empresas Page', () => { it('renderiza página', () => { render(<BrowserRouter><Empresas /></BrowserRouter>); expect(screen.getByText(/empresa/i)).toBeInTheDocument(); }); });
