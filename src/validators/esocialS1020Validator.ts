// V17-E004: Validador eSocial S-1020 (Lotações Tributárias)
export interface DadosS1020 {
  codLotacao: string; iniValid: string; fimValid?: string; tpLotacao: number;
  tpInsc?: number; nrInsc?: string; fpas: string; codTercs?: string;
  codTercsSusp?: string; infoEmprParcial?: { tpInscContrat: number; nrInscContrat: string; };
}
export function validateS1020(dados: Partial<DadosS1020>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.codLotacao) errors.push('Código da lotação obrigatório');
  if (!dados.iniValid) errors.push('Início de validade obrigatório');
  if (dados.tpLotacao === undefined) errors.push('Tipo de lotação obrigatório');
  if (!dados.fpas) errors.push('FPAS obrigatório');
  if (dados.fpas && !/^\d{3}$/.test(dados.fpas)) errors.push('FPAS deve ter 3 dígitos');
  if (dados.codTercs && !/^\d{4}$/.test(dados.codTercs)) errors.push('Código terceiros deve ter 4 dígitos');
  return { valid: errors.length === 0, errors };
}
export default validateS1020;
