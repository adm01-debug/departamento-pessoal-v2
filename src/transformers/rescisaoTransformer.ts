export const rescisaoTransformer = {
  toAPI: (data: any) => ({ demissao_id: data.demissaoId, data_calculo: data.dataCalculo, saldo_salario: data.saldoSalario, aviso_previo: data.avisoPrevio, ferias: data.ferias, decimo_terceiro: data.decimoTerceiro, fgts: data.fgts, multa_40: data.multa40, total_proventos: data.totalProventos, total_descontos: data.totalDescontos, liquido: data.liquido }),
  fromAPI: (data: any) => ({ id: data.id, demissaoId: data.demissao_id, dataCalculo: new Date(data.data_calculo), saldoSalario: data.saldo_salario, avisoPrevio: data.aviso_previo, ferias: data.ferias, decimoTerceiro: data.decimo_terceiro, fgts: data.fgts, multa40: data.multa_40, totalProventos: data.total_proventos, totalDescontos: data.total_descontos, liquido: data.liquido }),
};
export default rescisaoTransformer;
