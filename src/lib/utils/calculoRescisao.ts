export type TipoRescisao = "sem_justa_causa" | "justa_causa" | "pedido_demissao" | "acordo" | "termino_contrato";
export interface DadosRescisao { salarioBase: number; dataAdmissao: string; dataRescisao: string; tipoRescisao: TipoRescisao; saldoFGTS: number; feriasVencidas?: number; diasTrabalhados?: number; avisoPrevioTrabalhado?: boolean; dependentes?: number; }
export interface ResultadoRescisao { saldoSalario: number; avisoPrevio: number; feriasVencidas: number; feriasProporcionais: number; tercoFerias: number; decimoTerceiro: number; multaFGTS: number; totalBruto: number; inss: number; irrf: number; totalLiquido: number; }

function mesesEntreDatas(d1: string, d2: string): number { const a=new Date(d1),b=new Date(d2); return (b.getFullYear()-a.getFullYear())*12+(b.getMonth()-a.getMonth()); }
function diasAvisoPrevio(meses: number): number { return Math.min(90, 30 + Math.floor(meses/12)*3); }

export function calcularRescisao(dados: DadosRescisao): ResultadoRescisao {
  const {salarioBase,dataAdmissao,dataRescisao,tipoRescisao,saldoFGTS,feriasVencidas=0,diasTrabalhados=0,avisoPrevioTrabalhado=false,dependentes=0} = dados;
  const meses = mesesEntreDatas(dataAdmissao, dataRescisao);
  const diasAviso = diasAvisoPrevio(meses);
  const valorDia = salarioBase/30;
  
  let saldoSalario = valorDia * (diasTrabalhados || new Date(dataRescisao).getDate());
  let avisoPrevio = 0, multaFGTS = 0;
  
  if(tipoRescisao === "sem_justa_causa") { avisoPrevio = avisoPrevioTrabalhado ? 0 : valorDia*diasAviso; multaFGTS = saldoFGTS*0.4; }
  else if(tipoRescisao === "acordo") { avisoPrevio = avisoPrevioTrabalhado ? 0 : (valorDia*diasAviso)/2; multaFGTS = saldoFGTS*0.2; }
  else if(tipoRescisao === "pedido_demissao" && !avisoPrevioTrabalhado) { saldoSalario -= salarioBase; }
  
  const mesesFerias = meses % 12;
  const feriasProporcionais = (tipoRescisao !== "justa_causa") ? (salarioBase/12)*mesesFerias : 0;
  const tercoFerias = (feriasVencidas + feriasProporcionais)/3;
  const meses13 = new Date(dataRescisao).getMonth() + 1;
  const decimoTerceiro = (tipoRescisao !== "justa_causa") ? (salarioBase/12)*meses13 : 0;
  
  const totalBruto = saldoSalario + avisoPrevio + feriasVencidas + feriasProporcionais + tercoFerias + decimoTerceiro + multaFGTS;
  const inss = Math.min(totalBruto*0.14, 908.85);
  const irrf = Math.max(0, (totalBruto-inss-dependentes*189.59)*0.15-381.44);
  
  return { saldoSalario: Math.round(saldoSalario*100)/100, avisoPrevio: Math.round(avisoPrevio*100)/100, feriasVencidas, feriasProporcionais: Math.round(feriasProporcionais*100)/100, tercoFerias: Math.round(tercoFerias*100)/100, decimoTerceiro: Math.round(decimoTerceiro*100)/100, multaFGTS: Math.round(multaFGTS*100)/100, totalBruto: Math.round(totalBruto*100)/100, inss: Math.round(inss*100)/100, irrf: Math.round(irrf*100)/100, totalLiquido: Math.round((totalBruto-inss-irrf)*100)/100 };
}
export default { calcularRescisao };
