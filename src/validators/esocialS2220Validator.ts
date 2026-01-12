// V17-E010: Validador eSocial S-2220 (ASO)
export interface DadosS2220 { cpfTrab: string; matricula: string; dtAso: string; tpAso: number; resAso: number; nmMed: string; nrCRM: string; ufCRM: string; }
export function validateS2220(dados: Partial<DadosS2220>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (!dados.dtAso) errors.push('Data do ASO obrigatória');
  if (dados.tpAso === undefined) errors.push('Tipo de ASO obrigatório');
  if (dados.resAso === undefined) errors.push('Resultado do ASO obrigatório');
  if (!dados.nmMed) errors.push('Nome do médico obrigatório');
  if (!dados.nrCRM) errors.push('Número do CRM obrigatório');
  if (!dados.ufCRM) errors.push('UF do CRM obrigatória');
  if (dados.tpAso && ![0,1,2,3,4,9].includes(dados.tpAso)) errors.push('Tipo de ASO inválido');
  return { valid: errors.length === 0, errors };
}
