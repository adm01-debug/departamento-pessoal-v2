import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Image, FileSpreadsheet, File, Download, Trash2, Eye } from "lucide-react";

interface FileListItemProps { name: string; type?: string; size?: string; uploadedAt?: string; onView?: () => void; onDownload?: () => void; onDelete?: () => void; className?: string; }

const getIcon = (type?: string) => {
  if (type?.includes("image")) return Image;
  if (type?.includes("sheet") || type?.includes("excel")) return FileSpreadsheet;
  if (type?.includes("pdf") || type?.includes("document")) return FileText;
  return File;
};

export function FileListItem({ name, type, size, uploadedAt, onView, onDownload, onDelete, className }: FileListItemProps) {
  const Icon = getIcon(type);
  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors", className)}>
      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center"><Icon className="h-5 w-5 text-muted-foreground" /></div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">{size && <span>{size}</span>}{uploadedAt && <span>• {uploadedAt}</span>}</div>
      </div>
      <div className="flex gap-1">
        {onView && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}><Eye className="h-4 w-4" /></Button>}
        {onDownload && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDownload}><Download className="h-4 w-4" /></Button>}
        {onDelete && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>}
      </div>
    </div>
  );
}
export default FileListItem;
