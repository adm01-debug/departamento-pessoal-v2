export interface Dados13 { salarioBase: number; mesesTrabalhados: number; mediaHE?: number; mediaComissoes?: number; dependentes?: number; adiantamento?: number; }
export interface Resultado13 { salarioBase: number; meses: number; valor13Bruto: number; mediaHE: number; mediaComissoes: number; totalBruto: number; inss: number; irrf: number; adiantamento: number; totalLiquido: number; }

const calcINSS = (b: number) => { let i=0,r=b,a=0; for(const f of [{l:1412,al:0.075},{l:2666.68,al:0.09},{l:4000.03,al:0.12},{l:7786.02,al:0.14}]){if(r<=0)break;const x=Math.min(r,f.l-a);i+=x*f.al;r-=x;a=f.l;} return Math.min(i,908.85); };
const calcIRRF = (b: number, d: number) => { const base=b-d*189.59; if(base<=2259.20)return 0; if(base<=2826.65)return base*0.075-169.44; if(base<=3751.05)return base*0.15-381.44; if(base<=4664.68)return base*0.225-662.77; return base*0.275-896; };

export function calcular13Salario(dados: Dados13): Resultado13 {
  const {salarioBase,mesesTrabalhados,mediaHE=0,mediaComissoes=0,dependentes=0,adiantamento=0} = dados;
  const meses = Math.min(mesesTrabalhados, 12);
  const valor13Bruto = (salarioBase/12)*meses;
  const totalBruto = valor13Bruto + mediaHE + mediaComissoes;
  const inss = Math.round(calcINSS(totalBruto)*100)/100;
  const irrf = Math.round(Math.max(0,calcIRRF(totalBruto-inss,dependentes))*100)/100;
  return { salarioBase, meses, valor13Bruto: Math.round(valor13Bruto*100)/100, mediaHE, mediaComissoes, totalBruto: Math.round(totalBruto*100)/100, inss, irrf, adiantamento, totalLiquido: Math.round((totalBruto-inss-irrf-adiantamento)*100)/100 };
}

export function calcularPrimeiraParcela(salarioBase: number, mesesTrabalhados: number): number { return Math.round(((salarioBase/12)*Math.min(mesesTrabalhados,12))/2*100)/100; }
export function calcularSegundaParcela(dados: Dados13): number { const r = calcular13Salario(dados); return r.totalLiquido; }
export default { calcular13Salario, calcularPrimeiraParcela, calcularSegundaParcela };
