export function gerarCNAB240(pagamentos: { cpf: string; valor: number; banco: string; agencia: string; conta: string }[]): string {
  let arquivo = "0" + "2" + "240".padEnd(9, "0");
  pagamentos.forEach((p, i) => { arquivo += `\n3${String(i + 1).padStart(5, "0")}${p.cpf}${p.valor.toFixed(2).replace(".", "").padStart(15, "0")}`; });
  return arquivo + "\n9" + String(pagamentos.length).padStart(6, "0");
}
export function gerarRemessaPIX(pagamentos: { chave: string; valor: number }[]): object[] {
  return pagamentos.map(p => ({ txid: `PIX${Date.now()}`, valor: p.valor, chave: p.chave }));
}
export default gerarCNAB240;
