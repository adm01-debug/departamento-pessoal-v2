// V17-E018: Validador eSocial S-2306 (TSV Alteração)
export interface DadosS2306 { cpfTrab: string; dtAlteracao: string; codCateg?: number; vrSalFx?: number; }
export function validateS2306(dados: Partial<DadosS2306>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.dtAlteracao) errors.push('Data alteração obrigatória');
  return { valid: errors.length === 0, errors };
}
