import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Download, FileText, FileSpreadsheet, File, Loader2, Check } from "lucide-react";

type ExportFormat = "csv" | "xlsx" | "pdf";
interface Column { key: string; label: string; }
interface ExportDialogProps { open: boolean; onOpenChange: (open: boolean) => void; columns: Column[]; onExport: (format: ExportFormat, selectedColumns: string[]) => Promise<void>; title?: string; }

const formats: { value: ExportFormat; label: string; icon: React.ElementType }[] = [{ value: "csv", label: "CSV", icon: FileText }, { value: "xlsx", label: "Excel", icon: FileSpreadsheet }, { value: "pdf", label: "PDF", icon: File }];

export function ExportDialog({ open, onOpenChange, columns, onExport, title = "Exportar Dados" }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("xlsx");
  const [selected, setSelected] = useState<Set<string>>(new Set(columns.map(c => c.key)));
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const toggleColumn = (key: string) => { const next = new Set(selected); if (next.has(key)) next.delete(key); else next.add(key); setSelected(next); };
  const toggleAll = () => { if (selected.size === columns.length) setSelected(new Set()); else setSelected(new Set(columns.map(c => c.key))); };
  const handleExport = async () => { setExporting(true); setProgress(0); const interval = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 200); try { await onExport(format, Array.from(selected)); setProgress(100); setDone(true); } finally { clearInterval(interval); setExporting(false); } };
  const handleClose = () => { setDone(false); setProgress(0); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Selecione o formato e as colunas para exportar</DialogDescription></DialogHeader>
        {done ? (
          <div className="py-8 text-center"><Check className="h-12 w-12 text-green-500 mx-auto mb-4" /><p className="text-lg font-medium">Exportação concluída!</p></div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3"><Label>Formato</Label><RadioGroup value={format} onValueChange={v => setFormat(v as ExportFormat)} className="flex gap-4">{formats.map(f => <div key={f.value} className="flex items-center gap-2"><RadioGroupItem value={f.value} id={f.value} /><Label htmlFor={f.value} className="flex items-center gap-1 cursor-pointer"><f.icon className="h-4 w-4" />{f.label}</Label></div>)}</RadioGroup></div>
            <div className="space-y-3"><div className="flex items-center justify-between"><Label>Colunas</Label><Button variant="ghost" size="sm" onClick={toggleAll}>{selected.size === columns.length ? "Desmarcar" : "Marcar"} todas</Button></div><div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">{columns.map(col => <div key={col.key} className="flex items-center gap-2"><Checkbox id={col.key} checked={selected.has(col.key)} onCheckedChange={() => toggleColumn(col.key)} /><Label htmlFor={col.key} className="text-sm cursor-pointer">{col.label}</Label></div>)}</div></div>
            {exporting && <Progress value={progress} className="h-2" />}
          </div>
        )}
        <DialogFooter>{done ? <Button onClick={handleClose}>Fechar</Button> : <><Button variant="outline" onClick={handleClose}>Cancelar</Button><Button onClick={handleExport} disabled={exporting || selected.size === 0}>{exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}Exportar</Button></>}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ExportDialog;
