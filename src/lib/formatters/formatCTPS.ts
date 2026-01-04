export function formatCTPS(ctps: string): string { const n=ctps.replace(/\D/g,"").slice(0,11); if(n.length<=7)return n; return n.slice(0,7)+"/"+n.slice(7); }
export function unformatCTPS(ctps: string): string { return ctps.replace(/\D/g,""); }
export function validateCTPS(numero: string, serie: string): boolean { return numero.replace(/\D/g,"").length>=5&&serie.replace(/\D/g,"").length>=4; }
export function formatCTPSCompleta(numero: string, serie: string, uf: string): string { return `${numero}/${serie}-${uf}`; }
export default { formatCTPS, unformatCTPS, validateCTPS, formatCTPSCompleta };
