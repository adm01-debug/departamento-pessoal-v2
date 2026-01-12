// V17-E021: Validador eSocial S-3000 (Exclusão)
export interface DadosS3000 { tpEvento: string; nrRecEvt: string; }
export function validateS3000(dados: Partial<DadosS3000>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.tpEvento) errors.push('Tipo de evento obrigatório');
  if (!dados.nrRecEvt) errors.push('Número recibo evento obrigatório');
  return { valid: errors.length === 0, errors };
}
