import React from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

interface Column<T> { key: keyof T; header: string; sortable?: boolean; render?: (item: T) => React.ReactNode; }
interface InteractiveDataTableProps<T> { data: T[]; columns: Column<T>[]; selectable?: boolean; selectedIds?: string[]; onSelect?: (ids: string[]) => void; onSort?: (key: keyof T) => void; idKey?: keyof T; className?: string; }

export function InteractiveDataTable<T extends Record<string, any>>({ data, columns, selectable, selectedIds = [], onSelect, onSort, idKey = "id" as keyof T, className }: InteractiveDataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(String(item[idKey])));
  const toggleAll = () => { if (allSelected) onSelect?.([]); else onSelect?.(data.map((item) => String(item[idKey]))); };
  const toggleOne = (id: string) => { if (selectedIds.includes(id)) onSelect?.(selectedIds.filter((i) => i !== id)); else onSelect?.([...selectedIds, id]); };

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {selectable && <TableHead className="w-12"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>}
          {columns.map((col) => <TableHead key={String(col.key)}>{col.sortable ? <button className="flex items-center gap-1" onClick={() => onSort?.(col.key)}>{col.header}<ArrowUpDown className="h-4 w-4" /></button> : col.header}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={String(item[idKey])} className={selectedIds.includes(String(item[idKey])) ? "bg-muted/50" : ""}>
            {selectable && <TableCell><Checkbox checked={selectedIds.includes(String(item[idKey]))} onCheckedChange={() => toggleOne(String(item[idKey]))} /></TableCell>}
            {columns.map((col) => <TableCell key={String(col.key)}>{col.render ? col.render(item) : String(item[col.key] ?? "")}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default InteractiveDataTable;
