/**
 * @fileoverview Tipos para gestão de benefícios
 * @module types/beneficio
 */

export interface Beneficio {
  id: string;
  colaborador_id: string;
  tipo: 'vt' | 'vr' | 'va' | 'plano_saude' | 'plano_odonto' | 'seguro_vida' | 'gym' | 'outro';
  descricao?: string;
  valor: number;
  valor_empresa?: number;
  valor_colaborador?: number;
  data_inicio: string;
  data_fim?: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  observacoes?: string;
  created_at?: string;
}

export interface BeneficioFormData extends Omit<Beneficio, 'id' | 'created_at'> {}

export interface BeneficioFilters {
  colaborador_id?: string;
  tipo?: Beneficio['tipo'];
  status?: Beneficio['status'];
}

export const TIPOS_BENEFICIO: Record<Beneficio['tipo'], string> = {
  vt: 'Vale Transporte',
  vr: 'Vale Refeição',
  va: 'Vale Alimentação',
  plano_saude: 'Plano de Saúde',
  plano_odonto: 'Plano Odontológico',
  seguro_vida: 'Seguro de Vida',
  gym: 'Academia/Gympass',
  outro: 'Outro',
};

