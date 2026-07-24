import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

import { FolhaValidationAlerts } from '../folha/FolhaValidationAlerts';

const BASE_RESUMO = {
  colaboradores: 10,
  totalProventos: 30000,
  totalDescontos: 5000,
  liquido: 25000,
  inss: 3000,
  fgts: 2400,
  irrf: 2000,
};

describe('FolhaValidationAlerts', () => {
  it('renders the Audit Smart Validation title', () => {
    render(<FolhaValidationAlerts resumo={BASE_RESUMO} />);
    expect(screen.getByText('Audit Smart Validation')).toBeInTheDocument();
  });

  it('shows score display', () => {
    render(<FolhaValidationAlerts resumo={BASE_RESUMO} />);
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
  });

  it('warns when no colaboradores are processed', () => {
    render(<FolhaValidationAlerts resumo={{ ...BASE_RESUMO, colaboradores: 0 }} />);
    expect(screen.getByText(/Nenhum colaborador processado/i)).toBeInTheDocument();
  });

  it('warns when descontos exceed 40% of proventos', () => {
    render(
      <FolhaValidationAlerts
        resumo={{ ...BASE_RESUMO, totalProventos: 10000, totalDescontos: 5000 }}
      />
    );
    expect(screen.getByText(/Descontos totais elevados/i)).toBeInTheDocument();
  });

  it('shows critical alert when liquido is negative', () => {
    render(<FolhaValidationAlerts resumo={{ ...BASE_RESUMO, liquido: -100 }} />);
    expect(screen.getByText(/líquido negativo/i)).toBeInTheDocument();
  });

  it('always shows eSocial success alert', () => {
    render(<FolhaValidationAlerts resumo={BASE_RESUMO} />);
    expect(screen.getByText(/S-1010/)).toBeInTheDocument();
  });

  it('always shows atypical variation warning (hardcoded 35%)', () => {
    render(<FolhaValidationAlerts resumo={BASE_RESUMO} />);
    expect(screen.getByText(/Variação salarial atípica/i)).toBeInTheDocument();
  });
});
