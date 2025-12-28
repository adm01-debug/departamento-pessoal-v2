/**
 * Cálculo de Diárias de Viagem (CLT Art. 457, §2º)
 */
interface DiariasConfig {
  salarioBase: number;
  diasViagem: number;
  valorDiaria: number;
  tipoViagem: 'nacional' | 'internacional';
}

interface DiariasResult {
  valorTotal: number;
  excede50Porcento: boolean;
  parcelaIntegraSalario: number;
  parcelaIndenizatoria: number;
  incideINSS: boolean;
}

export function calcularDiarias(config: DiariasConfig): DiariasResult {
  const { salarioBase, diasViagem, valorDiaria, tipoViagem } = config;
  const valorTotal = valorDiaria * diasViagem;
  const limite50 = salarioBase * 0.5;
  const excede50Porcento = valorTotal > limite50;

  let parcelaIntegraSalario = 0;
  let parcelaIndenizatoria = valorTotal;

  if (excede50Porcento) {
    parcelaIntegraSalario = valorTotal - limite50;
    parcelaIndenizatoria = limite50;
  }

  return {
    valorTotal: Math.round(valorTotal * 100) / 100,
    excede50Porcento,
    parcelaIntegraSalario: Math.round(parcelaIntegraSalario * 100) / 100,
    parcelaIndenizatoria: Math.round(parcelaIndenizatoria * 100) / 100,
    incideINSS: excede50Porcento,
  };
}

export default { calcularDiarias };
