// V17.4: Calculadora Salário Família 2026 - Atualizada em 12/01/2026
// Portaria Interministerial MPS/MF nº 13 de 09/01/2026
import { LIMITE_SALARIO_FAMILIA_2026, VALOR_COTA_SALARIO_FAMILIA_2026 } from "@/constants/tabelas.constants";

export interface ResultadoSalarioFamilia {
  valor: number;
  cotas: number;
  valorCota: number;
  temDireito: boolean;
  limiteRenda: number;
}

/**
 * Calcula Salário Família 2026
 * Limite: R$ 1.980,38 | Cota: R$ 67,54 por dependente
 */
export function calcularSalarioFamilia(salarioBruto: number, dependentesAte14Anos: number): number {
  if (salarioBruto > LIMITE_SALARIO_FAMILIA_2026) return 0;
  if (dependentesAte14Anos <= 0) return 0;
  
  return Math.round(dependentesAte14Anos * VALOR_COTA_SALARIO_FAMILIA_2026 * 100) / 100;
}

/**
 * Calcula Salário Família detalhado
 */
export function calcularSalarioFamiliaDetalhado(
  salarioBruto: number, 
  dependentesAte14Anos: number
): ResultadoSalarioFamilia {
  const temDireito = salarioBruto <= LIMITE_SALARIO_FAMILIA_2026 && dependentesAte14Anos > 0;
  
  return {
    valor: temDireito ? Math.round(dependentesAte14Anos * VALOR_COTA_SALARIO_FAMILIA_2026 * 100) / 100 : 0,
    cotas: temDireito ? dependentesAte14Anos : 0,
    valorCota: VALOR_COTA_SALARIO_FAMILIA_2026,
    temDireito,
    limiteRenda: LIMITE_SALARIO_FAMILIA_2026
  };
}

export function getLimiteSalarioFamilia(): number {
  return LIMITE_SALARIO_FAMILIA_2026;
}

export function getValorCotaSalarioFamilia(): number {
  return VALOR_COTA_SALARIO_FAMILIA_2026;
}

// Regras 2026:
// - Limite de renda: R$ 1.980,38/mês
// - Valor da cota: R$ 67,54 por filho de até 14 anos
// - Pago proporcional aos dias trabalhados
