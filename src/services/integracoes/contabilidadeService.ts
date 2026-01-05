export interface LancamentoContabil { data: Date; debito: string; credito: string; valor: number; historico: string; }
export function gerarLancamentosFolha(folha: { proventos: number; inss: number; irrf: number; fgts: number; liquido: number }): LancamentoContabil[] {
  return [
    { data: new Date(), debito: "4.1.01.001", credito: "2.1.01.001", valor: folha.proventos, historico: "Provisão salários" },
    { data: new Date(), debito: "2.1.01.001", credito: "2.1.02.001", valor: folha.inss, historico: "INSS retido" },
    { data: new Date(), debito: "2.1.01.001", credito: "2.1.02.002", valor: folha.irrf, historico: "IRRF retido" },
    { data: new Date(), debito: "4.1.01.002", credito: "2.1.02.003", valor: folha.fgts, historico: "FGTS a recolher" },
  ];
}
export default gerarLancamentosFolha;
