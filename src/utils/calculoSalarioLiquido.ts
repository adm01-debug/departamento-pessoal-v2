export const calcularSalarioLiquido = (salarioBruto: number, inss: number, irrf: number, outrosDescontos: number = 0): number => { return salarioBruto - inss - irrf - outrosDescontos; };
