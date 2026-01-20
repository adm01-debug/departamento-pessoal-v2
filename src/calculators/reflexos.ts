// V18-C006/C007: Reflexos em Verbas Trabalhistas
export interface ReflexosConfig {
  salarioBase: number;
  horasExtras: number;
  comissoes: number;
  adicionalNoturno: number;
  adicionalPericulosidade: number;
  adicionalInsalubridade: number;
  dsr: number;
}

export interface ResultadoReflexos {
  baseFerias: number;
  base13: number;
  baseFGTS: number;
  baseINSS: number;
  baseIRRF: number;
  baseAvisoPrevio: number;
}

export function calcularReflexos(config: ReflexosConfig): ResultadoReflexos {
  const { salarioBase, horasExtras, comissoes, adicionalNoturno, adicionalPericulosidade, adicionalInsalubridade, dsr } = config;
  
  // Base para férias e 13º inclui habitualidade
  const baseHabitualidade = salarioBase + horasExtras + comissoes + adicionalNoturno + dsr;
  
  // Base para FGTS inclui todos os adicionais
  const baseFGTS = baseHabitualidade + adicionalPericulosidade + adicionalInsalubridade;
  
  // Base para INSS/IRRF segue regras específicas
  const baseINSS = baseFGTS;
  const baseIRRF = baseINSS; // Após deduzir INSS na prática

  return {
    baseFerias: Math.round(baseHabitualidade * 100) / 100,
    base13: Math.round(baseHabitualidade * 100) / 100,
    baseFGTS: Math.round(baseFGTS * 100) / 100,
    baseINSS: Math.round(baseINSS * 100) / 100,
    baseIRRF: Math.round(baseIRRF * 100) / 100,
    baseAvisoPrevio: Math.round(baseHabitualidade * 100) / 100
  };
}

// V18-C006: 13º proporcional com avos
export interface Params13Proporcional {
  salarioBase: number;
  mediaVariaveis: number;
  mesesTrabalhados: number;
  diasUltimoMes: number;
  faltas: number;
}

export function calcular13ProporcionalDetalhado(params: Params13Proporcional): {
  avos: number;
  valor: number;
  baseCalculo: number;
  descontoFaltas: number;
} {
  const { salarioBase, mediaVariaveis, mesesTrabalhados, diasUltimoMes, faltas } = params;
  
  // Calcula avos (mês com 15+ dias conta como avo)
  let avos = mesesTrabalhados;
  if (diasUltimoMes >= 15) avos++;
  
  // Desconto por faltas (15+ faltas no mês = perde 1 avo)
  const mesesPerdidos = Math.floor(faltas / 15);
  avos = Math.max(0, avos - mesesPerdidos);
  
  const baseCalculo = salarioBase + mediaVariaveis;
  const valor = (baseCalculo / 12) * avos;

  return {
    avos,
    valor: Math.round(valor * 100) / 100,
    baseCalculo: Math.round(baseCalculo * 100) / 100,
    descontoFaltas: mesesPerdidos
  };
}
