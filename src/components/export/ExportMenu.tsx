/**
 * @fileoverview Menu de exportação
 * @module components/export/ExportMenu
 */
import { memo } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, FileJson } from 'lucide-react';

interface ExportMenuProps { onExport: (format: 'csv' | 'xlsx' | 'pdf' | 'json') => void; }

export const ExportMenu = memo(function ExportMenu({ onExport }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onExport('csv')}><FileText className="h-4 w-4 mr-2" />CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('xlsx')}><FileSpreadsheet className="h-4 w-4 mr-2" />Excel</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('pdf')}><FileText className="h-4 w-4 mr-2" />PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('json')}><FileJson className="h-4 w-4 mr-2" />JSON</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
