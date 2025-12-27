import { Button } from '@/components/ui/button';
import { Trash2, Download, Edit, MoreHorizontal } from 'lucide-react';
interface BulkActionsProps { count: number; onDelete?: () => void; onExport?: () => void; onEdit?: () => void; onClear: () => void; }
export function BulkActions({ count, onDelete, onExport, onEdit, onClear }: BulkActionsProps) {
  if (count === 0) return null;
  return (<div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg"><span className="text-sm font-medium">{count} selecionado(s)</span><div className="flex gap-1 ml-auto">{onEdit && <Button variant="ghost" size="sm" onClick={onEdit}><Edit className="h-4 w-4" /></Button>}{onExport && <Button variant="ghost" size="sm" onClick={onExport}><Download className="h-4 w-4" /></Button>}{onDelete && <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>}<Button variant="ghost" size="sm" onClick={onClear}>Limpar</Button></div></div>);
}
