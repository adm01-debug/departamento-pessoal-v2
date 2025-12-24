/**
 * @fileoverview Botão de exportação
 * @module components/export/ExportButton
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportButtonProps { onClick: () => void; label?: string; loading?: boolean; disabled?: boolean; variant?: 'default' | 'outline' | 'ghost'; }

export const ExportButton = memo(function ExportButton({ onClick, label = 'Exportar', loading, disabled, variant = 'outline' }: ExportButtonProps) {
  return (
    <Button variant={variant} onClick={onClick} disabled={loading || disabled}>
      <Download className={`h-4 w-4 mr-2 ${loading ? 'animate-pulse' : ''}`} />{loading ? 'Exportando...' : label}
    </Button>
  );
});
