// V17-E009: Validador eSocial S-2210 (CAT)
export interface DadosS2210 { cpfTrab: string; dtAcid: string; hrAcid?: string; tpAcid: number; tpCat: number; dtObito?: string; indCatObito?: string; codSitGeradora: string; }
export function validateS2210(dados: Partial<DadosS2210>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.dtAcid) errors.push('Data do acidente obrigatória');
  if (dados.tpAcid === undefined) errors.push('Tipo de acidente obrigatório');
  if (dados.tpCat === undefined) errors.push('Tipo de CAT obrigatório');
  if (!dados.codSitGeradora) errors.push('Código situação geradora obrigatório');
  return { valid: errors.length === 0, errors };
}
