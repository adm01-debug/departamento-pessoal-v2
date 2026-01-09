import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Trash2, Archive, Download, Tag } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onExport?: () => void;
  onTag?: () => void;
  actions?: { label: string; icon: React.ReactNode; onClick: () => void }[];
  className?: string;
}

export function BulkActions({ selectedCount, onClear, onDelete, onArchive, onExport, onTag, actions, className }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={cn("flex items-center gap-2 p-2 bg-muted rounded-lg animate-in slide-in-from-bottom-2", className)}>
      <span className="text-sm font-medium px-2">{selectedCount} selecionado{selectedCount !== 1 && "s"}</span>
      <div className="h-4 w-px bg-border" />
      {onDelete && <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4 mr-1" />Excluir</Button>}
      {onArchive && <Button variant="ghost" size="sm" onClick={onArchive}><Archive className="h-4 w-4 mr-1" />Arquivar</Button>}
      {onExport && <Button variant="ghost" size="sm" onClick={onExport}><Download className="h-4 w-4 mr-1" />Exportar</Button>}
      {onTag && <Button variant="ghost" size="sm" onClick={onTag}><Tag className="h-4 w-4 mr-1" />Tag</Button>}
      {actions?.map((action, i) => (
        <Button key={i} variant="ghost" size="sm" onClick={action.onClick}>{action.icon}{action.label}</Button>
      ))}
      <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={onClear}><X className="h-4 w-4" /></Button>
    </div>
  );
}
export default BulkActions;
