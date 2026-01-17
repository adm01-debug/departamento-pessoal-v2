// V18: Tipos de Empresa - Formatado e Documentado

/**
 * Regime tributário da empresa
 */
export type RegimeTributario = 
  | 'simples_nacional' 
  | 'lucro_presumido' 
  | 'lucro_real'
  | 'mei';

/**
 * Status da empresa
 */
export type StatusEmpresa = 'ativa' | 'inativa' | 'suspensa';

/**
 * Porte da empresa
 */
export type PorteEmpresa = 'mei' | 'me' | 'epp' | 'medio' | 'grande';

/**
 * Interface principal da Empresa
 */
export interface Empresa {
  id: string;
  
  // Dados principais
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  
  // Contato
  email?: string;
  telefone?: string;
  site?: string;
  
  // Endereço
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  
  // Fiscal
  regime_tributario?: RegimeTributario;
  porte?: PorteEmpresa;
  cnae_principal?: string;
  cnaes_secundarios?: string[];
  
  // eSocial
  codigo_lotacao?: string;
  certificado_digital?: boolean;
  ambiente_esocial?: 'producao' | 'homologacao';
  
  // Status
  status: StatusEmpresa;
  
  // Visual
  logo_url?: string;
  cor_primaria?: string;
  
  // Metadados
  created_at: string;
  updated_at: string;
}

/**
 * Dados do formulário de empresa
 */
export interface EmpresaFormData extends Omit<Empresa, 'id' | 'created_at' | 'updated_at'> {}

/**
 * Empresa com contadores
 */
export interface EmpresaWithStats extends Empresa {
  total_colaboradores: number;
  colaboradores_ativos: number;
  total_departamentos: number;
  total_cargos: number;
}

/**
 * Filtros para listagem de empresas
 */
export interface EmpresaFilters {
  status?: StatusEmpresa;
  regime_tributario?: RegimeTributario;
  uf?: string;
  search?: string;
}
