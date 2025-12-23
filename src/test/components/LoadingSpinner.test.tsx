import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('deve renderizar', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('deve mostrar texto quando fornecido', () => {
    render(<LoadingSpinner text="Carregando dados..." />);
    expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
  });
  it('deve aplicar classe de tamanho', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    expect(container.querySelector('.h-12')).toBeInTheDocument();
  });
});
