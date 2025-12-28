/**
 * Cálculo de Reembolso por Quilometragem
 */
interface QuilometragemConfig {
  kmRodados: number;
  valorPorKm: number;
  tipoVeiculo: 'carro' | 'moto' | 'bicicleta';
  pedagios?: number;
  estacionamento?: number;
}

interface QuilometragemResult {
  valorKm: number;
  valorPedagios: number;
  valorEstacionamento: number;
  valorTotal: number;
  natureza: string;
}

const VALORES_REFERENCIA = { carro: 1.20, moto: 0.80, bicicleta: 0.30 };

export function calcularQuilometragem(config: QuilometragemConfig): QuilometragemResult {
  const { kmRodados, valorPorKm, tipoVeiculo, pedagios = 0, estacionamento = 0 } = config;
  const valorKmAplicado = valorPorKm || VALORES_REFERENCIA[tipoVeiculo];
  const valorKm = kmRodados * valorKmAplicado;
  const valorTotal = valorKm + pedagios + estacionamento;

  return {
    valorKm: Math.round(valorKm * 100) / 100,
    valorPedagios: pedagios,
    valorEstacionamento: estacionamento,
    valorTotal: Math.round(valorTotal * 100) / 100,
    natureza: 'Reembolso - não incide encargos',
  };
}

export default { calcularQuilometragem };
