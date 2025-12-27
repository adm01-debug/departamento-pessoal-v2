import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AssinaturaStatus } from '@/components/assinaturas/AssinaturaStatus';
describe('AssinaturaStatus', () => {
  it('exibe status assinado', () => {
    render(<AssinaturaStatus status="assinado" />);
    expect(screen.getByText(/assinado/i)).toBeInTheDocument();
  });
  it('exibe status pendente', () => {
    render(<AssinaturaStatus status="pendente" />);
    expect(screen.getByText(/pendente/i)).toBeInTheDocument();
  });
});
