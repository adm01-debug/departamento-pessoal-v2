// V17-C012: Calculadora de Gratificação
export interface ParamsGratificacao {
  salarioBase: number;
  percentual?: number;
  valorFixo?: number;
  mesesTrabalhados?: number;
}

export function calcularGratificacao(params: ParamsGratificacao): number {
  const { salarioBase, percentual, valorFixo, mesesTrabalhados = 12 } = params;
  if (valorFixo && valorFixo > 0) return valorFixo;
  if (percentual && percentual > 0) {
    const proporcional = mesesTrabalhados / 12;
    return Math.round(salarioBase * (percentual / 100) * proporcional * 100) / 100;
  }
  return 0;
}
