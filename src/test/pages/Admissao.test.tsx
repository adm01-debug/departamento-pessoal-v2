import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Admissao from '@/pages/Admissao';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Admissao Page', () => { it('renderiza página', () => { render(<BrowserRouter><Admissao /></BrowserRouter>); expect(screen.getByText(/admissão/i)).toBeInTheDocument(); }); });
