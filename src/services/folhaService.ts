import { BaseService, ListOptions, ListResponse } from './baseService';

class FolhaService extends BaseService<any> {
  constructor() {
    super('folhas_pagamento', {
      defaultOrderBy: 'competencia',
      searchColumn: 'competencia',
    });
  }

  async listar(options: ListOptions = {}): Promise<ListResponse<any>> {
    return super.listar({ ...options, orderAscending: false });
  }

  // Retorna array simples (usado por FinanceiroBancarioPage)
  async list(empresaId?: string): Promise<any[]> {
    if (!empresaId) return [];
    const { data, error } = await this.getQuery()
      .select('*')
      .eq('empresa_id', empresaId)
      .order('competencia', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Mantém compat com código legado
  async listarFolhas(competencia?: string, empresaId?: string) {
    if (!empresaId) return [];
    let query = this.getQuery().select('*').eq('empresa_id', empresaId).order('competencia', { ascending: false });
    if (competencia) query = query.eq('competencia', competencia);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}

export const folhaService = new FolhaService();
