export interface Mensagem { id: string; remetenteId: string; destinatarioId: string; conteudo: string; dataEnvio: Date; lida: boolean; }
export interface Canal { id: string; nome: string; tipo: "DIRETO" | "GRUPO" | "CANAL"; participantes: string[]; }
export function enviarMensagem(canal: string, remetente: string, conteudo: string): Mensagem { return { id: `MSG${Date.now()}`, remetenteId: remetente, destinatarioId: canal, conteudo, dataEnvio: new Date(), lida: false }; }
export default enviarMensagem;
