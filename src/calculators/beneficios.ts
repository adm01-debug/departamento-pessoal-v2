// Cálculos de benefícios e adicionais
import { SALARIO_MINIMO_2026 } from './tabelas';
import { calcularINSS, calcularIRRF } from './impostos';

export interface ParamsDecimo13 {
  salarioBase: number;
  mesesTrabalhados: number;
  mediasVariaveis?: number;
}

export function calcularDecimo13Proporcional(params: ParamsDecimo13): { bruto: number; inss: number; irrf: number; liquido: number } {
  const { salarioBase, mesesTrabalhados, mediasVariaveis = 0 } = params;
  const meses = Math.min(12, Math.max(0, mesesTrabalhados));
  const bruto = Math.round(((salarioBase + mediasVariaveis) / 12) * meses * 100) / 100;
  const inss = calcularINSS(bruto);
  const irrf = calcularIRRF(bruto);
  const liquido = Math.round((bruto - inss - irrf) * 100) / 100;
  return { bruto, inss, irrf, liquido };
}

export function calcularFerias(salarioBase: number, diasFerias: number = 30, diasAbono: number = 0) {
  const valorDiario = salarioBase / 30;
  const valorFerias = valorDiario * diasFerias;
  const tercoConstitucional = valorFerias / 3;
  const valorAbono = valorDiario * diasAbono;
  const tercoAbono = valorAbono / 3;
  const bruto = valorFerias + tercoConstitucional + valorAbono + tercoAbono;
  const inss = calcularINSS(bruto);
  const irrf = calcularIRRF(bruto);
  const liquido = Math.round((bruto - inss - irrf) * 100) / 100;
  return {
    valorFerias: Math.round(valorFerias * 100) / 100,
    tercoConstitucional: Math.round(tercoConstitucional * 100) / 100,
    valorAbono: Math.round(valorAbono * 100) / 100,
    tercoAbono: Math.round(tercoAbono * 100) / 100,
    bruto: Math.round(bruto * 100) / 100,
    inss, irrf, liquido,
  };
}

export function calcularHorasExtras(salarioBase: number, horasExtras50: number = 0, horasExtras100: number = 0) {
  const valorHora = salarioBase / 220;
  const valor50 = Math.round(valorHora * 1.5 * horasExtras50 * 100) / 100;
  const valor100 = Math.round(valorHora * 2.0 * horasExtras100 * 100) / 100;
  return { valor50, valor100, total: Math.round((valor50 + valor100) * 100) / 100 };
}

export function calcularDSR(totalVariaveis: number, diasUteis: number, domingosEFeriados: number): number {
  if (diasUteis <= 0) return 0;
  return Math.round((totalVariaveis / diasUteis) * domingosEFeriados * 100) / 100;
}

export function calcularAdicionalNoturno(salarioBase: number, horasNoturnas: number, percentual: number = 20): number {
  const valorHora = salarioBase / 220;
  return Math.round(valorHora * (percentual / 100) * horasNoturnas * 100) / 100;
}

export function calcularPericulosidade(salarioBase: number): number {
  return Math.round(salarioBase * 0.30 * 100) / 100;
}

export type GrauInsalubridade = 'minimo' | 'medio' | 'maximo';
export function calcularInsalubridade(grau: GrauInsalubridade): number {
  const percentuais = { minimo: 0.10, medio: 0.20, maximo: 0.40 };
  return Math.round(SALARIO_MINIMO_2026 * percentuais[grau] * 100) / 100;
}

export function calcularDescontoVT(salarioBase: number, valorVT: number): number {
  const limiteDesconto = salarioBase * 0.06;
  return Math.round(Math.min(valorVT, limiteDesconto) * 100) / 100;
}

export function calcularPensaoAlimenticia(salarioLiquido: number, percentual: number): number {
  return Math.round(salarioLiquido * (percentual / 100) * 100) / 100;
}

export function calcularSobreaviso(salarioBase: number, horas: number): number {
  const valorHora = salarioBase / 220;
  return Math.round(valorHora * (1 / 3) * horas * 100) / 100;
}

export function calcularProntidao(salarioBase: number, horas: number): number {
  const valorHora = salarioBase / 220;
  return Math.round(valorHora * (2 / 3) * horas * 100) / 100;
}

export function calcularGratificacao(salarioBase: number, percentual: number): number {
  return Math.round(salarioBase * (percentual / 100) * 100) / 100;
}

export function calcularComissao(valorVendas: number, percentualComissao: number): number {
  return Math.round(valorVendas * (percentualComissao / 100) * 100) / 100;
}

export function calcularAdicionalTransferencia(salarioBase: number, percentual: number = 25): number {
  return Math.round(salarioBase * (percentual / 100) * 100) / 100;
}

export function calcularSalarioFamilia(salarioBruto: number, dependentes: number): number {
  if (salarioBruto > 1819.26) return 0;
  const valorPorDependente = salarioBruto <= 1212.64 ? 62.04 : 43.73;
  return Math.round(valorPorDependente * dependentes * 100) / 100;
}

export function calcularSalarioMaternidade(salarioBase: number, diasLicenca: number = 120): number {
  return Math.round((salarioBase / 30) * diasLicenca * 100) / 100;
}

export function calcularAuxilioDoenca(ultimosSalarios: number[]): number {
  if (ultimosSalarios.length === 0) return 0;
  const media = ultimosSalarios.reduce((a, b) => a + b, 0) / ultimosSalarios.length;
  const beneficio = media * 0.91;
  return Math.round(Math.max(SALARIO_MINIMO_2026, beneficio) * 100) / 100;
}

export function calcularDiarias(valorDiaria: number, dias: number, percentualDesconto: number = 0) {
  const total = Math.round(valorDiaria * dias * 100) / 100;
  const desconto = Math.round(total * (percentualDesconto / 100) * 100) / 100;
  return { total, desconto, liquido: Math.round((total - desconto) * 100) / 100 };
}

export function calcularQuilometragem(km: number, valorPorKm: number = 1.20): number {
  return Math.round(km * valorPorKm * 100) / 100;
}

export function calcularBancoHoras(creditos: string[], debitos: string[]) {
  const parseMinutos = (h: string) => {
    const [hh, mm] = h.split(':').map(Number);
    return (hh || 0) * 60 + (mm || 0);
  };
  const totalCreditos = creditos.reduce((a, c) => a + parseMinutos(c), 0);
  const totalDebitos = debitos.reduce((a, d) => a + parseMinutos(d), 0);
  const saldo = totalCreditos - totalDebitos;
  const horas = Math.floor(Math.abs(saldo) / 60);
  const minutos = Math.abs(saldo) % 60;
  const saldoFormatado = `${saldo < 0 ? '-' : ''}${horas}:${minutos.toString().padStart(2, '0')}`;
  return { totalCreditos, totalDebitos, saldo, saldoFormatado };
}

export function calcularMedias(valoresMensais: number[]) {
  if (valoresMensais.length === 0) return { media: 0, meses: 0, total: 0 };
  const total = Math.round(valoresMensais.reduce((a, b) => a + b, 0) * 100) / 100;
  const media = Math.round((total / valoresMensais.length) * 100) / 100;
  return { media, meses: valoresMensais.length, total };
}
