import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

import { PontoWeekSummary } from '../ponto/PontoWeekSummary';

const REGISTROS = [
  { id: '1', data: '2024-07-01', horas_trabalhadas: '08:00', horas_extras: '00:30', atraso_minutos: 0 },
  { id: '2', data: '2024-07-02', horas_trabalhadas: '07:30', horas_extras: null, atraso_minutos: 15 },
];

describe('PontoWeekSummary', () => {
  it('renders "Últimos 7 dias" heading', () => {
    render(<PontoWeekSummary registrosSemana={[]} />);
    expect(screen.getByText('Últimos 7 dias')).toBeInTheDocument();
  });

  it('shows empty state when no records', () => {
    render(<PontoWeekSummary registrosSemana={[]} />);
    expect(screen.getByText('Sem registros recentes')).toBeInTheDocument();
  });

  it('renders horas trabalhadas for each record', () => {
    render(<PontoWeekSummary registrosSemana={REGISTROS} />);
    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('07:30')).toBeInTheDocument();
  });

  it('shows atraso badge for late records', () => {
    render(<PontoWeekSummary registrosSemana={REGISTROS} />);
    expect(screen.getByText('15m')).toBeInTheDocument();
  });

  it('shows horas extras badge when non-zero', () => {
    render(<PontoWeekSummary registrosSemana={REGISTROS} />);
    expect(screen.getByText('+00:30')).toBeInTheDocument();
  });
});
