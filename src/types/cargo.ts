export interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
  departamento_id?: string;
  departamento_nome?: string;
  cbo?: string;
  salario_base?: number;
  salario_minimo?: number;
  salario_maximo?: number;
  nivel?: 'junior' | 'pleno' | 'senior' | 'especialista' | 'gerente' | 'diretor';
  ativo?: boolean;
  created_at?: string;
}

export interface CargoFormData extends Omit<Cargo, 'id' | 'created_at' | 'departamento_nome'> {}

export interface CargoFilters {
  departamento_id?: string;
  nivel?: Cargo['nivel'];
  ativo?: boolean;
  search?: string;
}

export const NIVEIS_CARGO: Record<NonNullable<Cargo['nivel']>, string> = {
  junior: 'Júnior',
  pleno: 'Pleno',
  senior: 'Sênior',
  especialista: 'Especialista',
  gerente: 'Gerente',
  diretor: 'Diretor',
};
