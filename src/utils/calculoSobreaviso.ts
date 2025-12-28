/**
 * Cálculo de Sobreaviso (CLT Art. 244, §2º)
 * 1/3 do salário-hora normal
 */
interface SobreavisoConfig {
  salarioBase: number;
  horasMensais: number;
  horasSobreaviso: number;
}

interface SobreavisoResult {
  valorHoraNormal: number;
  valorHoraSobreaviso: number;
  totalSobreaviso: number;
  horasComputadas: number;
}

export function calcularSobreaviso(config: SobreavisoConfig): SobreavisoResult {
  const { salarioBase, horasMensais, horasSobreaviso } = config;
  const valorHoraNormal = salarioBase / horasMensais;
  const valorHoraSobreaviso = valorHoraNormal / 3;
  const totalSobreaviso = valorHoraSobreaviso * horasSobreaviso;

  return {
    valorHoraNormal: Math.round(valorHoraNormal * 100) / 100,
    valorHoraSobreaviso: Math.round(valorHoraSobreaviso * 100) / 100,
    totalSobreaviso: Math.round(totalSobreaviso * 100) / 100,
    horasComputadas: horasSobreaviso,
  };
}

export function calcularLimiteSobreaviso(horasSobreaviso: number): { dentroLimite: boolean; limiteMaximo: number } {
  const limiteMaximo = 24; // máximo 24h por escala
  return { dentroLimite: horasSobreaviso <= limiteMaximo, limiteMaximo };
}

export default { calcularSobreaviso, calcularLimiteSobreaviso };
