// V17-E002: Validador eSocial S-1005 (Estabelecimentos)
export interface DadosS1005 {
  tpInsc: number; nrInsc: string; iniValid: string; fimValid?: string;
  cnaePrep: string; cnpjResp?: string; nmCtt?: string; cpfCtt?: string;
  foneFixo?: string; foneCel?: string; email?: string;
  tpLograd?: string; dscLograd?: string; nrLograd?: string; bairro?: string;
  cep?: string; codMunic?: string; uf?: string;
}
export function validateS1005(dados: Partial<DadosS1005>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.tpInsc) errors.push('Tipo de inscrição obrigatório');
  if (!dados.nrInsc) errors.push('Número de inscrição obrigatório');
  if (!dados.iniValid) errors.push('Início de validade obrigatório');
  if (!dados.cnaePrep) errors.push('CNAE preponderante obrigatório');
  if (dados.cnaePrep && !/^\d{7}$/.test(dados.cnaePrep)) errors.push('CNAE deve ter 7 dígitos');
  if (dados.cep && !/^\d{8}$/.test(dados.cep)) errors.push('CEP deve ter 8 dígitos');
  return { valid: errors.length === 0, errors };
}
export default validateS1005;
