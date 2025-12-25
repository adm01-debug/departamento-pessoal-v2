/**
 * @fileoverview Tipos para feriados
 * @module types/feriado
 */
export interface Feriado {
  id: string;
  data: string;
  nome: string;
  tipo: 'nacional' | 'estadual' | 'municipal' | 'ponto_facultativo';
  uf?: string;
  cidade?: string;
  recorrente?: boolean;
  created_at?: string;
}

export interface FeriadoFormData extends Omit<Feriado, 'id' | 'created_at'> {}

export interface FeriadoFilters {
  ano?: number;
  mes?: number;
  tipo?: Feriado['tipo'];
  uf?: string;
}

export const TIPOS_FERIADO: Record<Feriado['tipo'], string> = {
  nacional: 'Nacional',
  estadual: 'Estadual',
  municipal: 'Municipal',
  ponto_facultativo: 'Ponto Facultativo',
};

export const UFS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
] as const;
