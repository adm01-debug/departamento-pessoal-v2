export const exameTransformer = {
  toAPI: (d: any) => ({ colaborador_id: d.colaboradorId, tipo: d.tipo, data_exame: d.dataExame, data_validade: d.dataValidade, resultado: d.resultado, medico: d.medico, crm: d.crm, riscos: d.riscos, observacoes: d.observacoes }),
  fromAPI: (d: any) => ({ id: d.id, colaboradorId: d.colaborador_id, tipo: d.tipo, dataExame: new Date(d.data_exame), dataValidade: new Date(d.data_validade), resultado: d.resultado, medico: d.medico, crm: d.crm, riscos: d.riscos, observacoes: d.observacoes }),
};
export default exameTransformer;
