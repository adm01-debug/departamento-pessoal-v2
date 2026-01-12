// V17-E035: Validador eSocial S-8299 (Download)
export interface DadosS8299 { perApur: string; }
export function validateS8299(dados: Partial<DadosS8299>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  return { valid: errors.length === 0, errors };
}
