export type TipoCalculo = "PERCENTUAL" | "VALOR_FIXO";
export type BaseCalculo = "LIQUIDO" | "BRUTO" | "BRUTO_MENOS_INSS_IRRF";
export interface Pensao { id: string; colaboradorId: string; beneficiario: string; cpfBeneficiario?: string; tipoCalculo: TipoCalculo; percentual?: number; valorFixo?: number; baseCalculo: BaseCalculo; banco?: string; agencia?: string; conta?: string; numeroProcesso?: string; vara?: string; dataInicio: Date; dataFim?: Date; ativo: boolean; }
export interface PensaoStats { total: number; ativas: number; valorMensal: number; }
