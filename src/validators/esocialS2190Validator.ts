// V17-E006: Validador eSocial S-2190 (Admissão Preliminar)
export interface DadosS2190 { cpfTrab: string; dtNascto: string; dtAdm: string; }
export function validateS2190(dados: Partial<DadosS2190>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.dtNascto) errors.push('Data de nascimento obrigatória');
  if (!dados.dtAdm) errors.push('Data de admissão obrigatória');
  if (dados.cpfTrab && dados.cpfTrab.length !== 11) errors.push('CPF deve ter 11 dígitos');
  return { valid: errors.length === 0, errors };
}
