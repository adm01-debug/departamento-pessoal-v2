// V15-306
import { PERCENTUAL_FGTS } from '@/constants';
export function calcularFGTS(baseCalculo: number): number {
  return baseCalculo * (PERCENTUAL_FGTS / 100);
}
export function calcularFGTSRescisorio(saldoFGTS: number, tempoServico: number, tipoRescisao: 'sem_justa_causa' | 'justa_causa' | 'pedido_demissao'): { multa: number; saque: number } {
  if (tipoRescisao === 'sem_justa_causa') {
    return { multa: saldoFGTS * 0.4, saque: saldoFGTS + (saldoFGTS * 0.4) };
  }
  if (tipoRescisao === 'pedido_demissao') {
    return { multa: 0, saque: 0 };
  }
  return { multa: 0, saque: 0 };
}
