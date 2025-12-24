import { memo } from "react";
import { TableRow as TR } from "@/components/ui/table";
interface TableRowProps { children: React.ReactNode; className?: string; }
export const TableRow = memo(function TableRow({ children, className }: TableRowProps) {
  return <TR className={className}>{children}</TR>;
});
