export function calcularRescisao(dados: { salario: number; dataAdmissao: string; dataDemissao: string; tipo: "SEM_JUSTA_CAUSA" | "JUSTA_CAUSA" | "PEDIDO" | "ACORDO"; saldoFGTS: number; diasFerias: number; meses13: number; avisoPrevio: "TRABALHADO" | "INDENIZADO" | "DISPENSADO" }): { saldoSalario: number; avisoPrevio: number; feriasProporcionais: number; tercoFerias: number; decimoTerceiro: number; multaFGTS: number; totalBruto: number } {
  const { salario, tipo, saldoFGTS, diasFerias, meses13, avisoPrevio: tipoAviso } = dados;
  const valorDia = salario / 30;
  const saldoSalario = valorDia * 15;
  let avisoValor = 0;
  if (tipo === "SEM_JUSTA_CAUSA" && tipoAviso === "INDENIZADO") avisoValor = salario;
  const feriasProporcionais = (salario / 12) * (diasFerias / 30 * 12);
  const tercoFerias = feriasProporcionais / 3;
  const decimoTerceiro = (salario / 12) * meses13;
  let multaFGTS = 0;
  if (tipo === "SEM_JUSTA_CAUSA") multaFGTS = saldoFGTS * 0.40;
  else if (tipo === "ACORDO") multaFGTS = saldoFGTS * 0.20;
  const totalBruto = saldoSalario + avisoValor + feriasProporcionais + tercoFerias + decimoTerceiro + multaFGTS;
  return { saldoSalario: Math.round(saldoSalario * 100) / 100, avisoPrevio: Math.round(avisoValor * 100) / 100, feriasProporcionais: Math.round(feriasProporcionais * 100) / 100, tercoFerias: Math.round(tercoFerias * 100) / 100, decimoTerceiro: Math.round(decimoTerceiro * 100) / 100, multaFGTS: Math.round(multaFGTS * 100) / 100, totalBruto: Math.round(totalBruto * 100) / 100 };
}
export default calcularRescisao;
