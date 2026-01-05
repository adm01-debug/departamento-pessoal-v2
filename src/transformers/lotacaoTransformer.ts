import { Lotacao } from "@/types/lotacao.types";
export const lotacaoTransformer = {
  toAPI(data: Partial<Lotacao>): Record<string, any> { return { codigo: data.codigo, descricao: data.descricao, tipo: data.tipo, empresa_id: data.empresaId, lotacao_pai_id: data.lotacaoPaiId, codigo_contabil: data.codigoContabil, responsavel_id: data.responsavelId, codigo_esocial: data.codigoESocial, ativo: data.ativo }; },
  fromAPI(data: Record<string, any>): Lotacao { return { id: data.id, codigo: data.codigo, descricao: data.descricao, tipo: data.tipo, empresaId: data.empresa_id, lotacaoPaiId: data.lotacao_pai_id, codigoContabil: data.codigo_contabil, responsavelId: data.responsavel_id, codigoESocial: data.codigo_esocial, ativo: data.ativo }; },
  toExport: (lotacoes: Lotacao[]) => lotacoes.map(l => ({ Código: l.codigo, Descrição: l.descricao, Tipo: l.tipo, "Código Contábil": l.codigoContabil, Ativo: l.ativo ? "Sim" : "Não" })),
};
export default lotacaoTransformer;
