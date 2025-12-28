import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AfastamentoCard } from '@/components/afastamentos/AfastamentoCard';

describe('AfastamentoCard', () => {
  const mockData = {
    id: '1',
    colaboradorId: '123',
    colaboradorNome: 'João Silva',
    tipo: 'LICENCA_MEDICA',
    dataInicio: '2025-01-01',
    dataFim: '2025-01-15',
    motivo: 'Atestado médico',
    status: 'ATIVO'
  };

  it('renders correctly', () => {
    render(<AfastamentoCard data={mockData} />);
    expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
  });

  it('displays afastamento type', () => {
    render(<AfastamentoCard data={mockData} />);
    expect(screen.getByText(/Licença Médica/i)).toBeInTheDocument();
  });

  it('shows date range', () => {
    render(<AfastamentoCard data={mockData} />);
    expect(screen.getByText(/01\/01\/2025/i)).toBeInTheDocument();
  });

  it('handles edit action', () => {
    const onEdit = vi.fn();
    render(<AfastamentoCard data={mockData} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(mockData);
  });

  it('shows status badge', () => {
    render(<AfastamentoCard data={mockData} />);
    expect(screen.getByText(/Ativo/i)).toHaveClass('badge');
  });
});
