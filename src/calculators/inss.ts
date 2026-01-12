// V17.4: Calculadora INSS 2026 - Atualizada em 12/01/2026
// Portaria Interministerial MPS/MF nº 13 de 09/01/2026
import { TABELA_INSS_2026, TETO_INSS_2026 } from "@/constants/tabelas.constants";

export interface ResultadoINSS {
  valor: number;
  aliquotaEfetiva: number;
  baseCalculo: number;
  faixasAplicadas: { faixa: number; base: number; aliquota: number; valor: number }[];
}

/**
 * Calcula INSS com base na tabela progressiva 2026
 * Faixas: 7.5% até R$ 1.621,00 | 9% até R$ 2.902,84 | 12% até R$ 4.354,27 | 14% até R$ 8.475,55
 */
export function calcularINSS(salarioBruto: number): number {
  if (salarioBruto <= 0) return 0;
  if (salarioBruto > TETO_INSS_2026) salarioBruto = TETO_INSS_2026;
  
  let inss = 0;
  let anterior = 0;
  
  for (const faixa of TABELA_INSS_2026) {
    if (salarioBruto > anterior) {
      const base = Math.min(salarioBruto, faixa.ate) - anterior;
      inss += base * (faixa.aliquota / 100);
      anterior = faixa.ate;
    }
  }
  
  return Math.round(inss * 100) / 100;
}

/**
 * Calcula INSS detalhado com breakdown por faixa
 */
export function calcularINSSDetalhado(salarioBruto: number): ResultadoINSS {
  if (salarioBruto <= 0) return { valor: 0, aliquotaEfetiva: 0, baseCalculo: 0, faixasAplicadas: [] };
  
  const baseCalculo = Math.min(salarioBruto, TETO_INSS_2026);
  let inss = 0;
  let anterior = 0;
  const faixasAplicadas: ResultadoINSS["faixasAplicadas"] = [];
  
  for (const faixa of TABELA_INSS_2026) {
    if (baseCalculo > anterior) {
      const base = Math.min(baseCalculo, faixa.ate) - anterior;
      const valorFaixa = base * (faixa.aliquota / 100);
      inss += valorFaixa;
      faixasAplicadas.push({ 
        faixa: faixa.faixa, 
        base, 
        aliquota: faixa.aliquota, 
        valor: Math.round(valorFaixa * 100) / 100 
      });
      anterior = faixa.ate;
    }
  }
  
  return {
    valor: Math.round(inss * 100) / 100,
    aliquotaEfetiva: salarioBruto > 0 ? Math.round((inss / salarioBruto) * 10000) / 100 : 0,
    baseCalculo,
    faixasAplicadas
  };
}

export function calcularAliquotaEfetivaINSS(salarioBruto: number): number {
  const inss = calcularINSS(salarioBruto);
  return salarioBruto > 0 ? Math.round((inss / salarioBruto) * 10000) / 100 : 0;
}

export function getTetoINSS(): number {
  return TETO_INSS_2026;
}

export function getTabelaINSS() {
  return TABELA_INSS_2026;
}

// Exemplos de cálculo 2026:
// R$ 1.621,00 -> R$ 121,58 (7,5%)
// R$ 2.000,00 -> R$ 155,69
// R$ 3.000,00 -> R$ 248,60
// R$ 5.000,00 -> R$ 501,51
// R$ 8.475,55 -> R$ 988,10 (máximo)
