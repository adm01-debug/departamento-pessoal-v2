export function formatTelefone(tel: string): string { const n=tel.replace(/\D/g,"").slice(0,11); if(n.length<=2)return "("+n; if(n.length<=6)return "("+n.slice(0,2)+") "+n.slice(2); if(n.length<=10)return "("+n.slice(0,2)+") "+n.slice(2,6)+"-"+n.slice(6); return "("+n.slice(0,2)+") "+n.slice(2,7)+"-"+n.slice(7); }
export function unformatTelefone(tel: string): string { return tel.replace(/\D/g,""); }
export function validateTelefone(tel: string): boolean { const n=tel.replace(/\D/g,""); return n.length>=10&&n.length<=11; }
export function isCelular(tel: string): boolean { const n=tel.replace(/\D/g,""); return n.length===11&&n[2]==="9"; }
export function formatWhatsApp(tel: string): string { const n=tel.replace(/\D/g,""); if(n.length===11)return "+55"+n; if(n.length===13&&n.startsWith("55"))return "+"+n; return "+55"+n; }
export default { formatTelefone, unformatTelefone, validateTelefone, isCelular, formatWhatsApp };
