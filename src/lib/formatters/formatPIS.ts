export function formatPIS(pis: string): string { const n=pis.replace(/\D/g,"").slice(0,11); if(n.length<=3)return n; if(n.length<=8)return n.slice(0,3)+"."+n.slice(3); if(n.length<=10)return n.slice(0,3)+"."+n.slice(3,8)+"."+n.slice(8); return n.slice(0,3)+"."+n.slice(3,8)+"."+n.slice(8,10)+"-"+n.slice(10); }
export function unformatPIS(pis: string): string { return pis.replace(/\D/g,""); }
export function validatePIS(pis: string): boolean { const n=pis.replace(/\D/g,""); if(n.length!==11||/^(\d)\1+$/.test(n))return false; const m=[3,2,9,8,7,6,5,4,3,2]; let s=0; for(let i=0;i<10;i++)s+=parseInt(n[i])*m[i]; const r=11-(s%11); const d=r>9?0:r; return d===parseInt(n[10]); }
export default { formatPIS, unformatPIS, validatePIS };
