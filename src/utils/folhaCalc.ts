/**
 * Utilitário de cálculo de folha (INSS/IRRF/FGTS).
 *
 * IMPORTANTE: Este módulo é apenas um WRAPPER em torno de `src/calculators/impostos.ts`,
 * que é a fonte única de verdade das tabelas vigentes (sincronizada com a edge function
 * `calcular-folha`). Mantido por compatibilidade com componentes que esperam a forma
 * `{ valor, faixa }`.
 */
import { calcularINSS as _inss, calcularIRRF as _irrf, calcularFGTS as _fgts } from '@/calculators/impostos';
import { FAIXAS_INSS_2026, FAIXAS_IRRF_2026, DEDUCAO_DEPENDENTE_IRRF } from '@/calculators/tabelas';

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

const TETO_INSS = FAIXAS_INSS_2026[FAIXAS_INSS_2026.length - 1].limite;

function descreverFaixaInss(salarioBruto: number): string {
  if (salarioBruto >= TETO_INSS) return 'Teto (14%)';
  for (let i = 0; i < FAIXAS_INSS_2026.length; i++) {
    if (salarioBruto <= FAIXAS_INSS_2026[i].limite) {
      return `${(FAIXAS_INSS_2026[i].aliquota * 100).toFixed(1).replace('.0', '')}%`;
    }
  }
  return '14%';
}

function descreverFaixaIrrf(base: number): string {
  if (base <= FAIXAS_IRRF_2026[0].limite) return 'Isento';
  for (const f of FAIXAS_IRRF_2026) {
    if (base <= f.limite) return `${(f.aliquota * 100).toFixed(1).replace('.0', '')}%`;
  }
  return '27.5%';
}

export const folhaCalc = {
  calcularINSS: (salarioBruto: number): { valor: number; faixa: string } => ({
    valor: _inss(salarioBruto),
    faixa: descreverFaixaInss(salarioBruto),
  }),

  calcularIRRF: (salarioBruto: number, inss: number, dependentes: number = 0): { valor: number; faixa: string } => {
    const valor = _irrf(salarioBruto, dependentes);
    const base = salarioBruto - inss - dependentes * DEDUCAO_DEPENDENTE_IRRF;
    return { valor, faixa: descreverFaixaIrrf(base) };
  },

  calcularFGTS: (salarioBruto: number): number => _fgts(salarioBruto),

  processar: (
    salarioBase: number,
    adicionais: number = 0,
    descontosExtras: number = 0,
    dependentes: number = 0
  ): CalculoResultado => {
    const proventos = salarioBase + adicionais;
    const { valor: inss, faixa: faixaInss } = folhaCalc.calcularINSS(proventos);
    const { valor: irrf, faixa: faixaIrrf } = folhaCalc.calcularIRRF(proventos, inss, dependentes);
    const fgts = folhaCalc.calcularFGTS(proventos);
    const descontos = Math.round((inss + irrf + descontosExtras) * 100) / 100;
    const liquido = Math.round((proventos - descontos) * 100) / 100;
    return { proventos, descontos, liquido, inss, irrf, fgts, faixaInss, faixaIrrf };
  },
};
