// @ts-nocheck
export interface CalculoFolha { salarioBruto: number; inss: number; irrf: number; outrosDescontos: number; salarioLiquido: number; fgts: number; }
export function calcularFolhaCompleta(salarioBruto: number, dependentes: number = 0, outrosDescontos: number = 0): CalculoFolha {
  const inss = salarioBruto * 0.11;
  const baseIRRF = salarioBruto - inss;
  const irrf = baseIRRF > 2259.20 ? baseIRRF * 0.075 - 169.44 : 0;
  const salarioLiquido = salarioBruto - inss - Math.max(0, irrf) - outrosDescontos;
  const fgts = salarioBruto * 0.08;
  return { salarioBruto, inss, irrf: Math.max(0, irrf), outrosDescontos, salarioLiquido, fgts };
}
export function calcularHorasExtras(salarioHora: number, horas: number, percentual: number): number { return salarioHora * horas * (1 + percentual / 100); }
export function calcularAdicionalNoturno(salarioHora: number, horasNoturnas: number): number { return salarioHora * horasNoturnas * 0.2; }
export function calcularDSR(salarioBase: number, diasUteis: number, domingos: number): number { return (salarioBase / diasUteis) * domingos; }
