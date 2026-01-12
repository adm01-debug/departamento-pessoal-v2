// V17-E005: Validador eSocial S-1070 (Processos Administrativos/Judiciais)
export interface DadosS1070 {
  tpProc: number; nrProc: string; iniValid: string; fimValid?: string;
  indAutoria?: number; indMatProc: number; observacao?: string;
  dadosProcJud?: { ufVara: string; codMunic: string; idVara: string; };
}
export function validateS1070(dados: Partial<DadosS1070>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (dados.tpProc === undefined) errors.push('Tipo de processo obrigatório');
  if (!dados.nrProc) errors.push('Número do processo obrigatório');
  if (!dados.iniValid) errors.push('Início de validade obrigatório');
  if (dados.indMatProc === undefined) errors.push('Indicador de matéria do processo obrigatório');
  if (dados.tpProc === 2 && !dados.dadosProcJud) errors.push('Dados do processo judicial obrigatórios para tipo 2');
  return { valid: errors.length === 0, errors };
}
export default validateS1070;
