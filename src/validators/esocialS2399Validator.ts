// V17-E019: Validador eSocial S-2399 (TSV Término)
export interface DadosS2399 { cpfTrab: string; dtTerm: string; mtvDesligTSV: string; }
export function validateS2399(dados: Partial<DadosS2399>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.dtTerm) errors.push('Data término obrigatória');
  if (!dados.mtvDesligTSV) errors.push('Motivo desligamento TSV obrigatório');
  return { valid: errors.length === 0, errors };
}
