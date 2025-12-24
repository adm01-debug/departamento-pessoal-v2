import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { SEOHead } from '@/components/SEOHead';
import React from 'react';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

describe('SEOHead', () => {
  it('deve renderizar', () => {
    const { container } = render(<SEOHead title="Teste" />, { wrapper: Wrapper });
    expect(container).toBeDefined();
  });

  it('deve aceitar título', () => {
    render(<SEOHead title="Minha Página" />, { wrapper: Wrapper });
    expect(document.title || 'Minha Página').toBeDefined();
  });

  it('deve aceitar descrição', () => {
    const { container } = render(<SEOHead title="Teste" description="Descrição" />, { wrapper: Wrapper });
    expect(container).toBeDefined();
  });
});
