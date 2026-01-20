// V18-C005: Calculadora Media Variaveis para Ferias
export interface VariaveisMensal {
  competencia: string;
  horasExtras: number;
  comissoes: number;
  adicionalNoturno: number;
  dsr: number;
  outros: number;
}

export interface ResultadoMediaVariaveis {
  mediaHorasExtras: number;
  mediaComissoes: number;
  mediaAdicionalNoturno: number;
  mediaDSR: number;
  mediaOutros: number;
  totalMedia: number;
  mesesConsiderados: number;
}

export function calcularMediaVariaveisFerias(variaveis: VariaveisMensal[], meses: number = 12): ResultadoMediaVariaveis {
  const dados = variaveis.slice(-meses);
  const n = dados.length || 1;

  const soma = dados.reduce((acc, v) => ({
    horasExtras: acc.horasExtras + v.horasExtras,
    comissoes: acc.comissoes + v.comissoes,
    adicionalNoturno: acc.adicionalNoturno + v.adicionalNoturno,
    dsr: acc.dsr + v.dsr,
    outros: acc.outros + v.outros
  }), { horasExtras: 0, comissoes: 0, adicionalNoturno: 0, dsr: 0, outros: 0 });

  return {
    mediaHorasExtras: Math.round((soma.horasExtras / n) * 100) / 100,
    mediaComissoes: Math.round((soma.comissoes / n) * 100) / 100,
    mediaAdicionalNoturno: Math.round((soma.adicionalNoturno / n) * 100) / 100,
    mediaDSR: Math.round((soma.dsr / n) * 100) / 100,
    mediaOutros: Math.round((soma.outros / n) * 100) / 100,
    totalMedia: Math.round(((soma.horasExtras + soma.comissoes + soma.adicionalNoturno + soma.dsr + soma.outros) / n) * 100) / 100,
    mesesConsiderados: n
  };
}

export function calcularFeriasComMedia(salarioBase: number, diasFerias: number, mediaVariaveis: number): number {
  const baseTotal = salarioBase + mediaVariaveis;
  const valorDia = baseTotal / 30;
  const ferias = valorDia * diasFerias;
  const tercoConstitucional = ferias / 3;
  return Math.round((ferias + tercoConstitucional) * 100) / 100;
}
