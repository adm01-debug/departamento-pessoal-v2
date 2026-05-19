import { supabase } from '@/integrations/supabase/client';

export interface ListOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderAscending?: boolean;
  filters?: Record<string, any>;
  searchColumn?: string;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
}

export class BaseService<T, CreateDTO = any, UpdateDTO = any> {
  constructor(
    protected table: string,
    protected options: {
      searchColumn?: string;
      defaultOrderBy?: string;
      useVersioning?: boolean;
    } = {}
  ) {}

  protected getQuery() {
    return (supabase as any).from(this.table);
  }

  async listar(options: ListOptions = {}): Promise<ListResponse<T>> {
    const { 
      search, 
      page = 1, 
      pageSize = 10, 
      orderBy = this.options.defaultOrderBy || 'nome', 
      orderAscending = true,
      filters = {},
      searchColumn = this.options.searchColumn || 'nome'
    } = options;

    let query = this.getQuery().select('*', { count: 'exact' });

    // Aplicar filtros dinâmicos
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    if (search && searchColumn) {
      query = query.ilike(searchColumn, `%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order(orderBy, { ascending: orderAscending })
      .range(from, to);

    if (error) throw error;
    return { data: (data as T[]) || [], total: count || 0 };
  }

  async buscarPorId(id: string): Promise<T | null> {
    const { data, error } = await this.getQuery()
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data as T;
  }

  async criar(payload: CreateDTO): Promise<T> {
    const { data, error } = await this.getQuery()
      .insert(payload as any)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error(`Nenhum registro de ${this.table} foi retornado após criação.`);
    return data as T;
  }

  async atualizar(id: string, payload: UpdateDTO): Promise<T> {
    let query = this.getQuery().update(payload as any).eq('id', id);

    if (this.options.useVersioning) {
      const { data: current, error: currentError } = await this.getQuery()
        .select('version')
        .eq('id', id)
        .single();
      
      if (currentError) throw currentError;
      query = query.eq('version', (current as any)?.version || 1);
    }

    const { data, error } = await query.select().maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error(`Falha ao atualizar ${this.table} ou conflito de versão.`);
    return data as T;
  }

  async excluir(id: string): Promise<void> {
    const { error } = await this.getQuery().delete().eq('id', id);
    if (error) throw error;
  }
}

