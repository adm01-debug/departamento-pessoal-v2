import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// Extensão de tipo para jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}


import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ColaboradorData {
  nome_completo: string;
  cpf: string;
  rg?: string;
  rg_orgao_emissor?: string;
  rg_uf?: string;
  data_nascimento: string;
  sexo: string;
  estado_civil: string;
  nacionalidade?: string;
  naturalidade_cidade?: string;
  naturalidade_uf?: string;
  nome_mae: string;
  nome_pai?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  pis_pasep?: string;
  ctps_numero?: string;
  ctps_serie?: string;
  ctps_uf?: string;
  cargo: string;
  departamento: string;
  data_admissao: string;
  salario_base: number;
  tipo_contrato: string;
  banco_nome?: string;
  agencia?: string;
  conta?: string;
  pix_chave?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return date;
  }
};

const formatCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export function gerarFichaRegistro(colaborador: ColaboradorData): void {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHA DE REGISTRO DE EMPREGADO', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth / 2, 24, { align: 'center' });
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  
  let yPos = 40;
  
  // Section: Dados Pessoais
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  doc.text('DADOS PESSOAIS', 14, yPos + 6);
  yPos += 12;
  
  const dadosPessoais = [
    ['Nome Completo', colaborador.nome_completo],
    ['CPF', formatCPF(colaborador.cpf)],
    ['RG', `${colaborador.rg || '-'} ${colaborador.rg_orgao_emissor ? `- ${colaborador.rg_orgao_emissor}/${colaborador.rg_uf}` : ''}`],
    ['Data de Nascimento', formatDate(colaborador.data_nascimento)],
    ['Sexo', colaborador.sexo === 'masculino' ? 'Masculino' : 'Feminino'],
    ['Estado Civil', colaborador.estado_civil.charAt(0).toUpperCase() + colaborador.estado_civil.slice(1)],
    ['Nacionalidade', colaborador.nacionalidade || 'Brasileira'],
    ['Naturalidade', `${colaborador.naturalidade_cidade || '-'}/${colaborador.naturalidade_uf || '-'}`],
    ['Nome da Mãe', colaborador.nome_mae],
    ['Nome do Pai', colaborador.nome_pai || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: dadosPessoais,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 'auto' },
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Section: Contato
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  doc.text('CONTATO', 14, yPos + 6);
  yPos += 12;
  
  const dadosContato = [
    ['E-mail', colaborador.email || '-'],
    ['Telefone', colaborador.telefone || '-'],
    ['Celular', colaborador.celular || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: dadosContato,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 'auto' },
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Section: Endereço
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  doc.text('ENDEREÇO', 14, yPos + 6);
  yPos += 12;
  
  const endereco = `${colaborador.logradouro || ''}, ${colaborador.numero || 'S/N'}${colaborador.complemento ? ` - ${colaborador.complemento}` : ''}`;
  const dadosEndereco = [
    ['CEP', colaborador.cep || '-'],
    ['Endereço', endereco || '-'],
    ['Bairro', colaborador.bairro || '-'],
    ['Cidade/UF', `${colaborador.cidade || '-'}/${colaborador.uf || '-'}`],
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: dadosEndereco,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 'auto' },
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Section: Documentos
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  doc.text('DOCUMENTOS TRABALHISTAS', 14, yPos + 6);
  yPos += 12;
  
  const dadosDocumentos = [
    ['PIS/PASEP', colaborador.pis_pasep || '-'],
    ['CTPS', `${colaborador.ctps_numero || '-'} / Série: ${colaborador.ctps_serie || '-'} / UF: ${colaborador.ctps_uf || '-'}`],
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: dadosDocumentos,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 'auto' },
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Section: Dados Profissionais
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  doc.text('DADOS PROFISSIONAIS', 14, yPos + 6);
  yPos += 12;
  
  const tipoContratoLabels: Record<string, string> = {
    clt: 'CLT',
    pj: 'PJ',
    estagiario: 'Estagiário',
    temporario: 'Temporário',
    intermitente: 'Intermitente',
    aprendiz: 'Aprendiz',
  };
  
  const dadosProfissionais = [
    ['Cargo', colaborador.cargo],
    ['Departamento', colaborador.departamento],
    ['Data de Admissão', formatDate(colaborador.data_admissao)],
    ['Salário Base', formatCurrency(colaborador.salario_base)],
    ['Tipo de Contrato', tipoContratoLabels[colaborador.tipo_contrato] || colaborador.tipo_contrato],
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: dadosProfissionais,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 'auto' },
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Section: Dados Bancários
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  doc.text('DADOS BANCÁRIOS', 14, yPos + 6);
  yPos += 12;
  
  const dadosBancarios = [
    ['Banco', colaborador.banco_nome || '-'],
    ['Agência', colaborador.agencia || '-'],
    ['Conta', colaborador.conta || '-'],
    ['Chave PIX', colaborador.pix_chave || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: dadosBancarios,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 'auto' },
    },
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Documento gerado automaticamente pelo Sistema de Departamento Pessoal', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('Página 1 de 1', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save
  doc.save(`ficha_registro_${colaborador.nome_completo.replace(/\s+/g, '_')}.pdf`);
}

export function gerarReciboFerias(dados: {
  colaborador: string;
  cpf: string;
  cargo: string;
  departamento: string;
  periodoAquisitivo: string;
  dataInicio: string;
  dataFim: string;
  diasGozo: number;
  diasAbono: number;
  valorFerias: number;
  valorTerco: number;
  valorAbono: number;
  valorTercoAbono: number;
  descontosInss: number;
  descontosIrrf: number;
  valorLiquido: number;
}): void {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('RECIBO DE FÉRIAS', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  
  let yPos = 35;
  
  // Dados do colaborador
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('COLABORADOR:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(dados.colaborador, 50, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('CPF:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCPF(dados.cpf), 50, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('CARGO:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(dados.cargo, 50, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('DEPARTAMENTO:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(dados.departamento, 50, yPos);
  
  yPos += 15;
  
  // Período
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('PERÍODO DE FÉRIAS', 14, yPos + 6);
  yPos += 12;
  
  const periodoData = [
    ['Período Aquisitivo', dados.periodoAquisitivo],
    ['Data de Início', formatDate(dados.dataInicio)],
    ['Data de Término', formatDate(dados.dataFim)],
    ['Dias de Gozo', `${dados.diasGozo} dias`],
    ['Dias de Abono', `${dados.diasAbono} dias`],
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: periodoData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // Valores
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('DEMONSTRATIVO DE PAGAMENTO', 14, yPos + 6);
  yPos += 12;
  
  const valoresData = [
    ['Férias', formatCurrency(dados.valorFerias)],
    ['1/3 Constitucional', formatCurrency(dados.valorTerco)],
    ['Abono Pecuniário', formatCurrency(dados.valorAbono)],
    ['1/3 sobre Abono', formatCurrency(dados.valorTercoAbono)],
    ['(-) INSS', formatCurrency(dados.descontosInss)],
    ['(-) IRRF', formatCurrency(dados.descontosIrrf)],
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: valoresData,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right' },
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 5;
  
  // Total
  doc.setFillColor(34, 197, 94);
  doc.rect(10, yPos, pageWidth - 20, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('VALOR LÍQUIDO:', 14, yPos + 7);
  doc.text(formatCurrency(dados.valorLiquido), pageWidth - 14, yPos + 7, { align: 'right' });
  
  yPos += 25;
  doc.setTextColor(0, 0, 0);
  
  // Assinaturas
  doc.setFontSize(10);
  doc.line(14, yPos + 20, 90, yPos + 20);
  doc.text('Assinatura do Colaborador', 52, yPos + 26, { align: 'center' });
  
  doc.line(pageWidth - 90, yPos + 20, pageWidth - 14, yPos + 20);
  doc.text('Assinatura do Empregador', pageWidth - 52, yPos + 26, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text(`Data: ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}`, pageWidth / 2, yPos + 40, { align: 'center' });
  
  doc.save(`recibo_ferias_${dados.colaborador.replace(/\s+/g, '_')}.pdf`);
}

export function gerarContratoTrabalho(dados: {
  empresa: string;
  cnpj: string;
  colaborador: string;
  cpf: string;
  rg: string;
  endereco: string;
  cargo: string;
  departamento: string;
  salario: number;
  dataAdmissao: string;
  jornadaSemanal: number;
}): void {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const textWidth = pageWidth - margin * 2;
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO DE TRABALHO', pageWidth / 2, 30, { align: 'center' });
  doc.text('POR PRAZO INDETERMINADO', pageWidth / 2, 38, { align: 'center' });
  
  let yPos = 55;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Partes
  const textoParte1 = `Pelo presente instrumento particular de Contrato de Trabalho, de um lado ${dados.empresa.toUpperCase()}, inscrita no CNPJ sob o nº ${dados.cnpj}, doravante denominada EMPREGADORA, e de outro lado ${dados.colaborador.toUpperCase()}, portador(a) do CPF nº ${formatCPF(dados.cpf)}, RG nº ${dados.rg}, residente e domiciliado(a) em ${dados.endereco}, doravante denominado(a) EMPREGADO(A), têm entre si justo e contratado o seguinte:`;
  
  const lines = doc.splitTextToSize(textoParte1, textWidth);
  doc.text(lines, margin, yPos);
  yPos += lines.length * 6 + 10;
  
  // Cláusulas
  const clausulas = [
    {
      titulo: 'CLÁUSULA PRIMEIRA - DO OBJETO',
      texto: `O presente contrato tem por objeto a prestação de serviços pelo EMPREGADO(A) à EMPREGADORA, na função de ${dados.cargo}, no Departamento de ${dados.departamento}.`,
    },
    {
      titulo: 'CLÁUSULA SEGUNDA - DA REMUNERAÇÃO',
      texto: `O EMPREGADO(A) receberá o salário mensal de ${formatCurrency(dados.salario)} (${extenso(dados.salario)}), a ser pago até o 5º dia útil do mês subsequente ao vencido.`,
    },
    {
      titulo: 'CLÁUSULA TERCEIRA - DA JORNADA DE TRABALHO',
      texto: `A jornada de trabalho será de ${dados.jornadaSemanal} horas semanais, podendo haver compensação de horas nos termos da legislação vigente.`,
    },
    {
      titulo: 'CLÁUSULA QUARTA - DO INÍCIO DAS ATIVIDADES',
      texto: `O presente contrato tem início em ${formatDate(dados.dataAdmissao)}, com prazo indeterminado.`,
    },
    {
      titulo: 'CLÁUSULA QUINTA - DAS OBRIGAÇÕES',
      texto: 'O EMPREGADO(A) se obriga a cumprir as normas internas da empresa, zelar pelos equipamentos e materiais de trabalho, e manter sigilo sobre informações confidenciais da empresa.',
    },
    {
      titulo: 'CLÁUSULA SEXTA - DO FORO',
      texto: 'Fica eleito o foro da Comarca onde se localiza a sede da EMPREGADORA para dirimir quaisquer dúvidas oriundas do presente contrato.',
    },
  ];
  
  clausulas.forEach(clausula => {
    doc.setFont('helvetica', 'bold');
    doc.text(clausula.titulo, margin, yPos);
    yPos += 6;
    
    doc.setFont('helvetica', 'normal');
    const clausulaLines = doc.splitTextToSize(clausula.texto, textWidth);
    doc.text(clausulaLines, margin, yPos);
    yPos += clausulaLines.length * 6 + 8;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
  });
  
  yPos += 10;
  doc.text(`E por estarem assim justos e contratados, assinam o presente instrumento em duas vias de igual teor.`, margin, yPos);
  
  yPos += 15;
  doc.text(`Local e Data: ________________________, ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, margin, yPos);
  
  yPos += 30;
  doc.line(margin, yPos, margin + 70, yPos);
  doc.text('EMPREGADORA', margin + 35, yPos + 6, { align: 'center' });
  
  doc.line(pageWidth - margin - 70, yPos, pageWidth - margin, yPos);
  doc.text('EMPREGADO(A)', pageWidth - margin - 35, yPos + 6, { align: 'center' });
  
  yPos += 25;
  doc.setFontSize(10);
  doc.text('Testemunhas:', margin, yPos);
  
  yPos += 15;
  doc.line(margin, yPos, margin + 60, yPos);
  doc.setFontSize(8);
  doc.text('Nome:', margin, yPos + 5);
  doc.text('CPF:', margin, yPos + 10);
  
  doc.line(pageWidth - margin - 60, yPos, pageWidth - margin, yPos);
  doc.text('Nome:', pageWidth - margin - 60, yPos + 5);
  doc.text('CPF:', pageWidth - margin - 60, yPos + 10);
  
  doc.save(`contrato_trabalho_${dados.colaborador.replace(/\s+/g, '_')}.pdf`);
}

// Helper function to convert number to words (simplified)
function extenso(valor: number): string {
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
  
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);
  
  if (inteiro === 0) return 'zero reais';
  
  let resultado = '';
  
  if (inteiro >= 1000) {
    const milhares = Math.floor(inteiro / 1000);
    resultado += milhares === 1 ? 'mil' : unidades[milhares] + ' mil';
    const resto = inteiro % 1000;
    if (resto > 0) resultado += ' e ';
  }
  
  const resto = inteiro % 1000;
  if (resto >= 100) {
    resultado += resto === 100 ? 'cem' : centenas[Math.floor(resto / 100)];
    const dezenaUnidade = resto % 100;
    if (dezenaUnidade > 0) resultado += ' e ';
  }
  
  const dezenaUnidade = resto % 100;
  if (dezenaUnidade >= 20) {
    resultado += dezenas[Math.floor(dezenaUnidade / 10)];
    if (dezenaUnidade % 10 > 0) resultado += ' e ' + unidades[dezenaUnidade % 10];
  } else if (dezenaUnidade >= 10) {
    resultado += especiais[dezenaUnidade - 10];
  } else if (dezenaUnidade > 0) {
    resultado += unidades[dezenaUnidade];
  }
  
  resultado += inteiro === 1 ? ' real' : ' reais';
  
  if (centavos > 0) {
    resultado += ' e ' + (centavos < 10 ? unidades[centavos] : dezenas[Math.floor(centavos / 10)] + (centavos % 10 > 0 ? ' e ' + unidades[centavos % 10] : ''));
    resultado += centavos === 1 ? ' centavo' : ' centavos';
  }
  
  return resultado;
}

export interface HoleriteData {
  competencia: string;
  colaborador_nome: string;
  colaborador_cpf: string;
  colaborador_matricula?: string;
  colaborador_cargo: string;
  colaborador_departamento: string;
  salario_base: number;
  total_proventos: number;
  total_descontos: number;
  liquido: number;
  valor_inss?: number;
  valor_irrf?: number;
  valor_fgts?: number;
  horas_extras_50?: number;
  horas_extras_100?: number;
  faltas_dias?: number;
  empresa_nome?: string;
  empresa_cnpj?: string;
}

export function gerarHoleritePDF(dados: HoleriteData): void {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header da Empresa
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 28, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(dados.empresa_nome || 'EMPRESA', pageWidth / 2, 12, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`CNPJ: ${dados.empresa_cnpj || '00.000.000/0001-00'}`, pageWidth / 2, 20, { align: 'center' });
  
  // Título do documento
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DEMONSTRATIVO DE PAGAMENTO', pageWidth / 2, 38, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Competência: ${dados.competencia}`, pageWidth / 2, 45, { align: 'center' });
  
  let yPos = 55;
  
  // Dados do Colaborador
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 25, 'F');
  doc.setFontSize(9);
  
  doc.setFont('helvetica', 'bold');
  doc.text('COLABORADOR:', 14, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(dados.colaborador_nome, 50, yPos + 7);
  
  doc.setFont('helvetica', 'bold');
  doc.text('CPF:', 14, yPos + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCPF(dados.colaborador_cpf), 50, yPos + 14);
  
  doc.setFont('helvetica', 'bold');
  doc.text('MATRÍCULA:', 110, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(dados.colaborador_matricula || '-', 140, yPos + 7);
  
  doc.setFont('helvetica', 'bold');
  doc.text('CARGO:', 14, yPos + 21);
  doc.setFont('helvetica', 'normal');
  doc.text(dados.colaborador_cargo, 50, yPos + 21);
  
  doc.setFont('helvetica', 'bold');
  doc.text('DEPTO:', 110, yPos + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(dados.colaborador_departamento, 140, yPos + 14);
  
  yPos += 35;
  
  // Tabela de Proventos e Descontos
  const proventos: [string, string, string][] = [
    ['Código', 'Descrição', 'Valor'],
    ['001', 'Salário Base', formatCurrency(dados.salario_base)],
  ];
  
  if (dados.horas_extras_50 && dados.horas_extras_50 > 0) {
    proventos.push(['002', 'Horas Extras 50%', formatCurrency(dados.horas_extras_50)]);
  }
  if (dados.horas_extras_100 && dados.horas_extras_100 > 0) {
    proventos.push(['003', 'Horas Extras 100%', formatCurrency(dados.horas_extras_100)]);
  }
  
  const descontos: [string, string, string][] = [
    ['Código', 'Descrição', 'Valor'],
  ];
  
  if (dados.valor_inss && dados.valor_inss > 0) {
    descontos.push(['101', 'INSS', formatCurrency(dados.valor_inss)]);
  }
  if (dados.valor_irrf && dados.valor_irrf > 0) {
    descontos.push(['102', 'IRRF', formatCurrency(dados.valor_irrf)]);
  }
  if (dados.faltas_dias && dados.faltas_dias > 0) {
    const valorFalta = (dados.salario_base / 30) * dados.faltas_dias;
    descontos.push(['103', `Faltas (${dados.faltas_dias} dias)`, formatCurrency(valorFalta)]);
  }
  
  // Proventos
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(34, 197, 94);
  doc.setTextColor(255, 255, 255);
  doc.rect(10, yPos, (pageWidth - 25) / 2, 7, 'F');
  doc.text('PROVENTOS', 14, yPos + 5);
  
  // Descontos
  doc.setFillColor(239, 68, 68);
  doc.rect(10 + (pageWidth - 25) / 2 + 5, yPos, (pageWidth - 25) / 2, 7, 'F');
  doc.text('DESCONTOS', 14 + (pageWidth - 25) / 2 + 5, yPos + 5);
  
  doc.setTextColor(0, 0, 0);
  yPos += 7;
  
  // Tabela Proventos
  autoTable(doc, {
    startY: yPos,
    head: [proventos[0]],
    body: proventos.slice(1),
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 45 },
      2: { cellWidth: 25, halign: 'right' },
    },
    tableWidth: (pageWidth - 25) / 2,
    margin: { left: 10 },
  });
  
  const proventosEndY = doc.lastAutoTable.finalY;
  
  // Tabela Descontos
  autoTable(doc, {
    startY: yPos,
    head: [descontos[0]],
    body: descontos.slice(1).length > 0 ? descontos.slice(1) : [['', 'Sem descontos', '']],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 45 },
      2: { cellWidth: 25, halign: 'right' },
    },
    tableWidth: (pageWidth - 25) / 2,
    margin: { left: 10 + (pageWidth - 25) / 2 + 5 },
  });
  
  const descontosEndY = doc.lastAutoTable.finalY;
  yPos = Math.max(proventosEndY, descontosEndY) + 10;
  
  // Totais
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos, pageWidth - 20, 25, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  doc.text('Total Proventos:', 14, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(dados.total_proventos), 70, yPos + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Total Descontos:', 14, yPos + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(dados.total_descontos), 70, yPos + 16);
  
  // FGTS
  doc.setFont('helvetica', 'bold');
  doc.text('Base FGTS:', 110, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(dados.total_proventos), 150, yPos + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('FGTS do Mês:', 110, yPos + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(dados.valor_fgts || dados.total_proventos * 0.08), 150, yPos + 16);
  
  yPos += 30;
  
  // Líquido
  doc.setFillColor(59, 130, 246);
  doc.rect(10, yPos, pageWidth - 20, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('LÍQUIDO A RECEBER:', 14, yPos + 8);
  doc.text(formatCurrency(dados.liquido), pageWidth - 14, yPos + 8, { align: 'right' });
  
  yPos += 25;
  doc.setTextColor(0, 0, 0);
  
  // Assinatura
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.line(14, yPos + 20, 90, yPos + 20);
  doc.text('Assinatura do Colaborador', 52, yPos + 26, { align: 'center' });
  
  doc.text(`Data: ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}`, pageWidth - 14, yPos + 26, { align: 'right' });
  
  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text('Este documento é uma representação do demonstrativo de pagamento e não substitui o documento oficial.', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save
  const competenciaNome = dados.competencia.replace('/', '-');
  doc.save(`holerite_${competenciaNome}_${dados.colaborador_nome.replace(/\s+/g, '_')}.pdf`);
}

