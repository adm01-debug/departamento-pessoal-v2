// V18: Formatters Index - Exporta todos os formatadores
export * from './currency';
export * from './date';
export * from './phone';

// Re-exportar dos validadores para conveniência
export { formatCPF, cleanCPF } from '@/utils/cpfValidator';
export { formatCNPJ, cleanCNPJ } from '@/utils/cnpjValidator';
export { formatPIS, cleanPIS } from '@/utils/pisValidator';
export { formatCEP, cleanCEP } from '@/utils/cepValidator';
export { formatTelefone, cleanTelefone } from '@/utils/telefoneValidator';
export { formatCTPS } from '@/utils/ctpsValidator';
