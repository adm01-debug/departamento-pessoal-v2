// V20-027: Index de Exports Calculadoras
export * from './inss';
export * from './irrf';
export * from './fgts';
export * from './ferias';
export { calcularRescisao, type DadosRescisao, type ResultadoRescisao } from './rescisao';
export { calcularHoraExtra, calcularHorasExtrasComDSR, type ResultadoHoraExtra, type ResultadoAdicionalNoturno } from './horasExtras';
export * from './decimo13';
export { calcularAdicionalNoturno as calcularAdicionalNoturnoDetalhado, type ParamsNoturno, type ResultNoturno } from './adicionalNoturno';
export { calcularDSR as calcularDSRDetalhado, calcularDSRHorasExtras, calcularDSRComissoes, calcularDSRComissionado, calcularDSRTotal, type ParamsDSR, type ParamsDSRComissionado, type VariaveisMes } from './dsr';
export { calcularMultaFGTS, estimarSaldoFGTS, getPercentualMulta, getPercentualSaque, type ParamsMultaFGTS, type ResultadoMultaFGTS } from './multaFGTS';
export * from './jornada';
export * from './contribuicaoSindical';
export * from './seguroDesemprego';
export * from './custosPessoal';
export * from './mediaVariaveis';
export * from './reflexos';

// Re-export de constantes
export { TRABALHISTAS_2026 } from '@/constants/trabalhistas2026';
export { FERIADOS_2026 } from '@/constants/feriados2026';
