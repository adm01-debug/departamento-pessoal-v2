export function formatCPF(cpf: string): string { const n=cpf.replace(/\D/g,"").slice(0,11); if(n.length<=3)return n; if(n.length<=6)return n.slice(0,3)+"."+n.slice(3); if(n.length<=9)return n.slice(0,3)+"."+n.slice(3,6)+"."+n.slice(6); return n.slice(0,3)+"."+n.slice(3,6)+"."+n.slice(6,9)+"-"+n.slice(9); }
export function unformatCPF(cpf: string): string { return cpf.replace(/\D/g,""); }
export function validateCPF(cpf: string): boolean { const n=cpf.replace(/\D/g,""); if(n.length!==11||/^(\d)\1+$/.test(n))return false; let s=0; for(let i=0;i<9;i++)s+=parseInt(n[i])*(10-i); let r=(s*10)%11; if(r===10)r=0; if(r!==parseInt(n[9]))return false; s=0; for(let i=0;i<10;i++)s+=parseInt(n[i])*(11-i); r=(s*10)%11; if(r===10)r=0; return r===parseInt(n[10]); }
export function maskCPF(cpf: string): string { const n=unformatCPF(cpf); if(n.length!==11)return cpf; return "***"+"."+n.slice(3,6)+"."+n.slice(6,9)+"-"+"**"; }
export default { formatCPF, unformatCPF, validateCPF, maskCPF };
