import { memo } from "react";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
interface DropdownContentProps { children: React.ReactNode; align?: "start" | "center" | "end"; }
export const DropdownContent = memo(function DropdownContent({ children, align = "end" }: DropdownContentProps) {
  return <DropdownMenuContent align={align}>{children}</DropdownMenuContent>;
});
