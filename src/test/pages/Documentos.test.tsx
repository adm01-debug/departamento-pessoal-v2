import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Documentos from '@/pages/Documentos';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Documentos Page', () => { it('renderiza página', () => { render(<BrowserRouter><Documentos /></BrowserRouter>); expect(screen.getByText(/documento/i)).toBeInTheDocument(); }); });
