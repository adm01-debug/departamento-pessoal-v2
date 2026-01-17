// V18: Tipos de Benefícios - Formatado e Documentado

/**
 * Tipos de benefícios disponíveis
 */
export type TipoBeneficio = 
  | 'vale_transporte' 
  | 'vale_refeicao' 
  | 'vale_alimentacao' 
  | 'plano_saude' 
  | 'plano_odontologico' 
  | 'seguro_vida' 
  | 'previdencia_privada' 
  | 'auxilio_creche'
  | 'auxilio_educacao'
  | 'auxilio_combustivel'
  | 'gympass'
  | 'outros';

/**
 * Tipo de desconto do benefício
 */
export type TipoDesconto = 'percentual' | 'fixo' | 'sem_desconto';

/**
 * Benefício da empresa
 */
export interface Beneficio {
  id: string;
  empresa_id: string;
  
  // Dados do benefício
  nome: string;
  descricao?: string;
  tipo: TipoBeneficio;
  
  // Valores
  valor_empresa: number;
  valor_colaborador: number;
  tipo_desconto: TipoDesconto;
  percentual_desconto?: number;
  
  // Fornecedor
  fornecedor?: string;
  contrato?: string;
  
  // Status
  ativo: boolean;
  
  // Metadados
  created_at: string;
  updated_at?: string;
}

/**
 * Vínculo de benefício com colaborador
 */
export interface BeneficioColaborador {
  id: string;
  beneficio_id: string;
  colaborador_id: string;
  
  // Dados
  beneficio_nome?: string;
  beneficio_tipo?: TipoBeneficio;
  valor_customizado?: number;
  
  // Período
  data_inicio: string;
  data_fim?: string;
  
  // Status
  ativo: boolean;
  
  // Dependentes (plano saúde)
  inclui_dependentes?: boolean;
  quantidade_dependentes?: number;
  
  // Metadados
  created_at?: string;
}

/**
 * Benefício com dados do colaborador
 */
export interface BeneficioWithColaborador extends BeneficioColaborador {
  colaborador: {
    id: string;
    nome: string;
    cpf: string;
  };
  beneficio: Beneficio;
}

/**
 * Dados do formulário de benefício
 */
export interface BeneficioFormData extends Omit<Beneficio, 'id' | 'created_at' | 'updated_at'> {}

/**
 * Dados para atribuir benefício a colaborador
 */
export interface AtribuirBeneficioData {
  beneficio_id: string;
  colaborador_id: string;
  valor_customizado?: number;
  data_inicio?: string;
  inclui_dependentes?: boolean;
}

/**
 * Filtros para listagem de benefícios
 */
export interface BeneficioFilters {
  empresa_id?: string;
  tipo?: TipoBeneficio;
  ativo?: boolean;
}

/**
 * Resumo de benefícios para dashboard
 */
export interface BeneficioResumo {
  tipo: TipoBeneficio;
  nome: string;
  total_colaboradores: number;
  custo_mensal_empresa: number;
  desconto_mensal_colaboradores: number;
}
