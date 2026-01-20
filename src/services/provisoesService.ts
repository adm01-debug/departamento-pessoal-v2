// V20-021: Service de Provisoes Contabeis
export interface ProvisaoParams {
  salarioBase: number;
  mesesTrabalhados: number;
  tipoProvisao: 'ferias' | '13_salario' | 'ambos';
}

export interface ProvisaoResult {
  ferias: number;
  tercoFerias: number;
  decimoTerceiro: number;
  encargosFerias: number;
  encargos13: number;
  totalProvisoes: number;
}

export const provisoesService = {
  ENCARGOS_PERCENTUAL: 36.8, // INSS + FGTS + outros

  calcular(params: ProvisaoParams): ProvisaoResult {
    const { salarioBase, mesesTrabalhados, tipoProvisao } = params;
    
    // Provisão de Férias (1/12 avos por mês)
    const feriasBase = tipoProvisao !== '13_salario' 
      ? (salarioBase / 12) * mesesTrabalhados 
      : 0;
    const tercoFerias = feriasBase / 3;
    const totalFerias = feriasBase + tercoFerias;
    
    // Provisão de 13º (1/12 avos por mês)
    const decimoTerceiro = tipoProvisao !== 'ferias'
      ? (salarioBase / 12) * mesesTrabalhados
      : 0;
    
    // Encargos sobre provisões
    const encargosFerias = totalFerias * this.ENCARGOS_PERCENTUAL / 100;
    const encargos13 = decimoTerceiro * this.ENCARGOS_PERCENTUAL / 100;

    return {
      ferias: Math.round(feriasBase * 100) / 100,
      tercoFerias: Math.round(tercoFerias * 100) / 100,
      decimoTerceiro: Math.round(decimoTerceiro * 100) / 100,
      encargosFerias: Math.round(encargosFerias * 100) / 100,
      encargos13: Math.round(encargos13 * 100) / 100,
      totalProvisoes: Math.round((totalFerias + decimoTerceiro + encargosFerias + encargos13) * 100) / 100
    };
  },

  calcularMensal(salarioBase: number): ProvisaoResult {
    return this.calcular({ salarioBase, mesesTrabalhados: 1, tipoProvisao: 'ambos' });
  },

  calcularAnual(salarioBase: number): ProvisaoResult {
    return this.calcular({ salarioBase, mesesTrabalhados: 12, tipoProvisao: 'ambos' });
  }
};

export default provisoesService;
