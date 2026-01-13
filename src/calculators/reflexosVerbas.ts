// V20-CALC002: Calculo Reflexos em Verbas Rescisorias
export interface ReflexosVerbas {
  reflexoFerias: number;
  reflexoDecimoTerceiro: number;
  reflexoAvisoPrevio: number;
  reflexoFGTS: number;
  totalReflexos: number;
}

export const calcularReflexosVerbas = (
  mediaHorasExtras: number,
  mediaComissoes: number,
  salarioBase: number,
  mesesTrabalhados: number
): ReflexosVerbas => {
  const mediaVariaveis = mediaHorasExtras + mediaComissoes;
  
  // Reflexo em ferias (media variaveis / 12 * meses)
  const reflexoFerias = (mediaVariaveis / 12) * Math.min(mesesTrabalhados, 12) * 1.3333;
  
  // Reflexo em 13o (media variaveis / 12 * meses)
  const reflexoDecimoTerceiro = (mediaVariaveis / 12) * mesesTrabalhados;
  
  // Reflexo no aviso previo
  const reflexoAvisoPrevio = mediaVariaveis;
  
  // Reflexo FGTS sobre tudo
  const reflexoFGTS = (reflexoFerias + reflexoDecimoTerceiro + reflexoAvisoPrevio) * 0.08;
  
  return {
    reflexoFerias,
    reflexoDecimoTerceiro,
    reflexoAvisoPrevio,
    reflexoFGTS,
    totalReflexos: reflexoFerias + reflexoDecimoTerceiro + reflexoAvisoPrevio + reflexoFGTS
  };
};
