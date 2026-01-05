export const sindicatoTransformer = {
  toAPI: (data: any) => ({ codigo: data.codigo, nome: data.nome, cnpj: data.cnpj, endereco: data.endereco, cidade: data.cidade, uf: data.uf, telefone: data.telefone, email: data.email, contribuicao_sindical: data.contribuicaoSindical, contribuicao_assistencial: data.contribuicaoAssistencial, mes_base: data.mesBase, data_base_salarial: data.dataBaseSalarial, ativo: data.ativo }),
  fromAPI: (data: any) => ({ id: data.id, codigo: data.codigo, nome: data.nome, cnpj: data.cnpj, endereco: data.endereco, cidade: data.cidade, uf: data.uf, telefone: data.telefone, email: data.email, contribuicaoSindical: data.contribuicao_sindical, contribuicaoAssistencial: data.contribuicao_assistencial, mesBase: data.mes_base, dataBaseSalarial: data.data_base_salarial, ativo: data.ativo }),
};
export default sindicatoTransformer;
