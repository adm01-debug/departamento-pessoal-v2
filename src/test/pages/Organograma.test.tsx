import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Organograma from '@/pages/Organograma';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Organograma Page', () => { it('renderiza página', () => { render(<BrowserRouter><Organograma /></BrowserRouter>); expect(screen.getByText(/organograma/i)).toBeInTheDocument(); }); });
