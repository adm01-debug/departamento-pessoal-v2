/**
 * Cálculo de Multa do Art. 477 CLT
 * Multa por atraso no pagamento das verbas rescisórias
 */
interface Multa477Config {
  salarioBase: number;
  dataDesligamento: Date;
  dataPagamento: Date;
  tipoRescisao: 'pedido_demissao' | 'sem_justa_causa' | 'justa_causa';
}

interface Multa477Result {
  devidaMulta: boolean;
  valorMulta: number;
  diasAtraso: number;
  prazoLegal: number;
  observacao: string;
}

export function calcularMulta477(config: Multa477Config): Multa477Result {
  const { salarioBase, dataDesligamento, dataPagamento, tipoRescisao } = config;
  
  const prazoLegal = tipoRescisao === 'pedido_demissao' ? 10 : 10;
  const diffTime = dataPagamento.getTime() - dataDesligamento.getTime();
  const diasAtraso = Math.floor(diffTime / (1000 * 60 * 60 * 24)) - prazoLegal;
  
  const devidaMulta = diasAtraso > 0;
  const valorMulta = devidaMulta ? salarioBase : 0;

  return {
    devidaMulta,
    valorMulta: Math.round(valorMulta * 100) / 100,
    diasAtraso: Math.max(0, diasAtraso),
    prazoLegal,
    observacao: devidaMulta ? `Atraso de ${diasAtraso} dias - multa de 1 salário devida` : 'Pagamento dentro do prazo legal',
  };
}

export default { calcularMulta477 };
