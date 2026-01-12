// V17.3: Calculadora IRRF 2025 - Atualizada
import { TABELA_IRRF_2025, DEDUCAO_DEPENDENTE_IRRF_2025 } from "@/constants/tabelas.constants";

export interface ResultadoIRRF {
  valor: number;
  aliquotaEfetiva: number;
  baseCalculo: number;
  faixaAplicada: number;
  aliquotaFaixa: number;
  deducaoFaixa: number;
}

export function calcularIRRF(baseCalculo: number, dependentes: number = 0): number {
  if (baseCalculo <= 0) return 0;
  
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE_IRRF_2025;
  const base = baseCalculo - deducaoDependentes;
  
  if (base <= 0) return 0;
  
  for (const faixa of TABELA_IRRF_2025) {
    if (base <= faixa.ate) {
      const irrf = base * (faixa.aliquota / 100) - faixa.deducao;
      return Math.max(0, Math.round(irrf * 100) / 100);
    }
  }
  
  // Última faixa (maior valor)
  const ultimaFaixa = TABELA_IRRF_2025[TABELA_IRRF_2025.length - 1];
  return Math.round((base * (ultimaFaixa.aliquota / 100) - ultimaFaixa.deducao) * 100) / 100;
}

export function calcularIRRFDetalhado(baseCalculo: number, dependentes: number = 0): ResultadoIRRF {
  if (baseCalculo <= 0) return { valor: 0, aliquotaEfetiva: 0, baseCalculo: 0, faixaAplicada: 0, aliquotaFaixa: 0, deducaoFaixa: 0 };
  
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE_IRRF_2025;
  const base = baseCalculo - deducaoDependentes;
  
  if (base <= 0) return { valor: 0, aliquotaEfetiva: 0, baseCalculo: base, faixaAplicada: 1, aliquotaFaixa: 0, deducaoFaixa: 0 };
  
  for (const faixa of TABELA_IRRF_2025) {
    if (base <= faixa.ate) {
      const irrf = Math.max(0, base * (faixa.aliquota / 100) - faixa.deducao);
      return {
        valor: Math.round(irrf * 100) / 100,
        aliquotaEfetiva: baseCalculo > 0 ? Math.round((irrf / baseCalculo) * 10000) / 100 : 0,
        baseCalculo: base,
        faixaAplicada: faixa.faixa,
        aliquotaFaixa: faixa.aliquota,
        deducaoFaixa: faixa.deducao
      };
    }
  }
  
  const ultimaFaixa = TABELA_IRRF_2025[TABELA_IRRF_2025.length - 1];
  const irrf = base * (ultimaFaixa.aliquota / 100) - ultimaFaixa.deducao;
  return {
    valor: Math.round(irrf * 100) / 100,
    aliquotaEfetiva: Math.round((irrf / baseCalculo) * 10000) / 100,
    baseCalculo: base,
    faixaAplicada: ultimaFaixa.faixa,
    aliquotaFaixa: ultimaFaixa.aliquota,
    deducaoFaixa: ultimaFaixa.deducao
  };
}

export function calcularBaseIRRF(salarioBruto: number, inss: number, pensaoAlimenticia: number = 0): number {
  return Math.max(0, salarioBruto - inss - pensaoAlimenticia);
}

export function getDeducaoDependente(): number {
  return DEDUCAO_DEPENDENTE_IRRF_2025;
}

export function getTabelaIRRF() {
  return TABELA_IRRF_2025;
}
