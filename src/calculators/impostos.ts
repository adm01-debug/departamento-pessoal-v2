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

  // Cálculo por faixas progressivas (Simulando 2026)
  let impostoTotal = 0;
  for (let i = 0; i < FAIXAS_IRRF_2026.length; i++) {
    const faixa = FAIXAS_IRRF_2026[i];
    const limiteAnterior = i === 0 ? 0 : FAIXAS_IRRF_2026[i - 1].limite;
    const baseNaFaixa = Math.min(Math.max(0, baseCalculo - limiteAnterior), (faixa.limite || Infinity) - limiteAnterior);
    
    if (baseNaFaixa <= 0) break;
    impostoTotal += baseNaFaixa * faixa.aliquota;
  }
  
  return Math.max(0, Math.round(impostoTotal * 100) / 100);
}

export function calcularFGTS(salarioBruto: number): number {
  return Math.round(salarioBruto * ALIQUOTA_FGTS * 100) / 100;
}
