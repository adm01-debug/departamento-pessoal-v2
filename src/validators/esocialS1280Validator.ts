// V17-E026: Validador eSocial S-1280 (Informações Complementares)
export interface DadosS1280 { perApur: string; qtdDiasTrab?: number; }
export function validateS1280(dados: Partial<DadosS1280>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  return { valid: errors.length === 0, errors };
}
