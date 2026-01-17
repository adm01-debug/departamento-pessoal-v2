// V18: Tipos de Colaborador - Formatado e Documentado

/**
 * Tipos de contrato de trabalho
 */
export type TipoContrato = 'clt' | 'pj' | 'estagio' | 'temporario' | 'autonomo';

/**
 * Status do colaborador
 */
export type StatusColaborador = 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'demitido';

/**
 * Interface principal do Colaborador
 */
export interface Colaborador {
  id: string;
  empresa_id: string;
  
  // Dados pessoais
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  foto_url?: string;
  
  // Documentos
  rg?: string;
  pis?: string;
  ctps_numero?: string;
  ctps_serie?: string;
  
  // Dados profissionais
  data_admissao: string;
  data_demissao?: string;
  salario: number;
  cargo_id?: string;
  cargo?: string;
  departamento_id?: string;
  departamento?: string;
  tipo_contrato: TipoContrato;
  status: StatusColaborador;
  
  // Dados bancários
  banco?: string;
  agencia?: string;
  conta?: string;
  conta_tipo?: 'corrente' | 'poupanca';
  
  // Metadados
  created_at: string;
  updated_at: string;
}

/**
 * Dados do formulário de colaborador (sem campos auto-gerados)
 */
export interface ColaboradorFormData extends Omit<Colaborador, 'id' | 'created_at' | 'updated_at'> {}

/**
 * Filtros para listagem de colaboradores
 */
export interface ColaboradorFilters {
  search?: string;
  status?: StatusColaborador;
  departamento_id?: string;
  cargo_id?: string;
  tipo_contrato?: TipoContrato;
  empresa_id?: string;
}

/**
 * Colaborador com relações
 */
export interface ColaboradorWithRelations extends Colaborador {
  cargo_info?: {
    id: string;
    nome: string;
    cbo?: string;
  };
  departamento_info?: {
    id: string;
    nome: string;
  };
  dependentes?: Array<{
    id: string;
    nome: string;
    parentesco: string;
    data_nascimento: string;
  }>;
}

/**
 * Resumo do colaborador para listagens
 */
export interface ColaboradorResumo {
  id: string;
  nome: string;
  cpf: string;
  cargo?: string;
  departamento?: string;
  status: StatusColaborador;
}
