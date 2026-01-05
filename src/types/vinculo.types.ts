export type TipoVinculo = "CLT" | "ESTAGIO" | "TEMPORARIO" | "AUTONOMO" | "PJ" | "AVULSO" | "DOMESTICO" | "APRENDIZ";
export type TipoSalario = "MENSAL" | "HORA" | "TAREFA" | "COMISSAO";
export type FormaPagamento = "DEPOSITO" | "PIX" | "CHEQUE" | "DINHEIRO";
export interface Vinculo { id: string; colaboradorId: string; empresaId: string; tipoVinculo: TipoVinculo; dataAdmissao: Date; dataDesligamento?: Date; matricula: string; cargoId: string; departamentoId: string; jornadaId?: string; salarioBase: number; tipoSalario: TipoSalario; formaPagamento: FormaPagamento; contaBancaria?: string; categoriaESocial: string; sindicatoId?: string; ativo: boolean; }
export interface VinculoFilter { tipoVinculo?: TipoVinculo; empresaId?: string; ativo?: boolean; }
export interface VinculoStats { total: number; ativos: number; porTipo: Record<TipoVinculo, number>; }
