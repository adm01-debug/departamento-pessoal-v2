// @ts-nocheck
/**
 * @fileoverview Utilitários de exportação
 * @module lib/exportUtils
 */
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types for export
export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
  format?: (value: unknown) => string;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
}

// Format value for export
const formatValue = (value: unknown, formatter?: (value: unknown) => string): string => {
  if (formatter) {
    return formatter(value);
  }
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return String(value);
};

// Export to Excel
export const exportToExcel = (options: ExportOptions): void => {
  const { filename, title, columns, data } = options;

  // Create worksheet data
  const wsData: string[][] = [];

  // Add title if provided
  if (title) {
    wsData.push([title]);
    wsData.push([`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`]);
    wsData.push([]);
  }

  // Add headers
  wsData.push(columns.map(col => col.header));

  // Add data rows
  data.forEach(row => {
    wsData.push(columns.map(col => formatValue(row[col.key], col.format)));
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = columns.map(col => ({ wch: col.width || 15 }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');

  // Generate file
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
};

// Export to PDF
export const exportToPDF = (options: ExportOptions): void => {
  const { filename, title, subtitle, columns, data } = options;

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Add title
  if (title) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 15, { align: 'center' });
  }

  // Add subtitle
  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, pageWidth / 2, 22, { align: 'center' });
  }

  // Add generation date
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(
    `Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
    pageWidth / 2,
    28,
    { align: 'center' }
  );

  // Prepare table data
  const headers = columns.map(col => col.header);
  const tableData = data.map(row =>
    columns.map(col => formatValue(row[col.key], col.format))
  );

  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: columns.reduce((acc, col, idx) => {
      if (col.width) {
        acc[idx] = { cellWidth: col.width };
      }
      return acc;
    }, {} as Record<number, { cellWidth: number }>),
  });

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  doc.save(`${filename}_${dateStr}.pdf`);
};

// Export to CSV
export const exportToCSV = (options: ExportOptions): void => {
  const { filename, columns, data } = options;

  // Create CSV content
  const headers = columns.map(col => `"${col.header}"`).join(';');
  const rows = data.map(row =>
    columns.map(col => {
      const value = formatValue(row[col.key], col.format);
      return `"${value.replace(/"/g, '""')}"`;
    }).join(';')
  );

  const csvContent = [headers, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  link.setAttribute('download', `${filename}_${dateStr}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format helpers for common data types
export const formatters = {
  currency: (value: unknown): string => {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  },
  date: (value: unknown): string => {
    if (!value) return '';
    try {
      return format(new Date(String(value)), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return String(value);
    }
  },
  cpf: (value: unknown): string => {
    if (!value) return '';
    const cpf = String(value).replace(/\D/g, '');
    if (cpf.length !== 11) return String(value);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },
  phone: (value: unknown): string => {
    if (!value) return '';
    const phone = String(value).replace(/\D/g, '');
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return String(value);
  },
  status: (value: unknown): string => {
    const statusMap: Record<string, string> = {
      ativo: 'Ativo',
      ferias: 'Férias',
      afastado: 'Afastado',
      desligado: 'Desligado',
      pendente: 'Pendente',
    };
    return statusMap[String(value)] || String(value);
  },
};
