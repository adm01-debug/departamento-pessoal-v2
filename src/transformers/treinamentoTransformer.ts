export const treinamentoTransformer = {
  toAPI: (d: any) => ({ nome: d.nome, descricao: d.descricao, tipo: d.tipo, carga_horaria: d.cargaHoraria, modalidade: d.modalidade, instrutor: d.instrutor, fornecedor: d.fornecedor, validade: d.validade, custo: d.custo, ativo: d.ativo }),
  fromAPI: (d: any) => ({ id: d.id, nome: d.nome, descricao: d.descricao, tipo: d.tipo, cargaHoraria: d.carga_horaria, modalidade: d.modalidade, instrutor: d.instrutor, fornecedor: d.fornecedor, validade: d.validade, custo: d.custo, ativo: d.ativo }),
};
export default treinamentoTransformer;
