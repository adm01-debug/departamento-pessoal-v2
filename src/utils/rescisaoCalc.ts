/**
 * Tabelas e Cálculos de Rescisão - Conformidade CLT 2026
 * Implementa cálculos de verbas rescisórias, descontos legais (INSS/IRRF) e multas.
 * Baseado na Lei 12.506/2011 (Aviso Prévio Proporcional) e Artigos 477 a 486 da CLT.
 */

// Tabela INSS 2026 (Progressiva - Portaria Interministerial MPS/MF nº 2/2024)
export function calcINSS(salario: number): number {
  const faixas = [
    { teto: 1518.00, aliq: 0.075, deducao: 0 },
    { teto: 2793.88, aliq: 0.09, deducao: 22.77 },
    { teto: 4190.83, aliq: 0.12, deducao: 106.59 },
    { teto: 8157.41, aliq: 0.14, deducao: 190.41 },
  ];

  let desc = 0;
  if (salario <= faixas[0].teto) {
    desc = salario * faixas[0].aliq;
  } else if (salario <= faixas[1].teto) {
    desc = (salario * faixas[1].aliq) - faixas[1].deducao;
  } else if (salario <= faixas[2].teto) {
    desc = (salario * faixas[2].aliq) - faixas[2].deducao;
  } else if (salario <= faixas[3].teto) {
    desc = (salario * faixas[3].aliq) - faixas[3].deducao;
  } else {
    desc = 951.62; // Teto máximo INSS 2026
  }
  return Number(desc.toFixed(2));
}

// IRRF 2026 (Base Mensal - IN RFB nº 2110/2022 atualizada)
export function calcIRRF(base: number, dependentes: number = 0): number {
  const deducaoDependente = dependentes * 189.59;
  const baseCalculo = Math.max(0, base - deducaoDependente);

  if (baseCalculo <= 2259.20) return 0;
  if (baseCalculo <= 2826.65) return Number(((baseCalculo * 0.075) - 169.44).toFixed(2));
  if (baseCalculo <= 3751.05) return Number(((baseCalculo * 0.15) - 381.44).toFixed(2));
  if (baseCalculo <= 4664.68) return Number(((baseCalculo * 0.225) - 662.77).toFixed(2));
  return Number(((baseCalculo * 0.275) - 896.00).toFixed(2));
}

export interface RescisaoResult {
  saldoSalario: number;
  avisoIndenizado: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoFerias: number;
  decimoTerceiro: number;
  multaFGTS: number;
  fgtsRescisao: number;
  totalProventos: number;
  inss: number;
  irrf: number;
  totalDescontos: number;
  totalLiquido: number;
  diasTrabalhados: number;
  mesesFerias: number;
  meses13: number;
  diasAviso: number;
  detalhes?: string;
}

export interface RescisaoParams {
  salario: number;
  dataAdmissao: string;
  dataDesligamento: string;
  tipo: string;
  avisoTrabalhado: boolean;
  feriasVencidas: boolean;
  saldoFGTS: number;
  dependentes?: number;
}

/**
 * Motor de Cálculo CLT
 */
