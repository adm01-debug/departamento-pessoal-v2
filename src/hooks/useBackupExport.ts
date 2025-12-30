import { useState } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { exportToExcel, exportToPDF, exportToCSV, formatters } from '@/lib/exportUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface BackupProgress {
  table: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  count?: number;
  error?: string;
}

interface ColaboradorBackup {
  nome_completo?: string;
  cpf?: string;
  cargo?: string;
  departamento?: string;
  status?: string;
}

export type BackupData = {
  [key: string]: unknown[];
  colaboradores: unknown[];
  admissoes: unknown[];
  desligamentos: unknown[];
  ferias: unknown[];
  afastamentos: unknown[];
  registros_ponto: unknown[];
  folhas_pagamento: unknown[];
  holerites: unknown[];
  beneficios_colaborador: unknown[];
  tipos_beneficio: unknown[];
  dependentes: unknown[];
  historico_cargo: unknown[];
  audit_log: unknown[];
}

const TABLES_TO_BACKUP = [
  'colaboradores',
  'admissoes',
  'desligamentos',
  'ferias',
  'afastamentos',
  'registros_ponto',
  'folhas_pagamento',
  'holerites',
  'beneficios_colaborador',
  'tipos_beneficio',
  'dependentes',
  'historico_cargo',
  'audit_log',
] as const;

const TABLE_LABELS: Record<string, string> = {
  colaboradores: 'Colaboradores',
  admissoes: 'Admissões',
  desligamentos: 'Desligamentos',
  ferias: 'Férias',
  afastamentos: 'Afastamentos',
  registros_ponto: 'Registros de Ponto',
  folhas_pagamento: 'Folhas de Pagamento',
  holerites: 'Holerites',
  beneficios_colaborador: 'Benefícios dos Colaboradores',
  tipos_beneficio: 'Tipos de Benefício',
  dependentes: 'Dependentes',
  historico_cargo: 'Histórico de Cargos',
  audit_log: 'Log de Auditoria',
};


export interface UseBackupExportReturn {
  isExporting: boolean;
  progress: BackupProgress[];
  exportToJSON: () => Promise<void>;
  exportToExcelWorkbook: () => Promise<void>;
  exportToPDFReport: () => Promise<void>;
  exportTableToCSV: (tableName: string) => Promise<void>;
  TABLE_LABELS: Record<string, string>;
  TABLES_TO_BACKUP: string[];
}

export function useBackupExport(): UseBackupExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<BackupProgress[]>([]);

  const fetchAllData = async (): Promise<BackupData> => {
    const data: BackupData = {
      colaboradores: [],
      admissoes: [],
      desligamentos: [],
      ferias: [],
      afastamentos: [],
      registros_ponto: [],
      folhas_pagamento: [],
      holerites: [],
      beneficios_colaborador: [],
      tipos_beneficio: [],
      dependentes: [],
      historico_cargo: [],
      audit_log: [],
    };

    // Initialize progress
    setProgress(TABLES_TO_BACKUP.map(table => ({
      table,
      status: 'pending',
    })));

    for (const table of TABLES_TO_BACKUP) {
      setProgress(prev => prev.map(p => 
        p.table === table ? { ...p, status: 'loading' } : p
      ));

      try {
        const { data: tableData, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        (data as Record<string, unknown[]>)[table] = tableData || [];

        setProgress(prev => prev.map(p => 
          p.table === table ? { ...p, status: 'done', count: tableData?.length || 0 } : p
        ));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        setProgress(prev => prev.map(p => 
          p.table === table ? { ...p, status: 'error', error: errorMessage } : p
        ));
      }
    }

    return data;
  };

  const exportToJSON = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllData();
      
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0',
          tables: TABLES_TO_BACKUP,
        },
        data,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_completo_${format(new Date(), 'yyyy-MM-dd_HHmm')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Backup exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar backup');
      logger.error('Error', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcelWorkbook = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllData();
      
      const wb = XLSX.utils.book_new();

      // Add metadata sheet
      const metadataWs = XLSX.utils.aoa_to_sheet([
        ['Backup Completo do Sistema'],
        [`Exportado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`],
        [''],
        ['Tabela', 'Registros'],
        ...TABLES_TO_BACKUP.map(table => [
          TABLE_LABELS[table],
          (data as Record<string, unknown[]>)[table]?.length || 0
        ])
      ]);
      XLSX.utils.book_append_sheet(wb, metadataWs, 'Resumo');

      // Add each table as a sheet
      for (const table of TABLES_TO_BACKUP) {
        const tableData = (data as Record<string, unknown[]>)[table];
        if (tableData && tableData.length > 0) {
          const ws = XLSX.utils.json_to_sheet(tableData as object[]);
          XLSX.utils.book_append_sheet(wb, ws, TABLE_LABELS[table].substring(0, 31));
        }
      }

      XLSX.writeFile(wb, `backup_completo_${format(new Date(), 'yyyy-MM-dd_HHmm')}.xlsx`);
      toast.success('Backup Excel exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar backup Excel');
      logger.error('Error', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDFReport = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllData();
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Title page
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Backup Completo do Sistema', pageWidth / 2, 50, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Relatório de Compliance', pageWidth / 2, 65, { align: 'center' });

      doc.setFontSize(10);
      doc.text(
        `Exportado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
        pageWidth / 2,
        80,
        { align: 'center' }
      );

      // Summary table
      const summaryData = TABLES_TO_BACKUP.map(table => [
        TABLE_LABELS[table],
        String((data as Record<string, unknown[]>)[table]?.length || 0)
      ]);

      autoTable(doc, {
        startY: 100,
        head: [['Tabela', 'Registros']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Add collaborators summary
      doc.addPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumo de Colaboradores', 14, 20);

      if (data.colaboradores.length > 0) {
        const colaboradoresSummary = data.colaboradores.slice(0, 50).map((item: unknown) => {
          const c = item as ColaboradorBackup;
          return [
            c.nome_completo || '',
            c.cpf || '',
            c.cargo || '',
            c.departamento || '',
            c.status || '',
          ];
        });

        autoTable(doc, {
          startY: 30,
          head: [['Nome', 'CPF', 'Cargo', 'Departamento', 'Status']],
          body: colaboradoresSummary,
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] },
          styles: { fontSize: 8 },
        });
      }

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

      doc.save(`backup_resumo_${format(new Date(), 'yyyy-MM-dd_HHmm')}.pdf`);
      toast.success('Relatório PDF exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar PDF');
      logger.error('Error', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportTableToCSV = async (table: string) => {
    try {
      const { data, error } = await supabase
        .from(table as 'colaboradores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.warning('Nenhum dado para exportar');
        return;
      }

      const columns = Object.keys(data[0]).map(key => ({
        key,
        header: key.replace(/_/g, ' ').toUpperCase(),
      }));

      exportToCSV({
        filename: `${table}_export`,
        columns,
        data,
      });

      toast.success(`${TABLE_LABELS[table]} exportado com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao exportar ${TABLE_LABELS[table]}`);
      logger.error('Error', error);
    }
  };

  return {
    isExporting,
    progress,
    exportToJSON,
    exportToExcelWorkbook,
    exportToPDFReport,
    exportTableToCSV,
    TABLE_LABELS,
    TABLES_TO_BACKUP,
  };
}


