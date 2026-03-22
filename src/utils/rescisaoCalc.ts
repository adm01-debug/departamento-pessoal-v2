// Tabela INSS 2026
export function calcINSS(salario: number): number {
  const faixas = [
    { teto: 1518.00, aliq: 0.075 },
    { teto: 2793.88, aliq: 0.09 },
    { teto: 4190.83, aliq: 0.12 },
    { teto: 8157.41, aliq: 0.14 },
  ];
  let desc = 0, anterior = 0;
  for (const f of faixas) {
    const base = Math.min(salario, f.teto) - anterior;
    if (base <= 0) break;
    desc += base * f.aliq;
    anterior = f.teto;
  }
  return desc;
}

// IRRF 2026
export function calcIRRF(base: number): number {
  if (base <= 2259.20) return 0;
  if (base <= 2826.65) return base * 0.075 - 169.44;
  if (base <= 3751.05) return base * 0.15 - 381.44;
  if (base <= 4664.68) return base * 0.225 - 662.77;
  return base * 0.275 - 896.00;
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
}

export interface RescisaoParams {
  salario: number;
  dataAdmissao: string;
  dataDesligamento: string;
  tipo: string;
  avisoTrabalhado: boolean;
  feriasVencidas: boolean;
  saldoFGTS: number;
}

export function calcularRescisao(params: RescisaoParams): RescisaoResult {
  const { salario, dataAdmissao, dataDesligamento, tipo, avisoTrabalhado, feriasVencidas, saldoFGTS } = params;
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);

  const diasNoMes = new Date(desligamento.getFullYear(), desligamento.getMonth() + 1, 0).getDate();
  const diasTrabalhados = desligamento.getDate();
  const saldoSalario = (salario / diasNoMes) * diasTrabalhados;

  const anosTrabalho = Math.floor((desligamento.getTime() - admissao.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const diasAviso = Math.min(90, 30 + anosTrabalho * 3);
  const avisoIndenizado = (tipo === 'sem_justa_causa' && !avisoTrabalhado) ? (salario / 30) * diasAviso : 0;

  const ultimoAniversario = new Date(admissao);
  ultimoAniversario.setFullYear(desligamento.getFullYear());
  if (ultimoAniversario > desligamento) ultimoAniversario.setFullYear(ultimoAniversario.getFullYear() - 1);
  const mesesDesdeAniversario = Math.ceil((desligamento.getTime() - ultimoAniversario.getTime()) / (30 * 24 * 60 * 60 * 1000));
  const mesesFerias = Math.min(12, Math.max(0, mesesDesdeAniversario));
  const feriasProporcionaisVal = tipo !== 'justa_causa' ? (salario / 12) * mesesFerias : 0;
  const feriasVencidasVal = feriasVencidas && tipo !== 'justa_causa' ? salario : 0;
  const tercoFerias = (feriasProporcionaisVal + feriasVencidasVal) / 3;

  const meses13 = desligamento.getMonth() + 1;
  const decimoTerceiro = tipo !== 'justa_causa' ? (salario / 12) * meses13 : 0;

  const fgtsRescisao = (saldoSalario + avisoIndenizado) * 0.08;
  const multaFGTS = tipo === 'sem_justa_causa' ? (saldoFGTS + fgtsRescisao) * 0.40 : 0;

  const totalProventos = saldoSalario + avisoIndenizado + feriasVencidasVal + feriasProporcionaisVal + tercoFerias + decimoTerceiro;
  const inss = calcINSS(saldoSalario);
  const baseIRRF = saldoSalario - inss;
  const irrf = calcIRRF(baseIRRF);
  const totalDescontos = inss + irrf;
  const totalLiquido = totalProventos - totalDescontos + multaFGTS;

  return {
    saldoSalario, avisoIndenizado, feriasVencidas: feriasVencidasVal, feriasProporcionais: feriasProporcionaisVal,
    tercoFerias, decimoTerceiro, multaFGTS, fgtsRescisao, totalProventos, inss, irrf, totalDescontos, totalLiquido,
    diasTrabalhados, mesesFerias, meses13, diasAviso,
  };
}

export function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
