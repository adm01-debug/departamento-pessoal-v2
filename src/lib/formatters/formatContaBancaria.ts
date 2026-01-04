export function formatAgencia(ag: string): string { const n=ag.replace(/\D/g,"").slice(0,4); return n.padStart(4,"0"); }
export function formatConta(conta: string): string { const n=conta.replace(/\D/g,""); if(n.length<=1)return n; return n.slice(0,-1)+"-"+n.slice(-1); }
export function formatContaCompleta(banco: string, agencia: string, conta: string): string { return `Banco ${banco} | Ag: ${formatAgencia(agencia)} | CC: ${formatConta(conta)}`; }
export function validateAgencia(ag: string): boolean { return ag.replace(/\D/g,"").length===4; }
export function validateConta(conta: string): boolean { const n=conta.replace(/\D/g,""); return n.length>=5&&n.length<=12; }
export function getBancoNome(codigo: string): string { const bancos:{[k:string]:string}={"001":"Banco do Brasil","033":"Santander","104":"Caixa","237":"Bradesco","341":"Itaú","756":"Sicoob","748":"Sicredi","077":"Inter","260":"Nubank","336":"C6 Bank"}; return bancos[codigo]||`Banco ${codigo}`; }
export default { formatAgencia, formatConta, formatContaCompleta, validateAgencia, validateConta, getBancoNome };
