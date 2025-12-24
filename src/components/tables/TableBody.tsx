import { memo } from "react";
import { TableBody as TB } from "@/components/ui/table";
interface TableBodyProps { children: React.ReactNode; }
export const TableBody = memo(function TableBody({ children }: TableBodyProps) {
  return <TB>{children}</TB>;
});
