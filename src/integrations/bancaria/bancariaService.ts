export interface ArquivoCNAB { tipo: "240" | "400"; banco: string; empresa: { nome: string; cnpj: string; agencia: string; conta: string }; lotes: LoteCNAB[]; }
export interface LoteCNAB { tipo: "PAGAMENTO" | "COBRANCA"; registros: RegistroCNAB[]; }
export interface RegistroCNAB { favorecido: string; cpfCnpj: string; banco: string; agencia: string; conta: string; valor: number; dataVencimento: string; }
export class IntegracaoBancariaService {
  async gerarCNAB240Pagamento(empresa: any, pagamentos: any[]): Promise<string> {
    const header = `${empresa.banco}0000000         2${empresa.cnpj.padEnd(14)}${empresa.agencia.padStart(5,"0")}${empresa.conta.padStart(12,"0")}`;
    const registros = pagamentos.map((p, i) => `${empresa.banco}00013${String(i+1).padStart(5,"0")}A000${p.banco}${p.agencia.padStart(5,"0")}${p.conta.padStart(12,"0")}${p.favorecido.padEnd(30)}${String(Math.round(p.valor*100)).padStart(15,"0")}`);
    const trailer = `${empresa.banco}99999${String(pagamentos.length).padStart(6,"0")}${String(Math.round(pagamentos.reduce((a,p)=>a+p.valor,0)*100)).padStart(18,"0")}`;
    return [header, ...registros, trailer].join("\n");
  }
  async processarRetornoCNAB(conteudo: string): Promise<{ sucesso: any[]; erro: any[] }> { return { sucesso: [], erro: [] }; }
  async gerarPixLote(pagamentos: any[]): Promise<{ id: string; status: string }> { return { id: `PIX${Date.now()}`, status: "PROCESSANDO" }; }
}
export default IntegracaoBancariaService;
