export const avaliacaoTransformer = {
  toAPI: (d: any) => ({ colaborador_id: d.colaboradorId, avaliador_id: d.avaliadorId, periodo: d.periodo, tipo: d.tipo, status: d.status, data_inicio: d.dataInicio, data_fim: d.dataFim, nota_final: d.notaFinal, metas: d.metas, competencias: d.competencias, comentario_colaborador: d.comentarioColaborador, comentario_gestor: d.comentarioGestor }),
  fromAPI: (d: any) => ({ id: d.id, colaboradorId: d.colaborador_id, avaliadorId: d.avaliador_id, periodo: d.periodo, tipo: d.tipo, status: d.status, dataInicio: new Date(d.data_inicio), dataFim: d.data_fim ? new Date(d.data_fim) : undefined, notaFinal: d.nota_final, metas: d.metas, competencias: d.competencias, comentarioColaborador: d.comentario_colaborador, comentarioGestor: d.comentario_gestor }),
};
export default avaliacaoTransformer;
