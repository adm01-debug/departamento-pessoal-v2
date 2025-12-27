import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Ferias from '@/pages/Ferias';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Ferias Page', () => { it('renderiza página', () => { render(<BrowserRouter><Ferias /></BrowserRouter>); expect(screen.getByText(/férias/i)).toBeInTheDocument(); }); });
