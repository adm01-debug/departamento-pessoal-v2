import { BaseService, ListOptions, ListResponse } from './baseService';

class FolhaService extends BaseService<any> {
  constructor() {
    super('folhas_pagamento', { 
      defaultOrderBy: 'competencia' 
    });
  }

  async list(competencia?: string, empresaId?: string): Promise<any[]> {
    let query = this.getQuery().select('*').order('competencia', { ascending: false }).limit(500);
    
    if (empresaId) query = query.eq('empresa_id', empresaId);
    if (competencia) query = query.eq('competencia', competencia);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async listar(options: ListOptions = {}): Promise<ListResponse<any>> {
    const { filters, search } = options;
    const competencia = search || (filters as any)?.competencia;
    const empresaId = (filters as any)?.empresa_id;
    const data = await this.list(competencia, empresaId);
    return { data, total: data.length };
  }

  // Alias
  async listarFolhas(competencia?: string, empresaId?: string) {
    return this.list(competencia, empresaId);
  }


}

export const folhaService = new FolhaService();
