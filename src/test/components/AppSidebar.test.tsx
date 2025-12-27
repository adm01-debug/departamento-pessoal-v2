import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { BrowserRouter } from 'react-router-dom';
describe('AppSidebar', () => {
  it('renderiza sidebar', () => {
    render(<BrowserRouter><AppSidebar /></BrowserRouter>);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
