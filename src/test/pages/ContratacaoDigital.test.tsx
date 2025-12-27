import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ContratacaoDigital from '@/pages/ContratacaoDigital';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('ContratacaoDigital Page', () => { it('renderiza página', () => { render(<BrowserRouter><ContratacaoDigital /></BrowserRouter>); expect(screen.getByText(/contratação/i)).toBeInTheDocument(); }); });
