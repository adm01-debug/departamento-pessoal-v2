import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

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
