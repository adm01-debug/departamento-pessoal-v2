/**
 * @fileoverview Botão de exportação
 * @module components/common/ExportButton
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';

interface ExportButtonProps { onExport: (format: 'xlsx' | 'csv' | 'pdf') => void; disabled?: boolean; }

export const ExportButton = memo(function ExportButton({ onExport, disabled }: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled}><Download className="h-4 w-4 mr-2" />Exportar</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onExport('xlsx')}><FileSpreadsheet className="h-4 w-4 mr-2" />Excel (.xlsx)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('csv')}><FileText className="h-4 w-4 mr-2" />CSV (.csv)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('pdf')}><File className="h-4 w-4 mr-2" />PDF (.pdf)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
