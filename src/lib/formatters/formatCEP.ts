export function formatCEP(cep: string): string { const n=cep.replace(/\D/g,"").slice(0,8); if(n.length<=5)return n; return n.slice(0,5)+"-"+n.slice(5); }
export function unformatCEP(cep: string): string { return cep.replace(/\D/g,""); }
export function validateCEP(cep: string): boolean { return cep.replace(/\D/g,"").length===8; }
export async function buscarCEP(cep: string): Promise<{logradouro:string;bairro:string;cidade:string;uf:string}|null> { try { const r=await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g,"")}/json/`); const d=await r.json(); if(d.erro)return null; return {logradouro:d.logradouro,bairro:d.bairro,cidade:d.localidade,uf:d.uf}; } catch { return null; } }
export default { formatCEP, unformatCEP, validateCEP, buscarCEP };
