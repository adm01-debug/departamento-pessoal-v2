import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

import { FeriasKPIs } from '../ferias/FeriasKPIs';

const BASE_STATS = {
  total: 42,
  pendentes: 5,
  aprovadas: 30,
  emGozo: 7,
  abonoPecuniario: 3,
  vencidas: 2,
};

describe('FeriasKPIs', () => {
  it('renders total count', () => {
    render(<FeriasKPIs stats={BASE_STATS} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders pendentes count', () => {
    render(<FeriasKPIs stats={BASE_STATS} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders aprovadas count', () => {
    render(<FeriasKPIs stats={BASE_STATS} />);
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('renders vencidas count', () => {
    render(<FeriasKPIs stats={BASE_STATS} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders all 6 KPI labels', () => {
    render(<FeriasKPIs stats={BASE_STATS} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Pendentes')).toBeInTheDocument();
    expect(screen.getByText('Aprovadas')).toBeInTheDocument();
    expect(screen.getByText('Em Gozo')).toBeInTheDocument();
    expect(screen.getByText('Abono')).toBeInTheDocument();
    expect(screen.getByText('Vencidas')).toBeInTheDocument();
  });

  it('renders zeros correctly', () => {
    render(<FeriasKPIs stats={{ total: 0, pendentes: 0, aprovadas: 0, emGozo: 0, abonoPecuniario: 0, vencidas: 0 }} />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(6);
  });
});
