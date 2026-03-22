import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesligamentoKPIs } from '../DesligamentoKPIs';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('DesligamentoKPIs', () => {
  const mockData = [
    { id: '1', status: 'pendente', valor_liquido: 5000, data_desligamento: new Date().toISOString() },
    { id: '2', status: 'em_andamento', valor_liquido: 3000, data_desligamento: new Date().toISOString() },
    { id: '3', status: 'concluido', valor_liquido: 8000, data_desligamento: '2025-01-15' },
    { id: '4', status: 'finalizado', valor_liquido: 12000, data_desligamento: '2025-06-01' },
    { id: '5', status: 'cancelado', valor_liquido: 0, data_desligamento: new Date().toISOString() },
  ];

  it('renders without crashing', () => {
    render(<DesligamentoKPIs desligamentos={mockData} />);
    expect(screen.getByText('Total Desligamentos')).toBeInTheDocument();
  });

  it('shows correct total count', () => {
    render(<DesligamentoKPIs desligamentos={mockData} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows pendentes count (pendente + em_andamento)', () => {
    render(<DesligamentoKPIs desligamentos={mockData} />);
    expect(screen.getByText('Pendentes')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows concluidos count (concluido + finalizado)', () => {
    render(<DesligamentoKPIs desligamentos={mockData} />);
    expect(screen.getByText('Concluídos')).toBeInTheDocument();
  });

  it('renders with empty array', () => {
    render(<DesligamentoKPIs desligamentos={[]} />);
    expect(screen.getByText('Total Desligamentos')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles missing valor_liquido gracefully', () => {
    const data = [{ id: '1', status: 'pendente', valor_liquido: null, data_desligamento: null }];
    expect(() => render(<DesligamentoKPIs desligamentos={data as any} />)).not.toThrow();
  });
});
