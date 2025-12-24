import { memo } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
interface Column<T> { key: keyof T; header: string; }
interface DataTableProps<T> { data: T[]; columns: Column<T>[]; }
export const DataTable = memo(function DataTable<T extends Record<string, unknown>>({ data, columns }: DataTableProps<T>) {
  return (
    <Table><TableHeader><TableRow>{columns.map(c => <TableHead key={String(c.key)}>{c.header}</TableHead>)}</TableRow></TableHeader>
    <TableBody>{data.map((row, i) => <TableRow key={i}>{columns.map(c => <TableCell key={String(c.key)}>{String(row[c.key] ?? "")}</TableCell>)}</TableRow>)}</TableBody></Table>
  );
});
