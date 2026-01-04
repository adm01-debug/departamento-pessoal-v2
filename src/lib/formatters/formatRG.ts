export function formatRG(rg: string): string { const n=rg.replace(/[^0-9Xx]/gi,"").slice(0,9).toUpperCase(); if(n.length<=2)return n; if(n.length<=5)return n.slice(0,2)+"."+n.slice(2); if(n.length<=8)return n.slice(0,2)+"."+n.slice(2,5)+"."+n.slice(5); return n.slice(0,2)+"."+n.slice(2,5)+"."+n.slice(5,8)+"-"+n.slice(8); }
export function unformatRG(rg: string): string { return rg.replace(/[^0-9Xx]/gi,"").toUpperCase(); }
export function validateRG(rg: string): boolean { const n=rg.replace(/[^0-9Xx]/gi,""); return n.length>=7&&n.length<=9; }
export default { formatRG, unformatRG, validateRG };
