export type TipoEmprestimo = "CONSIGNADO" | "ANTECIPACAO_SALARIAL" | "ADIANTAMENTO" | "VALE";
export type SituacaoEmprestimo = "ATIVO" | "QUITADO" | "CANCELADO" | "SUSPENSO";
export interface Emprestimo { id: string; colaboradorId: string; tipo: TipoEmprestimo; bancoId?: string; contrato?: string; valorTotal: number; taxaJuros?: number; quantidadeParcelas: number; valorParcela: number; parcelasPagas: number; dataInicio: Date; dataFim?: Date; diaDesconto: number; margemUtilizada?: number; situacao: SituacaoEmprestimo; observacao?: string; }
export interface EmprestimoFilter { colaboradorId?: string; tipo?: TipoEmprestimo; situacao?: SituacaoEmprestimo; }
export interface EmprestimoStats { total: number; ativos: number; quitados: number; valorTotalAtivo: number; parcelasRestantes: number; }
