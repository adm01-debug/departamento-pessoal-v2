// V15-308
export interface DadosRescisao { salarioBase: number; dataAdmissao: Date; dataRescisao: Date; tipoRescisao: 'sem_justa_causa' | 'justa_causa' | 'pedido_demissao'; saldoFGTS: number; feriasVencidas: number; feriasProporcionais: number; avisoPrevioTrabalhado: boolean; }
export function calcularRescisao(dados: DadosRescisao) {
  const diasTrabalhados = new Date(dados.dataRescisao).getDate();
  const saldoSalario = (dados.salarioBase / 30) * diasTrabalhados;
  const decimoTerceiro = (dados.salarioBase / 12) * (new Date(dados.dataRescisao).getMonth() + 1);
  const feriasVencidas = dados.feriasVencidas * (dados.salarioBase + dados.salarioBase / 3);
  const feriasProporcionais = (dados.feriasProporcionais / 12) * (dados.salarioBase + dados.salarioBase / 3);
  const avisoPrevio = dados.tipoRescisao === 'sem_justa_causa' && !dados.avisoPrevioTrabalhado ? dados.salarioBase : 0;
  const multaFGTS = dados.tipoRescisao === 'sem_justa_causa' ? dados.saldoFGTS * 0.4 : 0;
  return { saldoSalario, decimoTerceiro, feriasVencidas, feriasProporcionais, avisoPrevio, multaFGTS, total: saldoSalario + decimoTerceiro + feriasVencidas + feriasProporcionais + avisoPrevio + multaFGTS };
}
