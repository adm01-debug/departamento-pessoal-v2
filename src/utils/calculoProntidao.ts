/**
 * Cálculo de Prontidão (CLT Art. 244, §3º)
 * 2/3 do salário-hora normal
 */
interface ProntidaoConfig {
  salarioBase: number;
  horasMensais: number;
  horasProntidao: number;
}

interface ProntidaoResult {
  valorHoraNormal: number;
  valorHoraProntidao: number;
  totalProntidao: number;
  horasComputadas: number;
}

export function calcularProntidao(config: ProntidaoConfig): ProntidaoResult {
  const { salarioBase, horasMensais, horasProntidao } = config;
  const valorHoraNormal = salarioBase / horasMensais;
  const valorHoraProntidao = (valorHoraNormal * 2) / 3;
  const totalProntidao = valorHoraProntidao * horasProntidao;

  return {
    valorHoraNormal: Math.round(valorHoraNormal * 100) / 100,
    valorHoraProntidao: Math.round(valorHoraProntidao * 100) / 100,
    totalProntidao: Math.round(totalProntidao * 100) / 100,
    horasComputadas: horasProntidao,
  };
}

export default { calcularProntidao };
