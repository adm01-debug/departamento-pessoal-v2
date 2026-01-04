import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface ExportXMLProps { data: any[]; filename?: string; onExport?: () => void; disabled?: boolean; }

export function ExportXML({ data, filename = "export", onExport, disabled }: ExportXMLProps) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => { setLoading(true); try { onExport?.(); } finally { setLoading(false); } };
  return (
    <Button onClick={handleExport} disabled={disabled || loading || data.length === 0}>
      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
      Exportar
    </Button>
  );
}
export default ExportXML;
