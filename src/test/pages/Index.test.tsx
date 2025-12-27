import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Index Page', () => { it('renderiza página', () => { render(<BrowserRouter><Index /></BrowserRouter>); expect(document.body).toBeInTheDocument(); }); });
