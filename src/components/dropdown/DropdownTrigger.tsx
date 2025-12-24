import { memo } from "react";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface DropdownTriggerProps { children: React.ReactNode; asChild?: boolean; }
export const DropdownTrigger = memo(function DropdownTrigger({ children, asChild }: DropdownTriggerProps) {
  return <DropdownMenuTrigger asChild={asChild}>{children}</DropdownMenuTrigger>;
});
