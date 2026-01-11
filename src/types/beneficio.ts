// V15-436
export interface Beneficio { id: string; empresa_id: string; nome: string; tipo: 'vale_transporte' | 'vale_refeicao' | 'vale_alimentacao' | 'plano_saude' | 'plano_odontologico' | 'seguro_vida' | 'previdencia_privada' | 'auxilio_creche' | 'outros'; valor_empresa: number; valor_colaborador: number; tipo_desconto: 'percentual' | 'fixo' | 'sem_desconto'; fornecedor?: string; ativo: boolean; created_at: string; }
export interface BeneficioColaborador { id: string; beneficio_id: string; colaborador_id: string; beneficio_nome?: string; valor_customizado?: number; data_inicio: string; data_fim?: string; ativo: boolean; }
export interface BeneficioFormData extends Omit<Beneficio, 'id' | 'created_at'> {}
export interface AtribuirBeneficioData { beneficio_id: string; colaborador_id: string; valor_customizado?: number; }
