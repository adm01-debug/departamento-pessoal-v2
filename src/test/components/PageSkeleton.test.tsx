import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

describe('PageSkeleton', () => {
  it('deve renderizar skeleton de tabela por padrão', () => {
    const { container } = render(<PageSkeleton />);
    expect(container.querySelectorAll('[class*="h-"]').length).toBeGreaterThan(0);
  });
  it('deve renderizar skeleton de dashboard', () => {
    const { container } = render(<PageSkeleton type="dashboard" />);
    expect(container.querySelectorAll('[class*="grid"]').length).toBeGreaterThan(0);
  });
  it('deve renderizar skeleton de formulário', () => {
    const { container } = render(<PageSkeleton type="form" />);
    expect(container.querySelectorAll('[class*="h-10"]').length).toBeGreaterThan(0);
  });
});
