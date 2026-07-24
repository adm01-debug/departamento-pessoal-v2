import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

import { PontoTodayCard } from '../ponto/PontoTodayCard';

const REGISTRO = {
  entrada_esperada: '08:00',
  saida_esperada: '17:00',
  horas_trabalhadas: '08:00',
  horas_extras: '00:00',
  horas_falta: '00:00',
  entrada_1: '08:05',
  saida_1: null,
  saida_intervalo: null,
  retorno_intervalo: null,
  atraso_minutos: 5,
  saida_antecipada_minutos: 0,
};

describe('PontoTodayCard', () => {
  it('renders "Hoje" heading', () => {
    render(<PontoTodayCard registroHoje={null} />);
    expect(screen.getByText('Hoje')).toBeInTheDocument();
  });

  it('shows "A jornada ainda não começou" when no registro', () => {
    render(<PontoTodayCard registroHoje={null} />);
    expect(screen.getByText('A jornada ainda não começou')).toBeInTheDocument();
  });

  it('shows escala badge when registro has horarios', () => {
    render(<PontoTodayCard registroHoje={REGISTRO} />);
    expect(screen.getByText(/08:00 - 17:00/)).toBeInTheDocument();
  });

  it('shows Trabalhadas, Extras, Débito labels', () => {
    render(<PontoTodayCard registroHoje={REGISTRO} />);
    expect(screen.getByText('Trabalhadas')).toBeInTheDocument();
    expect(screen.getByText('Extras')).toBeInTheDocument();
    expect(screen.getByText('Débito')).toBeInTheDocument();
  });

  it('shows atraso badge when atraso_minutos > 0', () => {
    render(<PontoTodayCard registroHoje={REGISTRO} />);
    expect(screen.getByText(/Atraso: 5min/)).toBeInTheDocument();
  });

  it('shows Linha do Tempo section', () => {
    render(<PontoTodayCard registroHoje={REGISTRO} />);
    expect(screen.getByText('Linha do Tempo')).toBeInTheDocument();
  });

  it('shows waiting message when no entries', () => {
    const semEntrada = { ...REGISTRO, entrada_1: null };
    render(<PontoTodayCard registroHoje={semEntrada} />);
    expect(screen.getByText('Aguardando primeira batida')).toBeInTheDocument();
  });
});
