// V17-C010: Calculadora de Multa FGTS
export type TipoRescisao = 'sem_justa_causa' | 'acordo' | 'justa_causa' | 'pedido_demissao';

export interface ParamsMultaFGTS {
  saldoFGTS: number;
  tipoRescisao: TipoRescisao;
  depositosMesRescisao?: number;
}

export interface ResultMultaFGTS {
  percentualMulta: number;
  valorMulta: number;
  saldoTotal: number;
  saquePermitido: boolean;
  percentualSaque: number;
}

export function calcularMultaFGTS(params: ParamsMultaFGTS): ResultMultaFGTS {
  const { saldoFGTS, tipoRescisao, depositosMesRescisao = 0 } = params;
  const config: Record<TipoRescisao, { multa: number; saque: boolean; percSaque: number }> = {
    sem_justa_causa: { multa: 40, saque: true, percSaque: 100 },
    acordo: { multa: 20, saque: true, percSaque: 80 },
    justa_causa: { multa: 0, saque: false, percSaque: 0 },
    pedido_demissao: { multa: 0, saque: false, percSaque: 0 },
  };
  const c = config[tipoRescisao];
  const saldoTotal = saldoFGTS + depositosMesRescisao;
  const valorMulta = Math.round(saldoTotal * (c.multa / 100) * 100) / 100;
  return { percentualMulta: c.multa, valorMulta, saldoTotal, saquePermitido: c.saque, percentualSaque: c.percSaque };
}
