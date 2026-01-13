// V20-TYPE008: Relatorios Types
export interface Relatorio {
  id: string;
  tipo: TipoRelatorio;
  titulo: string;
  filtros: Record<string, any>;
  formato: "PDF" | "EXCEL" | "CSV";
  url?: string;
  geradoEm: Date;
}
export type TipoRelatorio = "FOLHA" | "FERIAS" | "RESCISOES" | "ADMISSOES" | "PONTO" | "BENEFICIOS" | "ESOCIAL";
export interface FiltroRelatorio {
  dataInicio?: Date;
  dataFim?: Date;
  colaboradorId?: string;
  departamento?: string;
}
