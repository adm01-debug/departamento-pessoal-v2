interface EmpresaCNAB {
  banco: string;
  cnpj: string;
  agencia: string;
  conta: string;
  razao_social: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
  uf?: string;
  codigo?: string;
}

// Gerador de arquivos CNAB 240 e 400 para pagamento de folha
import { format } from 'date-fns';

interface Colaborador {
  nome_completo: string;
  cpf: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo_conta: 'corrente' | 'poupanca';
}

interface Pagamento {
  colaborador: Colaborador;
  valor: number;
  data_pagamento: string;
}

// CNAB 240 - Layout padrão FEBRABAN
export function gerarCNAB240(empresa: EmpresaCNAB, pagamentos: Pagamento[]): string {
  const dataGeracao = format(new Date(), 'ddMMyyyy');
  const horaGeracao = format(new Date(), 'HHmmss');
  const linhas: string[] = [];
  
  // Header de Arquivo (240 posições)
  const headerArquivo = [
    empresa.banco.padStart(3, '0'),                    // 01-03: Código do banco
    '0000',                                            // 04-07: Lote de serviço
    '0',                                               // 08: Tipo de registro (0=Header)
    ' '.repeat(9),                                     // 09-17: Uso FEBRABAN
    '2',                                               // 18: Tipo de inscrição (2=CNPJ)
    empresa.cnpj.replace(/\D/g, '').padStart(14, '0'), // 19-32: CNPJ
    ' '.repeat(20),                                    // 33-52: Código do convênio
    empresa.agencia.padStart(5, '0'),                  // 53-57: Agência
    ' ',                                               // 58: Dígito agência
    empresa.conta.padStart(12, '0'),                   // 59-70: Conta
    ' ',                                               // 71: Dígito conta
    ' ',                                               // 72: Dígito verificador
    empresa.razao_social.substring(0, 30).padEnd(30),  // 73-102: Nome da empresa
    'BANCO'.padEnd(30),                                // 103-132: Nome do banco
    ' '.repeat(10),                                    // 133-142: Uso FEBRABAN
    '1',                                               // 143: Código remessa
    dataGeracao,                                       // 144-151: Data de geração
    horaGeracao,                                       // 152-157: Hora de geração
    '000001'.padStart(6, '0'),                         // 158-163: Número sequencial
    '089',                                             // 164-166: Versão do layout
    '00000',                                           // 167-171: Densidade
    ' '.repeat(20),                                    // 172-191: Uso banco
    ' '.repeat(20),                                    // 192-211: Uso empresa
    ' '.repeat(29),                                    // 212-240: Uso FEBRABAN
  ].join('');
  
  linhas.push(headerArquivo);
  
  // Header de Lote
  let sequencialRegistro = 1;
  const headerLote = [
    empresa.banco.padStart(3, '0'),
    '0001',                                            // Número do lote
    '1',                                               // Tipo registro (1=Header lote)
    'C',                                               // Tipo operação (C=Crédito)
    '20',                                              // Tipo serviço (20=Pagamento)
    '01',                                              // Forma lançamento
    '045',                                             // Versão layout lote
    ' ',
    '2',
    empresa.cnpj.replace(/\D/g, '').padStart(14, '0'),
    ' '.repeat(20),
    empresa.agencia.padStart(5, '0'),
    ' ',
    empresa.conta.padStart(12, '0'),
    ' ',
    ' ',
    empresa.razao_social.substring(0, 30).padEnd(30),
    ' '.repeat(40),
    empresa.endereco?.substring(0, 30).padEnd(30) || ' '.repeat(30),
    ' '.repeat(5),
    empresa.cidade?.substring(0, 20).padEnd(20) || ' '.repeat(20),
    empresa.cep?.replace(/\D/g, '').padStart(8, '0') || '00000000',
    empresa.uf?.padEnd(2) || '  ',
    ' '.repeat(8),
    ' '.repeat(10),
  ].join('');
  
  linhas.push(headerLote);
  
  // Detalhes (Segmento A para cada pagamento)
  pagamentos.forEach((pag, index) => {
    sequencialRegistro++;
    const segmentoA = [
      empresa.banco.padStart(3, '0'),
      '0001',
      '3',                                             // Tipo registro (3=Detalhe)
      String(sequencialRegistro).padStart(5, '0'),
      'A',                                             // Segmento A
      '0',                                             // Tipo movimento
      '00',                                            // Código instrução
      pag.colaborador.banco.padStart(3, '0'),
      pag.colaborador.agencia.padStart(5, '0'),
      ' ',
      pag.colaborador.conta.padStart(12, '0'),
      ' ',
      ' ',
      pag.colaborador.nome_completo.substring(0, 30).padEnd(30),
      ' '.repeat(20),                                  // Número documento
      pag.data_pagamento.replace(/-/g, ''),
      'BRL',
      '000000000000000',                               // Quantidade moeda
      Math.round(pag.valor * 100).toString().padStart(15, '0'),
      ' '.repeat(20),
      ' '.repeat(8),
      '00000000000000000',
      ' '.repeat(8),
      '000000000000000',
      ' '.repeat(5),
      ' '.repeat(5),
      ' ',
      ' '.repeat(10),
    ].join('');
    
    linhas.push(segmentoA);
  });
  
  // Trailer de lote
  const trailerLote = [
    empresa.banco.padStart(3, '0'),
    '0001',
    '5',                                               // Tipo registro (5=Trailer lote)
    ' '.repeat(9),
    String(pagamentos.length + 2).padStart(6, '0'),
    Math.round(pagamentos.reduce((sum, p) => sum + p.valor, 0) * 100).toString().padStart(18, '0'),
    '000000000000000000',
    ' '.repeat(6),
    ' '.repeat(165),
    ' '.repeat(10),
  ].join('');
  
  linhas.push(trailerLote);
  
  // Trailer de arquivo
  const trailerArquivo = [
    empresa.banco.padStart(3, '0'),
    '9999',
    '9',
    ' '.repeat(9),
    '000001',                                          // Quantidade de lotes
    String(linhas.length + 1).padStart(6, '0'),
    '000000',
    ' '.repeat(205),
  ].join('');
  
  linhas.push(trailerArquivo);
  
  return linhas.join('\r\n');
}

