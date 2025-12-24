import { memo } from "react";
import { File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
interface FileListProps { files: File[]; onRemove: (index: number) => void; }
export const FileList = memo(function FileList({ files, onRemove }: FileListProps) {
  return (
    <div className="space-y-2">{files.map((f, i) => (
      <div key={i} className="flex items-center justify-between p-2 border rounded"><span className="flex items-center gap-2"><File className="h-4 w-4" />{f.name}</span><Button variant="ghost" size="icon" onClick={() => onRemove(i)}><X className="h-4 w-4" /></Button></div>
    ))}</div>
  );
});
