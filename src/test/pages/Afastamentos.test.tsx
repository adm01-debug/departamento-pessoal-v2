import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Afastamentos from '@/pages/Afastamentos';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Afastamentos Page', () => { it('renderiza página', () => { render(<BrowserRouter><Afastamentos /></BrowserRouter>); expect(screen.getByText(/afastamento/i)).toBeInTheDocument(); }); });