// CNAB 400 - Layout legado
export function gerarCNAB400(empresa: EmpresaCNAB, pagamentos: Pagamento[]): string {
  const linhas: string[] = [];
  const dataGeracao = format(new Date(), 'ddMMyy');
  
  // Header
  const header = [
    '0',                                               // Tipo registro
    '1',                                               // Operação
    'REMESSA',                                         // Literal
    '01',                                              // Tipo serviço
    'COBRANCA'.padEnd(15),                             // Literal
    empresa.codigo?.padStart(20, '0') || '0'.repeat(20),
    empresa.razao_social.substring(0, 30).padEnd(30),
    empresa.banco.padStart(3, '0'),
    'BANCO'.padEnd(15),
    dataGeracao,
    ' '.repeat(8),
    'MX',
    '000001',                                          // Sequencial
    ' '.repeat(277),
    '000001',
  ].join('');
  
  linhas.push(header);
  
  // Detalhes
  pagamentos.forEach((pag, index) => {
    const detalhe = [
      '1',                                             // Tipo registro
      '02',                                            // Tipo inscrição
      pag.colaborador.cpf.replace(/\D/g, '').padStart(14, '0'),
      empresa.codigo?.padStart(20, '0') || '0'.repeat(20),
      ' '.repeat(25),
      '0'.repeat(8),
      ' '.repeat(12),
      '01',
      '00',
      ' '.repeat(10),
      Math.round(pag.valor * 100).toString().padStart(13, '0'),
      pag.colaborador.banco.padStart(3, '0'),
      pag.colaborador.agencia.padStart(5, '0'),
      pag.colaborador.conta.padStart(12, '0'),
      ' '.repeat(4),
      pag.data_pagamento.replace(/-/g, '').substring(2),
      '0'.repeat(13),
      '0'.repeat(13),
      '0'.repeat(13),
      ' '.repeat(25),
      pag.colaborador.nome_completo.substring(0, 40).padEnd(40),
      ' '.repeat(31),
      '0',
      ' '.repeat(2),
      '0'.repeat(6),
      '0'.repeat(5),
      ' '.repeat(26),
      String(index + 2).padStart(6, '0'),
    ].join('');
    
    linhas.push(detalhe);
  });
  
  // Trailer
  const trailer = [
    '9',
    '01',
    '356',
    ' '.repeat(10),
    String(pagamentos.length).padStart(8, '0'),
    Math.round(pagamentos.reduce((sum, p) => sum + p.valor, 0) * 100).toString().padStart(15, '0'),
    '0'.repeat(15),
    ' '.repeat(327),
    String(linhas.length + 1).padStart(6, '0'),
  ].join('');
  
  linhas.push(trailer);
  
  return linhas.join('\r\n');
}

