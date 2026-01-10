import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SimpleDataGridProps { headers: string[]; rows: (string | number)[][]; className?: string; }

export function SimpleDataGrid({ headers, rows, className }: SimpleDataGridProps) {
  return (
    <Table className={className}>
      <TableHeader><TableRow>{headers.map((h, i) => <TableHead key={i}>{h}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{rows.map((row, ri) => <TableRow key={ri}>{row.map((cell, ci) => <TableCell key={ci}>{cell}</TableCell>)}</TableRow>)}</TableBody>
    </Table>
  );
}
export default SimpleDataGrid;
