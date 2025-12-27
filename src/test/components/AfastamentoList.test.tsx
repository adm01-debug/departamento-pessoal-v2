import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AfastamentoList } from '@/components/afastamentos/AfastamentoList';
const mockAfastamentos = [
  { id: '1', colaboradorNome: 'João', tipo: 'Médico', dataInicio: '2025-01-01', status: 'ativo' },
  { id: '2', colaboradorNome: 'Maria', tipo: 'Férias', dataInicio: '2025-02-01', status: 'pendente' },
];
describe('AfastamentoList', () => {
  it('renderiza lista de afastamentos', () => {
    render(<AfastamentoList afastamentos={mockAfastamentos} />);
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });
  it('exibe mensagem quando lista vazia', () => {
    render(<AfastamentoList afastamentos={[]} />);
    expect(screen.getByText(/nenhum afastamento/i)).toBeInTheDocument();
  });
  it('aplica filtro por status', () => {
    render(<AfastamentoList afastamentos={mockAfastamentos} filterStatus="ativo" />);
    expect(screen.getByText('João')).toBeInTheDocument();
  });
});
