// V17-C006: Calculadora de Vale Transporte
export const PERCENTUAL_DESCONTO_VT = 6;

export interface ParamsVT {
  salarioBase: number;
  valorPassagem: number;
  diasUteis?: number;
  viagensDia?: number;
}

export interface ResultVT {
  valorVT: number;
  descontoEmpregado: number;
  custoEmpresa: number;
  limiteDesconto: number;
}

export function calcularValeTransporte(params: ParamsVT): ResultVT {
  const { salarioBase, valorPassagem, diasUteis = 22, viagensDia = 2 } = params;
  const valorVT = Math.round(valorPassagem * diasUteis * viagensDia * 100) / 100;
  const limiteDesconto = Math.round(salarioBase * (PERCENTUAL_DESCONTO_VT / 100) * 100) / 100;
  const descontoEmpregado = Math.min(valorVT, limiteDesconto);
  const custoEmpresa = Math.round((valorVT - descontoEmpregado) * 100) / 100;
  return { valorVT, descontoEmpregado, custoEmpresa, limiteDesconto };
}
