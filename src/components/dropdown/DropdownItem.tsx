import { memo } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
interface DropdownItemProps { children: React.ReactNode; onClick?: () => void; disabled?: boolean; }
export const DropdownItem = memo(function DropdownItem({ children, onClick, disabled }: DropdownItemProps) {
  return <DropdownMenuItem onClick={onClick} disabled={disabled}>{children}</DropdownMenuItem>;
});
