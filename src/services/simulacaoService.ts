// V21-003: Service de Simulacao Salarial
export interface SimulacaoParams {
  salarioBruto: number;
  dependentes?: number;
  valeTransporte?: number;
  planoSaude?: number;
  outrosDescontos?: number;
}

export interface SimulacaoResult {
  salarioBruto: number;
  inss: number;
  irrf: number;
  valeTransporte: number;
  planoSaude: number;
  outrosDescontos: number;
  totalDescontos: number;
  salarioLiquido: number;
  fgts: number;
  custoEmpresa: number;
}

export const simulacaoService = {
  TABELA_INSS_2026: [
    { ate: 1621.00, aliquota: 7.5 },
    { ate: 2696.91, aliquota: 9 },
    { ate: 4049.10, aliquota: 12 },
    { ate: 8475.55, aliquota: 14 }
  ],

  TABELA_IRRF_2026: [
    { ate: 2480.15, aliquota: 0, deducao: 0 },
    { ate: 3272.19, aliquota: 7.5, deducao: 186.01 },
    { ate: 4363.07, aliquota: 15, deducao: 431.42 },
    { ate: 5451.45, aliquota: 22.5, deducao: 758.80 },
    { ate: Infinity, aliquota: 27.5, deducao: 1031.13 }
  ],

  DEDUCAO_DEPENDENTE: 227.42,

  simular(params: SimulacaoParams): SimulacaoResult {
    const { salarioBruto, dependentes = 0, valeTransporte = 0, planoSaude = 0, outrosDescontos = 0 } = params;

    // Calcular INSS
    let inss = 0;
    let restante = salarioBruto;
    let anterior = 0;
    for (const faixa of this.TABELA_INSS_2026) {
      const base = Math.min(restante, faixa.ate - anterior);
      if (base <= 0) break;
      inss += base * faixa.aliquota / 100;
      restante -= base;
      anterior = faixa.ate;
    }
    inss = Math.min(inss, 951.63); // Teto

    // Calcular IRRF
    const baseIRRF = salarioBruto - inss - (dependentes * this.DEDUCAO_DEPENDENTE);
    let irrf = 0;
    for (const faixa of this.TABELA_IRRF_2026) {
      if (baseIRRF <= faixa.ate) {
        irrf = baseIRRF * faixa.aliquota / 100 - faixa.deducao;
        break;
      }
    }
    irrf = Math.max(0, irrf);

    const totalDescontos = inss + irrf + valeTransporte + planoSaude + outrosDescontos;
    const salarioLiquido = salarioBruto - totalDescontos;
    const fgts = salarioBruto * 0.08;
    const custoEmpresa = salarioBruto + fgts + (salarioBruto * 0.288); // Encargos estimados

    return {
      salarioBruto: r(salarioBruto),
      inss: r(inss),
      irrf: r(irrf),
      valeTransporte: r(valeTransporte),
      planoSaude: r(planoSaude),
      outrosDescontos: r(outrosDescontos),
      totalDescontos: r(totalDescontos),
      salarioLiquido: r(salarioLiquido),
      fgts: r(fgts),
      custoEmpresa: r(custoEmpresa)
    };
  }
};

function r(v: number): number { return Math.round(v * 100) / 100; }

export default simulacaoService;
