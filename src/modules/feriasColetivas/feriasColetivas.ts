export interface FeriasColetivas { id: string; empresaId: string; dataInicio: Date; dataFim: Date; diasUteis: number; departamentos: string[]; colaboradores: string[]; status: "PLANEJADA" | "COMUNICADA" | "EM_GOZO" | "CONCLUIDA"; }
export function calcularFeriasColetivas(dataInicio: Date, dias: number): { dataFim: Date; diasUteis: number } { const dataFim = new Date(dataInicio.getTime() + dias * 86400000); return { dataFim, diasUteis: dias }; }
export function validarComunicacao(dataInicio: Date, dataComunicacao: Date): boolean { const diasAntecedencia = Math.floor((dataInicio.getTime() - dataComunicacao.getTime()) / 86400000); return diasAntecedencia >= 15; }
export default calcularFeriasColetivas;
