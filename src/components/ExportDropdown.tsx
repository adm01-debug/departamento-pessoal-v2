import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, FileDown, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportToExcel, exportToPDF, exportToCSV, ExportOptions } from '@/lib/exportUtils';

interface ExportDropdownProps {
  options: Omit<ExportOptions, 'filename'> & { filename?: string };
  defaultFilename: string;
  disabled?: boolean;
}

type ExportFormat = 'excel' | 'pdf' | 'csv';

export function ExportDropdown({ options, defaultFilename, disabled }: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (options.data.length === 0) {
      toast({
        title: 'Sem dados para exportar',
        description: 'Não há registros para exportar.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      const exportOptions: ExportOptions = {
        ...options,
        filename: options.filename || defaultFilename,
      };

      switch (format) {
        case 'excel':
          exportToExcel(exportOptions);
          toast({
            title: 'Exportação concluída',
            description: 'Arquivo Excel gerado com sucesso.',
          });
          break;
        case 'pdf':
          exportToPDF(exportOptions);
          toast({
            title: 'Exportação concluída',
            description: 'Arquivo PDF gerado com sucesso.',
          });
          break;
        case 'csv':
          exportToCSV(exportOptions);
          toast({
            title: 'Exportação concluída',
            description: 'Arquivo CSV gerado com sucesso.',
          });
          break;
      }
    } catch (error) {
      logger.error('Erro ao exportar:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível gerar o arquivo.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [options, defaultFilename, toast]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border border-border">
        <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4 text-red-600" />
          PDF (.pdf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
          <FileDown className="mr-2 h-4 w-4 text-blue-600" />
          CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


