export interface Documento { id: string; colaboradorId?: string; tipo: string; nome: string; arquivo: string; dataUpload: Date; dataValidade?: Date; tags: string[]; versao: number; }
export function verificarVencimento(doc: Documento): boolean { if (!doc.dataValidade) return false; return doc.dataValidade < new Date(); }
export function gerarCodigoDocumento(tipo: string): string { return `${tipo.substring(0,3).toUpperCase()}${Date.now()}`; }
export default verificarVencimento;
