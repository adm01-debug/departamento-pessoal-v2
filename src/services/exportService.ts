import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export const exportPontoCSV = (data: any[], filename = 'registros-ponto.csv') => {
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
};

export const exportPontoPDF = (data: any[], title = 'Relatório de Ponto', columns: string[]) => {
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
};
