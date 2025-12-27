import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AfastamentoCard } from '@/components/afastamentos/AfastamentoCard';

const mockAfastamento = {
  id: '1',
  colaboradorNome: 'João Silva',
  tipo: 'Licença Médica',
  dataInicio: '2025-01-15',
  dataFim: '2025-01-30',
  status: 'ativo',
  motivo: 'Tratamento médico',
  cid: 'J11',
};

describe('AfastamentoCard', () => {
  it('renderiza informações do afastamento', () => {
    render(<AfastamentoCard afastamento={mockAfastamento} />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Licença Médica')).toBeInTheDocument();
  });

  it('exibe período do afastamento', () => {
    render(<AfastamentoCard afastamento={mockAfastamento} />);
    expect(screen.getByText(/15\/01\/2025/)).toBeInTheDocument();
  });

  it('exibe status do afastamento', () => {
    render(<AfastamentoCard afastamento={mockAfastamento} />);
    expect(screen.getByText(/ativo/i)).toBeInTheDocument();
  });

  it('executa onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<AfastamentoCard afastamento={mockAfastamento} onClick={handleClick} />);
    fireEvent.click(screen.getByText('João Silva'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('exibe CID quando disponível', () => {
    render(<AfastamentoCard afastamento={mockAfastamento} showCid />);
    expect(screen.getByText(/J11/)).toBeInTheDocument();
  });

  it('aplica estilo de status encerrado', () => {
    const afastamentoEncerrado = { ...mockAfastamento, status: 'encerrado' };
    render(<AfastamentoCard afastamento={afastamentoEncerrado} />);
    expect(screen.getByText(/encerrado/i)).toBeInTheDocument();
  });
});
