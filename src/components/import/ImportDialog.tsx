import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Upload, File, X, Loader2, Check, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface ImportDialogProps { open: boolean; onOpenChange: (open: boolean) => void; onImport: (file: File) => Promise<{ success: number; errors: number }>; accept?: Record<string, string[]>; title?: string; }

export function ImportDialog({ open, onOpenChange, onImport, accept = { "text/csv": [".csv"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] }, title = "Importar Dados" }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "importing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);

  const onDrop = useCallback((files: File[]) => { if (files[0]) setFile(files[0]); }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, multiple: false });

  const handleImport = async () => {
    if (!file) return;
    setStatus("importing"); setProgress(0);
    const interval = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 200);
    try { const res = await onImport(file); setResult(res); setProgress(100); setStatus("done"); } catch { setStatus("error"); } finally { clearInterval(interval); }
  };

  const handleClose = () => { setFile(null); setStatus("idle"); setProgress(0); setResult(null); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Arraste um arquivo ou clique para selecionar</DialogDescription></DialogHeader>
        {status === "done" ? (
          <div className="py-8 text-center"><Check className="h-12 w-12 text-green-500 mx-auto mb-4" /><p className="text-lg font-medium">Importação concluída!</p>{result && <p className="text-muted-foreground">{result.success} registros importados{result.errors > 0 && `, ${result.errors} erros`}</p>}</div>
        ) : status === "error" ? (
          <div className="py-8 text-center"><AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" /><p className="text-lg font-medium">Erro na importação</p></div>
        ) : (
          <div className="space-y-4 py-4">
            <div {...getRootProps()} className={cn("border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors", isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50")}>
              <input {...getInputProps()} />
              {file ? <div className="flex items-center justify-center gap-2"><File className="h-8 w-8 text-primary" /><span className="font-medium">{file.name}</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); setFile(null); }}><X className="h-4 w-4" /></Button></div>
                : <div><Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">Arraste um arquivo aqui ou clique para selecionar</p></div>}
            </div>
            {status === "importing" && <Progress value={progress} className="h-2" />}
          </div>
        )}
        <DialogFooter>{status === "done" || status === "error" ? <Button onClick={handleClose}>Fechar</Button> : <><Button variant="outline" onClick={handleClose}>Cancelar</Button><Button onClick={handleImport} disabled={!file || status === "importing"}>{status === "importing" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}Importar</Button></>}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ImportDialog;
