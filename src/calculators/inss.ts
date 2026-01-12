// V17.3: Calculadora INSS 2025 - Atualizada
import { TABELA_INSS_2025, TETO_INSS_2025 } from "@/constants/tabelas.constants";

export interface ResultadoINSS {
  valor: number;
  aliquotaEfetiva: number;
  baseCalculo: number;
  faixasAplicadas: { faixa: number; base: number; aliquota: number; valor: number }[];
}

export function calcularINSS(salarioBruto: number): number {
  if (salarioBruto <= 0) return 0;
  if (salarioBruto > TETO_INSS_2025) salarioBruto = TETO_INSS_2025;
  
  let inss = 0;
  let anterior = 0;
  
  for (const faixa of TABELA_INSS_2025) {
    if (salarioBruto > anterior) {
      const base = Math.min(salarioBruto, faixa.ate) - anterior;
      inss += base * (faixa.aliquota / 100);
      anterior = faixa.ate;
    }
  }
  
  return Math.round(inss * 100) / 100;
}

export function calcularINSSDetalhado(salarioBruto: number): ResultadoINSS {
  if (salarioBruto <= 0) return { valor: 0, aliquotaEfetiva: 0, baseCalculo: 0, faixasAplicadas: [] };
  
  const baseCalculo = Math.min(salarioBruto, TETO_INSS_2025);
  let inss = 0;
  let anterior = 0;
  const faixasAplicadas: ResultadoINSS["faixasAplicadas"] = [];
  
  for (const faixa of TABELA_INSS_2025) {
    if (baseCalculo > anterior) {
      const base = Math.min(baseCalculo, faixa.ate) - anterior;
      const valorFaixa = base * (faixa.aliquota / 100);
      inss += valorFaixa;
      faixasAplicadas.push({ faixa: faixa.faixa, base, aliquota: faixa.aliquota, valor: Math.round(valorFaixa * 100) / 100 });
      anterior = faixa.ate;
    }
  }
  
  return {
    valor: Math.round(inss * 100) / 100,
    aliquotaEfetiva: Math.round((inss / salarioBruto) * 10000) / 100,
    baseCalculo,
    faixasAplicadas
  };
}

export function calcularAliquotaEfetivaINSS(salarioBruto: number): number {
  const inss = calcularINSS(salarioBruto);
  return Math.round((inss / salarioBruto) * 10000) / 100;
}

export function getTetoINSS(): number {
  return TETO_INSS_2025;
}

export function getTabelaINSS() {
  return TABELA_INSS_2025;
}
