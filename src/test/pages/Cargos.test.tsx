import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Cargos from '@/pages/Cargos';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Cargos Page', () => { it('renderiza página', () => { render(<BrowserRouter><Cargos /></BrowserRouter>); expect(screen.getByText(/cargo/i)).toBeInTheDocument(); }); });
