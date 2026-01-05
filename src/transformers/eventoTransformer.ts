export const eventoTransformer = {
  toAPI: (data: any) => ({ colaborador_id: data.colaboradorId, folha_id: data.folhaId, rubrica_id: data.rubricaId, tipo: data.tipo, quantidade: data.quantidade, referencia: data.referencia, valor: data.valor, origem: data.origem, observacao: data.observacao }),
  fromAPI: (data: any) => ({ id: data.id, colaboradorId: data.colaborador_id, folhaId: data.folha_id, rubricaId: data.rubrica_id, rubricaNome: data.rubrica?.descricao, tipo: data.tipo, quantidade: data.quantidade, referencia: data.referencia, valor: data.valor, origem: data.origem, observacao: data.observacao }),
};
export default eventoTransformer;
