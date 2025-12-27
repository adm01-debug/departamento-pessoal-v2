import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Departamentos from '@/pages/Departamentos';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Departamentos Page', () => { it('renderiza página', () => { render(<BrowserRouter><Departamentos /></BrowserRouter>); expect(screen.getByText(/departamento/i)).toBeInTheDocument(); }); });
