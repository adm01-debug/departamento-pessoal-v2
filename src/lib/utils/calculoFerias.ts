export interface DadosFerias { salarioBase: number; diasFerias: number; diasAbono?: number; mediaHE?: number; mediaAdicional?: number; dependentes?: number; faltas?: number; }
export interface ResultadoFerias { salarioBase: number; diasFerias: number; valorFerias: number; tercoConstitucional: number; abonoPecuniario: number; tercoAbono: number; mediaHE: number; mediaAdicional: number; totalBruto: number; inss: number; irrf: number; totalLiquido: number; }

const TABELA_INSS = [{limite:1412,aliq:0.075},{limite:2666.68,aliq:0.09},{limite:4000.03,aliq:0.12},{limite:7786.02,aliq:0.14}];
const TABELA_IRRF = [{limite:2259.20,aliq:0,ded:0},{limite:2826.65,aliq:0.075,ded:169.44},{limite:3751.05,aliq:0.15,ded:381.44},{limite:4664.68,aliq:0.225,ded:662.77},{limite:Infinity,aliq:0.275,ded:896}];

function calcINSS(base: number): number { let inss=0,rest=base,ant=0; for(const f of TABELA_INSS){if(rest<=0)break;const b=Math.min(rest,f.limite-ant);inss+=b*f.aliq;rest-=b;ant=f.limite;} return Math.min(inss,908.85); }
function calcIRRF(base: number, dep: number): number { const b=base-dep*189.59; if(b<=0)return 0; for(const f of TABELA_IRRF){if(b<=f.limite)return Math.max(0,b*f.aliq-f.ded);} return 0; }

export function calcularDiasFerias(mesesTrabalhados: number, faltas: number = 0): number {
  if(mesesTrabalhados<12) return Math.floor((mesesTrabalhados/12)*30);
  if(faltas<=5) return 30; if(faltas<=14) return 24; if(faltas<=23) return 18; if(faltas<=32) return 12; return 0;
}

export function calcularFerias(dados: DadosFerias): ResultadoFerias {
  const {salarioBase,diasFerias,diasAbono=0,mediaHE=0,mediaAdicional=0,dependentes=0} = dados;
  const valorDia = salarioBase/30;
  const valorFerias = valorDia * diasFerias;
  const tercoConstitucional = valorFerias/3;
  const abonoPecuniario = valorDia * diasAbono;
  const tercoAbono = abonoPecuniario/3;
  const totalBruto = valorFerias + tercoConstitucional + abonoPecuniario + tercoAbono + mediaHE + mediaAdicional;
  const inss = Math.round(calcINSS(totalBruto)*100)/100;
  const irrf = Math.round(calcIRRF(totalBruto-inss, dependentes)*100)/100;
  return { salarioBase, diasFerias, valorFerias: Math.round(valorFerias*100)/100, tercoConstitucional: Math.round(tercoConstitucional*100)/100, abonoPecuniario: Math.round(abonoPecuniario*100)/100, tercoAbono: Math.round(tercoAbono*100)/100, mediaHE, mediaAdicional, totalBruto: Math.round(totalBruto*100)/100, inss, irrf, totalLiquido: Math.round((totalBruto-inss-irrf)*100)/100 };
}

export function calcularFeriasVencidas(salarioBase: number, mesesVencidos: number): number { return (salarioBase + salarioBase/3) * 2 * Math.floor(mesesVencidos/12); }
export function calcularFeriasProporcionais(salarioBase: number, mesesTrabalhados: number): number { return ((salarioBase/12)*mesesTrabalhados) + (((salarioBase/12)*mesesTrabalhados)/3); }
export default { calcularFerias, calcularDiasFerias, calcularFeriasVencidas, calcularFeriasProporcionais };
