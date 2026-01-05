export type TipoRubrica = "PROVENTO" | "DESCONTO" | "INFORMATIVA";
export type NaturezaRubrica = "SALARIO" | "HORA_EXTRA" | "DSR" | "ADICIONAL_NOTURNO" | "INSALUBRIDADE" | "PERICULOSIDADE" | "COMISSAO" | "FERIAS" | "13_SALARIO" | "BENEFICIO" | "IMPOSTO" | "CONTRIBUICAO" | "OUTROS";
export interface Rubrica { id: string; codigo: string; descricao: string; tipo: TipoRubrica; natureza: NaturezaRubrica; incideINSS: boolean; incideIRRF: boolean; incideFGTS: boolean; incideFerias: boolean; incide13: boolean; codigoESocial?: string; formula?: string; ativo: boolean; }
export interface RubricaFilter { tipo?: TipoRubrica; natureza?: NaturezaRubrica; ativo?: boolean; }
export interface RubricaStats { total: number; proventos: number; descontos: number; informativas: number; }
