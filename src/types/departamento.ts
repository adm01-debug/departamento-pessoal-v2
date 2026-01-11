// V15-166: src/types/departamento.ts
export interface Departamento {
  id: string;
  empresa_id: string;
  nome: string;
  sigla?: string;
  descricao?: string;
  departamento_pai_id?: string;
  responsavel_id?: string;
  responsavel_nome?: string;
  centro_custo?: string;
  local?: string;
  ativo: boolean;
  colaboradores_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DepartamentoFormData extends Omit<Departamento, 'id' | 'created_at' | 'updated_at' | 'responsavel_nome' | 'colaboradores_count'> {}

export interface DepartamentoTree extends Departamento {
  children?: DepartamentoTree[];
  level: number;
}
