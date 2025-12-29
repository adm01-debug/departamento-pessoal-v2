/**
 * @fileoverview Service para operações de colaboradores
 * @module services/colaboradoresService
 * @version V8.1 - Corrigido por análise QA
 */
import { supabase } from '@/integrations/supabase/client';
import { Colaborador, ColaboradorFormData, ColaboradorFilters } from '@/types/colaborador';
import { logger } from '@/lib/logger';

// ============================================
// CONSTANTES
// ============================================

const TABLE_NAME = 'colaboradores';

const COLABORADOR_FIELDS = `
  id, nome, cpf, rg, data_nascimento, sexo, estado_civil, 
  email, telefone, celular, endereco, numero, complemento, 
  bairro, cidade, estado, cep, cargo_id, departamento_id, 
  data_admissao, data_demissao, salario, tipo_contrato, 
  jornada_trabalho, banco, agencia, conta, tipo_conta, pix, 
  status, foto_url, empresa_id, created_at, updated_at
`;

const COLABORADOR_WITH_RELATIONS = `
  ${COLABORADOR_FIELDS},
  cargo:cargos(id, nome, cbo),
  departamento:departamentos(id, nome)
`;

// ============================================
// VALIDAÇÕES
// ============================================

/**
 * Valida CPF
 */
function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpfLimpo)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo[9])) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpfLimpo[10]);
}

/**
 * Valida email
 */
function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Sanitiza dados antes de enviar ao banco
 */
function sanitizarDados(dados: Partial<ColaboradorFormData>): Partial<ColaboradorFormData> {
  const sanitizado = { ...dados };
  
  // Limpar CPF
  if (sanitizado.cpf) {
    sanitizado.cpf = sanitizado.cpf.replace(/\D/g, '');
  }
  
  // Limpar telefones
  if (sanitizado.telefone) {
    sanitizado.telefone = sanitizado.telefone.replace(/\D/g, '');
  }
  if (sanitizado.celular) {
    sanitizado.celular = sanitizado.celular.replace(/\D/g, '');
  }
  
  // Limpar CEP
  if (sanitizado.cep) {
    sanitizado.cep = sanitizado.cep.replace(/\D/g, '');
  }
  
  // Normalizar nome
  if (sanitizado.nome) {
    sanitizado.nome = sanitizado.nome.trim().toUpperCase();
  }
  
  // Normalizar email
  if (sanitizado.email) {
    sanitizado.email = sanitizado.email.trim().toLowerCase();
  }
  
  return sanitizado;
}

// ============================================
// SERVICE
// ============================================

