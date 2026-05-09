/**
 * Utilitário de cálculo de folha de pagamento e impostos (INSS/IRRF/FGTS)
 * Baseado nas tabelas vigentes e projeções para 2026
 */

export interface CalculoResultado {
  proventos: number;
  descontos: number;
  liquido: number;
  inss: number;
  irrf: number;
  fgts: number;
  faixaInss: string;
  faixaIrrf: string;
}

export const folhaCalc = {
  /**
   * Tabela INSS 2025/2026 (Projetada)
   * Faixas progressivas
   */
  calcularINSS: (salarioBruto: number): { valor: number; faixa: string } => {
    // Teto INSS 2025/2026 estimado em R$ 8.157,41
    const teto = 8157.41;
    const base = Math.min(salarioBruto, teto);
    
    let inss = 0;
    let faixa = "";

    // Faixa 1: Até 1.518,00 (7,5%)
    if (base > 0) {
      const v1 = Math.min(base, 1518.00);
      inss += v1 * 0.075;
      faixa = "7.5%";
    }
    
    // Faixa 2: 1.518,01 até 2.793,88 (9%)
    if (base > 1518.00) {
      const v2 = Math.min(base, 2793.88) - 1518.00;
      inss += v2 * 0.09;
      faixa = "9%";
    }

    // Faixa 3: 2.793,89 até 4.190,83 (12%)
    if (base > 2793.88) {
      const v3 = Math.min(base, 4190.83) - 2793.88;
      inss += v3 * 0.12;
      faixa = "12%";
    }

    // Faixa 4: 4.190,84 até 8.157,41 (14%)
    if (base > 4190.83) {
      const v4 = base - 4190.83;
      inss += v4 * 0.14;
      faixa = "14%";
    }

    return { 
      valor: Math.round(inss * 100) / 100,
      faixa: base >= teto ? "Teto (14%)" : faixa
    };
  },

  /**
   * Tabela IRRF 2025/2026 (Projetada)
   * Base = Salário Bruto - INSS - Dependentes (R$ 189,59 cada)
   */
  calcularIRRF: (salarioBruto: number, inss: number, dependentes: number = 0): { valor: number; faixa: string } => {
    const base = salarioBruto - inss - (dependentes * 189.59);
    
    // Simplificação da tabela progressiva com parcelas a deduzir
    if (base <= 2259.20) return { valor: 0, faixa: "Isento" };
    
    if (base <= 2826.65) {
      return { valor: Math.round((base * 0.075 - 169.44) * 100) / 100, faixa: "7.5%" };
    }
    if (base <= 3751.05) {
      return { valor: Math.round((base * 0.15 - 381.44) * 100) / 100, faixa: "15%" };
    }
    if (base <= 4664.68) {
      return { valor: Math.round((base * 0.225 - 662.77) * 100) / 100, faixa: "22.5%" };
    }
    
    return { valor: Math.round((base * 0.275 - 896.00) * 100) / 100, faixa: "27.5%" };
  },

  calcularFGTS: (salarioBruto: number): number => {
    return Math.round(salarioBruto * 0.08 * 100) / 100;
  },

  processar: (salarioBase: number, adicionais: number = 0, descontosExtras: number = 0, dependentes: number = 0): CalculoResultado => {
    const proventos = salarioBase + adicionais;
    const { valor: inss, faixa: faixaInss } = folhaCalc.calcularINSS(proventos);
    const { valor: irrf, faixa: faixaIrrf } = folhaCalc.calcularIRRF(proventos, inss, dependentes);
    const fgts = folhaCalc.calcularFGTS(proventos);
    
    const descontos = inss + irrf + descontosExtras;
    const liquido = proventos - descontos;

    return {
      proventos,
      descontos,
      liquido,
      inss,
      irrf,
      fgts,
      faixaInss,
      faixaIrrf
    };
  }
};
