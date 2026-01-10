import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { X, CheckCircle } from "lucide-react";

interface UploadProgress { name: string; progress: number; status: "uploading" | "complete" | "error"; }
interface UploadProgressListProps { items: UploadProgress[]; onCancel?: (index: number) => void; className?: string; }

export function UploadProgressList({ items, onCancel, className }: UploadProgressListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate">{item.name}</span>
            {item.status === "complete" ? <CheckCircle className="h-4 w-4 text-green-500" /> : item.status === "uploading" && onCancel ? <button onClick={() => onCancel(i)}><X className="h-4 w-4" /></button> : null}
          </div>
          <Progress value={item.progress} className="h-1" />
        </div>
      ))}
    </div>
  );
}
export default UploadProgressList;
