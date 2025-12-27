import { FileIcon } from './FileIcon';
import { formatFileSize } from '@/lib/fileHelpers';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface FileCardProps { file: { name: string; size: number }; onRemove?: () => void; }
export function FileCard({ file, onRemove }: FileCardProps) {
  return (<div className="flex items-center gap-3 p-3 border rounded-lg"><FileIcon filename={file.name} className="h-8 w-8 text-muted-foreground" /><div className="flex-1 min-w-0"><p className="font-medium truncate">{file.name}</p><p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p></div>{onRemove && <Button variant="ghost" size="icon" onClick={onRemove}><X className="h-4 w-4" /></Button>}</div>);
}
