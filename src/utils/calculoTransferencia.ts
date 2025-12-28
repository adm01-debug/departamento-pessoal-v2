/**
 * Cálculo de Adicional de Transferência (CLT Art. 469)
 * Mínimo 25% sobre salário
 */
interface TransferenciaConfig {
  salarioBase: number;
  percentualAdicional: number;
  tipoTransferencia: 'provisoria' | 'definitiva';
  diasTransferencia: number;
}

interface TransferenciaResult {
  valorAdicional: number;
  valorProporcional: number;
  deveReceberAdicional: boolean;
  observacao: string;
}

export function calcularAdicionalTransferencia(config: TransferenciaConfig): TransferenciaResult {
  const { salarioBase, percentualAdicional, tipoTransferencia, diasTransferencia } = config;
  const percentual = Math.max(percentualAdicional, 25) / 100;

  if (tipoTransferencia === 'definitiva') {
    return { valorAdicional: 0, valorProporcional: 0, deveReceberAdicional: false, observacao: 'Transferência definitiva não gera adicional' };
  }

  const valorAdicional = salarioBase * percentual;
  const valorProporcional = (valorAdicional / 30) * diasTransferencia;

  return {
    valorAdicional: Math.round(valorAdicional * 100) / 100,
    valorProporcional: Math.round(valorProporcional * 100) / 100,
    deveReceberAdicional: true,
    observacao: 'Transferência provisória com adicional de ' + (percentual * 100) + '%',
  };
}

export default { calcularAdicionalTransferencia };
