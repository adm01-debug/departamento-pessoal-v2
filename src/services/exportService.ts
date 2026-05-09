import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const validateExportData = (data: any[]) => {
  if (!data || data.length === 0) {
    throw new Error('Nenhum dado disponível para exportação');
  }
  
  // Verificação de integridade básica: garantir que todos os campos essenciais existem
  const sample = data[0];
  const requiredKeys = ['colaborador', 'data'];
  const missingKeys = requiredKeys.filter(key => !Object.keys(sample).includes(key));
  
  if (missingKeys.length > 0) {
    console.warn(`Aviso de integridade: Campos faltando no primeiro registro: ${missingKeys.join(', ')}`);
  }

  return true;
};

export const exportPontoCSV = (data: any[], filename = 'registros-ponto.csv') => {
  try {
    validateExportData(data);
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error: any) {
    console.error('Erro na exportação CSV:', error);
    throw error;
  }
};

export const exportPontoPDF = (data: any[], title = 'Relatório de Ponto', columns: string[]) => {
  try {
    validateExportData(data);
    const doc = new jsPDF() as any;
    
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);
    
    const body = data.map(item => columns.map(col => item[col] || ''));
    
    doc.autoTable({
      startY: 35,
      head: [columns.map(c => c.replace('_', ' ').toUpperCase())],
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    return true;
  } catch (error: any) {
    console.error('Erro na exportação PDF:', error);
    throw error;
  }
};

export const exportPortaria671PDF = (solicitacao: any) => {
  try {
    const doc = new jsPDF() as any;
    const relatorio = solicitacao.relatorio_conformidade || {};
    
    // Header
    doc.setFontSize(16);
    doc.text('Relatório de Conformidade - Portaria 671', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`ID Solicitação: ${solicitacao.id}`, 14, 28);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`, 14, 33);
    
    // Colaborador Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Informações do Ajuste', 14, 45);
    
    const adjustmentData = [
      ['Colaborador', solicitacao.colaborador?.nome_completo || 'N/A'],
      ['Data do Ponto', format(new Date(solicitacao.data_ponto), 'dd/MM/yyyy')],
      ['Tipo', solicitacao.tipo_ponto?.toUpperCase() || 'N/A'],
      ['Hora Original', solicitacao.hora_original || 'Original'],
      ['Hora Sugerida', solicitacao.hora_sugerida],
      ['Motivo', solicitacao.motivo]
    ];
    
    doc.autoTable({
      startY: 48,
      body: adjustmentData,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold', width: 40 } }
    });
    
    // Compliance Info
    const nextY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Validações de Conformidade', 14, nextY);
    
    const complianceData = [
      ['Timezone', relatorio.timezone || 'America/Sao_Paulo'],
      ['Geofencing', relatorio.geofencing ? 'VÁLIDO' : 'NÃO VERIFICADO'],
      ['Divergência', `${relatorio.divergencia_minutos || 0} minutos`],
      ['Integridade SHA256', relatorio.sha256_integridade || 'N/A'],
      ['Status Portaria 671', relatorio.portaria_671_conformidade ? 'CONFORME' : 'EM ANÁLISE']
    ];
    
    doc.autoTable({
      startY: nextY + 3,
      body: complianceData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });
    
    doc.save(`conformidade-671-${solicitacao.id.slice(0, 8)}.pdf`);
    return true;
  } catch (error) {
    console.error('Erro exportando conformidade:', error);
    throw error;
  }
};
