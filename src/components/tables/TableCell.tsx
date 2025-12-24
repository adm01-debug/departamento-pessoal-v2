import { memo } from "react";
import { TableCell as TC } from "@/components/ui/table";
interface TableCellProps { children: React.ReactNode; className?: string; }
export const TableCell = memo(function TableCell({ children, className }: TableCellProps) {
  return <TC className={className}>{children}</TC>;
});
