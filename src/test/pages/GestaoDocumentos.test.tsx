import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import GestaoDocumentos from '@/pages/GestaoDocumentos';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('GestaoDocumentos Page', () => { it('renderiza página', () => { render(<BrowserRouter><GestaoDocumentos /></BrowserRouter>); expect(screen.getByText(/documento/i)).toBeInTheDocument(); }); });
