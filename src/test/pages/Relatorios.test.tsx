import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Relatorios from '@/pages/Relatorios';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Relatorios Page', () => { it('renderiza página', () => { render(<BrowserRouter><Relatorios /></BrowserRouter>); expect(screen.getByText(/relatório/i)).toBeInTheDocument(); }); });
