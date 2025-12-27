import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PortalColaborador from '@/pages/PortalColaborador';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('PortalColaborador Page', () => { it('renderiza página', () => { render(<BrowserRouter><PortalColaborador /></BrowserRouter>); expect(screen.getByText(/portal/i)).toBeInTheDocument(); }); });
