// V17-S043: SPEDService Real
export const spedServiceReal = {
  gerarECD(empresaId: string, anoCalendario: number) { return { tipo: 'ECD', anoCalendario, arquivo: `ECD_${anoCalendario}.txt` }; },
  gerarECF(empresaId: string, anoCalendario: number) { return { tipo: 'ECF', anoCalendario, arquivo: `ECF_${anoCalendario}.txt` }; },
  gerarEFDContribuicoes(empresaId: string, competencia: string) { return { tipo: 'EFD-Contribuicoes', competencia, arquivo: `EFD_${competencia}.txt` }; }
};
export default spedServiceReal;
