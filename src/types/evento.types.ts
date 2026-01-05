export type TipoEvento = "PROVENTO" | "DESCONTO" | "INFORMATIVO";
export type OrigemEvento = "MANUAL" | "CALCULADO" | "IMPORTADO" | "AUTOMATICO";
export interface Evento { id: string; colaboradorId: string; folhaId: string; rubricaId: string; rubricaNome?: string; tipo: TipoEvento; quantidade?: number; referencia?: number; valor: number; origem: OrigemEvento; observacao?: string; }
export interface EventoResumo { totalProventos: number; totalDescontos: number; liquido: number; eventos: Evento[]; }
