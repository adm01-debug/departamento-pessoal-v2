import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Auditoria from '@/pages/Auditoria';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Auditoria Page', () => { it('renderiza página', () => { render(<BrowserRouter><Auditoria /></BrowserRouter>); expect(screen.getByText(/auditoria/i)).toBeInTheDocument(); }); });
