// V17-E020: Validador eSocial S-2400 (CDP)
export interface DadosS2400 { cpfBenef: string; dtIniBenef: string; tpBenef: number; nrBeneficio?: string; }
export function validateS2400(dados: Partial<DadosS2400>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfBenef) errors.push('CPF do beneficiário obrigatório');
  if (!dados.dtIniBenef) errors.push('Data início benefício obrigatória');
  if (dados.tpBenef === undefined) errors.push('Tipo de benefício obrigatório');
  return { valid: errors.length === 0, errors };
}
