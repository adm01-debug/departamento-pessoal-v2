import { BaseService } from './baseService';

class AdmissaoService extends BaseService<any> {
  constructor() {
    super('admissoes', { 
      defaultOrderBy: 'data_prevista' 
    });
  }

  async listar(empresaId?: string): Promise<any[]> {
    let query = this.getQuery().select('*').order('data_prevista', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Aliases
  async getAll(empresaId?: string) { return this.listar(empresaId); }
  async getById(id: string) { return this.buscarPorId(id); }
  async create(d: any) { return this.criar(d); }
  async update(id: string, d: any) { return this.atualizar(id, d); }
  async concluir(id: string) { return this.update(id, { etapa: 'concluida' }); }
  async cancelar(id: string) { return this.update(id, { etapa: 'cancelada' }); }
}

export const admissaoService = new AdmissaoService();
