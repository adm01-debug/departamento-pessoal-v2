import { supabase } from '@/integrations/supabase/client';

export interface CNABConfig {
  banco_codigo: string;
  agencia: string;
  agencia_digito?: string;
  conta: string;
  conta_digito: string;
  convenio: string;
  codigo_empresa?: string;
  nome_empresa?: string;
}

export const cnabService = {
  async getConfig(empresaId: string): Promise<CNABConfig | null> {
    const { data, error } = await supabase
      .from('cnab_configuracoes' as any)
      .select('*')
      .eq('empresa_id', empresaId)
      .maybeSingle();
    
    if (error) throw error;
    return data as any as CNABConfig | null;
  },

  async saveConfig(empresaId: string, config: CNABConfig) {
    const { data: existing } = await supabase
      .from('cnab_configuracoes' as any)
      .select('id')
      .eq('empresa_id', empresaId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('cnab_configuracoes' as any)
        .update(config)
        .eq('id', (existing as any).id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cnab_configuracoes' as any)
        .insert([{ empresa_id: empresaId, ...config }]);
      if (error) throw error;
    }
  },

  async listRemessas(empresaId: string) {
    const { data, error } = await supabase
      .from('cnab_remessas' as any)
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async listPixLotes(empresaId: string) {
    const { data, error } = await supabase
      .from('pix_lotes' as any)
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async generateCNAB240(empresaId: string, folhaId: string): Promise<string> {
    const config = await this.getConfig(empresaId);
    if (!config) throw new Error('Configuração CNAB não encontrada para esta empresa.');

    // Busca itens da folha detalhados
    const { data: itens, error: hError } = await supabase
      .from('folha_itens')
      .select(`
        *, 
        colaborador:colaboradores(id, nome_completo, cpf)
      `)
      .eq('folha_id', folhaId);
    
    if (hError) throw hError;
    if (!itens?.length) throw new Error('Nenhum pagamento encontrado para gerar CNAB.');

    // Busca contas bancárias dos colaboradores
    const colaboradorIds = itens.map(i => i.colaborador_id);
    const { data: contas, error: cError } = await supabase
      .from('contas_bancarias' as any)
      .select('*')
      .in('colaborador_id', colaboradorIds)
      .eq('principal', true);

    if (cError) throw cError;

    const lines: string[] = [];
    let sequence = 1;

    const pad = (val: any, len: number, char = ' ', side: 'left' | 'right' = 'right') => {
      const s = String(val).substring(0, len);
      return side === 'right' ? s.padEnd(len, char) : s.padStart(len, char);
    };

    const formatAmount = (val: number) => pad(Math.round(val * 100), 15, '0', 'left');

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = today.toTimeString().slice(0, 8).replace(/:/g, '');

    // Header Arquivo (Registro 0)
    let header = pad(config.banco_codigo, 3, '0', 'left');
    header += '0000'; // Lote
    header += '0'; // Registro
    header += pad('', 9); // Reservado
    header += '2'; // Inscrição Empresa (CNPJ)
    header += pad('', 14, '0'); // CNPJ Placeholder
    header += pad(config.convenio, 20);
    header += pad(config.agencia, 5, '0', 'left');
    header += pad(config.agencia_digito || '', 1);
    header += pad(config.conta, 12, '0', 'left');
    header += pad(config.conta_digito, 1);
    header += ' ';
    header += pad(config.nome_empresa || 'EMPRESA', 30);
    header += pad('BANCO', 30);
    header += pad('', 10);
    header += '1'; // Remessa
    header += dateStr;
    header += timeStr;
    header += pad(sequence, 6, '0', 'left'); // NSA
    header += '081'; // Layout
    header += '00000';
    header += pad('', 69);
    lines.push(header.padEnd(240, ' '));

    let totalAmount = 0;
    let detailSequence = 1;

    for (const item of itens) {
      const colab = item.colaborador as any;
      const conta = (contas as any[])?.find(c => c.colaborador_id === item.colaborador_id);
      if (!conta) continue;

      const valor = Number(item.total_liquido);
      totalAmount += valor;

      // Segmento A (Crédito em Conta)
      let segA = pad(config.banco_codigo, 3, '0', 'left');
      segA += '0001'; // Lote
      segA += '3'; // Registro
      segA += pad(detailSequence++, 5, '0', 'left');
      segA += 'A'; // Segmento
      segA += '000'; // Inclusão
      segA += '000'; // Câmara
      segA += pad(conta.banco_codigo || '000', 3, '0', 'left');
      segA += pad(conta.agencia || '', 5, '0', 'left');
      segA += pad(conta.agencia_digito || '', 1);
      segA += pad(conta.conta || '', 12, '0', 'left');
      segA += pad(conta.digito || '', 1);
      segA += ' ';
      segA += pad(colab.nome_completo || '', 30);
      segA += pad(item.id.substring(0, 20), 20); // Documento
      segA += dateStr;
      segA += 'BRL';
      segA += pad('', 15, '0');
      segA += formatAmount(valor);
      segA += pad('', 20);
      segA += pad('', 8, '0');
      segA += pad('', 15, '0');
      segA += pad('', 40);
      segA += '00';
      segA += pad('', 10);
      lines.push(segA.padEnd(240, ' '));
    }

    // Trailer Arquivo (Registro 9)
    let trailer = pad(config.banco_codigo, 3, '0', 'left');
    trailer += '9999';
    trailer += '9';
    trailer += pad('', 9);
    trailer += '000001';
    trailer += pad(lines.length + 1, 6, '0', 'left');
    trailer += pad('', 6, '0');
    trailer += pad('', 205);
    lines.push(trailer.padEnd(240, ' '));

    return lines.join('\r\n');
  },

  async generatePIXBatch(empresaId: string, folhaId: string): Promise<string> {
    const { data: itens, error: hError } = await supabase
      .from('folha_itens')
      .select(`
        *, 
        colaborador:colaboradores(id, nome_completo, cpf)
      `)
      .eq('folha_id', folhaId);
    
    if (hError) throw hError;
    if (!itens?.length) throw new Error('Nenhum pagamento encontrado para gerar lote PIX.');

    const colaboradorIds = itens.map(i => i.colaborador_id);
    const { data: contas, error: cError } = await supabase
      .from('contas_bancarias' as any)
      .select('*')
      .in('colaborador_id', colaboradorIds)
      .eq('principal', true);

    if (cError) throw cError;

    const csvLines = ['Nome;CPF/CNPJ;Chave Pix;Tipo Chave;Valor;Descricao;ID_Folha_Item'];
    let totalAmount = 0;

    for (const item of itens) {
      const colab = item.colaborador as any;
      const conta = (contas as any[])?.find(c => c.colaborador_id === item.colaborador_id);
      if (!conta || !conta.pix_chave) continue;

      const valor = Number(item.total_liquido);
      totalAmount += valor;
      const valorStr = valor.toFixed(2).replace('.', ',');
      
      csvLines.push(`${colab.nome_completo};${colab.cpf || ''};${conta.pix_chave};${conta.pix_tipo || 'CPF'};${valorStr};Pagamento Salarial;${item.id}`);
    }

    if (csvLines.length === 1) throw new Error('Nenhum colaborador com chave PIX cadastrada nesta folha.');

    return csvLines.join('\n');
  }
};
