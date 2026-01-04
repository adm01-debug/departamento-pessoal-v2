import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, Loader2 } from "lucide-react";

interface ImportButtonProps { onImport: (file: File) => void | Promise<void>; accept?: string; loading?: boolean; disabled?: boolean; className?: string; label?: string; }

export function ImportButton({ onImport, accept = ".csv,.xlsx,.xls", loading = false, disabled = false, className, label = "Importar" }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = React.useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImporting(true); try { await onImport(file); } finally { setImporting(false); if (inputRef.current) inputRef.current.value = ""; } }
  };

  return (
    <>
      <input type="file" ref={inputRef} accept={accept} onChange={handleChange} className="hidden" />
      <Button variant="outline" disabled={disabled || loading || importing} onClick={() => inputRef.current?.click()} className={cn("", className)}>
        {(loading || importing) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}{label}
      </Button>
    </>
  );
}
export default ImportButton;
