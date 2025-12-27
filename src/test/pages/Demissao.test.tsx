import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Demissao from '@/pages/Demissao';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Demissao Page', () => { it('renderiza página', () => { render(<BrowserRouter><Demissao /></BrowserRouter>); expect(screen.getByText(/demissão/i)).toBeInTheDocument(); }); });
