// V17-E017: Validador eSocial S-2300 (TSV Início)
export interface DadosS2300 { cpfTrab: string; nisTrab?: string; nmTrab: string; sexo: string; racaCor: number; dtNascto: string; codCateg: number; dtInicio: string; }
export function validateS2300(dados: Partial<DadosS2300>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.nmTrab) errors.push('Nome do trabalhador obrigatório');
  if (!dados.sexo) errors.push('Sexo obrigatório');
  if (dados.racaCor === undefined) errors.push('Raça/cor obrigatória');
  if (!dados.dtNascto) errors.push('Data nascimento obrigatória');
  if (dados.codCateg === undefined) errors.push('Código categoria obrigatório');
  if (!dados.dtInicio) errors.push('Data início obrigatória');
  return { valid: errors.length === 0, errors };
}
