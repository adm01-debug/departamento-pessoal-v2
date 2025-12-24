import { memo } from "react";
import { DropdownMenu as DM } from "@/components/ui/dropdown-menu";
interface DropdownMenuProps { children: React.ReactNode; }
export const DropdownMenu = memo(function DropdownMenu({ children }: DropdownMenuProps) {
  return <DM>{children}</DM>;
});
