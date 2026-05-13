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

    const { data: itens, error: hError } = await supabase
      .from('folha_itens')
      .select(`
        *, 
        colaborador:colaboradores(id, nome_completo, cpf)
      `)
      .eq('folha_id', folhaId);
    
    if (hError) throw hError;
    if (!itens?.length) throw new Error('Nenhum pagamento encontrado para gerar CNAB.');

    const colaboradorIds = itens.map(i => i.colaborador_id);
    const { data: contas, error: cError } = await supabase
      .from('contas_bancarias' as any)
      .select('*')
      .in('colaborador_id', colaboradorIds)
      .eq('principal', true);

    if (cError) throw cError;

    const { data: remessa, error: rError } = await supabase
      .from('cnab_remessas' as any)
      .insert([{
        empresa_id: empresaId,
        banco_codigo: config.banco_codigo,
        status: 'pendente',
        valor_total: itens.reduce((acc, i) => acc + Number(i.total_liquido), 0),
        total_pagamentos: itens.length
      }])
      .select()
      .single();

    if (rError || !remessa) throw rError || new Error('Falha ao criar remessa');

    const lines: string[] = [];
    let sequence = 1;

    const pad = (val: any, len: number, char = ' ', side: 'left' | 'right' = 'right') => {
      const s = String(val || '').substring(0, len);
      return side === 'right' ? s.padEnd(len, char) : s.padStart(len, char);
    };

    const formatAmount = (val: number) => pad(Math.round(val * 100), 15, '0', 'left');

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = today.toTimeString().slice(0, 8).replace(/:/g, '');

    let header = pad(config.banco_codigo, 3, '0', 'left') + '00000' + pad('', 9) + '2' + pad('', 14, '0') + pad(config.convenio, 20) + pad(config.agencia, 5, '0', 'left') + pad(config.agencia_digito || '', 1) + pad(config.conta, 12, '0', 'left') + pad(config.conta_digito, 1) + ' ' + pad(config.nome_empresa || 'EMPRESA', 30) + pad('BANCO', 30) + pad('', 10) + '1' + dateStr + timeStr + pad(sequence, 6, '0', 'left') + '081' + '00000' + pad('', 69);
    lines.push(header.padEnd(240, ' '));

    // Registrar o arquivo de remessa no banco para auditoria real
    await supabase.from('cnab_remessas' as any).update({ 
      arquivo_remessa: lines[0],
      status: 'enviado' 
    } as any).eq('id', (remessa as any).id);

    let detailSequence = 1;
    let totalValue = 0;
    const cnabItensToInsert = [];

    // Header de Lote (Tipo 1)
    let lotHeader = pad(config.banco_codigo, 3, '0', 'left') + '00011' + 'C' + '30' + '01' + ' ' + '040' + pad(config.agencia, 5, '0', 'left') + pad(config.agencia_digito || '', 1) + pad(config.conta, 12, '0', 'left') + pad(config.conta_digito, 1) + ' ' + pad(config.nome_empresa || 'EMPRESA', 30) + pad('', 40) + pad('', 30) + pad('', 10) + dateStr + pad('', 8, '0') + pad('', 33);
    lines.push(lotHeader.padEnd(240, ' '));

    for (const item of itens) {
      const colab = item.colaborador as any;
      const conta = (contas as any[])?.find(c => c.colaborador_id === item.colaborador_id);
      if (!conta) continue;

      const valor = Number(item.total_liquido);
      totalValue += valor;
      const seuNumero = `${(remessa as any).id.substring(0, 8)}-${detailSequence}`;

      cnabItensToInsert.push({
        remessa_id: (remessa as any).id,
        colaborador_id: item.colaborador_id,
        folha_item_id: item.id,
        nome_favorecido: colab.nome_completo,
        cpf_cnpj_favorecido: colab.cpf,
        valor_pagamento: valor,
        seu_numero: seuNumero,
        status: 'processando'
      });

      // Segmento A (Crédito em Conta)
      let segA = pad(config.banco_codigo, 3, '0', 'left') + '00013' + pad(detailSequence++, 5, '0', 'left') + 'A' + '000' + '000' + pad(conta.banco_codigo || '000', 3, '0', 'left') + pad(conta.agencia || '', 5, '0', 'left') + pad(conta.agencia_digito || '', 1) + pad(conta.conta || '', 12, '0', 'left') + pad(conta.digito || '', 1) + ' ' + pad(colab.nome_completo || '', 30) + pad(seuNumero, 20) + dateStr + 'BRL' + pad('', 15, '0') + formatAmount(valor) + pad('', 20) + pad('', 8, '0') + pad('', 15, '0') + pad('', 40) + '00' + pad('', 10);
      lines.push(segA.padEnd(240, ' '));

      // Se tiver chave PIX, adiciona Segmento B (PIX)
      if (conta.pix_chave) {
        let segB = pad(config.banco_codigo, 3, '0', 'left') + '00013' + pad(detailSequence++, 5, '0', 'left') + 'B' + pad('', 3) + '2' + pad(colab.cpf || '', 14, '0', 'left') + pad('', 30) + pad('', 30) + pad('', 30) + pad('', 30) + pad(conta.pix_chave, 60) + pad('', 25);
        lines.push(segB.padEnd(240, ' '));
      }
    }

    // Trailer de Lote (Tipo 5)
    let lotTrailer = pad(config.banco_codigo, 3, '0', 'left') + '00015' + pad('', 9) + pad(detailSequence + 1, 6, '0', 'left') + formatAmount(totalValue) + pad('', 18, '0') + pad('', 183);
    lines.push(lotTrailer.padEnd(240, ' '));

    await supabase.from('cnab_itens' as any).insert(cnabItensToInsert);

    // Trailer de Arquivo (Tipo 9)
    let trailer = pad(config.banco_codigo, 3, '0', 'left') + '99999' + pad('', 9) + '000001' + pad(lines.length + 1, 6, '0', 'left') + pad('', 6, '0') + pad('', 205);
    lines.push(trailer.padEnd(240, ' '));

    const fullFile = lines.join('\r\n');
    
    // Atualiza com o arquivo completo
    await supabase.from('cnab_remessas' as any).update({ 
      arquivo_remessa: fullFile 
    } as any).eq('id', (remessa as any).id);

    return fullFile;
  },

  async parseRetornoCNAB(fileContent: string) {
    const lines = fileContent.split(/\r?\n/);
    const results = {
      sucesso: 0,
      erro: 0,
      detalhes: [] as any[]
    };

    for (const line of lines) {
      if (line.length < 240) continue;
      
      const tipoRegistro = line.substring(7, 8);
      const segmento = line.substring(13, 14);

      if (tipoRegistro === '3' && segmento === 'A') {
        const seuNumero = line.substring(73, 93).trim();
        const codigoOcorrencia = line.substring(230, 232);
        
        const { data: item } = await supabase
          .from('cnab_itens' as any)
          .select('id, folha_item_id, nome_favorecido')
          .eq('seu_numero', seuNumero)
          .maybeSingle();

        if (item) {
          const isSuccess = ['00', '02'].includes(codigoOcorrencia);
          const status = isSuccess ? 'pago' : 'erro';
          
          await supabase
            .from('cnab_itens' as any)
            .update({ 
              status, 
              codigo_ocorrencia: codigoOcorrencia,
              mensagem_ocorrencia: isSuccess ? 'Confirmado' : 'Rejeitado pelo banco'
            })
            .eq('id', (item as any).id);

          if (isSuccess && (item as any).folha_item_id) {
            await supabase
              .from('folha_itens')
              .update({ status_pagamento: 'pago' } as any)
              .eq('id', (item as any).folha_item_id);
            results.sucesso++;
          } else {
            results.erro++;
          }

          results.detalhes.push({
            nome: (item as any).nome_favorecido,
            status,
            ocorrencia: codigoOcorrencia
          });
        }
      }
    }
    return results;
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
    for (const item of itens) {
      const colab = item.colaborador as any;
      const conta = (contas as any[])?.find(c => c.colaborador_id === item.colaborador_id);
      if (!conta || !conta.pix_chave) continue;
      const valor = Number(item.total_liquido);
      csvLines.push(`${colab.nome_completo};${colab.cpf || ''};${conta.pix_chave};${conta.pix_tipo || 'CPF'};${valor.toFixed(2).replace('.', ',')};Pagamento Salarial;${item.id}`);
    }

    if (csvLines.length === 1) throw new Error('Nenhum colaborador com chave PIX cadastrada nesta folha.');
    return csvLines.join('\n');
  }
};