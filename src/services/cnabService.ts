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
      .from('cnab_configuracoes')
      .select('*')
      .eq('empresa_id', empresaId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async saveConfig(empresaId: string, config: CNABConfig) {
    const { data: existing } = await supabase
      .from('cnab_configuracoes')
      .select('id')
      .eq('empresa_id', empresaId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('cnab_configuracoes')
        .update(config)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cnab_configuracoes')
        .insert([{ empresa_id: empresaId, ...config }]);
      if (error) throw error;
    }
  },

  async generateCNAB240(empresaId: string, folhaId: string): Promise<string> {
    const config = await this.getConfig(empresaId);
    if (!config) throw new Error('Configuração CNAB não encontrada para esta empresa.');

    // Fetch Holerites
    const { data: holerites, error: hError } = await supabase
      .from('holerites')
      .select('*, colaborador:colaboradores(id, nome_completo, cpf)')
      .eq('folha_id', folhaId);
    
    if (hError) throw hError;
    if (!holerites?.length) throw new Error('Nenhum pagamento encontrado para gerar CNAB.');

    // Fetch Bank Accounts for these employees
    const colaboradorIds = holerites.map(h => h.colaborador_id);
    const { data: contas, error: cError } = await supabase
      .from('contas_bancarias')
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
    let header = pad(config.banco_codigo, 3, '0', 'left'); // Banco
    header += '0000'; // Lote
    header += '0'; // Registro
    header += pad('', 9); // Reservado
    header += '2'; // Inscrição Empresa (CGC/CNPJ)
    header += pad('', 14, '0'); // CNPJ Empresa (Placeholder)
    header += pad(config.convenio, 20); // Convênio
    header += pad(config.agencia, 5, '0', 'left');
    header += pad(config.agencia_digito || '', 1);
    header += pad(config.conta, 12, '0', 'left');
    header += pad(config.conta_digito, 1);
    header += ' '; // Dígito Verificador Ag/Conta
    header += pad(config.nome_empresa || 'EMPRESA', 30);
    header += pad('BANCO', 30);
    header += pad('', 10); // Reservado
    header += '1'; // Código Arquivo (1=Remessa)
    header += dateStr;
    header += timeStr;
    header += pad(sequence++, 6, '0', 'left'); // NSA
    header += '081'; // Layout
    header += '00000'; // Densidade
    header += pad('', 69); // Reservado
    lines.push(header.padEnd(240, ' '));

    // Header Lote (Registro 1)
    let headerLote = pad(config.banco_codigo, 3, '0', 'left');
    headerLote += '0001'; // Lote
    headerLote += '1'; // Registro
    headerLote += 'C'; // Operação (C=Crédito)
    headerLote += '30'; // Serviço (30=Pagamento Salários)
    headerLote += '01'; // Forma de Lançamento (01=Crédito em Conta)
    headerLote += '040'; // Layout Lote
    headerLote += ' '; // Reservado
    headerLote += '2'; // Inscrição
    headerLote += pad('', 14, '0');
    headerLote += pad(config.convenio, 20);
    headerLote += pad(config.agencia, 5, '0', 'left');
    headerLote += pad(config.agencia_digito || '', 1);
    headerLote += pad(config.conta, 12, '0', 'left');
    headerLote += pad(config.conta_digito, 1);
    headerLote += ' ';
    headerLote += pad(config.nome_empresa || 'EMPRESA', 30);
    headerLote += pad('', 40); // Mensagem
    headerLote += pad('', 30); // Endereço
    headerLote += pad('', 10, '0'); // CEP
    headerLote += pad('', 20); // Complemento
    lines.push(headerLote.padEnd(240, ' '));

    let totalAmount = 0;
    let detailSequence = 1;

    for (const holerite of holerites) {
      const conta = (contas as any[])?.find(c => c.colaborador_id === holerite.colaborador_id);
      if (!conta) continue;

      totalAmount += Number(holerite.liquido);

      // Segmento A
      let segA = pad(config.banco_codigo, 3, '0', 'left');
      segA += '0001'; // Lote
      segA += '3'; // Registro
      segA += pad(detailSequence++, 5, '0', 'left');
      segA += 'A'; // Segmento
      segA += '000'; // Movimento (000=Inclusão)
      segA += '000'; // Câmara (000=Crédito em Conta)
      segA += pad(conta.banco_codigo || '000', 3, '0', 'left');
      segA += pad(conta.agencia || '', 5, '0', 'left');
      segA += pad(conta.agencia_digito || '', 1);
      segA += pad(conta.conta || '', 12, '0', 'left');
      segA += pad(conta.digito || '', 1);
      segA += ' ';
      segA += pad(holerite.colaborador_nome || '', 30);
      segA += pad(holerite.id.substring(0, 20), 20); // Documento
      segA += dateStr; // Data Pagamento
      segA += 'BRL'; // Moeda
      segA += pad('', 15, '0'); // Quantidade
      segA += formatAmount(Number(holerite.liquido));
      segA += pad('', 20); // Nosso Numero
      segA += pad('', 8, '0'); // Data Real
      segA += pad('', 15, '0'); // Valor Real
      segA += pad('', 40); // Finalidade
      segA += '00'; // Aviso
      segA += pad('', 10); // Ocorrências
      lines.push(segA.padEnd(240, ' '));
    }

    // Trailer Lote (Registro 5)
    let trailerLote = pad(config.banco_codigo, 3, '0', 'left');
    trailerLote += '0001';
    trailerLote += '5';
    trailerLote += pad('', 9);
    trailerLote += pad(lines.length + 1 - 2, 6, '0', 'left'); // Qtd Registros (excluindo headers e trailer lote/arquivo?) - simplified
    trailerLote += formatAmount(totalAmount);
    trailerLote += pad('', 18, '0'); // Qtd Moeda
    trailerLote += pad('', 18, '0'); // Numero Aviso
    trailerLote += pad('', 165);
    lines.push(trailerLote.padEnd(240, ' '));

    // Trailer Arquivo (Registro 9)
    let trailer = pad(config.banco_codigo, 3, '0', 'left');
    trailer += '9999';
    trailer += '9';
    trailer += pad('', 9);
    trailer += '000001'; // Qtd Lotes
    trailer += pad(lines.length + 1, 6, '0', 'left'); // Qtd Registros
    trailer += pad('', 6, '0'); // Qtd Contas Conciliação
    trailer += pad('', 205);
    lines.push(trailer.padEnd(240, ' '));

    return lines.join('\n');
  }
};
