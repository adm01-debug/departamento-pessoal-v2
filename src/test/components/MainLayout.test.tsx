import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainLayout } from '@/components/layout/MainLayout';
import { BrowserRouter } from 'react-router-dom';
describe('MainLayout', () => { it('renderiza layout', () => { render(<BrowserRouter><MainLayout><div>Content</div></MainLayout></BrowserRouter>); expect(screen.getByText('Content')).toBeInTheDocument(); }); });
