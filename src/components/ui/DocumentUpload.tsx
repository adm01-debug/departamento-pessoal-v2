import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, File, X, Check } from "lucide-react";

interface DocumentUploadProps { label: string; description?: string; accept?: string; value?: File | null; onChange?: (file: File | null) => void; required?: boolean; disabled?: boolean; className?: string; }

export function DocumentUpload({ label, description, accept = ".pdf,.jpg,.jpeg,.png", value, onChange, required, disabled, className }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => onChange?.(e.target.files?.[0] || null)} disabled={disabled} />
      {value ? (
        <div className="flex items-center gap-2 p-2 border rounded bg-muted/50">
          <File className="h-4 w-4 text-primary" />
          <span className="flex-1 text-sm truncate">{value.name}</span>
          <Check className="h-4 w-4 text-green-500" />
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onChange?.(null)} disabled={disabled}><X className="h-3 w-3" /></Button>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={disabled} className="w-full">
          <Upload className="h-4 w-4 mr-2" />Selecionar arquivo
        </Button>
      )}
    </div>
  );
}
export default DocumentUpload;
