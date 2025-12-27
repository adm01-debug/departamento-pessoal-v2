import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Beneficios from '@/pages/Beneficios';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Beneficios Page', () => { it('renderiza página', () => { render(<BrowserRouter><Beneficios /></BrowserRouter>); expect(screen.getByText(/benefício/i)).toBeInTheDocument(); }); });
