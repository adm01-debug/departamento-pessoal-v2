import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AssinaturaCanvas } from '@/components/assinaturas/AssinaturaCanvas';
describe('AssinaturaCanvas', () => {
  it('renderiza canvas', () => {
    const { container } = render(<AssinaturaCanvas />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
  it('exibe botão limpar', () => {
    render(<AssinaturaCanvas showClear />);
    expect(screen.getByText(/limpar/i)).toBeInTheDocument();
  });
});
