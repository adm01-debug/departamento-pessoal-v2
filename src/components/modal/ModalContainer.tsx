import { memo } from "react";
import { DialogContent } from "@/components/ui/dialog";
interface ModalContainerProps { children: React.ReactNode; className?: string; }
export const ModalContainer = memo(function ModalContainer({ children, className }: ModalContainerProps) {
  return <DialogContent className={className}>{children}</DialogContent>;
});
