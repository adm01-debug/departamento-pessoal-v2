export const afastamentoTransformer = {
  toAPI: (data: any) => ({ colaborador_id: data.colaboradorId, tipo: data.tipo, data_inicio: data.dataInicio, data_fim: data.dataFim, dias: data.dias, cid: data.cid, crm: data.crm, inss: data.inss, documento_id: data.documentoId, observacao: data.observacao }),
  fromAPI: (data: any) => ({ id: data.id, colaboradorId: data.colaborador_id, tipo: data.tipo, dataInicio: new Date(data.data_inicio), dataFim: data.data_fim ? new Date(data.data_fim) : undefined, dias: data.dias, cid: data.cid, crm: data.crm, inss: data.inss, documentoId: data.documento_id, observacao: data.observacao }),
};
export default afastamentoTransformer;
