export type TipoLotacao = "DEPARTAMENTO" | "FILIAL" | "CENTRO_CUSTO" | "PROJETO" | "OBRA";
export interface Lotacao { id: string; codigo: string; descricao: string; tipo: TipoLotacao; empresaId: string; lotacaoPaiId?: string; codigoContabil?: string; responsavelId?: string; codigoESocial?: string; ativo: boolean; createdAt?: Date; updatedAt?: Date; }
export interface LotacaoFilter { tipo?: TipoLotacao; empresaId?: string; ativo?: boolean; }
export interface LotacaoStats { total: number; ativos: number; porTipo: Record<TipoLotacao, number>; }
export interface LotacaoFormData extends Omit<Lotacao, "id" | "createdAt" | "updatedAt"> {}
