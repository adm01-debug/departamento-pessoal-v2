// V17-C007: Calculadora de Banco de Horas
export interface MovimentacaoBH {
  tipo: 'credito' | 'debito';
  minutos: number;
  data: string;
  motivo?: string;
}

export interface SaldoBH {
  saldoMinutos: number;
  saldoHoras: number;
  saldoFormatado: string;
}

export function calcularSaldoBancoHoras(movimentacoes: MovimentacaoBH[]): SaldoBH {
  let saldoMinutos = 0;
  movimentacoes.forEach(m => {
    saldoMinutos += m.tipo === 'credito' ? m.minutos : -m.minutos;
  });
  const saldoHoras = Math.floor(Math.abs(saldoMinutos) / 60);
  const mins = Math.abs(saldoMinutos) % 60;
  const sinal = saldoMinutos < 0 ? '-' : '';
  return { saldoMinutos, saldoHoras: saldoMinutos / 60, saldoFormatado: `${sinal}${saldoHoras}h${mins.toString().padStart(2,'0')}min` };
}

export function calcularValorPagamento(saldoMinutos: number, valorHora: number): number {
  return Math.round((saldoMinutos / 60) * valorHora * 100) / 100;
}
