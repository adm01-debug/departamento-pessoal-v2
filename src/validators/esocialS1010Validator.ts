// V17-E003: Validador eSocial S-1010 (Rubricas)
export interface DadosS1010 {
  codRubr: string; ideTabRubr: string; iniValid: string; fimValid?: string;
  dscRubr: string; natRubr: number; tpRubr: number; codIncCP: string;
  codIncIRRF: string; codIncFGTS: string; codIncSIND?: string;
}
export function validateS1010(dados: Partial<DadosS1010>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.codRubr) errors.push('Código da rubrica obrigatório');
  if (!dados.ideTabRubr) errors.push('Identificador da tabela obrigatório');
  if (!dados.iniValid) errors.push('Início de validade obrigatório');
  if (!dados.dscRubr) errors.push('Descrição da rubrica obrigatória');
  if (dados.natRubr === undefined) errors.push('Natureza da rubrica obrigatória');
  if (dados.tpRubr === undefined) errors.push('Tipo de rubrica obrigatório');
  if (!dados.codIncCP) errors.push('Código de incidência CP obrigatório');
  if (!dados.codIncIRRF) errors.push('Código de incidência IRRF obrigatório');
  if (!dados.codIncFGTS) errors.push('Código de incidência FGTS obrigatório');
  if (dados.tpRubr && ![1, 2, 3, 4].includes(dados.tpRubr)) errors.push('Tipo de rubrica inválido (1=Provento, 2=Desconto, 3=Informativa, 4=Informativa dedutora)');
  return { valid: errors.length === 0, errors };
}
export default validateS1010;
