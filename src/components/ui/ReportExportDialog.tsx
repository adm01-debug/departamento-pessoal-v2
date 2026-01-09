import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet, File } from "lucide-react";

interface ReportExportDialogProps { open: boolean; onOpenChange: (open: boolean) => void; onExport: (format: string) => void; loading?: boolean; }

export function ReportExportDialog({ open, onOpenChange, onExport, loading }: ReportExportDialogProps) {
  const [format, setFormat] = useState("pdf");
  const formats = [
    { value: "pdf", label: "PDF", icon: FileText },
    { value: "xlsx", label: "Excel (XLSX)", icon: FileSpreadsheet },
    { value: "csv", label: "CSV", icon: File },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Exportar Relatório</DialogTitle></DialogHeader>
        <RadioGroup value={format} onValueChange={setFormat} className="space-y-3">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={f.value} id={f.value} />
                <Icon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor={f.value} className="flex-1 cursor-pointer">{f.label}</Label>
              </div>
            );
          })}
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onExport(format)} disabled={loading}>{loading ? "Exportando..." : "Exportar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ReportExportDialog;
