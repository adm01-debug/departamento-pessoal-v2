// V17-C013: Calculadora de Comissão
export interface ParamsComissao {
  valorVendas: number;
  percentual: number;
  metaMinima?: number;
  bonusMeta?: number;
}

export interface ResultComissao {
  comissaoBase: number;
  bonus: number;
  totalComissao: number;
  atingiuMeta: boolean;
}

export function calcularComissao(params: ParamsComissao): ResultComissao {
  const { valorVendas, percentual, metaMinima = 0, bonusMeta = 0 } = params;
  const comissaoBase = Math.round(valorVendas * (percentual / 100) * 100) / 100;
  const atingiuMeta = valorVendas >= metaMinima;
  const bonus = atingiuMeta && metaMinima > 0 ? Math.round(bonusMeta * 100) / 100 : 0;
  return { comissaoBase, bonus, totalComissao: comissaoBase + bonus, atingiuMeta };
}
