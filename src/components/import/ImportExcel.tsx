import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileUp, Check, X } from "lucide-react";

interface ImportExcelProps { onImport?: (data: any[]) => void; accept?: string; maxSize?: number; }

export function ImportExcel({ onImport, accept = ".csv,.xlsx", maxSize = 5 }: ImportExcelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > maxSize * 1024 * 1024) { setError("Arquivo muito grande"); return; }
    setFile(f); setError(null);
  };

  const handleImport = () => { if (file && onImport) onImport([]); };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />ImportExcel</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50" onClick={() => inputRef.current?.click()}>
          <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm">{file ? file.name : "Clique para selecionar arquivo"}</p>
        </div>
        {error && <p className="text-sm text-red-500 flex items-center gap-1"><X className="h-4 w-4" />{error}</p>}
        <Button onClick={handleImport} disabled={!file} className="w-full"><Check className="h-4 w-4 mr-2" />Importar</Button>
      </CardContent>
    </Card>
  );
}
export default ImportExcel;
