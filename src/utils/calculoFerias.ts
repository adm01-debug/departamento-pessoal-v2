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
    // Validação de Abono Pecuniário (Máximo 10 dias ou 1/3 do direito total)
    // Se o usuário tem 30 dias de direito, ele pode gozar 20 e vender 10.
    const diasAbonoEfetivo = Math.min(diasAbono, 10);
    
    const valorDia = salarioBase / 30;
    const vf = Math.round(valorDia * diasFerias * 100) / 100;
    const tc = Math.round(vf / 3 * 100) / 100;
    const va = Math.round(valorDia * diasAbonoEfetivo * 100) / 100;
    const ta = Math.round(va / 3 * 100) / 100;

    
    const bruto = vf + tc + va + ta;
    
    const inss = calcularINSS(bruto);
    const baseIRRF = bruto - inss - (dependentesIrrf * 189.59);
    const irrf = calcularIRRF(baseIRRF);
    
    const liquido = Math.round((bruto - inss - irrf) * 100) / 100;

    return {
      valorFerias: vf,
      tercoConstitucional: tc,
      valorAbono: va,
      tercoAbono: ta,
      bruto: Math.round(bruto * 100) / 100,
      inss,
      irrf,
      liquido
    };
  }
};

function calcularINSS(salario: number): number {
  const faixas = [
    { limite: 1518.00, aliquota: 0.075 },
    { limite: 2793.88, aliquota: 0.09 },
    { limite: 5563.80, aliquota: 0.12 },
    { limite: 7786.93, aliquota: 0.14 }
  ];

  let desconto = 0;
  let restante = salario;
  let limiteAnterior = 0;

  for (const faixa of faixas) {
    const base = Math.min(restante, faixa.limite - limiteAnterior);
    if (base <= 0) break;
    desconto += base * faixa.aliquota;
    restante -= base;
    limiteAnterior = faixa.limite;
  }

  return Math.round(desconto * 100) / 100;
}

function calcularIRRF(base: number): number {
  const faixas = [
    { limite: 2259.20, aliquota: 0, deducao: 0 },
    { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
  ];

  if (base <= 0) return 0;

  for (const faixa of faixas) {
    if (base <= faixa.limite) {
      return Math.max(0, Math.round((base * faixa.aliquota - faixa.deducao) * 100) / 100);
    }
  }

  return 0;
}
