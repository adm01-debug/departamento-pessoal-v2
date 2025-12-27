import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Desligamento from '@/pages/Desligamento';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Desligamento Page', () => { it('renderiza página', () => { render(<BrowserRouter><Desligamento /></BrowserRouter>); expect(screen.getByText(/desligamento/i)).toBeInTheDocument(); }); });
