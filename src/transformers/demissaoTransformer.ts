export const demissaoTransformer = {
  toAPI: (data: any) => ({ colaborador_id: data.colaboradorId, data_demissao: data.data, tipo: data.tipo, motivo: data.motivo, aviso_previo: data.avisoPrevio, data_homologacao: data.dataHomologacao }),
  fromAPI: (data: any) => ({ id: data.id, colaboradorId: data.colaborador_id, data: new Date(data.data_demissao), tipo: data.tipo, motivo: data.motivo, avisoPrevio: data.aviso_previo, dataHomologacao: data.data_homologacao ? new Date(data.data_homologacao) : undefined }),
  toExport: (demissoes: any[]) => demissoes.map(d => ({ Colaborador: d.colaboradorId, Data: d.data, Tipo: d.tipo, Motivo: d.motivo })),
};
export default demissaoTransformer;
