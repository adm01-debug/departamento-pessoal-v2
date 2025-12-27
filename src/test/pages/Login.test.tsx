import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login';
describe('Login Page', () => { it('renderiza página', () => { render(<BrowserRouter><Login /></BrowserRouter>); expect(screen.getByText(/entrar/i)).toBeInTheDocument(); }); });
