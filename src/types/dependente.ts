// V15-168: src/types/dependente.ts
export interface Dependente {
  id: string;
  colaborador_id: string;
  nome: string;
  cpf?: string;
  data_nascimento: string;
  grau_parentesco: GrauParentesco;
  sexo: 'M' | 'F';
  deficiente: boolean;
  tipo_deficiencia?: string;
  ir_dedutivel: boolean;
  salario_familia: boolean;
  plano_saude: boolean;
  documento_url?: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type GrauParentesco =
  | 'conjuge'
  | 'companheiro'
  | 'filho'
  | 'filha'
  | 'enteado'
  | 'enteada'
  | 'pai'
  | 'mae'
  | 'avo'
  | 'bisavo'
  | 'irmao'
  | 'neto'
  | 'bisneto'
  | 'menor_tutelado'
  | 'outros';

export interface DependenteFormData extends Omit<Dependente, 'id' | 'created_at' | 'updated_at'> {}
