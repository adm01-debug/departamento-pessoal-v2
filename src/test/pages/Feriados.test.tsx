import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Feriados from '@/pages/Feriados';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Feriados Page', () => { it('renderiza página', () => { render(<BrowserRouter><Feriados /></BrowserRouter>); expect(screen.getByText(/feriado/i)).toBeInTheDocument(); }); });
