export interface Manifestacao { id: string; tipo: "DENUNCIA" | "RECLAMACAO" | "SUGESTAO" | "ELOGIO"; descricao: string; anonima: boolean; colaboradorId?: string; dataRegistro: Date; status: "ABERTA" | "EM_ANALISE" | "RESPONDIDA" | "ARQUIVADA"; resposta?: string; }
export function registrarManifestacao(tipo: string, descricao: string, anonima: boolean): Manifestacao { return { id: `OUV${Date.now()}`, tipo: tipo as any, descricao, anonima, dataRegistro: new Date(), status: "ABERTA" }; }
export default registrarManifestacao;
