import { calcularFerias as coreCalcularFerias } from '@/calculators/beneficios';

export interface CalculoFeriasParams {
  salarioBase: number;
  diasFerias: number;
  diasAbono?: number;
  dependentesIrrf?: number;
}

export interface CalculoFeriasResult {
  valorFerias: number;
  tercoConstitucional: number;
  valorAbono: number;
  tercoAbono: number;
  bruto: number;
  inss: number;
  irrf: number;
  liquido: number;
}

export const calculoFerias = {
  calcular: ({
    salarioBase,
    diasFerias,
    diasAbono = 0,
    dependentesIrrf = 0
  }: CalculoFeriasParams): CalculoFeriasResult => {
    // Abono pecuniário no máximo 10 dias
    const diasAbonoEfetivo = Math.min(diasAbono, 10);
    return coreCalcularFerias(salarioBase, diasFerias, diasAbonoEfetivo, dependentesIrrf) as CalculoFeriasResult;
  }
};

