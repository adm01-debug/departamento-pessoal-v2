// V17-E015: Validador eSocial S-2298 (Reintegração)
export interface DadosS2298 { cpfTrab: string; matricula: string; tpReint: number; dtEfetRetorno: string; dtEfeito: string; }
export function validateS2298(dados: Partial<DadosS2298>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (dados.tpReint === undefined) errors.push('Tipo de reintegração obrigatório');
  if (!dados.dtEfetRetorno) errors.push('Data efetiva retorno obrigatória');
  if (!dados.dtEfeito) errors.push('Data efeito obrigatória');
  return { valid: errors.length === 0, errors };
}
