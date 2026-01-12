// V17-E030: Validador eSocial S-5002 (IRRF Consolidado)
export interface DadosS5002 { perApur: string; cpfTrab: string; vrIrrf?: number; vrDedDep?: number; }
export function validateS5002(dados: Partial<DadosS5002>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  return { valid: errors.length === 0, errors };
}
