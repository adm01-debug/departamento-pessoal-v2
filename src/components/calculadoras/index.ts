/**
 * @fileoverview Exportações centralizadas das calculadoras trabalhistas
 * @module components/calculadoras
 * @version V8.1
 */

// Calculadoras individuais
export { CalculadoraINSS } from './CalculadoraINSS';
export { CalculadoraIRRF } from './CalculadoraIRRF';
export { CalculadoraFGTS } from './CalculadoraFGTS';
export { CalculadoraHorasExtras } from './CalculadoraHorasExtras';
export { CalculadoraDSR } from './CalculadoraDSR';
export { CalculadoraBancoHoras } from './CalculadoraBancoHoras';

// Default exports como named exports
export { default as CalculadoraINSSDefault } from './CalculadoraINSS';
export { default as CalculadoraIRRFDefault } from './CalculadoraIRRF';
export { default as CalculadoraFGTSDefault } from './CalculadoraFGTS';
export { default as CalculadoraHorasExtrasDefault } from './CalculadoraHorasExtras';
export { default as CalculadoraDSRDefault } from './CalculadoraDSR';
export { default as CalculadoraBancoHorasDefault } from './CalculadoraBancoHoras';
