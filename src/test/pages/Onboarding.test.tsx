import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Onboarding from '@/pages/Onboarding';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Onboarding Page', () => { it('renderiza página', () => { render(<BrowserRouter><Onboarding /></BrowserRouter>); expect(screen.getByText(/onboarding/i)).toBeInTheDocument(); }); });
