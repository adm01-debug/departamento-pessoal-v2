// V17.4: Calculadora IRRF 2026 - Atualizada em 12/01/2026
// REFORMA IR 2026: Isenção total até R$ 5.000,00
// Fonte: Secretaria de Comunicação Social - Gov.br 06/01/2026
import { TABELA_IRRF_2026, DEDUCAO_DEPENDENTE_IRRF_2026 } from "@/constants/tabelas.constants";

export interface ResultadoIRRF {
  valor: number;
  aliquotaEfetiva: number;
  baseCalculo: number;
  faixaAplicada: number;
  aliquotaFaixa: number;
  deducaoFaixa: number;
  isento: boolean;
}

/**
 * Calcula IRRF 2026 com NOVA ISENÇÃO até R$ 5.000
 * Faixas: Isento até R$ 5.000 | 7,5% até R$ 7.350 | 15% até R$ 9.920 | 22,5% até R$ 13.170 | 27,5% acima
 */
export function calcularIRRF(baseCalculo: number, dependentes: number = 0): number {
  if (baseCalculo <= 0) return 0;
  
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE_IRRF_2026;
  const base = baseCalculo - deducaoDependentes;
  
  // ISENÇÃO TOTAL até R$ 5.000,00 (Reforma IR 2026)
  if (base <= 5000) return 0;
  
  for (const faixa of TABELA_IRRF_2026) {
    if (base <= faixa.ate) {
      const irrf = base * (faixa.aliquota / 100) - faixa.deducao;
      return Math.max(0, Math.round(irrf * 100) / 100);
    }
  }
  
  // Última faixa (maior valor - 27,5%)
  const ultimaFaixa = TABELA_IRRF_2026[TABELA_IRRF_2026.length - 1];
  return Math.round((base * (ultimaFaixa.aliquota / 100) - ultimaFaixa.deducao) * 100) / 100;
}

/**
 * Calcula IRRF detalhado com todas as informações
 */
export function calcularIRRFDetalhado(baseCalculo: number, dependentes: number = 0): ResultadoIRRF {
  const resultadoZerado: ResultadoIRRF = { 
    valor: 0, aliquotaEfetiva: 0, baseCalculo: 0, 
    faixaAplicada: 1, aliquotaFaixa: 0, deducaoFaixa: 0, isento: true 
  };
  
  if (baseCalculo <= 0) return resultadoZerado;
  
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE_IRRF_2026;
  const base = baseCalculo - deducaoDependentes;
  
  // ISENÇÃO até R$ 5.000
  if (base <= 5000) {
    return { ...resultadoZerado, baseCalculo: base, isento: true };
  }
  
  for (const faixa of TABELA_IRRF_2026) {
    if (base <= faixa.ate) {
      const irrf = Math.max(0, base * (faixa.aliquota / 100) - faixa.deducao);
      return {
        valor: Math.round(irrf * 100) / 100,
        aliquotaEfetiva: baseCalculo > 0 ? Math.round((irrf / baseCalculo) * 10000) / 100 : 0,
        baseCalculo: base,
        faixaAplicada: faixa.faixa,
        aliquotaFaixa: faixa.aliquota,
        deducaoFaixa: faixa.deducao,
        isento: false
      };
    }
  }
  
  const ultimaFaixa = TABELA_IRRF_2026[TABELA_IRRF_2026.length - 1];
  const irrf = base * (ultimaFaixa.aliquota / 100) - ultimaFaixa.deducao;
  return {
    valor: Math.round(irrf * 100) / 100,
    aliquotaEfetiva: Math.round((irrf / baseCalculo) * 10000) / 100,
    baseCalculo: base,
    faixaAplicada: ultimaFaixa.faixa,
    aliquotaFaixa: ultimaFaixa.aliquota,
    deducaoFaixa: ultimaFaixa.deducao,
    isento: false
  };
}

export function calcularBaseIRRF(salarioBruto: number, inss: number, pensaoAlimenticia: number = 0): number {
  return Math.max(0, salarioBruto - inss - pensaoAlimenticia);
}

export function getDeducaoDependente(): number {
  return DEDUCAO_DEPENDENTE_IRRF_2026;
}

export function getTabelaIRRF() {
  return TABELA_IRRF_2026;
}

// REFORMA IR 2026 - Principais mudanças:
// - Isenção TOTAL para quem ganha até R$ 5.000/mês
// - Redução progressiva para rendas entre R$ 5.000 e R$ 7.350
// - Declaração 2027 (ano-calendário 2026) refletirá as mudanças