export const colaboradoresService = {
  /**
   * Lista colaboradores com filtros opcionais
   */
  async listar(filters?: ColaboradorFilters): Promise<Colaborador[]> {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select(COLABORADOR_WITH_RELATIONS);
      
      // Aplicar filtros
      if (filters?.empresa_id) {
        query = query.eq('empresa_id', filters.empresa_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.departamento_id) {
        query = query.eq('departamento_id', filters.departamento_id);
      }
      if (filters?.cargo_id) {
        query = query.eq('cargo_id', filters.cargo_id);
      }
      if (filters?.tipo_contrato) {
        query = query.eq('tipo_contrato', filters.tipo_contrato);
      }
      if (filters?.search) {
        const search = filters.search.trim();
        query = query.or(`nome.ilike.%${search}%,cpf.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      // Ordenação
      const orderBy = filters?.orderBy || 'nome';
      const orderDirection = filters?.orderDirection || 'asc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      
      // Paginação
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Erro ao listar colaboradores:', error);
        throw new Error(`Falha ao listar colaboradores: ${error.message}`);
      }
      
      return (data ?? []) as Colaborador[];
    } catch (error) {
      logger.error('Erro ao listar colaboradores:', error);
      throw error;
    }
  },

  /**
   * Busca colaborador por ID
   */
  async buscarPorId(id: string): Promise<Colaborador | null> {
    if (!id) {
      throw new Error('ID é obrigatório');
    }
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(COLABORADOR_WITH_RELATIONS)
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Não encontrado
        }
        throw new Error(`Falha ao buscar colaborador: ${error.message}`);
      }
      
      return data as Colaborador;
    } catch (error) {
      logger.error('Erro ao buscar colaborador por ID:', error);
      throw error;
    }
  },

  /**
   * Busca colaborador por CPF
   */
  async buscarPorCPF(cpf: string): Promise<Colaborador | null> {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (!validarCPF(cpfLimpo)) {
      throw new Error('CPF inválido');
    }
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(COLABORADOR_FIELDS)
        .eq('cpf', cpfLimpo)
        .maybeSingle();
      
      if (error) throw error;
      return data as Colaborador | null;
    } catch (error) {
      logger.error('Erro ao buscar colaborador por CPF:', error);
      throw error;
    }
  },

  /**
   * Cria novo colaborador
   */
  async criar(dados: ColaboradorFormData): Promise<Colaborador> {
    // Validações
    if (!dados.nome?.trim()) {
      throw new Error('Nome é obrigatório');
    }
    if (!dados.cpf) {
      throw new Error('CPF é obrigatório');
    }
    if (!validarCPF(dados.cpf)) {
      throw new Error('CPF inválido');
    }
    if (dados.email && !validarEmail(dados.email)) {
      throw new Error('Email inválido');
    }
    
    // Verificar se CPF já existe
    const existente = await this.buscarPorCPF(dados.cpf);
    if (existente) {
      throw new Error('CPF já cadastrado');
    }
    
    // Sanitizar dados
    const dadosSanitizados = sanitizarDados(dados);
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert({
          ...dadosSanitizados,
          status: dadosSanitizados.status || 'ativo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select(COLABORADOR_FIELDS)
        .single();
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('Colaborador já existe com este CPF ou email');
        }
        throw new Error(`Falha ao criar colaborador: ${error.message}`);
      }
      
      logger.info('Colaborador criado:', { id: data.id, nome: data.nome });
      return data as Colaborador;
    } catch (error) {
      logger.error('Erro ao criar colaborador:', error);
      throw error;
    }
  },

  /**
   * Atualiza colaborador existente
   */
  async atualizar(id: string, dados: Partial<ColaboradorFormData>): Promise<Colaborador> {
    if (!id) {
      throw new Error('ID é obrigatório');
    }
    
    // Validações
    if (dados.email && !validarEmail(dados.email)) {
      throw new Error('Email inválido');
    }
    if (dados.cpf && !validarCPF(dados.cpf)) {
      throw new Error('CPF inválido');
    }
    
    // Sanitizar dados
    const dadosSanitizados = sanitizarDados(dados);
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...dadosSanitizados,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(COLABORADOR_FIELDS)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Colaborador não encontrado');
        }
        throw new Error(`Falha ao atualizar colaborador: ${error.message}`);
      }
      
      logger.info('Colaborador atualizado:', { id: data.id });
      return data as Colaborador;
    } catch (error) {
      logger.error('Erro ao atualizar colaborador:', error);
      throw error;
    }
  },

  /**
   * Inativa colaborador (soft delete)
   */
  async inativar(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID é obrigatório');
    }
    
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          status: 'inativo',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      logger.info('Colaborador inativado:', { id });
    } catch (error) {
      logger.error('Erro ao inativar colaborador:', error);
      throw error;
    }
  },

  /**
   * Exclui colaborador permanentemente
   * ATENÇÃO: Usar apenas para correção de dados
   */
  async excluir(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID é obrigatório');
    }
    
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      logger.warn('Colaborador excluído permanentemente:', { id });
    } catch (error) {
      logger.error('Erro ao excluir colaborador:', error);
      throw error;
    }
  },

  /**
   * Conta colaboradores por status
   */
  async contarPorStatus(empresa_id?: string): Promise<Record<string, number>> {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select('status');
      
      if (empresa_id) {
        query = query.eq('empresa_id', empresa_id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data ?? []).reduce((acc, item) => {
        const status = item.status ?? 'ativo';
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      logger.error('Erro ao contar colaboradores por status:', error);
      throw error;
    }
  },

  /**
   * Conta total de colaboradores
   */
  async contarTotal(filters?: ColaboradorFilters): Promise<number> {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select('id', { count: 'exact', head: true });
      
      if (filters?.empresa_id) {
        query = query.eq('empresa_id', filters.empresa_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      const { count, error } = await query;
      
      if (error) throw error;
      return count ?? 0;
    } catch (error) {
      logger.error('Erro ao contar colaboradores:', error);
      throw error;
    }
  },

  /**
   * Lista colaboradores aniversariantes do mês
   */
  async listarAniversariantes(mes: number, empresa_id?: string): Promise<Colaborador[]> {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select(COLABORADOR_FIELDS)
        .eq('status', 'ativo');
      
      if (empresa_id) {
        query = query.eq('empresa_id', empresa_id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filtrar por mês de nascimento
      return (data ?? []).filter(colab => {
        if (!colab.data_nascimento) return false;
        const mesNascimento = new Date(colab.data_nascimento).getMonth() + 1;
        return mesNascimento === mes;
      }) as Colaborador[];
    } catch (error) {
      logger.error('Erro ao listar aniversariantes:', error);
      throw error;
    }
  },

  /**
   * Lista colaboradores com admissão no mês
   */
  async listarAdmissoesMes(mes: number, ano: number, empresa_id?: string): Promise<Colaborador[]> {
    const inicioMes = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const fimMes = `${ano}-${String(mes).padStart(2, '0')}-31`;
    
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select(COLABORADOR_FIELDS)
        .gte('data_admissao', inicioMes)
        .lte('data_admissao', fimMes);
      
      if (empresa_id) {
        query = query.eq('empresa_id', empresa_id);
      }
      
      const { data, error } = await query.order('data_admissao');
      
      if (error) throw error;
      return (data ?? []) as Colaborador[];
    } catch (error) {
      logger.error('Erro ao listar admissões do mês:', error);
      throw error;
    }
  },
};

export default colaboradoresService;
