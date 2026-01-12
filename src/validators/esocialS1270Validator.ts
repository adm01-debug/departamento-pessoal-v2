// V17-E025: Validador eSocial S-1270 (Contratação Avulsos)
export interface DadosS1270 { perApur: string; cnpjOperPortuario?: string; }
export function validateS1270(dados: Partial<DadosS1270>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  return { valid: errors.length === 0, errors };
}
