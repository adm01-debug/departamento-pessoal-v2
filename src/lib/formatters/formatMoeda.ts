export function formatMoeda(valor: number, moeda: string = "BRL"): string { return new Intl.NumberFormat("pt-BR",{style:"currency",currency:moeda}).format(valor); }
export function formatMoedaInput(valor: string): string { const n=valor.replace(/\D/g,""); if(!n)return ""; const v=parseInt(n)/100; return formatMoeda(v).replace("R$","").trim(); }
export function unformatMoeda(valor: string): number { const n=valor.replace(/[^\d,-]/g,"").replace(",","."); return parseFloat(n)||0; }
export function formatMoedaCompacta(valor: number): string { if(valor>=1000000000)return (valor/1000000000).toFixed(1)+"B"; if(valor>=1000000)return (valor/1000000).toFixed(1)+"M"; if(valor>=1000)return (valor/1000).toFixed(1)+"K"; return formatMoeda(valor); }
export function formatPorcentagem(valor: number, decimais: number = 2): string { return valor.toFixed(decimais)+"%"; }
export function parseMoeda(valor: string): number { return parseFloat(valor.replace(/[^\d,-]/g,"").replace(".","").replace(",","."))||0; }
export default { formatMoeda, formatMoedaInput, unformatMoeda, formatMoedaCompacta, formatPorcentagem, parseMoeda };
