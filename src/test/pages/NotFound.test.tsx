import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
describe('NotFound Page', () => { it('renderiza página', () => { render(<BrowserRouter><NotFound /></BrowserRouter>); expect(screen.getByText(/404/i)).toBeInTheDocument(); }); });
