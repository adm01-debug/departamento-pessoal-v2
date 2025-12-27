import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ESocial from '@/pages/ESocial';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('ESocial Page', () => { it('renderiza página', () => { render(<BrowserRouter><ESocial /></BrowserRouter>); expect(screen.getByText(/esocial/i)).toBeInTheDocument(); }); });
