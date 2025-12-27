import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Ponto from '@/pages/Ponto';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Ponto Page', () => { it('renderiza página', () => { render(<BrowserRouter><Ponto /></BrowserRouter>); expect(screen.getByText(/ponto/i)).toBeInTheDocument(); }); });
