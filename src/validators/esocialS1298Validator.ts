// V17-E027: Validador eSocial S-1298 (Reabertura)
export interface DadosS1298 { perApur: string; }
export function validateS1298(dados: Partial<DadosS1298>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  return { valid: errors.length === 0, errors };
}
