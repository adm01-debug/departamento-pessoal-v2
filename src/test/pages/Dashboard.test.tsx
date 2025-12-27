import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Dashboard Page', () => { it('renderiza página', () => { render(<BrowserRouter><Dashboard /></BrowserRouter>); expect(screen.getByText(/dashboard/i)).toBeInTheDocument(); }); });
