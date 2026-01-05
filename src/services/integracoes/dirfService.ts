export interface DIRFData { anoCalendario: number; beneficiarios: { cpf: string; nome: string; rendimentos: number; irrf: number }[]; }
export function gerarDIRF(dados: DIRFData): string {
  let arquivo = `DIRF${dados.anoCalendario}\n`;
  dados.beneficiarios.forEach(b => { arquivo += `BPFDEC|${b.cpf}|${b.nome}|${b.rendimentos}|${b.irrf}\n`; });
  return arquivo;
}
export default gerarDIRF;
