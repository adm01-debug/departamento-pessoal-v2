// Cálculo completo de folha e salário líquido
import { calcularINSS, calcularIRRF, calcularFGTS } from './impostos';
import { calcularHorasExtras, calcularAdicionalNoturno, calcularInsalubridade, calcularPericulosidade, calcularDescontoVT, calcularPensaoAlimenticia, type GrauInsalubridade } from './beneficios';

export interface ParamsFolhaCompleta {
  salarioBase: number;
  horasExtras50?: number;
  horasExtras100?: number;
  horasNoturnas?: number;
  adicionalNoturnoPerc?: number;
  insalubridade?: GrauInsalubridade | null;
  periculosidade?: boolean;
  dependentes?: number;
  valeTransporte?: number;
  pensaoPercentual?: number;
  outrosDescontos?: number;
  outrosProventos?: number;
}

export function calcularFolhaCompleta(params: ParamsFolhaCompleta) {
  const {
    salarioBase, horasExtras50 = 0, horasExtras100 = 0,
    horasNoturnas = 0, adicionalNoturnoPerc = 20,
    insalubridade = null, periculosidade = false,
    dependentes = 0, valeTransporte = 0,
    pensaoPercentual = 0, outrosDescontos = 0, outrosProventos = 0,
  } = params;

  const he = calcularHorasExtras(salarioBase, horasExtras50, horasExtras100);
  const adNoturno = horasNoturnas > 0 ? calcularAdicionalNoturno(salarioBase, horasNoturnas, adicionalNoturnoPerc) : 0;
  const adInsalubridade = insalubridade ? calcularInsalubridade(insalubridade) : 0;
  const adPericulosidade = periculosidade ? calcularPericulosidade(salarioBase) : 0;

  const totalProventos = Math.round((salarioBase + he.total + adNoturno + adInsalubridade + adPericulosidade + outrosProventos) * 100) / 100;

  const inss = calcularINSS(totalProventos);
  const irrf = calcularIRRF(totalProventos, dependentes);
  const fgts = calcularFGTS(totalProventos);
  const descontoVT = valeTransporte > 0 ? calcularDescontoVT(salarioBase, valeTransporte) : 0;

  const salarioAposDescontosBase = totalProventos - inss - irrf - descontoVT - outrosDescontos;
  const pensao = pensaoPercentual > 0 ? calcularPensaoAlimenticia(salarioAposDescontosBase, pensaoPercentual) : 0;

  const totalDescontos = Math.round((inss + irrf + descontoVT + pensao + outrosDescontos) * 100) / 100;
  const salarioLiquido = Math.round((totalProventos - totalDescontos) * 100) / 100;

  return {
    proventos: {
      salarioBase, horasExtras: he.total, adicionalNoturno: adNoturno,
      insalubridade: adInsalubridade, periculosidade: adPericulosidade,
      outrosProventos, totalProventos,
    },
    descontos: { inss, irrf, valeTransporte: descontoVT, pensao, outrosDescontos, totalDescontos },
    fgts, salarioLiquido,
  };
}

export function calcularSalarioLiquido(params: {
  salarioBruto: number;
  dependentes?: number;
  outrasDeducoes?: number;
  valeTransporte?: number;
}) {
  const { salarioBruto, dependentes = 0, outrasDeducoes = 0, valeTransporte = 0 } = params;
  const inss = calcularINSS(salarioBruto);
  const irrf = calcularIRRF(salarioBruto, dependentes, outrasDeducoes);
  const fgts = calcularFGTS(salarioBruto);
  const descontoVT = valeTransporte > 0 ? calcularDescontoVT(salarioBruto, valeTransporte) : 0;
  const totalDescontos = inss + irrf + descontoVT;
  const liquido = Math.round((salarioBruto - totalDescontos) * 100) / 100;
  return { salarioBruto, inss, irrf, fgts, descontoVT, totalDescontos: Math.round(totalDescontos * 100) / 100, liquido };
}
