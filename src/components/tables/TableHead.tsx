import { memo } from "react";
import { TableHead as TH } from "@/components/ui/table";
interface TableHeadProps { children: React.ReactNode; className?: string; }
export const TableHead = memo(function TableHead({ children, className }: TableHeadProps) {
  return <TH className={className}>{children}</TH>;
});
