// V17-C011: Calculadora de Aviso Prévio
export type TipoAviso = 'trabalhado' | 'indenizado';

export interface ParamsAviso {
  tipoAviso: TipoAviso;
  anosServico: number;
  salario: number;
}

export interface ResultAviso {
  diasAviso: number;
  diasBase: number;
  diasAdicionais: number;
  valorIndenizado: number;
}

export function calcularAvisoPrevio(params: ParamsAviso): ResultAviso {
  const { tipoAviso, anosServico, salario } = params;
  const diasBase = 30;
  const diasAdicionais = Math.min(Math.floor(anosServico) * 3, 60);
  const diasAviso = diasBase + diasAdicionais;
  const valorDia = salario / 30;
  const valorIndenizado = tipoAviso === 'indenizado' ? Math.round(valorDia * diasAviso * 100) / 100 : 0;
  return { diasAviso, diasBase, diasAdicionais, valorIndenizado };
}
