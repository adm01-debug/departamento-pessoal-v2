import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, TipoBadge } from '../DesligamentoStatusBadge';

describe('StatusBadge', () => {
  it('renders pendente status', () => {
    render(<StatusBadge status="pendente" />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renders em_andamento status', () => {
    render(<StatusBadge status="em_andamento" />);
    expect(screen.getByText('Em Andamento')).toBeInTheDocument();
  });

  it('renders concluido status', () => {
    render(<StatusBadge status="concluido" />);
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });

  it('renders finalizado status', () => {
    render(<StatusBadge status="finalizado" />);
    expect(screen.getByText('Finalizado')).toBeInTheDocument();
  });

  it('renders cancelado status', () => {
    render(<StatusBadge status="cancelado" />);
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('renders unknown status as-is', () => {
    render(<StatusBadge status="custom_status" />);
    expect(screen.getByText('custom_status')).toBeInTheDocument();
  });
});

describe('TipoBadge', () => {
  it('renders sem_justa_causa', () => {
    render(<TipoBadge tipo="sem_justa_causa" />);
    expect(screen.getByText('Sem Justa Causa')).toBeInTheDocument();
  });

  it('renders com_justa_causa', () => {
    render(<TipoBadge tipo="com_justa_causa" />);
    expect(screen.getByText('Justa Causa')).toBeInTheDocument();
  });

  it('renders pedido_demissao', () => {
    render(<TipoBadge tipo="pedido_demissao" />);
    expect(screen.getByText('Pedido Demissão')).toBeInTheDocument();
  });

  it('renders acordo_mutuo', () => {
    render(<TipoBadge tipo="acordo_mutuo" />);
    expect(screen.getByText('Acordo Mútuo')).toBeInTheDocument();
  });

  it('renders termino_contrato', () => {
    render(<TipoBadge tipo="termino_contrato" />);
    expect(screen.getByText('Término Contrato')).toBeInTheDocument();
  });

  it('renders unknown tipo as-is', () => {
    render(<TipoBadge tipo="outro" />);
    expect(screen.getByText('outro')).toBeInTheDocument();
  });
});
