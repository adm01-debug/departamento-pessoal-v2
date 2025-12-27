import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert } from '@/components/feedback/Alert';
describe('Alert', () => {
  it('renderiza mensagem de alerta', () => {
    render(<Alert message="Atenção!" />);
    expect(screen.getByText('Atenção!')).toBeInTheDocument();
  });
  it('aplica variante de sucesso', () => {
    const { container } = render(<Alert message="Sucesso" variant="success" />);
    expect(container.firstChild).toHaveClass('success');
  });
  it('aplica variante de erro', () => {
    const { container } = render(<Alert message="Erro" variant="error" />);
    expect(container.firstChild).toHaveClass('error');
  });
  it('exibe título quando fornecido', () => {
    render(<Alert title="Importante" message="Mensagem" />);
    expect(screen.getByText('Importante')).toBeInTheDocument();
  });
  it('renderiza ícone baseado na variante', () => {
    const { container } = render(<Alert message="Info" variant="info" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
