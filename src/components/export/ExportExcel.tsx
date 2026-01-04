import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface ExportExcelProps { data: any[]; filename?: string; onExport?: () => void; disabled?: boolean; }

export function ExportExcel({ data, filename = "export", onExport, disabled }: ExportExcelProps) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => { setLoading(true); try { onExport?.(); } finally { setLoading(false); } };
  return (
    <Button onClick={handleExport} disabled={disabled || loading || data.length === 0}>
      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
      Exportar
    </Button>
  );
}
export default ExportExcel;
