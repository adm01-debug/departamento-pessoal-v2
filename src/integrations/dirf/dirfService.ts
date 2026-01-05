export interface DIRFDeclaracao { anoCalendario: number; declarante: { cnpj: string; nome: string }; beneficiarios: DIRFBeneficiario[]; }
export interface DIRFBeneficiario { cpf: string; nome: string; rendimentos: number; irrf: number; inss: number; dependentes: number; pensao: number; }
export class DIRFService {
  async gerarDeclaracao(anoCalendario: number, declarante: any, colaboradores: any[]): Promise<DIRFDeclaracao> {
    const beneficiarios = colaboradores.map(c => ({ cpf: c.cpf, nome: c.nome, rendimentos: c.totalRendimentos, irrf: c.totalIRRF, inss: c.totalINSS, dependentes: c.dependentes, pensao: c.pensao || 0 }));
    return { anoCalendario, declarante, beneficiarios };
  }
  async exportarTXT(declaracao: DIRFDeclaracao): Promise<string> {
    const linhas = [`DIRF|2026|${declaracao.declarante.cnpj}|${declaracao.declarante.nome}|`];
    declaracao.beneficiarios.forEach(b => linhas.push(`BPFDEC|${b.cpf}|${b.nome}|${b.rendimentos}|${b.irrf}|`));
    return linhas.join("\n");
  }
}
export default DIRFService;