export function calcularRescisao(params: RescisaoParams): RescisaoResult {
  const { salario, dataAdmissao, dataDesligamento, tipo, avisoTrabalhado, feriasVencidas, saldoFGTS, dependentes = 0 } = params;
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);

  // 1. Saldo de Salário (Art. 4º CLT)
  const ultimoDiaMes = new Date(desligamento.getFullYear(), desligamento.getMonth() + 1, 0).getDate();
  const diasTrabalhados = desligamento.getDate();
  const saldoSalario = Number(((salario / 30) * diasTrabalhados).toFixed(2));

  // 2. Aviso Prévio (Lei 12.506/2011)
  const diffTime = Math.abs(desligamento.getTime() - admissao.getTime());
  const anosCompletos = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  const diasAviso = Math.min(90, 30 + (anosCompletos * 3));
  
  let avisoIndenizado = 0;
  if (tipo === 'sem_justa_causa' && !avisoTrabalhado) {
    avisoIndenizado = Number(((salario / 30) * diasAviso).toFixed(2));
  } else if (tipo === 'acordo_mutuo' && !avisoTrabalhado) {
    avisoIndenizado = Number(((salario / 30) * (diasAviso / 2)).toFixed(2));
  }

  // 3. Férias (Art. 146 CLT)
  const calcularAvosFerias = () => {
    let meses = (desligamento.getFullYear() - admissao.getFullYear()) * 12;
    meses += desligamento.getMonth() - admissao.getMonth();
    const diaAdmissao = admissao.getDate();
    const diaDesligamento = desligamento.getDate();
    
    let avos = meses % 12;
    const diasIncompleto = diaDesligamento >= diaAdmissao 
      ? diaDesligamento - diaAdmissao 
      : (new Date(desligamento.getFullYear(), desligamento.getMonth(), 0).getDate() - diaAdmissao) + diaDesligamento;

    return diasIncompleto >= 15 ? avos + 1 : avos;
  };
  
  const mesesFerias = calcularAvosFerias();
  let feriasProporcionaisVal = 0;
  if (tipo !== 'justa_causa') {
    feriasProporcionaisVal = Number(((salario / 12) * mesesFerias).toFixed(2));
  }
  
  const feriasVencidasVal = feriasVencidas && tipo !== 'justa_causa' ? salario : 0;
  const tercoFerias = Number(((feriasProporcionaisVal + feriasVencidasVal) / 3).toFixed(2));

  // 4. 13º Salário (Lei 4.090/62)
  const meses13 = desligamento.getDate() >= 15 ? desligamento.getMonth() + 1 : desligamento.getMonth();
  let decimoTerceiro = 0;
  if (tipo !== 'justa_causa' && tipo !== 'culpa_reciproca') {
    decimoTerceiro = Number(((salario / 12) * meses13).toFixed(2));
  } else if (tipo === 'culpa_reciproca') {
    decimoTerceiro = Number(((salario / 12) * meses13 / 2).toFixed(2));
  }

  // 5. FGTS e Multa (Art. 18 Lei 8.036/90)
  const fgtsRescisao = Number(((saldoSalario + avisoIndenizado + decimoTerceiro) * 0.08).toFixed(2));
  let multaFGTS = 0;
  if (tipo === 'sem_justa_causa') {
    multaFGTS = Number(((saldoFGTS + fgtsRescisao) * 0.40).toFixed(2));
  } else if (tipo === 'acordo_mutuo') {
    multaFGTS = Number(((saldoFGTS + fgtsRescisao) * 0.20).toFixed(2));
  }

  // 6. Totais e Descontos
  const totalProventos = Number((saldoSalario + avisoIndenizado + feriasVencidasVal + feriasProporcionaisVal + tercoFerias + decimoTerceiro).toFixed(2));
  
  // INSS incide sobre Saldo Salário e 13º
  const inss = calcINSS(saldoSalario) + calcINSS(decimoTerceiro);
  
  // IRRF incide sobre verbas salariais (Saldo Salário + 13º) descontado INSS
  const baseIRRF = (saldoSalario + decimoTerceiro) - inss;
  const irrf = calcIRRF(baseIRRF, dependentes);
  
  const totalDescontos = Number((inss + irrf).toFixed(2));
  const totalLiquido = Number((totalProventos - totalDescontos + multaFGTS).toFixed(2));

  return {
    saldoSalario, 
    avisoIndenizado, 
    feriasVencidas: feriasVencidasVal, 
    feriasProporcionais: feriasProporcionaisVal,
    tercoFerias, 
    decimoTerceiro, 
    multaFGTS, 
    fgtsRescisao, 
    totalProventos, 
    inss, 
    irrf, 
    totalDescontos, 
    totalLiquido,
    diasTrabalhados, 
    mesesFerias, 
    meses13, 
    diasAviso,
  };
}

export function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
