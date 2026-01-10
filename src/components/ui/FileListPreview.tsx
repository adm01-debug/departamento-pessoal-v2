import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FileItem { name: string; size: number; type: string; }
interface FileListPreviewProps { files: FileItem[]; onRemove?: (index: number) => void; className?: string; }

export function FileListPreview({ files, onRemove, className }: FileListPreviewProps) {
  const formatSize = (b: number) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`;
  return (
    <div className={cn("space-y-2", className)}>
      {files.map((file, i) => (
        <div key={i} className="flex items-center justify-between p-2 border rounded">
          <div><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{formatSize(file.size)}</p></div>
          {onRemove && <button onClick={() => onRemove(i)}><X className="h-4 w-4" /></button>}
        </div>
      ))}
    </div>
  );
}
export default FileListPreview;
