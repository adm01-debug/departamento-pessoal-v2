/**
 * tiposExame
 * Constants para Departamento Pessoal
 */

export const tiposExame = {
  // Valores padrão
  DEFAULT: 'padrao',
  
  // Lista de opções
  options: [
    { value: 'tipo1', label: 'Tipo 1', descricao: 'Descrição do tipo 1' },
    { value: 'tipo2', label: 'Tipo 2', descricao: 'Descrição do tipo 2' },
    { value: 'tipo3', label: 'Tipo 3', descricao: 'Descrição do tipo 3' },
  ],

  // Mapeamento por código
  byCode: {
    'T1': { nome: 'Tipo 1', ativo: true },
    'T2': { nome: 'Tipo 2', ativo: true },
    'T3': { nome: 'Tipo 3', ativo: false },
  },

  // Helper para obter label
  getLabel(value: string): string {
    const option = this.options.find(o => o.value === value);
    return option?.label || value;
  },

  // Helper para listar ativos
  getActive(): typeof this.options {
    return this.options.filter(o => this.byCode[o.value]?.ativo);
  },
} as const;

export type tiposExameType = keyof typeof tiposExame.byCode;

export default tiposExame;
