import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Assinaturas from '@/pages/Assinaturas';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Assinaturas Page', () => { it('renderiza página', () => { render(<BrowserRouter><Assinaturas /></BrowserRouter>); expect(screen.getByText(/assinatura/i)).toBeInTheDocument(); }); });
