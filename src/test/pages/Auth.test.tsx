import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Auth from '@/pages/Auth';
describe('Auth Page', () => { it('renderiza página', () => { render(<BrowserRouter><Auth /></BrowserRouter>); expect(screen.getByText(/entrar/i)).toBeInTheDocument(); }); });
