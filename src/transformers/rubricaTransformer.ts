import { Rubrica } from "@/types/rubrica.types";
export const rubricaTransformer = {
  toAPI(data: Partial<Rubrica>): Record<string, any> { return { codigo: data.codigo, descricao: data.descricao, tipo: data.tipo, natureza: data.natureza, incide_inss: data.incideINSS, incide_irrf: data.incideIRRF, incide_fgts: data.incideFGTS, incide_ferias: data.incideFerias, incide_13: data.incide13, codigo_esocial: data.codigoESocial, formula: data.formula, ativo: data.ativo }; },
  fromAPI(data: Record<string, any>): Rubrica { return { id: data.id, codigo: data.codigo, descricao: data.descricao, tipo: data.tipo, natureza: data.natureza, incideINSS: data.incide_inss, incideIRRF: data.incide_irrf, incideFGTS: data.incide_fgts, incideFerias: data.incide_ferias, incide13: data.incide_13, codigoESocial: data.codigo_esocial, formula: data.formula, ativo: data.ativo }; },
  toExport: (rubricas: Rubrica[]) => rubricas.map(r => ({ Código: r.codigo, Descrição: r.descricao, Tipo: r.tipo, Natureza: r.natureza, INSS: r.incideINSS ? "Sim" : "Não", IRRF: r.incideIRRF ? "Sim" : "Não", FGTS: r.incideFGTS ? "Sim" : "Não", Ativo: r.ativo ? "Sim" : "Não" })),
};
export default rubricaTransformer;
