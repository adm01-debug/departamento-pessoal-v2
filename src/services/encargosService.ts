// V20-011: Service Calculo de Encargos Sociais
export interface EncargosResult {
  inssPatronal: number;
  rat: number;
  fap: number;
  terceiros: number;
  fgts: number;
  totalEncargos: number;
  percentualTotal: number;
}

export interface EncargosParams {
  baseCalculo: number;
  ratBase?: number;
  fap?: number;
  terceirosBase?: number;
}

export const encargosService = {
  // Alíquotas padrão
  ALIQUOTAS: {
    INSS_PATRONAL: 20, // 20%
    RAT_PADRAO: 2, // 1% a 3%
    FAP_PADRAO: 1, // 0.5 a 2.0
    TERCEIROS_PADRAO: 5.8, // Sistema S
    FGTS: 8
  },

  calcular(params: EncargosParams): EncargosResult {
    const { baseCalculo, ratBase = 2, fap = 1, terceirosBase = 5.8 } = params;
    
    const inssPatronal = baseCalculo * this.ALIQUOTAS.INSS_PATRONAL / 100;
    const rat = baseCalculo * (ratBase * fap) / 100;
    const terceiros = baseCalculo * terceirosBase / 100;
    const fgts = baseCalculo * this.ALIQUOTAS.FGTS / 100;
    
    const totalEncargos = inssPatronal + rat + terceiros + fgts;
    const percentualTotal = (totalEncargos / baseCalculo) * 100;

    return {
      inssPatronal: Math.round(inssPatronal * 100) / 100,
      rat: Math.round(rat * 100) / 100,
      fap,
      terceiros: Math.round(terceiros * 100) / 100,
      fgts: Math.round(fgts * 100) / 100,
      totalEncargos: Math.round(totalEncargos * 100) / 100,
      percentualTotal: Math.round(percentualTotal * 100) / 100
    };
  },

  calcularCustoTotal(salarioBruto: number, params?: EncargosParams): number {
    const encargos = this.calcular({ baseCalculo: salarioBruto, ...params });
    return Math.round((salarioBruto + encargos.totalEncargos) * 100) / 100;
  }
};

export default encargosService;
