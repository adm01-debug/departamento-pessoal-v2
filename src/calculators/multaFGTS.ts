// V18-C008: Calculadora Multa FGTS Atualizada 2026
// Lei 13.467/2017 (Reforma) e Lei 13.932/2019 (FGTS Digital)

export type TipoRescisao = 'sem_justa_causa' | 'acordo' | 'justa_causa' | 'pedido_demissao' | 'termino_contrato' | 'aposentadoria' | 'falecimento';

export interface ResultadoMultaFGTS {
  saldoFGTS: number;
  percentualMulta: number;
  valorMulta: number;
  podeSacar: boolean;
  percentualSaque: number;
  valorSaque: number;
  contribuicaoSocial: number;
  totalLiberado: number;
}

export interface ParamsMultaFGTS {
  saldoFGTS: number;
  tipoRescisao: TipoRescisao;
  tempoContrato?: number; // meses
  salarioBase?: number;
}

const PERCENTUAIS: Record<TipoRescisao, { multa: number; saque: number }> = {
  sem_justa_causa: { multa: 40, saque: 100 },
  acordo: { multa: 20, saque: 80 },
  justa_causa: { multa: 0, saque: 0 },
  pedido_demissao: { multa: 0, saque: 0 },
  termino_contrato: { multa: 40, saque: 100 },
  aposentadoria: { multa: 0, saque: 100 },
  falecimento: { multa: 0, saque: 100 }
};

export function calcularMultaFGTS(params: ParamsMultaFGTS): ResultadoMultaFGTS {
  const { saldoFGTS, tipoRescisao } = params;
  const config = PERCENTUAIS[tipoRescisao];

  const valorMulta = Math.round((saldoFGTS * config.multa / 100) * 100) / 100;
  const valorSaque = Math.round((saldoFGTS * config.saque / 100) * 100) / 100;
  
  // Contribuição social (10% sobre multa) - extinta em 2019 mas mantida para histórico
  const contribuicaoSocial = 0;

  return {
    saldoFGTS: Math.round(saldoFGTS * 100) / 100,
    percentualMulta: config.multa,
    valorMulta,
    podeSacar: config.saque > 0,
    percentualSaque: config.saque,
    valorSaque,
    contribuicaoSocial,
    totalLiberado: Math.round((valorSaque + valorMulta) * 100) / 100
  };
}

export function getPercentualMulta(tipoRescisao: TipoRescisao): number {
  return PERCENTUAIS[tipoRescisao].multa;
}

export function getPercentualSaque(tipoRescisao: TipoRescisao): number {
  return PERCENTUAIS[tipoRescisao].saque;
}

// Simula saldo FGTS baseado no histórico
export function estimarSaldoFGTS(salarioMedio: number, mesesContrato: number, taxaCorrecao: number = 3): number {
  const depositoMensal = salarioMedio * 0.08;
  const totalDepositos = depositoMensal * mesesContrato;
  const correcaoAnual = taxaCorrecao / 100;
  const anos = mesesContrato / 12;
  const saldoCorrigido = totalDepositos * Math.pow(1 + correcaoAnual, anos);
  return Math.round(saldoCorrigido * 100) / 100;
}
