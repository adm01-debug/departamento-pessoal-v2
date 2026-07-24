import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

import { FeriasInsights } from '../ferias/FeriasInsights';

const BASE_STATS = {
  total: 20,
  pendentes: 2,
  aprovadas: 15,
  emGozo: 3,
  vencidas: 0,
  abonoPecuniario: 5,
};

describe('FeriasInsights', () => {
  it('shows Excelência Operacional when all green', () => {
    render(<FeriasInsights stats={BASE_STATS} />);
    expect(screen.getByText('Excelência Operacional')).toBeInTheDocument();
  });

  it('shows Alerta de Vencimentos when vencidas > 0', () => {
    render(<FeriasInsights stats={{ ...BASE_STATS, vencidas: 3 }} />);
    expect(screen.getByText('Alerta de Vencimentos')).toBeInTheDocument();
    expect(screen.getByText(/3 períodos aquisitivos vencidos/)).toBeInTheDocument();
  });

  it('shows Gargalo no Workflow when pendentes > 5', () => {
    render(<FeriasInsights stats={{ ...BASE_STATS, pendentes: 8 }} />);
    expect(screen.getByText('Gargalo no Workflow')).toBeInTheDocument();
  });

  it('shows Tendência de Abono when abono > 40% of total', () => {
    render(<FeriasInsights stats={{ ...BASE_STATS, total: 10, abonoPecuniario: 5 }} />);
    expect(screen.getByText('Tendência de Abono')).toBeInTheDocument();
  });

  it('does not show success insight when vencidas > 0', () => {
    render(<FeriasInsights stats={{ ...BASE_STATS, vencidas: 2 }} />);
    expect(screen.queryByText('Excelência Operacional')).not.toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<FeriasInsights stats={BASE_STATS} />);
    expect(screen.getByRole('button', { name: /Ver Histórico/ })).toBeInTheDocument();
  });
});
