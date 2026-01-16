// V18-FIX-001: Calculadora de Adicional de Insalubridade - ATUALIZADO 2026
// Atualizado em 16/01/2026 - Salário Mínimo 2026: R$ 1.621,00
import { SALARIO_MINIMO_2026 } from "@/constants/tabelas.constants";

export type GrauInsalubridade = "minimo" | "medio" | "maximo";

export const PERCENTUAIS_INSALUBRIDADE = {
  minimo: 10,
  medio: 20,
  maximo: 40,
};

export interface ParamsInsalubridade {
  grau: GrauInsalubridade;
  baseCalculo?: number;
}

export interface ResultadoInsalubridade {
  valor: number;
  percentual: number;
  grau: GrauInsalubridade;
  baseCalculo: number;
}

/**
 * Calcula Adicional de Insalubridade
 * Base: Salário Mínimo 2026 = R$ 1.621,00
 * Grau Mínimo: 10% = R$ 162,10
 * Grau Médio: 20% = R$ 324,20
 * Grau Máximo: 40% = R$ 648,40
 */
export function calcularInsalubridade(params: ParamsInsalubridade): number {
  const { grau, baseCalculo = SALARIO_MINIMO_2026 } = params;
  const percentual = PERCENTUAIS_INSALUBRIDADE[grau];
  return Math.round(baseCalculo * (percentual / 100) * 100) / 100;
}

/**
 * Calcula Adicional de Insalubridade com detalhamento
 */
export function calcularInsalubridadeDetalhado(
  params: ParamsInsalubridade
): ResultadoInsalubridade {
  const { grau, baseCalculo = SALARIO_MINIMO_2026 } = params;
  const percentual = PERCENTUAIS_INSALUBRIDADE[grau];
  const valor = Math.round(baseCalculo * (percentual / 100) * 100) / 100;

  return {
    valor,
    percentual,
    grau,
    baseCalculo,
  };
}

/**
 * Retorna o valor do salário mínimo atual (base para insalubridade)
 */
export function getSalarioMinimoBase(): number {
  return SALARIO_MINIMO_2026;
}

/**
 * Retorna tabela de valores por grau
 */
export function getTabelaInsalubridade(): Record<GrauInsalubridade, number> {
  return {
    minimo: calcularInsalubridade({ grau: "minimo" }),
    medio: calcularInsalubridade({ grau: "medio" }),
    maximo: calcularInsalubridade({ grau: "maximo" }),
  };
}

// Valores 2026:
// Grau Mínimo (10%): R$ 162,10
// Grau Médio (20%): R$ 324,20
// Grau Máximo (40%): R$ 648,40
