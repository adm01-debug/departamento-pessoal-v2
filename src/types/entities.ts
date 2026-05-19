export interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
  cbo?: string;
  nivel_hierarquico?: number;
  salario_base?: number;
  ativo?: boolean;
  empresa_id?: string;
  version?: number;
  created_at?: string;
}

export interface Departamento {
  id: string;
  nome: string;
  codigo_centro_custo?: string;
  departamento_pai_id?: string;
  ativo?: boolean;
  empresa_id?: string;
  created_at?: string;
}

export interface Empresa {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  ativo?: boolean;
  created_at?: string;
}
