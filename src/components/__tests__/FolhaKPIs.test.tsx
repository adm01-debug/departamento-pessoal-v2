import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    span: ({ children, ...rest }: any) => <span {...rest}>{children}</span>,
  },
}));

vi.mock('@/components/dashboard/AnimatedNumber', () => ({
  AnimatedNumber: ({ value, format }: any) => (
    <span>{format ? format(value) : String(value)}</span>
  ),
}));

vi.mock('@/components/ui/module-skeleton', () => ({
  KPICardSkeleton: () => <div data-testid="kpi-skeleton" />,
}));

import { FolhaKPIs } from '../folha/FolhaKPIs';

const RESUMO = {
  colaboradores: 50,
  totalProventos: 100000,
  totalDescontos: 20000,
  liquido: 80000,
  inss: 10000,
  fgts: 8000,
  irrf: 5000,
  custoTotalEmpresa: 140000,
};

describe('FolhaKPIs', () => {
  it('renders loading skeletons when isLoading', () => {
    render(<FolhaKPIs resumo={undefined} isLoading={true} />);
    expect(screen.getAllByTestId('kpi-skeleton').length).toBe(6);
  });

  it('renders KPI labels when not loading', () => {
    render(<FolhaKPIs resumo={RESUMO} isLoading={false} />);
    expect(screen.getByText('Colaboradores')).toBeInTheDocument();
    expect(screen.getByText('Total Bruto')).toBeInTheDocument();
    expect(screen.getByText('Total Descontos')).toBeInTheDocument();
    expect(screen.getByText('Líquido Total')).toBeInTheDocument();
    expect(screen.getByText('IRRF Retido')).toBeInTheDocument();
    expect(screen.getByText('Custo Empresa')).toBeInTheDocument();
  });

  it('shows zeros when resumo is undefined', () => {
    render(<FolhaKPIs resumo={undefined} isLoading={false} />);
    expect(screen.getByText('Colaboradores')).toBeInTheDocument();
  });

  it('renders all 7 KPI cards (no skeletons) when not loading', () => {
    render(<FolhaKPIs resumo={RESUMO} isLoading={false} />);
    expect(screen.queryByTestId('kpi-skeleton')).not.toBeInTheDocument();
  });

  it('shows Encargos label', () => {
    render(<FolhaKPIs resumo={RESUMO} isLoading={false} />);
    expect(screen.getByText(/Encargos/)).toBeInTheDocument();
  });
});
