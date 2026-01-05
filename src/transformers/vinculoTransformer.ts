import { Vinculo } from "@/types/vinculo.types";
export const vinculoTransformer = {
  toAPI(data: Partial<Vinculo>): Record<string, any> {
    return { colaborador_id: data.colaboradorId, empresa_id: data.empresaId, tipo_vinculo: data.tipoVinculo, data_admissao: data.dataAdmissao, data_desligamento: data.dataDesligamento, matricula: data.matricula, cargo_id: data.cargoId, departamento_id: data.departamentoId, jornada_id: data.jornadaId, salario_base: data.salarioBase, tipo_salario: data.tipoSalario, forma_pagamento: data.formaPagamento, conta_bancaria: data.contaBancaria, categoria_esocial: data.categoriaESocial, sindicato_id: data.sindicatoId, ativo: data.ativo };
  },
  fromAPI(data: Record<string, any>): Vinculo {
    return { id: data.id, colaboradorId: data.colaborador_id, empresaId: data.empresa_id, tipoVinculo: data.tipo_vinculo, dataAdmissao: new Date(data.data_admissao), dataDesligamento: data.data_desligamento ? new Date(data.data_desligamento) : undefined, matricula: data.matricula, cargoId: data.cargo_id, departamentoId: data.departamento_id, jornadaId: data.jornada_id, salarioBase: data.salario_base, tipoSalario: data.tipo_salario, formaPagamento: data.forma_pagamento, contaBancaria: data.conta_bancaria, categoriaESocial: data.categoria_esocial, sindicatoId: data.sindicato_id, ativo: data.ativo };
  },
  toExport: (vinculos: Vinculo[]) => vinculos.map(v => ({ Matrícula: v.matricula, Tipo: v.tipoVinculo, Admissão: v.dataAdmissao, Salário: v.salarioBase, Ativo: v.ativo ? "Sim" : "Não" })),
};
export default vinculoTransformer;
