import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const feriasPDF = {
  gerarRecibo: (solicitacao: any) => {
    const doc = new jsPDF();
    const colab = solicitacao.colaborador || {};
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Aviso e Recibo de Férias', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 28, { align: 'center' });

    // Info Table
    autoTable(doc, {
      startY: 40,
      head: [['Informação', 'Detalhe']],
      body: [
        ['Colaborador', colab.nome_completo || '-'],
        ['CPF', colab.cpf || '-'],
        ['Cargo', colab.cargo?.nome || '-'],
        ['Departamento', colab.departamento?.nome || '-'],
        ['Período de Gozo', `${format(new Date(solicitacao.data_inicio), 'dd/MM/yyyy')} a ${format(new Date(solicitacao.data_fim), 'dd/MM/yyyy')}`],
        ['Dias de Férias', `${solicitacao.dias_ferias} dias`],
        ['Abono Pecuniário', solicitacao.abono_pecuniario ? 'Sim (10 dias)' : 'Não'],
        ['Adiantamento 13º', solicitacao.adiantamento_13 ? 'Sim' : 'Não'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255] },
    });

    // Texto Legal
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(11);
    doc.setTextColor(0);
    const texto = `Comunico-lhe que, de acordo com as disposições legais vigentes, lhe serão concedidas férias relativas ao período aquisitivo correspondente, a serem gozadas no período acima mencionado.`;
    doc.text(doc.splitTextToSize(texto, 170), 20, finalY);

    // Assinaturas
    const signatureY = finalY + 50;
    doc.line(20, signatureY, 90, signatureY);
    doc.text('Assinatura da Empresa', 35, signatureY + 5);

    doc.line(120, signatureY, 190, signatureY);
    doc.text('Assinatura do Colaborador', 130, signatureY + 5);

    doc.save(`recibo_ferias_${colab.nome_completo || 'colaborador'}.pdf`);
  },

  gerarRelatorioKPIs: (stats: any, data: any[], filters?: any) => {
    const doc = new jsPDF();
    
    // Header com Logo (Simulado por Retângulo e Texto)
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('LOVABLE HR', 20, 25);
    doc.setFontSize(10);
    doc.text('Sistema Unificado de Gestão de Pessoas', 20, 32);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Relatório Executivo de Férias', 190, 25, { align: 'right' });
    
    doc.setFontSize(9);
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 190, 32, { align: 'right' });

    // Filtros Aplicados
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`Filtros: ${stats.periodoLabel || 'Todos'}`, 20, 50);
    if (filters?.search) doc.text(`Busca: ${filters.search}`, 20, 55);
    if (filters?.status) doc.text(`Status: ${filters.status}`, 20, 60);

    // KPIs Summary Grid
    autoTable(doc, {
      startY: 65,
      head: [['Resumo de KPIs', 'Valor']],
      body: [
        ['Total de Registros no Filtro', stats.total.toString()],
        ['Pendentes de Aprovação', stats.pendentes.toString()],
        ['Aprovadas/Confirmadas', stats.aprovadas.toString()],
        ['Colaboradores em Gozo', stats.emGozo.toString()],
        ['Abonos Pecuniários', stats.abonoPecuniario.toString()],
        ['Períodos Vencidos', stats.vencidas.toString()],
      ],
      theme: 'grid',
      headStyles: { fillColor: [44, 62, 80] },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    // Detailed Table
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(14);
    doc.text('Detalhamento de Solicitações', 20, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Colaborador', 'Início', 'Fim', 'Dias', 'Status']],
      body: data.map(f => [
        f.colaborador?.nome_completo || '-',
        format(new Date(f.data_inicio), 'dd/MM/yyyy'),
        format(new Date(f.data_fim), 'dd/MM/yyyy'),
        (f.dias_gozo || f.dias_ferias || '-').toString(),
        f.status.toUpperCase()
      ]),
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
      didDrawPage: (dataArg) => {
        // Footer com Paginação
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Página ${dataArg.pageNumber}`,
          dataArg.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          'LOVABLE HR - Relatório Confidencial',
          190,
          doc.internal.pageSize.height - 10,
          { align: 'right' }
        );
      }
    });

    doc.save(`relatorio_ferias_${format(new Date(), 'yyyyMMdd')}.pdf`);
  }
};
