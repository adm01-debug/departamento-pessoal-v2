// V17-C009: Calculadora de Provisões Contábeis
export interface ParamsProvisao {
  salarioBruto: number;
  encargos?: number;
}

export interface ResultProvisoes {
  provisaoFerias: number;
  provisao13: number;
  provisaoEncargosFerias: number;
  provisaoEncargos13: number;
  totalMensal: number;
}

export function calcularProvisoes(params: ParamsProvisao): ResultProvisoes {
  const { salarioBruto, encargos = 36.8 } = params;
  const provisaoFerias = Math.round((salarioBruto / 12) * 1.3333 * 100) / 100;
  const provisao13 = Math.round((salarioBruto / 12) * 100) / 100;
  const provisaoEncargosFerias = Math.round(provisaoFerias * (encargos / 100) * 100) / 100;
  const provisaoEncargos13 = Math.round(provisao13 * (encargos / 100) * 100) / 100;
  const totalMensal = provisaoFerias + provisao13 + provisaoEncargosFerias + provisaoEncargos13;
  return { provisaoFerias, provisao13, provisaoEncargosFerias, provisaoEncargos13, totalMensal: Math.round(totalMensal * 100) / 100 };
}
