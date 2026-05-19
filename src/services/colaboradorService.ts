import { BaseService, ListOptions, ListResponse } from './baseService';
import { Colaborador } from '@/types/entities';
import { supabase } from '@/integrations/supabase/client';

class ColaboradorService extends BaseService<Colaborador> {
  constructor() {
    super('colaboradores', { 
      searchColumn: 'nome_completo', 
      defaultOrderBy: 'nome_completo',
      useVersioning: true 
    });
  }

  async listar(options: ListOptions & { 
    status?: string; 
    departamento?: string; 
    cargo?: string;
    empresaId?: string;
  } = {}): Promise<ListResponse<Colaborador>> {
    const { 
      search, 
      page = 1, 
      pageSize = 25, 
      status, 
      departamento, 
      cargo, 
      empresaId 
    } = options;

    let query = this.getQuery().select('*', { count: 'exact' });

    if (empresaId) query = query.eq('empresa_id', empresaId);
    if (status && status !== 'all') query = query.eq('status', status);
    if (departamento && departamento !== 'all') query = query.eq('departamento', departamento);
    if (cargo && cargo !== 'all') query = query.eq('cargo', cargo);

    if (search) {
      query = query.or(`nome_completo.ilike.%${search}%,cpf.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order('nome_completo', { ascending: true })
      .range(from, to);

    if (error) throw error;
    return { data: (data as Colaborador[]) || [], total: count || 0 };
  }

  // Alias for backward compatibility
  async list(empresaId?: string) {
    return (await this.listar({ filters: { empresa_id: empresaId }, pageSize: 1000 })).data;
  }

  async getById(id: string) { return this.buscarPorId(id); }
  async create(d: any) { return this.criar(d); }
  async update(id: string, d: any) { return this.atualizar(id, d); }

}

export const colaboradorService = new ColaboradorService();
