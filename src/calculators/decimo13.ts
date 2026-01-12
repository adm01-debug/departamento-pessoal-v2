// V17-C001: Calculadora de 13º Salário
import { calcularINSS } from './inss';
import { calcularIRRF } from './irrf';

export interface Params13 {
  salarioBase: number;
  mesesTrabalhados: number;
  mediasVariaveis?: number;
  faltas?: number;
  dependentesIR?: number;
}

export interface Result13 {
  bruto: number;
  inss: number;
  irrf: number;
  liquido: number;
  primeiraParcela: number;
  segundaParcela: number;
}

export function calcular13Proporcional(params: Params13): Result13 {
  const { salarioBase, mesesTrabalhados, mediasVariaveis = 0, faltas = 0, dependentesIR = 0 } = params;
  const mesesEfetivos = Math.max(0, Math.min(12, mesesTrabalhados - Math.floor(faltas / 15)));
  const base = salarioBase + mediasVariaveis;
  const bruto = Math.round((base / 12) * mesesEfetivos * 100) / 100;
  const inss = calcularINSS(bruto);
  const baseIRRF = bruto - inss;
  const irrf = calcularIRRF(baseIRRF, dependentesIR);
  const liquido = Math.round((bruto - inss - irrf) * 100) / 100;
  const primeiraParcela = Math.round((bruto / 2) * 100) / 100;
  const segundaParcela = Math.round((bruto - primeiraParcela - inss - irrf) * 100) / 100;
  return { bruto, inss, irrf, liquido, primeiraParcela, segundaParcela };
}

export function calcular13Integral(salario: number, dependentesIR: number = 0): Result13 {
  return calcular13Proporcional({ salarioBase: salario, mesesTrabalhados: 12, dependentesIR });
}
