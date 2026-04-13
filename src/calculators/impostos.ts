// Cálculos base: INSS, IRRF, FGTS
import { FAIXAS_INSS_2026, FAIXAS_IRRF_2026, DEDUCAO_DEPENDENTE_IRRF, ALIQUOTA_FGTS } from './tabelas';

export function calcularINSS(salarioBruto: number): number {
  let descontoTotal = 0;
  let baseRestante = salarioBruto;
  for (let i = 0; i < FAIXAS_INSS_2026.length; i++) {
    const faixa = FAIXAS_INSS_2026[i];
    const limiteAnterior = i === 0 ? 0 : FAIXAS_INSS_2026[i - 1].limite;
    const faixaCalculo = Math.min(baseRestante, faixa.limite - limiteAnterior);
    if (faixaCalculo <= 0) break;
    descontoTotal += faixaCalculo * faixa.aliquota;
    baseRestante -= faixaCalculo;
  }
  return Math.round(descontoTotal * 100) / 100;
}

export function calcularIRRF(salarioBruto: number, dependentes: number = 0, outrasDeducoes: number = 0): number {
  const descontoINSS = calcularINSS(salarioBruto);
  const baseCalculo = salarioBruto - descontoINSS - (dependentes * DEDUCAO_DEPENDENTE_IRRF) - outrasDeducoes;
  if (baseCalculo <= 0) return 0;
  for (const faixa of FAIXAS_IRRF_2026) {
    if (baseCalculo <= faixa.limite) {
      const imposto = baseCalculo * faixa.aliquota - faixa.deducao;
      return Math.max(0, Math.round(imposto * 100) / 100);
    }
  }
  return 0;
}

export function calcularFGTS(salarioBruto: number): number {
  return Math.round(salarioBruto * ALIQUOTA_FGTS * 100) / 100;
}
