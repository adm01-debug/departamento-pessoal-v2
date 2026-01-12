// V17-C016: Calculadora de Auxílio Doença
export const DIAS_EMPRESA = 15;
export const PERCENTUAL_BENEFICIO = 91;

export interface ParamsAuxilioDoenca {
  salarioContribuicao: number;
  diasAfastamento: number;
  carencia?: boolean;
}

export interface ResultAuxilioDoenca {
  diasEmpresa: number;
  diasINSS: number;
  valorEmpresa: number;
  valorINSS: number;
  valorTotal: number;
}

export function calcularAuxilioDoenca(params: ParamsAuxilioDoenca): ResultAuxilioDoenca {
  const { salarioContribuicao, diasAfastamento, carencia = true } = params;
  const diasEmpresa = Math.min(diasAfastamento, DIAS_EMPRESA);
  const diasINSS = Math.max(0, diasAfastamento - DIAS_EMPRESA);
  const valorDia = salarioContribuicao / 30;
  const valorEmpresa = Math.round(valorDia * diasEmpresa * 100) / 100;
  const valorDiaINSS = valorDia * (PERCENTUAL_BENEFICIO / 100);
  const valorINSS = carencia ? Math.round(valorDiaINSS * diasINSS * 100) / 100 : 0;
  return { diasEmpresa, diasINSS, valorEmpresa, valorINSS, valorTotal: valorEmpresa + valorINSS };
}
