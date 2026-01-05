export type TipoExame = "ADMISSIONAL" | "PERIODICO" | "RETORNO_TRABALHO" | "MUDANCA_FUNCAO" | "DEMISSIONAL";
export type ResultadoExame = "APTO" | "INAPTO" | "APTO_COM_RESTRICAO";
export interface Exame { id: string; colaboradorId: string; tipo: TipoExame; dataExame: Date; dataValidade: Date; resultado?: ResultadoExame; medico: string; crm: string; riscos?: string[]; observacoes?: string; }
export interface ExameStats { total: number; vencidos: number; aVencer30Dias: number; }
