import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Download, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";

type ExportFormat = "csv" | "xlsx" | "pdf" | "json";
interface ExportButtonProps { onExport: (format: ExportFormat) => void | Promise<void>; formats?: ExportFormat[]; loading?: boolean; disabled?: boolean; className?: string; label?: string; }

const formatConfig: Record<ExportFormat, { label: string; icon: React.ElementType }> = { csv: { label: "CSV", icon: FileText }, xlsx: { label: "Excel", icon: FileSpreadsheet }, pdf: { label: "PDF", icon: File }, json: { label: "JSON", icon: FileText } };

export function ExportButton({ onExport, formats = ["csv", "xlsx", "pdf"], loading = false, disabled = false, className, label = "Exportar" }: ExportButtonProps) {
  const [exporting, setExporting] = React.useState(false);
  const handleExport = async (format: ExportFormat) => { setExporting(true); try { await onExport(format); } finally { setExporting(false); } };
  const isLoading = loading || exporting;

  if (formats.length === 1) {
    const format = formats[0];
    const Icon = formatConfig[format].icon;
    return <Button variant="outline" disabled={disabled || isLoading} onClick={() => handleExport(format)} className={className}>{isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Icon className="h-4 w-4 mr-2" />}{label}</Button>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline" disabled={disabled || isLoading} className={cn("", className)}>{isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}{label}</Button></DropdownMenuTrigger>
      <DropdownMenuContent>{formats.map(format => { const { label, icon: Icon } = formatConfig[format]; return <DropdownMenuItem key={format} onClick={() => handleExport(format)}><Icon className="h-4 w-4 mr-2" />{label}</DropdownMenuItem>; })}</DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ExportButton;
