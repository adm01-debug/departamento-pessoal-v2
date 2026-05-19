import { BaseService } from './baseService';
import { Documento } from '@/types/entities';

class DocumentoService extends BaseService<Documento> {
  constructor() {
    super('documentos', { 
      searchColumn: 'nome', 
      defaultOrderBy: 'created_at' 
    });
  }

  async listar(colaboradorId?: string, empresaId?: string): Promise<Documento[]> {
    let query = this.getQuery()
      .select('*, colaborador:colaboradores(id, nome_completo, cpf)')
      .order('created_at', { ascending: false })
      .limit(500);
      
    if (empresaId) query = query.eq('empresa_id', empresaId);
    if (colaboradorId) query = query.eq('colaborador_id', colaboradorId);
    
    const { data, error } = await query;
    if (error) throw error;
    return (data as Documento[]) || [];
  }
}

export const documentoService = new DocumentoService();
