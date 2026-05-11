/**
 * Utilitário de cálculo de folha (INSS/IRRF/FGTS/Trabalhista).
 *
 * Este módulo centraliza os cálculos de folha de pagamento, integrando
 * impostos e verbas trabalhistas.
 */
import { calcularINSS as _inss, calcularIRRF as _irrf, calcularFGTS as _fgts } from '@/calculators/impostos';
import { calcularHorasExtras, calcularDSR, calcular13Salario } from '@/calculators/trabalhista';
import { FAIXAS_INSS_2026, FAIXAS_IRRF_2026, DEDUCAO_DEPENDENTE_IRRF } from '@/calculators/tabelas';

export interface CalculoResultado {
  proventos: number;
  descontos: number;
  liquido: number;
  inss: number;
  irrf: number;
  fgts: number;
  horasExtras?: number;
  dsr?: number;
  decimoTerceiro?: number;
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

  calcularHorasExtras,
  calcularDSR,
  calcular13Salario,

  processar: (
    salarioBase: number,
    params: {
      adicionais?: number;
      descontosExtras?: number;
      dependentes?: number;
      horasExtras50?: number;
      horasExtras100?: number;
      meses13?: number;
      parcela13?: 1 | 2;
      jornada?: number;
    } = {}
  ): CalculoResultado => {
    const {
      adicionais = 0,
      descontosExtras = 0,
      dependentes = 0,
      horasExtras50 = 0,
      horasExtras100 = 0,
      meses13 = 0,
      parcela13,
      jornada = 220
    } = params;

    let totalTrabalhista = 0;
    
    // Cálculo de Horas Extras
    const valorHE50 = calcularHorasExtras(salarioBase, jornada, horasExtras50, 0.5);
    const valorHE100 = calcularHorasExtras(salarioBase, jornada, horasExtras100, 1.0);
    const totalHE = valorHE50 + valorHE100;
    
    // Cálculo de DSR sobre Horas Extras (estimado 26 dias úteis / 4 domingos)
    const dsr = calcularDSR(totalHE);
    
    // Cálculo de 13º Salário se solicitado
    let decimoTerceiro = 0;
    if (parcela13) {
      decimoTerceiro = calcular13Salario(salarioBase, meses13 || 12, parcela13);
    }

    const proventos = salarioBase + adicionais + totalHE + dsr + decimoTerceiro;
    
    const { valor: inss, faixa: faixaInss } = folhaCalc.calcularINSS(proventos);
    const { valor: irrf, faixa: faixaIrrf } = folhaCalc.calcularIRRF(proventos, inss, dependentes);
    const fgts = folhaCalc.calcularFGTS(proventos);
    
    const descontos = Math.round((inss + irrf + descontosExtras) * 100) / 100;
    const liquido = Math.round((proventos - descontos) * 100) / 100;

    return { 
      proventos, 
      descontos, 
      liquido, 
      inss, 
      irrf, 
      fgts, 
      horasExtras: totalHE,
      dsr,
      decimoTerceiro,
      faixaInss, 
      faixaIrrf 
    };
  },
};
