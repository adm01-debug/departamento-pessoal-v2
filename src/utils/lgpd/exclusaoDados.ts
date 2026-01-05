export interface SolicitacaoExclusao { id: string; titularCpf: string; dataSolicitacao: Date; motivo: string; status: "PENDENTE" | "EM_ANALISE" | "APROVADA" | "REJEITADA" | "EXECUTADA"; dataExecucao?: Date; dadosExcluidos?: string[]; }
export interface ResultadoExclusao { sucesso: boolean; dadosExcluidos: string[]; dadosMantidos: string[]; motivo?: string; }
export async function solicitarExclusao(cpf: string, motivo: string): Promise<SolicitacaoExclusao> {
  return { id: `EXC${Date.now()}`, titularCpf: cpf, dataSolicitacao: new Date(), motivo, status: "PENDENTE" };
}
export async function executarExclusao(solicitacaoId: string): Promise<ResultadoExclusao> {
  const dadosExcluidos = ["dados_pessoais", "enderecos", "contatos", "documentos_digitalizados", "logs_acesso"];
  const dadosMantidos = ["folha_pagamento", "contribuicoes_inss", "fgts", "contratos"];
  return { sucesso: true, dadosExcluidos, dadosMantidos, motivo: "Dados trabalhistas mantidos por obrigação legal (5 anos após desligamento)" };
}
export function verificarRetencaoLegal(tiposDados: string[]): { podeExcluir: boolean; motivoRetencao?: string }[] {
  const retencaoLegal: Record<string, string> = { folha_pagamento: "Retenção obrigatória: 5 anos (CLT)", contribuicoes_inss: "Retenção obrigatória: 10 anos", fgts: "Retenção obrigatória: 30 anos", contratos: "Retenção obrigatória: 5 anos após término" };
  return tiposDados.map(tipo => ({ podeExcluir: !retencaoLegal[tipo], motivoRetencao: retencaoLegal[tipo] }));
}
export default executarExclusao;
