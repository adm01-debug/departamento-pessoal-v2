import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Folha from '@/pages/Folha';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Folha Page', () => { it('renderiza página', () => { render(<BrowserRouter><Folha /></BrowserRouter>); expect(screen.getByText(/folha/i)).toBeInTheDocument(); }); });
