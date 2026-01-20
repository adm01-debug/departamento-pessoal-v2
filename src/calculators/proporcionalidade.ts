// V21-008: Calculadora de Proporcionalidade de Verbas
export interface ProporcionalidadeParams {
  valorIntegral: number;
  diasTrabalhados: number;
  diasMes?: number;
  tipo: 'dias' | 'avos';
  avos?: number;
}

export interface ProporcionalidadeResult {
  valorIntegral: number;
  valorProporcional: number;
  fatorProporcional: number;
  diasConsiderados: number;
}

export function calcularProporcional(params: ProporcionalidadeParams): ProporcionalidadeResult {
  const { valorIntegral, diasTrabalhados, diasMes = 30, tipo, avos = 12 } = params;

  let fator: number;
  let diasConsiderados: number;

  if (tipo === 'dias') {
    fator = diasTrabalhados / diasMes;
    diasConsiderados = diasTrabalhados;
  } else {
    // Cálculo por avos (12 avos no ano)
    fator = avos / 12;
    diasConsiderados = Math.round(avos * 30);
  }

  const valorProporcional = valorIntegral * fator;

  return {
    valorIntegral: r(valorIntegral),
    valorProporcional: r(valorProporcional),
    fatorProporcional: Math.round(fator * 10000) / 10000,
    diasConsiderados
  };
}

// Calcular avos trabalhados
export function calcularAvos(dataAdmissao: Date, dataReferencia: Date): number {
  const mesesCompletos = (dataReferencia.getFullYear() - dataAdmissao.getFullYear()) * 12 
    + dataReferencia.getMonth() - dataAdmissao.getMonth();
  
  // Se o dia de admissão é <= 15, conta o mês
  const diaAdmissao = dataAdmissao.getDate();
  const avos = diaAdmissao <= 15 ? mesesCompletos + 1 : mesesCompletos;
  
  return Math.min(12, Math.max(0, avos));
}

// Verificar se mês completo
export function isMesCompleto(dataAdmissao: Date, dataReferencia: Date): boolean {
  return dataAdmissao.getDate() === 1 || 
    (dataAdmissao.getMonth() < dataReferencia.getMonth() || 
     dataAdmissao.getFullYear() < dataReferencia.getFullYear());
}

function r(v: number): number { return Math.round(v * 100) / 100; }

export default calcularProporcional;
