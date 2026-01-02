// Índice de hooks do DP System
export { useCRUD } from './useCRUD';
export { useSavedFilters } from './useSavedFilters';
export { useFulltextSearch } from './useFulltextSearch';
export { useBulkActions } from './useBulkActions';
export { useSoftDelete } from './useSoftDelete';
export { useVersioning } from './useVersioning';
export { useDuplicate } from './useDuplicate';
export { useInfiniteScroll } from './useInfiniteScroll';
export { useDebouncedValue } from './useDebouncedValue';

// Tipos comuns
export interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  data_admissao: string;
  cargo_id?: string;
  departamento_id?: string;
  salario?: number;
  status: 'ativo' | 'inativo' | 'ferias' | 'afastado';
}

export interface Ferias {
  id: string;
  colaborador_id: string;
  data_inicio: string;
  data_fim: string;
  dias: number;
  status: 'pendente' | 'aprovado' | 'em_gozo' | 'concluido';
}

export interface Afastamento {
  id: string;
  colaborador_id: string;
  tipo: string;
  data_inicio: string;
  data_fim?: string;
  motivo?: string;
}

export interface Cargo {
  id: string;
  nome: string;
  cbo?: string;
  nivel?: string;
  salario_base?: number;
}

export interface Departamento {
  id: string;
  nome: string;
  codigo?: string;
  responsavel_id?: string;
}

export interface Beneficio {
  id: string;
  nome: string;
  tipo: string;
  valor?: number;
}

export interface Documento {
  id: string;
  colaborador_id: string;
  tipo: string;
  numero?: string;
  data_validade?: string;
}

export interface Ponto {
  id: string;
  colaborador_id: string;
  data: string;
  entrada?: string;
  saida?: string;
  horas_trabalhadas?: number;
}

export interface FolhaPagamento {
  id: string;
  competencia: string;
  colaborador_id: string;
  salario_base: number;
  salario_liquido: number;
  status: 'aberta' | 'processando' | 'fechada';
}
