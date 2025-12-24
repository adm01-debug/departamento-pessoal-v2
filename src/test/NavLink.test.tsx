import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavLink from '@/components/NavLink';
import React from 'react';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('NavLink', () => {
  it('deve renderizar', () => {
    const { container } = render(<NavLink to="/test">Test</NavLink>, { wrapper: Wrapper });
    expect(container).toBeDefined();
  });

  it('deve ter link correto', () => {
    const { container } = render(<NavLink to="/dashboard">Dashboard</NavLink>, { wrapper: Wrapper });
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/dashboard');
  });

  it('deve renderizar children', () => {
    const { getByText } = render(<NavLink to="/test">Meu Link</NavLink>, { wrapper: Wrapper });
    expect(getByText('Meu Link')).toBeDefined();
  });
});
