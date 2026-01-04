import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";

interface PreviewRow { data: Record<string, any>; valid: boolean; errors?: string[]; }
interface ImportPreviewProps { columns: string[]; rows: PreviewRow[]; maxRows?: number; className?: string; }

export function ImportPreview({ columns, rows, maxRows = 10, className }: ImportPreviewProps) {
  const displayRows = rows.slice(0, maxRows);
  const validCount = rows.filter(r => r.valid).length;
  const errorCount = rows.filter(r => !r.valid).length;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle className="text-base">Pré-visualização</CardTitle><CardDescription>{rows.length} registros encontrados</CardDescription></div>
          <div className="flex gap-2"><Badge variant="secondary"><Check className="h-3 w-3 mr-1" />{validCount} válidos</Badge>{errorCount > 0 && <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />{errorCount} erros</Badge>}</div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader><TableRow><TableHead className="w-10">#</TableHead>{columns.map(col => <TableHead key={col}>{col}</TableHead>)}<TableHead className="w-20">Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {displayRows.map((row, i) => (
                <TableRow key={i} className={cn(!row.valid && "bg-red-50")}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  {columns.map(col => <TableCell key={col} className="max-w-[200px] truncate">{String(row.data[col] ?? "-")}</TableCell>)}
                  <TableCell>{row.valid ? <Check className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" title={row.errors?.join(", ")} />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rows.length > maxRows && <p className="text-sm text-muted-foreground text-center py-2">... e mais {rows.length - maxRows} registros</p>}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
export default ImportPreview;
