import { memo } from "react";
import { DialogFooter } from "@/components/ui/dialog";
interface ModalFooterProps { children: React.ReactNode; }
export const ModalFooter = memo(function ModalFooter({ children }: ModalFooterProps) {
  return <DialogFooter>{children}</DialogFooter>;
});
