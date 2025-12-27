import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Bitrix24Config from '@/pages/Bitrix24Config';
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
describe('Bitrix24Config Page', () => { it('renderiza página', () => { render(<BrowserRouter><Bitrix24Config /></BrowserRouter>); expect(screen.getByText(/bitrix/i)).toBeInTheDocument(); }); });
