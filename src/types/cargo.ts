// V15-165: src/types/cargo.ts
export interface Cargo {
  id: string;
  empresa_id: string;
  nome: string;
  cbo: string;
  descricao?: string;
  nivel: NivelCargo;
  departamento_id?: string;
  salario_minimo?: number;
  salario_maximo?: number;
  carga_horaria_semanal: number;
  periculosidade: boolean;
  insalubridade: boolean;
  grau_insalubridade?: GrauInsalubridade;
  requisitos?: string;
  responsabilidades?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type NivelCargo = 'junior' | 'pleno' | 'senior' | 'especialista' | 'coordenador' | 'gerente' | 'diretor';
export type GrauInsalubridade = 'minimo' | 'medio' | 'maximo';

export interface CargoFormData extends Omit<Cargo, 'id' | 'created_at' | 'updated_at'> {}

export interface CBO {
  codigo: string;
  titulo: string;
  familia: string;
  descricao?: string;
}
