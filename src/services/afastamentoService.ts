import { supabase } from '@/integrations/supabase/client';

const ensureSingleResult = <T>(data: T | null, entity: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${entity} foi retornado.`);
  return data;
};

export const afastamentoService = {
  // --- Afastamentos ---
  async listar(empresaId?: string, filtros?: any) {
    let query = supabase
      .from('afastamentos')
      .select(`
        *,
        colaborador:colaboradores(nome_completo, departamento:departamentos(nome)),
        cid:cid10(codigo, descricao)
      `)
      .order('data_inicio', { ascending: false });
    
    if (empresaId) query = query.eq('empresa_id', empresaId);
    if (filtros?.status) query = query.eq('status', filtros.status);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('afastamentos')
      .select('*, colaborador:colaboradores(nome_completo), cid:cid10(*)')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async criar(d: any) {
    const { data, error } = await supabase
      .from('afastamentos')
      .insert(d)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return ensureSingleResult(data, 'afastamento');
  },

  async atualizar(id: string, d: any) {
    const { data, error } = await supabase
      .from('afastamentos')
      .update({ ...d, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return ensureSingleResult(data, 'afastamento');
  },

  async excluir(id: string) {
    const { error } = await supabase.from('afastamentos').delete().eq('id', id);
    if (error) throw error;
  },

  // --- CID-10 ---
  async buscarCID(termo: string) {
    const { data, error } = await supabase
      .from('cid10')
      .select('*')
      .or(`codigo.ilike.%${termo}%,descricao.ilike.%${termo}%`)
      .limit(10);
    
    if (error) throw error;
    return data || [];
  },

  // --- Configurações ---
  async listarConfiguracoes() {
    const { data, error } = await supabase
      .from('config_afastamentos')
      .select('*')
      .order('tipo');
    
    if (error) throw error;
    return data || [];
  },

  // --- Documentos ---
  async listarDocumentos(afastamentoId: string) {
    const { data, error } = await supabase
      .from('documentos_afastamento')
      .select('*')
      .eq('afastamento_id', afastamentoId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async uploadDocumento(afastamentoId: string, file: File, tipo: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${afastamentoId}/${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('afastamentos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('afastamentos')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('documentos_afastamento')
      .insert({
        afastamento_id: afastamentoId,
        tipo,
        nome_arquivo: file.name,
        url: publicUrl
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async validarDocumento(id: string, validado: boolean) {
    const { data, error } = await supabase
      .from('documentos_afastamento')
      .update({ validado } as any)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // --- Prorrogações ---
  async listarProrrogacoes(afastamentoId?: string) {
    let query = supabase
      .from('prorrogacoes_afastamento')
      .select('*, documento:documentos_afastamento(*)');
    
    if (afastamentoId) query = query.eq('afastamento_id', afastamentoId);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async criarProrrogacao(d: any) {
    const { data, error } = await supabase
      .from('prorrogacoes_afastamento')
      .insert(d)
      .select()
      .maybeSingle();
    
    if (error) throw error;

    await this.atualizar(d.afastamento_id, {
      data_fim_prevista: d.data_fim_nova,
      status: 'prorrogado'
    });

    return data;
  },

  // --- Cálculos ---
  calcularDias(inicio: string, fim: string): number {
    if (!inicio || !fim) return 0;
    const start = new Date(inicio);
    const end = new Date(fim);
    const diffMs = end.getTime() - start.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 0;
  },

  calcularDistribuicaoDias(diasTotais: number, tipo: string, configs: any[]) {
    const config = configs.find(c => c.tipo === tipo);
    if (!config) return { empresa: diasTotais, inss: 0 };

    const maxEmpresa = config.dias_empresa_maximo ?? 15;
    
    if (diasTotais <= maxEmpresa) {
      return { empresa: diasTotais, inss: 0 };
    } else {
      return { empresa: maxEmpresa, inss: diasTotais - maxEmpresa };
    }
  }
};