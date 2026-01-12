// V17-E022: Validador eSocial S-1200 (Remuneração)
export interface DadosS1200 { cpfTrab: string; matricula: string; perApur: string; dmDev: Array<{ codCateg: number; infoPerApur: { ideEstabLot: { codLotacao: string; }; detVerbas: Array<{ codRubr: string; ideTabRubr: string; vrRubr: number; }>; }; }>; }
export function validateS1200(dados: Partial<DadosS1200>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  if (!dados.dmDev || dados.dmDev.length === 0) errors.push('Demonstrativo de valores obrigatório');
  dados.dmDev?.forEach((dm, i) => { if (!dm.infoPerApur?.detVerbas?.length) errors.push(`Verbas obrigatórias no demonstrativo ${i+1}`); });
  return { valid: errors.length === 0, errors };
}
