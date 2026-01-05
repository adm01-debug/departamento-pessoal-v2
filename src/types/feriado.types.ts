export type TipoFeriado = "NACIONAL" | "ESTADUAL" | "MUNICIPAL" | "PONTO_FACULTATIVO";
export interface Feriado { id: string; data: Date; descricao: string; tipo: TipoFeriado; uf?: string; municipioId?: string; recorrente: boolean; ativo: boolean; }
export interface FeriadoFilter { ano?: number; tipo?: TipoFeriado; uf?: string; }
export const FERIADOS_NACIONAIS_FIXOS = [{ dia: 1, mes: 1, descricao: "Confraternização Universal" }, { dia: 21, mes: 4, descricao: "Tiradentes" }, { dia: 1, mes: 5, descricao: "Dia do Trabalho" }, { dia: 7, mes: 9, descricao: "Independência" }, { dia: 12, mes: 10, descricao: "Nossa Senhora Aparecida" }, { dia: 2, mes: 11, descricao: "Finados" }, { dia: 15, mes: 11, descricao: "Proclamação da República" }, { dia: 25, mes: 12, descricao: "Natal" }];
