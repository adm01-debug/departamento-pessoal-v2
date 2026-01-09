import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, FileJson, Printer } from "lucide-react";

type ExportFormat = "pdf" | "excel" | "csv" | "json" | "print";

interface ExportMenuProps {
  onExport: (format: ExportFormat) => void;
  formats?: ExportFormat[];
  className?: string;
}

const formatConfig = {
  pdf: { icon: FileText, label: "Exportar PDF" },
  excel: { icon: FileSpreadsheet, label: "Exportar Excel" },
  csv: { icon: FileText, label: "Exportar CSV" },
  json: { icon: FileJson, label: "Exportar JSON" },
  print: { icon: Printer, label: "Imprimir" },
};

export function ExportMenu({ onExport, formats = ["pdf", "excel", "csv"], className }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}><Download className="h-4 w-4 mr-2" />Exportar</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {formats.map((format) => {
          const config = formatConfig[format];
          return (
            <DropdownMenuItem key={format} onClick={() => onExport(format)}>
              <config.icon className="h-4 w-4 mr-2" />
              {config.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ExportMenu;
