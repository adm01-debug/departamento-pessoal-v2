import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import IntegracaoContabil from '@/pages/IntegracaoContabil';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('IntegracaoContabil Page', () => { it('renderiza página', () => { render(<BrowserRouter><IntegracaoContabil /></BrowserRouter>); expect(screen.getByText(/contábil/i)).toBeInTheDocument(); }); });
